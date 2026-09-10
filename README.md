# AI Agent 开发指南

一份面向前端团队的通用 AI Agent 开发指南。站点使用 Astro + Starlight 构建，并部署到 Cloudflare Workers Static Assets。

## 本地开发

```bash
pnpm install
pnpm dev
```

## 构建与部署

```bash
pnpm build
pnpm deploy
```

生产地址：<https://ai-agent-dev-guide.guygubaby.top>

## 内容范围

- 浏览器内运行 `ToolLoopAgent` 与 `DirectChatTransport`
- 从 Pinia Store、选中节点和画布 DOM 生成实时上下文
- 使用 Zod 定义可审计的 CRUD 工具
- 按领域逐步开放工具并裁剪历史上下文
- Schema 事务、撤销、重绘和节点选择恢复
- 删除二次确认、敏感信息脱敏和安全富文本
- 流式聊天、Reasoning、滚动状态机、i18n 与性能策略

> “纯前端”指 Agent 编排与工具执行位于浏览器，不代表不需要模型服务或现有业务 API。公开互联网产品不应把长期有效、无访问限制的模型密钥放进客户端包。
