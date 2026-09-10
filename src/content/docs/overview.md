---
title: 指南总览
description: 理解 AI Agent、纯前端架构、适用范围以及这份指南的阅读路径。
---

import { Aside, Card, CardGrid, Steps } from '@astrojs/starlight/components'

普通聊天应用只需要把消息交给模型，再显示一段回复；业务 Agent 还必须读取当前事实、选择受控能力、修改应用状态，并让每一步都可验证、可撤销、可解释。

本指南使用一个通用页面编辑器助手作为贯穿示例。它能诊断当前页面与选中节点，修改样式、内容、配置、动态数据绑定和页面结构，也能管理页面、菜单与网站配置。Agent 循环和本地编辑工具全部运行在浏览器内。

## 最重要的结论

<CardGrid>
  <Card title="模型不是业务层" icon="setting">
    模型负责理解意图和选择工具；权限、校验、事务与副作用必须由应用代码负责。
  </Card>
  <Card title="Context 要按需读取" icon="magnifier">
    不要完整 dump Store。先给 scope 摘要，再通过分页、按 ID 查询和领域读取工具补充事实。
  </Card>
  <Card title="写操作必须收口" icon="approve-check">
    工具调用既不是授权，也不是可信输入。每次写入都要重查目标、校验参数并形成事务。
  </Card>
  <Card title="纯前端不等于密钥安全" icon="warning">
    浏览器最终需要使用的共享密钥一定可见。生产环境通常应使用 BYOK、临时凭据或薄 BFF。
  </Card>
</CardGrid>

## 一次请求会经过什么

<Steps>
1. **识别范围**：从本轮用户消息判断语言、目标领域和风险级别。
2. **读取事实**：从 Pinia、页面 Schema、选中节点、DOM 布局或业务 API 读取最小上下文。
3. **选择工具**：首步只暴露 discovery tools；读过相应领域后再开放写工具。
4. **执行 Agent 循环**：模型在文本、reasoning、tool call 和 tool result 之间迭代。
5. **提交事务**：应用层验证权限和参数，修改 Store，并保存撤销与选择恢复所需快照。
6. **反馈结果**：聊天 UI 流式显示思考、工具进度、确认卡片和最终说明。
</Steps>

## 推荐阅读路径

- 第一次接触 Agent：先读[架构与运行流程](/architecture/)和[快速开始](/getting-started/)。
- 正在接入复杂业务：重点读[上下文工程](/core/context-engineering/)、[工具设计与路由](/core/tools-and-routing/)和[Schema 与事务](/core/schema-transactions/)。
- 准备上线：逐项完成[安全](/production/security/)、[性能](/production/performance/)和[测试](/production/testing/)章节。
- 准备落地：使用[工具清单](/reference/tool-reference/)与[项目实现蓝图](/reference/implementation-blueprint/)拆分模块和迭代阶段。

<Aside type="caution" title="安全边界">
如果应用包含共享模型密钥、个人数据、跨租户权限、统一额度或审计要求，推荐把模型请求移动到 Cloudflare Worker 等薄 BFF。DOM、Store 与本地编辑器工具仍可留在浏览器执行。
</Aside>

## 成功标准

一个可以上线的 Agent 至少应满足：

- 每个回答都基于当前状态，而不是旧消息里的对象快照。
- 工具参数有运行时 schema；工具实现会再做业务校验。
- 失败不产生半成品状态；成功可撤销或明确确认不可逆。
- 删除、覆盖、发布等危险动作不会因第一次 tool call 直接执行。
- 用户能看见 submitted、streaming、tool、error 和 stop 等状态。
- 大页面和长会话不会让 Context、DOM 或包体无限增长。
- API Key、token、cookie、Authorization 和数据源 header 不会进入模型上下文或日志。

这套约束比一段很长的 system prompt 更重要。Prompt 用于告知工作方式，而代码才是最终权限边界。
