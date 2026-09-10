---
title: 工具库与选型
description: 纯前端 AI Agent、Vue UI、安全渲染、状态管理、动效与文档站所用库。
---

本指南的库选型围绕三个目标：浏览器内直接建立 Agent 循环、让业务工具保持类型安全、让 UI 在复杂流式状态下仍可维护。

## Agent 与模型

| 包 | 作用 | 为什么使用 |
| --- | --- | --- |
| `ai` | `ToolLoopAgent`、`DirectChatTransport`、`tool`、step limit、消息裁剪 | 在同一 JavaScript 进程内完成多步工具循环，适合浏览器直连 |
| `@ai-sdk/vue` | `useChat` | 管理流式 UIMessage、状态、停止、工具和批准响应 |
| `@ai-sdk/openai-compatible` | 自定义 provider | 通过 `baseURL + modelId + apiKey` 接入兼容接口 |
| `zod` | 工具输入 schema | 同时向模型描述参数并在运行时校验 |

关键资料：

- [ToolLoopAgent](https://ai-sdk.dev/docs/reference/ai-sdk-core/tool-loop-agent)
- [DirectChatTransport](https://ai-sdk.dev/docs/reference/ai-sdk-ui/direct-chat-transport)
- [useChat](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat)
- [Tools & Tool Calling](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling)
- [OpenAI-compatible providers](https://ai-sdk.dev/providers/openai-compatible-providers)
- [Zod](https://zod.dev/)

## 应用与界面

| 包 | 作用 | 使用建议 |
| --- | --- | --- |
| `vue` | UI 与组合式逻辑 | Composition API + `<script setup>`；大对象使用 `shallowRef` |
| `pinia` | 业务 Store | Agent 只通过 Context reader 与 Action adapter 接入，不直接暴露整个 Store |
| `motion-v` | 拖拽、layout transition、进入/退出 | 禁用不必要弹性，设置四边约束并尊重 reduced motion |
| `lucide-vue-next` | 统一图标 | 图标按钮提供可访问 label，不用 emoji 代替操作 icon |
| `@vueuse/core` | ResizeObserver、事件和生命周期工具 | 选择性导入，避免重复实现边缘事件逻辑 |
| `@floating-ui/vue` | 欢迎气泡、Popover 定位 | 处理 viewport flip/shift，比硬编码坐标可靠 |
| `canvas-confetti` | 首次打开欢迎动效 | 动态 import，只在确认展示时加载；reduced motion 下跳过 |

## 内容安全

| 包 | 作用 | 边界 |
| --- | --- | --- |
| `marked` | Markdown → HTML | 自身不负责净化；禁用/转义原始 HTML 与图片 |
| `dompurify` | 聊天 HTML 净化 | 在 `v-html` 前使用明确 allow-list |
| `sanitize-html` | 持久化富文本净化 | 为业务字段使用更严格的 tag/style/protocol 规则 |

Markdown 显示和页面富文本写入是两个不同信任边界，不要共用一个宽松配置。

## 样式与组件

页面编辑器项目可以继续使用自己的设计系统。通用新项目推荐：

- Tailwind CSS v4：应用级 atom class 与 design token。
- shadcn-vue：可拥有源码的基础 UI，不把 Agent 交互锁在黑盒组件里。
- UnoCSS：如果产品允许用户输入原子类，可在编辑端生成并持久化派生样式。

核心工具卡、确认卡和消息渲染器应优先复用现有产品组件，保持 hover、focus、error 与 disabled 状态一致。

## 文件输入（可选）

需要图片、HTML、Word 等导入时，可以使用 [Uppy](https://uppy.io/) 统一拖拽、校验、进度、取消和重试体验。文件解析与页面生成应作为独立工作流：

1. 本地验证 MIME、扩展名和大小。
2. 将 DOCX/HTML/图片转换成受限中间表示。
3. 让模型输出页面计划，不直接输出任意可执行 HTML。
4. 用已有组件工厂生成 Schema。
5. 预览 diff，用户确认后提交。

这不是最小聊天 Agent 的必需依赖，不应默认进入主包。

## 指南站

| 包 | 作用 |
| --- | --- |
| `astro` | 静态优先站点与 Islands |
| `@astrojs/starlight` | 文档导航、搜索、主题和可访问结构 |
| `@astrojs/vue` | 只为交互示例 hydrate Vue island |
| `@astrojs/sitemap` | 生成 sitemap |
| `tailwindcss` + `@tailwindcss/vite` | 交互示例的 atom class |
| `wrangler` | 构建产物部署到 Cloudflare Workers Static Assets |

## 不要盲目添加的依赖

- 仅为一个 spinner 引入完整动画库。
- 为两三个标题解析引入完整 AST pipeline。
- 把整个 UnoCSS runtime 放到发布站，只为消费已知样式。
- 同时使用多个重复的 Markdown sanitizer。
- 使用一个通用 JSON patch 库来绕开业务 Action 设计。

库只是实现手段。Agent 的可靠性主要来自 Context、工具契约、事务、安全确认和可观察 UI。
