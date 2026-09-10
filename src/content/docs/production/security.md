---
title: 安全与确认
description: 保护模型凭据、业务数据、HTML、工具权限与危险操作。
---

import { Aside, Steps } from '@astrojs/starlight/components'

纯前端 Agent 可以完整运行，但浏览器不是秘密执行环境。安全设计要分别处理模型凭据、Context、工具授权、持久化内容和不可逆操作。

## API Key 的现实边界

Vite 的 `VITE_*` 环境变量会在构建时替换进客户端 bundle。无论变量名、混淆、加密 LocalStorage 还是运行时配置，只要浏览器能发送 Bearer token，用户就能通过 DevTools 看到它。

### 纯前端可接受的方式

- **BYOK**：用户输入自己的 Key，默认仅保存在内存；只有用户明确选择时才跨刷新保存。
- **受限临时凭据**：已有认证系统签发短期 token，限制模型、额度、有效期、来源和租户。
- **受信任内部环境**：明确接受密钥可见，并在供应商侧限制额度、域名和权限。

### 生产推荐

共享生产密钥、个人数据、统一限流、审计或跨租户权限存在时，把模型请求放进薄 Cloudflare Worker BFF：

```text
Browser UI + local tools ── same-origin stream ── Worker ── model provider
```

Store/DOM 工具仍在浏览器执行；Worker 只负责 Secret、认证、限流、模型代理和日志策略。

## CORS 与供应商兼容

浏览器直连需要 endpoint：

- 响应 HTTPS。
- 允许应用的明确 Origin。
- 允许 `POST`、`OPTIONS` 和 `Authorization`、`Content-Type` headers。
- 支持流式响应且代理层不缓冲。
- 实际支持目标模型的 tool calling、reasoning 和多步调用字段。

不要只以一次 `200 OK` 判断兼容。`content: "[]"`、reasoning 独立字段、工具参数为空或图片输入降级，都可能在协议层成功但在产品层失败。

## 权限模型

授权必须在工具执行时完成：

```ts
async function updatePage(input: UpdatePageInput, session: Session) {
  assertAuthenticated(session)
  assertPermission(session, 'page:update', input.pageId)
  const current = await pageStore.get(input.pageId)
  assertVersion(current, input.expectedVersion)
  return pageStore.updateValidated(input)
}
```

System prompt 中的“只修改当前页面”是行为提示，不是安全措施。

## 危险操作确认

页面、菜单、站点配置删除等操作需要目标绑定的确认状态机：

```ts
interface PendingConfirmation {
  confirmationId: string
  action: 'delete_page' | 'delete_menu' | 'delete_site_settings'
  resourceId: string
  resourceVersion: number
  requestedAt: number
  expiresAt: number
}
```

<Steps>
1. 模型第一次调用删除工具时，冻结资源 ID、版本、标题和影响摘要。
2. 工具返回 `CONFIRMATION_REQUIRED`，UI 渲染“确认删除 / 取消”按钮。
3. 用户点击确认，或下一条消息严格等于“确认删除”/`confirm delete`。
4. 再次核对 confirmationId、resourceId、version、权限和有效期。
5. 匹配后直接执行冻结动作；任何其他回复取消待确认。
</Steps>

确认应有短有效期（例如五分钟）。如果资源在等待期间变化，必须失效并重新展示影响。

AI SDK 自带 `needsApproval` 流程，适合通用工具批准；应用状态机更适合目标已确定的本地删除。两者都不能只靠模型口头询问“你确定吗”。

## Context 脱敏

递归过滤键名：`token`、`secret`、`password`、`cookie`、`authorization`、`apiKey`。URL query 参数也要脱敏；请求 header 只透露是否配置。日志与 telemetry 同样执行脱敏，错误消息不要包含完整请求体。

## Markdown 与富文本

有两条不同边界：

1. **聊天 Markdown**：Marked 解析后用 DOMPurify allow-list 净化；禁用原始 HTML 与图片，安全处理外链。
2. **写入页面的 HTML**：用 `sanitize-html` 等业务白名单，严格限制 tag、attribute、protocol 和 inline style。

严禁把模型输出交给 `eval()`、动态 `<script>`、`Function()` 或未经审查的模板编译器。

## URL 与 CSS

- URL 使用 `new URL()` 解析并限制协议；禁止 `javascript:`、`data:`（除非明确的安全图片场景）。
- CSS 值禁止 `expression()`、`url()`、声明分隔符和行为型属性。
- 自定义类名限制字符集，并交给实际原子类 generator 验证。
- 远程图片要限制协议、大小和 MIME，上传文件需要独立扫描与资源服务策略。

<Aside type="danger" title="前端工具不是隔离沙箱">
Agent 工具与当前用户拥有相同的浏览器权限。它不能越过服务端 ACL，但也会放大前端已有的危险 API。先缩小工具能力，再讨论 Prompt 防护。
</Aside>

## 发布前检查

- 客户端产物与 source map 中没有共享 API Key。
- 模型 Context、日志和错误追踪没有敏感字段。
- 所有写工具在运行时检查权限、scope 和版本。
- 危险操作在 UI 中展示准确目标与不可逆性。
- 所有 HTML/Markdown/URL/CSS 写入都有明确 allow-list。
- CSP、依赖审计和供应商数据保留策略已确认。
