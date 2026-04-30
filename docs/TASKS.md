# 职觉 ZhiJue · TASKS 任务记录

> 最后更新：2026-04-30 00:30
> 说明：本文件记录每次工作范围、完成结果、自测结论、接口变更和后续建议，作为跨会话续接依据。

## 已完成工作记录

### 2026-04-29 · 简历阶段布局优化 + 照片完整渲染 + 骨架简历 + 提示词修复
- ✅ 完成：
  - **简历阶段 6:4 左右布局**（`ChatLayout.tsx`）：左侧聊天区 `flex-[6]` + 右侧简历预览 `flex-[4]`，底部操作按钮固定
  - **A4Frame 自适应组件**（`ChatLayout.tsx`）：`ResizeObserver` 监听容器宽度，按宽度等比缩放 + `overflow-y: auto` 支持上下滚动查看完整简历
  - **照片完整渲染**（`ResumeExportButtons.tsx`）：导出 PDF 前将所有 `<img>` 通过 `fetch` + `FileReader` 转为 data URL 内联，照片完整嵌入 PDF
  - **骨架简历实时渲染**（`ChatContext.tsx`）：`career_profile` 结构化事件时用 `basicInfo` 创建骨架 `ResumeData` 立即 `dispatch SET_RESUME_DATA`，右侧预览区立即显示
  - **简历提示词修复**（`resume.ts`）：补充 `phone`/`email`/`location` 字段 + 禁止重复询问指令 + 模块收集顺序（教育经历 → 工作经历 → 项目经历 → 技能 → 自我评价）
  - 服务器 `121.41.99.231` build + PM2 restart + 验证通过
- 🔧 接口变更：本次无接口变更
- 📦 commit：未提交

## 已完成工作记录

### 2026-04-30 · Notion 浅色米黄配色全站改造
- ✅ 完成：
  - 全站改为 Notion 浅色米黄风格：背景 `#FFFCF7`、卡片 `#FFFFFF`、强调色 `#D4A853`、文字 `#37352F`
  - `tailwind.config.ts`：色彩 token 全面改为 Notion 浅色（notion-bg/surface/hover/border/text/accent）
  - `globals.css`：CSS 变量、滚动条、选中色、prose-notion Markdown 排版样式
  - `layout.tsx`：Toaster 浅色样式
  - `home/page.tsx`：首页 Hero + 历史记录浅色适配
  - `MessageBubble.tsx`：用户气泡深色文字白字、AI 气泡白色卡片 + 边框
  - `MessageList.tsx`：空状态浅色适配
  - `InputBox.tsx`：白色输入框 + 浅阴影
  - `BasicInfoForm.tsx`：浅色表单
  - `ChatLayout.tsx`：进度条、简历区背景 `#F5F0E8`、操作按钮浅色适配
  - `ResumeExportButtons.tsx`：深色文字白字按钮
  - `InterviewReport.tsx`：浅色卡片 + 暖金评分
  - `RadarChart.tsx`：暖金配色
  - 服务器 build + PM2 restart + 验证通过
  - 推送到 GitHub `hongyue0721/ZhiJue`
- 🔧 接口变更：本次无接口变更
- 📦 commit：`feat: Notion 浅色米黄配色全站改造`

### 2026-04-29 · 简历阶段布局优化 + PDF 照片修复 + A4Frame 自适应
- ✅ 完成：
  - `ChatLayout.tsx`：简历阶段改为 6:4 左右分栏（左侧聊天 60% + 右侧简历预览 40%）
  - `ChatLayout.tsx`：A4Frame 组件重写，按宽度等比缩放 + `overflow-y: auto` 支持上下滚动查看完整简历
  - `ChatLayout.tsx`：操作按钮（重新生成/导出PDF/确认简历）固定在右侧底部 `flex-shrink-0`
  - `ResumeExportButtons.tsx`：PDF 导出前将所有 `<img>` 通过 `fetch` + `FileReader` 转为 data URL 内联，照片完整嵌入 PDF
  - `ResumeExportButtons.tsx`：移除 `filter` 跳过图片逻辑
  - 服务器 `121.41.99.231` build + PM2 restart 验证通过
- 🔧 接口变更：本次无接口变更
- 📦 commit：待提交

### 2026-04-29 · 简历提示词修复 + 骨架简历 + PDF skipImages
- ✅ 完成：
  - `src/lib/prompts/resume.ts`：补充 phone/email/location 字段 + 禁止重复询问指令 + 模块收集顺序
  - `src/contexts/ChatContext.tsx`：career_profile 事件创建骨架 ResumeData 立即渲染预览区
  - `src/components/chat/ChatLayout.tsx`：简历阶段改为全宽简历预览 + 底部输入框
  - `src/components/chat/ResumeExportButtons.tsx`：toPng 添加 filter 跳过 HTMLImageElement
  - 服务器 build + PM2 restart 验证通过
  - `docs/API.md` + `docs/TASKS.md` 更新
- 🔧 接口变更：本次无接口变更

### 2026-04-29 · 照片上传 + 单栏简历 + 首页历史记录 + 对话页重构
- ✅ 完成：
  - 新增 `POST /api/upload` 图片上传接口（存 `public/uploads/avatar/`）
  - `BasicInfo` 新增 `avatar` 字段，`BasicInfoForm` 加照片上传区域
  - `ResumePreview.tsx` 改为 easyCV 风格单栏 A4 简历
  - `ResumeExportButtons.tsx` 修正 PDF 导出（`toPng` 具名导入、分页逻辑修正、toast 提示）
  - `ChatLayout.tsx` 移除左侧 Sidebar，顶部加返回按钮
  - `home/page.tsx` 加入历史会话列表 + "历史回顾"按钮 + 删除功能
  - `chat/page.tsx` 支持 `?session={id}` 参数加载指定会话
  - `docs/API.md` + `docs/TASKS.md` 更新
  - 服务器 build 通过并部署
- 🔧 接口变更：
  - 新增 `POST /api/upload`
  - `BasicInfo` / `ResumeBasicInfo` 新增 `avatar` 字段
- 📦 commit：未提交

### 2026-04-29 · 聊天主链路完全打通，发送消息功能修复
- ✅ 完成：
  - 服务器 `.env` 配置真实 API Key
  - `ChatContext.tsx`：`generateLocalId()` 替代 `crypto.randomUUID()`
  - `ChatContext.tsx`：正确识别 `done` 事件
  - `chat/route.ts`：异常时补发 `sendDone()`
  - `basic-info/route.ts`：新增 form-urlencoded 兼容
  - PM2 固定单实例，nginx 反代
- 🧪 自测结论：浏览器端完整回归通过 ✅

### 2026-04-29 · 新服务器部署完成
- ✅ 完成：服务器 `121.41.99.231` 安装 Node 20 + pnpm + PM2 + nginx，项目 build + 部署

### 2026-04-28 · 修复职业探索消息无响应并打通阶段承接
- ✅ 完成：SSE 解析修正、基础信息时序修正、结构化结果回写 sessions

### 2026-04-28 · 初始化文档基线
- ✅ 完成：创建 `docs/API.md` + `docs/TASKS.md`
