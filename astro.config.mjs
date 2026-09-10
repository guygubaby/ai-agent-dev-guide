// @ts-check
import sitemap from '@astrojs/sitemap'
import starlight from '@astrojs/starlight'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://ai-agent-dev-guide.guygubaby.top',
  integrations: [
    starlight({
      title: 'AI Agent 开发指南',
      description: '构建一个可读上下文、可调用工具、可安全修改业务状态的纯前端 AI Agent。',
      favicon: '/favicon.svg',
      customCss: ['./src/styles/global.css'],
      editLink: {
        baseUrl: 'https://github.com/guygubaby/ai-agent-dev-guide/edit/main/',
      },
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/guygubaby/ai-agent-dev-guide',
        },
      ],
      sidebar: [
        {
          label: '开始',
          items: [
            { label: '指南总览', slug: 'overview' },
            { label: '架构与运行流程', slug: 'architecture' },
            { label: '快速开始', slug: 'getting-started' },
          ],
        },
        {
          label: '核心实现',
          items: [
            { label: '上下文工程', slug: 'core/context-engineering' },
            { label: '工具设计与路由', slug: 'core/tools-and-routing' },
            { label: 'Schema 与事务', slug: 'core/schema-transactions' },
            { label: '聊天 UI 与交互', slug: 'core/chat-ux' },
          ],
        },
        {
          label: '生产质量',
          items: [
            { label: '安全与确认', slug: 'production/security' },
            { label: '性能与上下文预算', slug: 'production/performance' },
            { label: '测试与验收', slug: 'production/testing' },
            { label: '部署到 Cloudflare', slug: 'production/deployment' },
          ],
        },
        {
          label: '参考',
          items: [
            { label: '工具清单', slug: 'reference/tool-reference' },
            { label: '工具库与选型', slug: 'reference/libraries' },
            { label: '项目实现蓝图', slug: 'reference/implementation-blueprint' },
          ],
        },
      ],
    }),
    vue(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
