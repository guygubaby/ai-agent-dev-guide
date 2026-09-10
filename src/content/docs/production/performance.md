---
title: 性能与上下文预算
description: 控制工具 schema、消息历史、序列化、渲染和前端包体。
---

Agent 性能同时受模型延迟、prompt token、工具 I/O、Store 更新和流式 DOM 渲染影响。只优化一个 spinner 不会让系统真正变快。

## 建立预算

建议为每次请求记录：

| 指标 | 目标/用途 |
| --- | --- |
| submit → first visible state | 应接近即时，验证 UI 没有静默期 |
| submit → first token | 观察模型与网络延迟 |
| 每次 prompt tokens | 发现 Context/工具 schema 膨胀 |
| Agent steps | 防止无效循环 |
| 每个 tool duration/success | 定位业务瓶颈 |
| 平均 Context bytes | 对比版本变化 |
| undo rate / confirmation cancel rate | 评估误操作与工具理解 |
| main-thread long tasks | 发现序列化与 Markdown 渲染卡顿 |

不要记录原始页面内容、tool arguments 或敏感模型请求来换取指标。

## 工具 schema 预算

27 个工具并不天然过多，问题是每一步是否都需要把它们发送给模型。使用 `activeTools`：

- 首步只发送 discovery tools。
- 读过 canvas/page/site/menu 领域后再开放对应写工具。
- 描述保持明确、短而不含重复 system prompt。
- 极少使用的管理能力可以按意图延迟注册。

这会同时降低 token、延迟和相似工具误选率。

## 消息历史裁剪

保留用户意图与必要事实，删除已经失效的执行细节：

- 下一轮去掉旧 reasoning。
- 旧 tool calls/results 只保留最近几轮，或压缩为变更摘要。
- 对话跨任务后建立新的 scope summary。
- 不把 UI-only loading 文案写入消息历史。
- 达到预算时先压缩工具结果，不要截掉 system 安全规则。

```ts
const messages = pruneMessages({
  messages: source,
  reasoning: 'before-last-message',
  toolCalls: 'before-last-6-messages',
  emptyMessages: 'remove',
})
```

具体选项应以项目使用的 AI SDK 版本为准。

## Context 序列化

- 先判断本轮任务领域，再读取数据。
- 大树分页，数组限长，字符串截断，对象限深度/键数/总值数。
- computed style 只读相关属性，不复制浏览器返回的全部 CSSStyleDeclaration。
- 动态数据 catalog 做短时、有界 LRU 缓存；页面更新后主动失效。
- 对大 payload 使用 `shallowRef`，避免 Vue 深层 proxy；primitive 使用 `ref`。

## Store 与画布更新

将相邻样式更新合并为一个事务和一次重绘。不要每个 CSS 属性都触发：Schema clone → UnoCSS 生成 → Canvas refresh → Moveable rebind。

Custom Class 生成属于异步派生工作，工具要 await 完成后一次性提交动态样式字段，避免用户立即保存时抓到中间状态。

## 流式渲染

- 将 token delta 写入同一 part，不为每个字符新建 Vue component。
- Markdown 可以按帧或短间隔批量解析，避免每个 token 重跑全量 DOMPurify。
- 自动滚动、ResizeObserver 回调和布局测量用 `requestAnimationFrame` 合并。
- 工具结果折叠详情延迟渲染，默认只显示摘要。
- 长会话可对旧消息做折叠/虚拟化，但要保持键盘与屏幕阅读器可访问。

## 包体

助手面板应通过 `defineAsyncComponent()` 延迟加载。进一步建议：

- `canvas-confetti`、富文本 sanitizer、文件解析器等按功能动态 import。
- 未打开助手时不创建 provider、Agent 和大型 Context cache。
- 简单 hover/press 使用 CSS；复杂拖拽与 layout transition 才使用 Motion。
- Astro 指南站默认零运行时，只对交互图使用 `client:visible` island。

## 取消与超时

- 输入区在 submitted/streaming 提供停止按钮。
- 读取工具设置合理超时；写工具不因 UI 超时而盲目重试。
- Agent 设置步骤上限和输出 token 上限。
- 页面切换或关闭编辑器时中止当前请求，并让后续 tool result 无法写入旧 scope。

## 推荐基线

可从最多 12 步、最多 3200 输出 token、模型温度 0.2、`maxRetries: 1` 起步，并在新请求前裁剪旧 reasoning 和旧 tool parts。这些数值不是通用标准，应通过真实任务成功率和延迟数据调整。

性能优化的优先级通常是：减少无关 Context → 减少无关工具 → 合并业务重绘 → 批量流式 DOM 更新 → 最后再优化微小依赖。
