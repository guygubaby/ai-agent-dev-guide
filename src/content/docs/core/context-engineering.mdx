---
title: 上下文工程
description: 用按需读取、稳定 ID、分页、脱敏和新鲜度控制，让模型看到足够但不过量的业务事实。
---

import { Aside, Steps } from '@astrojs/starlight/components'

Context engineering 的目标不是“把更多数据塞给模型”，而是让模型能以最低成本获取**当前任务所需的可信事实**。

## 为什么不能完整 dump Store

直接 `JSON.stringify(store)` 通常会同时带来：

- 页面越复杂，token 和首响应时间越不可控。
- 大量无关字段会稀释真正有用的事实。
- token、cookie、header、内部 URL 等敏感信息容易泄漏。
- Pinia proxy、DOM 节点、循环引用和第三方实例无法稳定序列化。
- 模型会长期持有旧对象快照，随后覆盖用户刚刚完成的修改。

推荐采用“初始摘要 + discovery tools + 详情工具”的分层读取方式。

## 推荐的上下文层级

### 1. Runtime scope

每次请求都可以便宜地提供：

```ts
interface RuntimeScope {
  locale: string
  pageId: string
  pageName: string
  viewport: 'PC' | 'MOBILE'
  selectedNodeId?: string
  selectedNodeType?: string
  writable: boolean
}
```

它告诉模型“现在在哪里”，但不展开整棵树。

### 2. Selected context

用户选中节点时，按稳定 UUID 返回：

- 节点类型、可读名称、父级与祖先路径。
- 相邻兄弟的短摘要。
- 当前 PC/Mobile 样式、Custom Class 与 Custom CSS。
- data、attributes、fieldMap、additionalConfig 等可编辑配置。
- DOM `getBoundingClientRect()` 与少量关键 computed styles。
- 动态数据绑定的可读名称，不只是绑定 ID。

不要默认展开所有后代。让模型通过 `includeDescendants` 和受限 `maxDepth` 主动请求。

### 3. Page summary

整页读取工具应支持分页和树深限制：

```ts
const PageContextInput = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(40).default(20),
  maxDepth: z.number().int().min(0).max(4).default(2),
})
```

返回节点总数、页面根结构、每个节点的 ID/type/name/layout 摘要，以及下一页 cursor。大段富文本只给截断摘要，详情按 ID 获取。

### 4. External resource catalog

动态数据、页面、菜单、站点配置等都应有 catalog tool。绑定字段需要把内部 ID 解析成：

```json
{
  "id": "data_7d9...",
  "name": "Sports day",
  "sourceType": "REST",
  "fields": ["title", "date", "thumbnail"],
  "sample": { "title": "...", "date": "..." }
}
```

这样用户可以说“绑定到 Sports day 的 thumbnail”，模型也能说明自己操作的对象。

## 安全序列化器

所有 Context 都应经过同一个限制器，而不是让每个工具自行 `JSON.stringify`。

```ts
const LIMITS = {
  maxDepth: 6,
  maxArrayItems: 30,
  maxObjectKeys: 60,
  maxStringLength: 2_000,
  maxTotalValues: 1_500,
}

const SENSITIVE_KEY = /token|secret|password|cookie|authorization|api[-_]?key/i

function serializeValue(value: unknown, depth = 0): unknown {
  if (depth > LIMITS.maxDepth) return '[Max depth reached]'
  if (typeof value === 'string') return value.slice(0, LIMITS.maxStringLength)
  if (Array.isArray(value)) {
    return value
      .slice(0, LIMITS.maxArrayItems)
      .map(item => serializeValue(item, depth + 1))
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .slice(0, LIMITS.maxObjectKeys)
        .map(([key, item]) => [
          key,
          SENSITIVE_KEY.test(key) ? '[REDACTED]' : serializeValue(item, depth + 1),
        ]),
    )
  }
  return value
}
```

实际实现还应处理循环引用、非普通对象、总值数和 URL query 脱敏。请求 header 最好只返回“已配置哪些 header 名”，不要返回内容。

## 新鲜度规则

<Steps>
1. 每轮 `prepareCall()` 都重新生成 runtime scope。
2. 每次写操作前，按 ID 从当前 Store 重新查找目标。
3. 读取结果携带 pageId、viewport 和 version，写工具验证 scope 没变。
4. 用户切页、切换 PC/Mobile、撤销或手动编辑后，废弃旧 context cache。
5. 动态数据 catalog 可以短缓存，但 key 必须包含租户、资源和版本；敏感响应不落本地持久化。
</Steps>

## 抵抗 Prompt Injection

页面文本、富文本、接口返回、组件属性、文件内容都属于不可信数据。System prompt 应声明它们只是被编辑的内容，不是可执行指令；更重要的是：

- 工具路由不根据页面文本解锁敏感能力。
- 数据内容不能改变工具 schema、权限或确认规则。
- 对“读取到的说明”与“系统规则”使用清晰字段边界。
- 不把模型返回的代码交给 `eval()`、`Function()` 或任意脚本执行器。

<Aside type="tip" title="Context 成本的判断标准">
如果模型能通过一个便宜的只读工具在下一步获得事实，就不应把这批事实永久放在 system prompt 或每轮初始上下文里。
</Aside>

## 页面编辑器示例的读取工具

一个完整实现通常包含：`get_page_context`、`get_selected_node_context`、`get_component_catalog`、`get_node_context`、`get_dynamic_data_catalog`，页面/站点/菜单也各有单独读取工具。完整示例见[工具清单](/reference/tool-reference/)。
