---
title: 最小实现
description: 使用 Vercel AI SDK 和 OpenAI-compatible provider 建立浏览器内工具循环。
---

# 最小实现

## 1. 安装

```bash
pnpm add ai @ai-sdk/openai-compatible zod
```

Vue、React 或其他 UI 框架都可以使用同一套 Agent 核心；框架适配只负责展示消息。

## 2. 准备受控 Action

```ts
const state = {
  title: 'Untitled',
  version: 1,
};

function updateTitle(title: string, expectedVersion: number) {
  if (state.version !== expectedVersion) {
    return { ok: false, code: 'STALE_CONTEXT' } as const;
  }

  state.title = title;
  state.version += 1;
  return { ok: true, title, version: state.version } as const;
}
```

## 3. 定义工具

```ts
import { tool } from 'ai';
import { z } from 'zod';

const tools = {
  read_state: tool({
    description: 'Read the latest editable state.',
    inputSchema: z.object({}),
    execute: async () => ({ ...state }),
  }),

  update_title: tool({
    description: 'Update the title after reading the latest state.',
    inputSchema: z.object({
      title: z.string().trim().min(1).max(80),
      expectedVersion: z.number().int().positive(),
    }),
    execute: async input => updateTitle(input.title, input.expectedVersion),
  }),
};
```

## 4. 创建 Agent

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { DirectChatTransport, ToolLoopAgent, isStepCount } from 'ai';

const provider = createOpenAICompatible({
  name: 'model-provider',
  baseURL: config.baseUrl,
  apiKey: config.apiKey,
});

const agent = new ToolLoopAgent({
  model: provider(config.modelId),
  instructions: `
    Read the latest state before changing it.
    Never invent IDs, fields, permissions, or results.
    Never claim success unless the write tool returned ok: true.
    Reply in the language of the user's latest message.
  `,
  tools,
  stopWhen: isStepCount(6),
});

export const transport = new DirectChatTransport({ agent });
```

`DirectChatTransport` 会在当前 JavaScript 进程中调用 Agent。在浏览器应用中，这意味着无需自建 `/api/chat`，但模型服务必须支持 CORS。

## 5. 接入聊天 UI

- Vue 使用 `@ai-sdk/vue` 的 `useChat`。
- React 使用 `@ai-sdk/react` 的 `useChat`。
- 按 message parts 分别渲染 text、reasoning、tool 和 error。

完成第一个闭环后，再阅读 [Context 与 Tools](/guide/context-and-tools)。
