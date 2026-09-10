---
title: 快速开始
description: 用 Vue 3、Pinia 和 Vercel AI SDK 建立一个纯前端的最小工具循环。
---

import { Aside, Steps } from '@astrojs/starlight/components'

本章建立一个最小但方向正确的 Agent：它只能读取和更新一个标题，所有状态都在 Pinia，浏览器直接连接 OpenAI-compatible endpoint。

## 1. 安装依赖

```bash
pnpm add ai @ai-sdk/vue @ai-sdk/openai-compatible zod pinia
```

## 2. 建立业务 Store

```ts title="stores/page.ts"
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePageStore = defineStore('page', () => {
  const titleRef = ref('Untitled page')
  const versionRef = ref(0)

  function updateTitle(nextTitle: string) {
    titleRef.value = nextTitle
    versionRef.value += 1
  }

  return { titleRef, versionRef, updateTitle }
})
```

## 3. 定义窄工具，而不是任意 patch

```ts title="ai/tools.ts"
import { tool } from 'ai'
import { z } from 'zod'
import type { Pinia } from 'pinia'
import { usePageStore } from '../stores/page'

export function createTools(pinia: Pinia) {
  return {
    get_page_title: tool({
      description: 'Read the current page title and version.',
      inputSchema: z.object({}),
      execute: async () => {
        const store = usePageStore(pinia)
        return { title: store.titleRef, version: store.versionRef }
      },
    }),
    update_page_title: tool({
      description: 'Update the current page title.',
      inputSchema: z.object({
        title: z.string().trim().min(1).max(80),
        expectedVersion: z.number().int().nonnegative(),
      }),
      execute: async ({ title, expectedVersion }) => {
        const store = usePageStore(pinia)
        if (store.versionRef !== expectedVersion) {
          return { ok: false, code: 'STALE_CONTEXT' }
        }
        store.updateTitle(title)
        return { ok: true, title: store.titleRef, version: store.versionRef }
      },
    }),
  }
}
```

`expectedVersion` 是最小的乐观并发保护：如果用户在模型思考期间已经改了标题，工具不会覆盖新值。

## 4. 创建浏览器 Agent

```ts title="ai/use-page-agent.ts"
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { useChat } from '@ai-sdk/vue'
import { DirectChatTransport, ToolLoopAgent, isStepCount } from 'ai'
import type { Pinia } from 'pinia'
import { createTools } from './tools'

export function usePageAgent(pinia: Pinia) {
  const provider = createOpenAICompatible({
    name: 'my-provider',
    baseURL: import.meta.env.VITE_AI_BASE_URL,
    apiKey: import.meta.env.VITE_AI_API_KEY,
  })

  const agent = new ToolLoopAgent({
    model: provider(import.meta.env.VITE_AI_MODEL_ID),
    instructions: `
You are a page editor assistant.
Always call get_page_title before updating the title.
Never claim success unless the write tool returned ok: true.
Reply in the language used by the user's latest message.
    `.trim(),
    tools: createTools(pinia),
    stopWhen: isStepCount(5),
  })

  return useChat({
    transport: new DirectChatTransport({ agent }),
  })
}
```

## 5. 按 message parts 渲染

不要假设每条 assistant 消息只有 `text`。工具调用、reasoning 和确认都属于独立 part。

```vue title="AgentPanel.vue"
<script setup lang="ts">
import { usePageAgent } from './ai/use-page-agent'
import { getActivePinia } from 'pinia'
import { ref } from 'vue'

const inputRef = ref('')
const chat = usePageAgent(getActivePinia()!)

function submit() {
  const text = inputRef.value.trim()
  if (!text || chat.status.value === 'streaming') return
  inputRef.value = ''
  chat.sendMessage({ text })
}
</script>

<template>
  <section aria-label="AI assistant">
    <article v-for="message in chat.messages.value" :key="message.id">
      <template v-for="(part, index) in message.parts" :key="index">
        <p v-if="part.type === 'text'">{{ part.text }}</p>
        <details v-else-if="part.type === 'reasoning'">
          <summary>查看分析过程</summary>
          <p>{{ part.text }}</p>
        </details>
        <p v-else-if="part.type.startsWith('tool-')">
          {{ part.state }}
        </p>
      </template>
    </article>

    <form @submit.prevent="submit">
      <textarea v-model="inputRef" aria-label="Message" />
      <button type="submit">发送</button>
    </form>
  </section>
</template>
```

## 6. 做能力探测

<Steps>
1. 普通文本是否流式到达，而不是网关最后一次性返回。
2. `Authorization` 预检是否通过，响应是否包含正确 CORS header。
3. 目标模型是否真正支持 streamed tool calls 和多步工具调用。
4. `stop()` 是否会中止上游请求。
5. reasoning、tool arguments 和 provider-specific 参数的字段形态是否兼容。
</Steps>

<Aside type="danger" title="不要把共享生产密钥写进 VITE_*">
Vite 会把 `VITE_*` 替换进客户端产物。这个示例只适用于内部验证、受限临时凭据或用户自带 Key。需要共享密钥时，请使用薄 BFF，并把密钥保存在服务端 Secret。
</Aside>

下一步不要急着增加更多写工具。先实现稳定的 Context DTO、错误语义、事务和 UI 状态，再逐个扩展能力。
