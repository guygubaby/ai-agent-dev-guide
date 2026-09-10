---
title: 技术栈
description: 构建纯前端 AI Agent 和本指南站点所需的最小库。
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

## 本指南站点

本站使用 [Rspress](https://rspress.rs/zh/)：

- 默认 SSG，文档构建为静态 HTML。
- Markdown、搜索、导航和暗色主题开箱即用。
- 构建产物位于 `doc_build`。
- 通过 Cloudflare Workers Static Assets 发布。

Rspress 的 `llms` 输出已开启，会同时生成 `llms.txt` 与便于模型读取的 Markdown 版本。
