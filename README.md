# AI 开发实践

记录 AI 应用开发中的工程实践、架构取舍与真实实现案例，使用 Rspress 构建并部署到 Cloudflare Workers Static Assets。

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
