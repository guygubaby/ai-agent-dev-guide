---
title: 技术栈
description: 构建纯前端 AI Agent 所需的最小库。
---

# 技术栈

## Agent 核心

| 库 | 用途 |
| --- | --- |
| [`ai`](https://ai-sdk.dev/) | `ToolLoopAgent`、`DirectChatTransport`、工具循环与消息裁剪 |
| [`@ai-sdk/openai-compatible`](https://ai-sdk.dev/providers/openai-compatible-providers) | 连接 OpenAI-compatible endpoint |
| [`zod`](https://zod.dev/) | 工具输入的运行时校验 |
| `@ai-sdk/vue` / `@ai-sdk/react` | 按前端框架接入流式聊天 UI |

状态管理使用产品已有方案即可，例如 Pinia、Redux、Zustand 或普通 Store。关键是 Agent 通过 Context adapter 和 Action adapter 接入，而不是依赖某个状态库。

## 安全与 UI（按需）

| 库 | 用途 |
| --- | --- |
| `marked` | 解析 Markdown |
| `dompurify` | 净化聊天 HTML |
| `sanitize-html` | 净化将要持久化的富文本 |
| `motion-v` / Motion | 复杂拖拽和布局动效；简单状态优先 CSS |
| `Uppy` | 需要文件上传时统一进度、取消和重试 |

这些都是可选能力，不要在最小版本一次性安装。
