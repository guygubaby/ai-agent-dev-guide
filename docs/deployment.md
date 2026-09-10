---
title: 部署
description: 使用 Rspress 构建静态文档，并部署到 Cloudflare Workers Static Assets。
---

# 部署

## 本地命令

```bash
pnpm install
pnpm dev
pnpm run build
pnpm preview
```

Rspress 默认启用 SSG，生产文件输出到 `doc_build`。

## Cloudflare

```jsonc title="wrangler.jsonc"
{
  "name": "ai-agent-dev-guide",
  "compatibility_date": "2026-09-10",
  "assets": {
    "directory": "./doc_build",
    "not_found_handling": "404-page"
  },
  "routes": [
    {
      "pattern": "ai-agent-dev-guide.guygubaby.top",
      "custom_domain": true
    }
  ]
}
```

部署：

```bash
pnpm run deploy
```

完成后同时检查首页、直接访问的子页面和不存在页面，不能只以 Wrangler 上传成功作为验收。

## 生产地址

[ai-agent-dev-guide.guygubaby.top](https://ai-agent-dev-guide.guygubaby.top)
