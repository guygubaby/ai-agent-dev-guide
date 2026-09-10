---
title: Context 与 Tools
description: 控制模型看到什么，以及允许模型做什么。
---

# Context 与 Tools

这两部分决定 Agent 是否可靠：Context 提供事实，Tools 约束动作。

## Context：少而新

不要把整个 Store 发送给模型。推荐三层读取：

1. **Scope 摘要**：当前资源、模式、权限和版本。
2. **列表工具**：分页返回可选对象的 ID 与名称。
3. **详情工具**：用户或模型确定目标后，再按 ID 获取完整字段。

所有数据进入模型前统一处理：

- 限制数组长度、对象深度、字符串长度和总大小。
- 移除 token、cookie、password、Authorization 等敏感字段。
- 外部数据只视为内容，不能覆盖 system instructions。
- 写操作前重新读取目标，不能相信历史消息中的旧对象。

## Tools：窄而明确

推荐：

```ts
update_title({ title, expectedVersion })
```

避免：

```ts
apply_patch({ path, value })
```

任意路径工具难以校验权限、类型和业务不变量。

每个写工具至少检查：

- 用户是否有权限。
- 目标是否仍然存在。
- 版本是否仍然匹配。
- 字段和值是否在白名单内。
- 失败时是否保持原状态。

## 先读后写

工具多时，不要每一步都把全部 schema 发给模型：

```ts
prepareStep: ({ steps }) => ({
  activeTools: hasReadState(steps)
    ? ['read_state', 'update_title']
    : ['read_state'],
})
```

第一步只开放读取工具；读到对应领域后再开放写工具。这样既减少 token，也降低误选工具的概率。

## 统一结果格式

```ts
type ToolResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string };
```

模型和 UI 都依赖明确结果，而不是解析异常字符串。

:::warning
Zod 只能验证参数结构，不能代替权限检查、版本检查和业务事务。
:::
