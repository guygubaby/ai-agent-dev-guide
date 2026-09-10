---
title: 工具清单
description: 一个页面编辑器 Agent 的通用工具分组、输入边界和执行前置条件。
---

这份清单不是要求所有项目一次性实现 27 个工具，而是一套可裁剪的参考注册表。先完成只读诊断闭环，再按用户价值逐个加入写操作。

## Discovery 与画布读取

| 工具 | 作用 | 关键限制 |
| --- | --- | --- |
| `get_page_context` | 分页读取当前页面树与布局摘要 | 限制 depth、limit 和文本长度 |
| `get_selected_node_context` | 读取当前选中节点、亲属、配置与 DOM 布局 | 每次调用重新读取选择 |
| `get_component_catalog` | 获取可创建组件与允许的父子关系 | 不返回内部实现或函数 |
| `get_node_context` | 按稳定 ID 补取节点详情 | 验证节点属于当前页面 |
| `get_dynamic_data_catalog` | 解析动态数据 ID、名称、字段和样本 | 脱敏、分页、短缓存 |

## 画布写入

| 工具 | 作用 | 前置与保护 |
| --- | --- | --- |
| `create_component` | 通过组件工厂创建并插入节点 | 校验 parent/position；根级内容默认包裹 PageSection |
| `update_node_styles` | 更新受支持的布局与视觉字段 | 属性/单位/值白名单；指定 viewport |
| `update_node_custom_classes` | 应用原子类兜底样式 | 字符检查 + generator 验证 + 等待派生样式 |
| `update_node_properties` | 更新文本、alt、href、配置与属性 | 按组件类型开放字段；HTML 独立清理 |
| `update_node_list_data` | 修改 Carousel、列表等重复数据 | 限制条数、字段和 payload 大小 |
| `update_node_dynamic_binding` | 设置数据源、字段映射和子节点绑定 | ID 必须来自当前 catalog |
| `delete_component` | 删除节点或子树 | 显示影响；大范围删除需要确认 |
| `undo_last_ai_change` | 撤销最近一次 Agent 事务 | 校验 pageId、version 和 undoId |

## 页面管理

| 工具 | 作用 | 保护 |
| --- | --- | --- |
| `get_pages` | 分页列出可访问页面 | 只返回必要摘要 |
| `get_page_settings` | 读取标题、路径、SEO 等配置 | 按权限过滤 |
| `open_page` | 打开目标页面进入编辑 | 取消旧请求并重置 scope |
| `create_page` | 通过模板/默认工厂创建页面 | 路径唯一、默认 schema 合法 |
| `update_page_settings` | 更新页面元数据 | 字段白名单、版本检查 |
| `delete_page` | 删除页面 | 目标绑定二次确认 |

## 网站配置

| 工具 | 作用 | 保护 |
| --- | --- | --- |
| `get_site_settings` | 读取公开站点配置摘要 | 不返回 Secret、header 值 |
| `create_site_settings` | 创建缺失配置 | 明确唯一性与默认值 |
| `update_site_settings` | 更新允许的站点字段 | 权限、类型、URL 规则 |
| `delete_site_settings` | 删除一项配置 | 二次确认和引用检查 |

## 菜单管理

| 工具 | 作用 | 保护 |
| --- | --- | --- |
| `get_site_menus` | 读取菜单树、条目和目标摘要 | 限深度、分页 |
| `create_site_menu` | 创建菜单或条目 | 校验父级、顺序、URL/页面目标 |
| `update_site_menu` | 修改标题、链接、层级与顺序 | 防止树循环，版本检查 |
| `delete_site_menu` | 删除菜单或条目 | 二次确认并展示子项影响 |

## 默认路由矩阵

| 已完成的读取 | 下一步可开放 |
| --- | --- |
| 无 | 仅 discovery tools |
| 页面/选中节点读取 | 画布写入与 Undo |
| 页面列表/设置读取 | 页面创建、打开、更新；删除仍需确认 |
| 网站设置读取 | 网站设置写入；删除仍需确认 |
| 菜单读取 | 菜单写入；删除仍需确认 |
| 页面创建或打开成功 | 新页面的画布读取与写入 |

## 每个工具都应回答的六个问题

1. 用户在什么意图下应该调用它？
2. 必须先读取什么事实？
3. 输入 schema 的最大范围是什么？
4. Action 层要验证哪些权限和业务不变量？
5. 成功与失败如何结构化返回？
6. UI 应如何展示执行中、成功、失败和确认状态？

如果一个工具无法清楚回答这些问题，它通常过于宽泛，需要继续拆分。

## 版本化

工具名和 schema 是 Agent API。生产系统应记录 tool registry 版本；重命名、字段语义变化和错误码变化需要兼容策略。不要让旧消息中的 tool part 因部署新版本而导致 UI 崩溃，渲染器应能显示未知工具的通用摘要。
