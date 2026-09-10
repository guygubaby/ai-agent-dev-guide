---
title: 上线检查
description: 一份短小的纯前端 Agent 发布清单。
---

# 上线检查

## Context

- [ ] 只发送当前任务需要的事实。
- [ ] 数据有长度、深度和分页上限。
- [ ] token、cookie、password、Authorization 已脱敏。
- [ ] 写入前会重新读取当前目标和版本。

## Tools

- [ ] 每个工具只表达一个明确动作。
- [ ] 输入有 Zod schema，执行时还有权限和业务校验。
- [ ] 失败不会留下部分修改。
- [ ] 工具返回统一的成功/错误结构。
- [ ] 危险操作需要目标绑定的二次确认。

## UI

- [ ] submitted、reasoning、tool、error、stop 都有可见状态。
- [ ] 用户查看历史消息时不会被自动滚动打断。
- [ ] Markdown/HTML 已净化。
- [ ] 键盘、焦点、对比度和 reduced motion 可用。
- [ ] 回复语言优先跟随本轮用户消息。

## 运行与安全

- [ ] 浏览器产物中没有共享 Secret。
- [ ] 已实测目标模型的 streaming 和 tool calling。
- [ ] 有步骤上限、token 上限、取消和超时。
- [ ] 日志不包含原始敏感 Context。
- [ ] 关键写操作有回滚或 Undo。

满足这份清单后，再逐步增加更多工具，而不是先扩大 Prompt。
