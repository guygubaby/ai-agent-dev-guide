import { defineConfig } from '@rspress/core';
import mermaid from 'rspress-plugin-mermaid';

export default defineConfig({
  root: 'docs',
  title: 'AI 开发实践',
  description: '记录 AI 应用开发中的工程实践、架构取舍与真实实现案例。',
  icon: '/favicon.svg',
  lang: 'zh',
  ssg: true,
  llms: true,
  plugins: [mermaid()],
  globalStyles: new URL('./styles/global.css', import.meta.url).pathname,
  themeConfig: {
    nav: [
      { text: '开发指南', link: '/guide/' },
      { text: '专题', link: '/topics/browser-use' },
      { text: '技术参考', link: '/reference/stack' },
      {
        text: 'llms.txt',
        link: 'https://ai-agent-dev-guide.guygubaby.top/llms.txt',
      },
    ],
    sidebar: {
      '/': [
        {
          text: 'Agent 开发',
          items: [
            { text: '先理解 Agent', link: '/guide/' },
            { text: '最小实现', link: '/guide/quick-start' },
            { text: 'Context 与 Tools', link: '/guide/context-and-tools' },
            { text: '工具设计规范', link: '/guide/tool-design' },
            { text: '安全边界', link: '/guide/safety' },
            { text: '体验与性能', link: '/guide/ux-and-performance' },
          ],
        },
        {
          text: '专题',
          items: [
            { text: '浏览器能力实现', link: '/topics/browser-use' },
          ],
        },
        {
          text: '参考',
          items: [
            { text: '技术栈', link: '/reference/stack' },
            { text: '上线检查', link: '/reference/checklist' },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/guygubaby/ai-agent-dev-guide',
      },
    ],
    editLink: {
      docRepoBaseUrl: 'https://github.com/guygubaby/ai-agent-dev-guide/tree/main/docs',
    },
    lastUpdated: true,
    enableScrollToTop: true,
  },
});
