---
title: 聊天 UI 与交互
description: 设计流式消息、reasoning、工具卡片、滚动、i18n、浮动面板和可访问交互。
---

import { Aside, Steps } from '@astrojs/starlight/components'

一个 Agent 请求可能先等待模型、再输出 reasoning、连续执行工具，最后才给文字回答。只显示气泡会让用户误以为应用卡住，也无法理解操作是否已经生效。

## 按 part 渲染消息

`UIMessage.parts` 应映射成不同组件：

| Part | UI |
| --- | --- |
| text | 安全 Markdown 气泡 |
| reasoning | 可折叠“分析过程”，流式时显示运行状态 |
| tool-input-* | 工具名称、目标和“正在执行” |
| tool-output-* | 成功/失败、简短结果和状态 icon |
| approval | 危险操作确认卡片 |
| error | 可重试错误，不伪装成 assistant 文本 |

工具卡片不要直接 dump JSON。为每个工具提供本地化名称、目标摘要和用户能理解的结果，例如“更新 Container 的 PC 布局 · 已完成”。详细参数可以放在折叠区供调试。

## Loading 状态

<Steps>
1. 用户发送后立即显示 submitted 状态，例如“正在读取页面上下文…”。
2. 收到 reasoning 时显示真实流式内容；尚无可读内容时显示短状态，而不是空白卡片。
3. 工具调用开始后，以工具卡片替代通用 spinner。
4. streaming 静默间隙可以轮换原创短文案，但真实工具进度优先。
5. 最终 text 到达或请求结束时，所有通用 spinner 必须立即退出。
</Steps>

判断“仍在工作”应基于 chat `status` 和当前 part state，不能用“最后一条消息是不是 assistant”这类间接条件，否则回答结束后容易残留转圈。

## Reasoning 的流式处理

部分 provider 会把 reasoning 以极小 delta 输出。不要每个字符都建立新卡片；应按同一 reasoning part 累积文本，并通过 `requestAnimationFrame` 合并渲染。标题保持稳定的“正在分析…”或“查看分析过程”，正文为空或只有半个单词时可以延迟几十毫秒显示，避免出现长期只有 `The` 的视觉误导。

不要把 reasoning 写进后续历史上下文。保留本轮显示即可；下一次调用用 `pruneMessages()` 去掉旧 reasoning，降低 token 与供应商不兼容风险。

## 聊天滚动规则

用户的阅读意图高于自动跟随：

```ts
const BOTTOM_DELTA = 20

function isNearBottom(el: HTMLElement) {
  return el.scrollHeight - el.scrollTop - el.clientHeight <= BOTTOM_DELTA
}
```

- 用户位于底部 20px 内：新 delta 自动跟随。
- 用户向上阅读：停止抢滚动；输入框上方显示 arrow-down 按钮。
- 用户点击 arrow-down：smooth scroll 到底部并恢复跟随。
- 用户主动发送新消息：无论之前位置如何，都 smooth scroll 到底部。
- 尊重 `prefers-reduced-motion`，此时使用即时滚动。

对 Markdown 图片、工具卡片展开和字体加载造成的高度变化使用 `ResizeObserver`；滚动更新用 `requestAnimationFrame` 合并，避免每个 token 强制布局。

底部 sentinel 比直接计算最后一条消息更稳：输入框是 sticky/footer、消息异步增高时，`scrollIntoView` sentinel 能更准确到达真实底部。容器还需要正确的 `min-height: 0`，否则 flex 子项可能无法缩小并出现“看似到底但仍差一截”。

## 安全 Markdown

推荐小而清晰的链路：

```ts
const html = DOMPurify.sanitize(marked.parse(text), {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'ul', 'ol', 'li', 'a'],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
})
```

同时在 Marked renderer 层直接转义原始 HTML和图片；链接加 `target="_blank" rel="noopener noreferrer"`。Marked 自己不负责 sanitize。

## 语言策略

固定 UI（按钮、工具状态、错误）跟随应用 locale。模型回复优先跟随**本轮用户消息语言**：

```ts
function detectResponseLanguage(text: string, uiLocale: string) {
  const han = (text.match(/[\u3400-\u9fff]/g) ?? []).length
  const latin = (text.match(/[A-Za-z]/g) ?? []).length
  if (han > latin * 0.25) return 'zh-CN'
  if (latin > 0) return 'en'
  return uiLocale.startsWith('zh') ? 'zh-CN' : 'en'
}
```

这意味着应用是 English 模式，但用户问中文，Agent 仍应回复中文；只有 emoji、数字或极短消息无法判断时才由界面语言兜底。

## 浮动面板

- 默认右下角打开，可拖拽；四边都保留 16px 安全距离，底部避让触发按钮。
- 使用 `motion-v` 的 drag constraints，关闭惯性和弹性；窗口 resize 后重新约束位置。
- 支持最大化/还原；小屏优先全屏，避免键盘挤压内容。
- 标题栏使用明确拖拽手柄，关闭/还原/Undo 按钮至少 44×44px 命中区域。
- `MotionConfig reduced-motion="user"` 尊重系统偏好。
- 面板通过 `defineAsyncComponent()` 延迟加载，未打开时不下载完整聊天依赖。

## 首次欢迎

欢迎提示不是在“页面首次显示”时就永久完成。只有用户真正点击并打开助手后，才记录 onboarding 已完成。礼花使用按需动态 import，在 idle 时预加载；箭头通过浮层定位到实际触发按钮，视口变化时重新计算。

<Aside type="caution" title="不要用动效掩盖状态">
动画只负责解释空间变化和操作反馈。请求进度必须来自真实状态；不要用循环文案或 spinner 替代工具成功/失败结果。
</Aside>
