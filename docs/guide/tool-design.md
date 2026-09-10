---
title: 工具设计规范
description: 使用渐进式发现管理大量工具，而不是把全部工具一次性交给模型。
---

# 工具设计规范

工具可以很多，但模型每一步看到的工具应该很少。核心做法是把“系统拥有的全部工具”和“本步骤允许模型选择的工具”分开。

```text
完整工具注册表
      ↓
本轮常驻的发现工具
      ↓
模型读取某个领域
      ↓
解锁该领域的操作工具
      ↓
执行、校验、返回结果
```

这是一种**渐进式发现**：模型先发现目标和事实，再获得完成任务所需的能力。

## 六条规则

### 1. 完整注册，按步暴露

应用维护一个完整、类型安全、顺序稳定的工具注册表。每次请求模型时，通过 `activeTools` 只发送当前子集的名称、描述和输入 Schema。

未激活的工具仍然存在于应用中，只是本步骤不会进入模型上下文。

### 2. 首步只给常驻工具

每个新回合从少量常驻工具开始：

- 当前上下文读取。
- 资源列表或摘要读取。
- 各领域的入口读取工具。
- 明确、安全且高频的全局动作，例如撤销。

这些工具负责定位目标，不负责大范围修改。

### 3. 读取哪个领域，就解锁哪个领域

工具按领域分组。模型调用某个领域的读取工具后，下一步才开放该组的详情、创建、更新和删除工具。

```ts
const discoveryTools = [
  'read_current_context',
  'list_resources',
  'read_settings',
] as const;

const toolGroups = {
  content: [
    'read_current_context',
    'read_content',
    'create_content',
    'update_content',
    'delete_content',
  ],
  resource: [
    'list_resources',
    'read_resource',
    'create_resource',
    'update_resource',
    'delete_resource',
  ],
  settings: [
    'read_settings',
    'update_settings',
  ],
} as const;
```

路由依据是**本回合实际调用过的工具**，不是对用户消息做脆弱的关键词匹配。

### 4. 本回合累积，下回合重置

同一请求可能跨越多个领域。已经解锁的分组在本回合继续可用，新读取的领域再累积加入。

新用户消息开始时恢复到常驻工具集，避免上一轮获得的能力无期限延续。

### 5. 显式声明跨领域桥接

少数动作天然会进入另一个领域，例如创建或打开资源后继续编辑其内容。用明确映射解锁下游工具，不要让模型猜测依赖关系。

```ts
const bridgeGroups = {
  create_resource: ['content'],
  open_resource: ['content'],
} as const;
```

### 6. 解锁不等于跳过安全检查

`activeTools` 只控制模型能否看到工具，不是权限系统。每个工具执行时仍需校验权限、目标、版本、输入白名单和事务边界。

危险操作第一次调用只能登记待确认目标并返回 `confirmationRequired`。真正执行时必须校验同一目标、明确确认和有效期；取消或超时后立即失效。

## 路由实现

下面是当前流程的抽象版本：

```ts
function getActiveTools(calledTools: readonly string[]) {
  const activeToolSet = new Set<string>(discoveryTools);

  for (const calledTool of calledTools) {
    const group = findGroupByTool(calledTool);

    if (group) {
      for (const toolName of toolGroups[group]) {
        activeToolSet.add(toolName);
      }
    }

    for (const bridgedGroup of bridgeGroups[calledTool] ?? []) {
      for (const toolName of toolGroups[bridgedGroup]) {
        activeToolSet.add(toolName);
      }
    }
  }

  return allToolNames.filter(toolName => activeToolSet.has(toolName));
}

const agent = new ToolLoopAgent({
  tools,
  toolOrder: allToolNames,
  prepareStep: ({ steps }) => ({
    activeTools: getActiveTools(
      steps.flatMap(step =>
        step.toolCalls.map(call => call.toolName),
      ),
    ),
  }),
});
```

系统提示词还要明确告诉模型：如果目标工具当前不可见，先调用同领域的读取工具，不要直接声称没有能力。

## 为什么这样设计

| 目标 | 渐进式发现的作用 |
| --- | --- |
| 控制上下文 | 每一步只发送少量工具 Schema |
| 提高选中率 | 减少名称相近工具之间的竞争 |
| 限制副作用 | 先读取真实状态，再开放写操作 |
| 支持扩展 | 新增工具只需归入现有分组或增加新入口 |
| 便于审计 | 每次能力扩展都有明确的工具调用依据 |

## 边界

- 工具数量较少时，保持简单，不必提前分组。
- 工具达到几十个时，优先采用领域分组和 `activeTools`。
- 工具达到数百个且来自动态插件时，再增加 `search_tools` 或能力目录；不要一开始就引入二次工具搜索系统。
- 无论工具多少，都不要提供可写任意路径、执行任意代码或覆盖整个状态的万能工具。

:::tip
判断设计是否正确的简单标准：模型第一步应该只会“定位和读取”，得到事实后才会看到“修改和删除”。
:::
