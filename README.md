# AI Agent 开发指南

一份简洁、通用的纯前端 AI Agent 实现指南，使用 Rspress 构建并部署到 Cloudflare Workers Static Assets。

## 使用

```bash
pnpm install
pnpm dev
pnpm run build
```

部署：

```bash
pnpm run deploy
```

生产地址：<https://ai-agent-dev-guide.guygubaby.top>

> 纯前端指 Agent 编排和本地工具运行在浏览器。浏览器无法保守共享 API Key；生产环境需要 BYOK、短期凭据或轻量模型代理。
