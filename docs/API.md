# 职觉 ZhiJue · API 接口规范

> 最后更新：2026-04-29 23:30
> 维护原则：所有改动必须先在此登记 [DRAFT]，再实现代码，最后回填实际响应样例。

## 0. 全局约定
- BaseURL：开发 `http://localhost:3000`；生产 `https://<domain>`
- 鉴权：MVP 阶段不需要登录；以前端持有的 `sessionId` 关联会话
- Content-Type：JSON 接口 `application/json`；流式接口 `text/event-stream`
- 错误响应：

```json
{
  "error": {
    "code": "string",
    "message": "中文可读错误信息",
    "details": {}
  }
}
```

- 通用错误码：`BAD_REQUEST` / `UNAUTHORIZED` / `NOT_FOUND` / `RATE_LIMITED` / `INTERNAL` / `AI_UPSTREAM_ERROR` / `DB_ERROR` / `VALIDATION_ERROR`
- 环境变量：`OPENAI_API_KEY` / `OPENAI_BASE_URL` / `AI_MODEL` / `DATABASE_URL` / `NEXT_PUBLIC_APP_NAME`
- 时区：服务端统一 UTC ISO 字符串；前端本地展示未统一做时区格式化
- AI 提供方：当前主链路走 OpenAI-compatible 接口，默认模型为 `deepseek-v4-flash`

## 1. 最近变更
- 2026-04-29：新增 `POST /api/upload` 图片上传接口；`BasicInfo` 新增 `avatar` 字段；简历改为 easyCV 单栏风格；简历阶段改为 7:3 左右布局；首页加入历史会话列表
- 2026-04-29：新服务器 `121.41.99.231` 聊天主链路已打通；`POST /api/chat` SSE 流式回复正常；`POST /api/sessions/:id/basic-info` 增加表单编码兼容
- 2026-04-29：新服务器 `121.41.99.231` 已完成 Node + pm2 + nginx 部署；`POST /api/chat` 新增表单编码请求体解析，但聊天主链路仍未完全打通
- 2026-04-28：新测试服务器 `121.41.99.231` 已完成基础部署，验证 `sessions` 与 `basic-info` 接口可用，`POST /api/chat` 仍存在线上残留异常
- 2026-04-28：调整单条数据流，`POST /api/chat` 现在会基于结构化结果回写 `sessions` 并推进 `stage`
- 2026-04-28：补全文档，登记当前已实现接口 `POST /api/chat`、`GET|POST /api/sessions`、`GET|DELETE /api/sessions/:id`、`POST /api/sessions/:id/basic-info`

## 2. 接口列表

### 2.1 获取会话列表
- 用途：返回所有历史会话，供聊天侧边栏展示
- Method + Path：`GET /api/sessions`
- 鉴权：无
- 请求 Headers：无特殊要求
- 请求 Body：无

响应示例：

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "求职旅程",
      "mode": "explore",
      "stage": "basic_info",
      "basicInfoCompleted": false,
      "basicInfo": null,
      "careerProfile": null,
      "recommendations": null,
      "resumeData": null,
      "interviewReport": null,
      "createdAt": "2026-04-28T00:00:00.000Z",
      "updatedAt": "2026-04-28T00:00:00.000Z"
    }
  ]
}
```

错误响应：
- `500 DB_ERROR`：数据库读取失败

实现备注：
- 结果按 `updatedAt desc` 排序

### 2.2 创建会话
- 用途：新建一条求职会话，默认从基础信息阶段开始
- Method + Path：`POST /api/sessions`
- 鉴权：无
- 请求 Headers：`Content-Type: application/json`

请求 Body：

```ts
type CreateSessionRequest = {
  mode?: string
}
```

请求示例：

```json
{
  "mode": "explore"
}
```

响应示例：

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "求职旅程",
    "mode": "explore",
    "stage": "basic_info",
    "basicInfoCompleted": false,
    "basicInfo": null,
    "careerProfile": null,
    "recommendations": null,
    "resumeData": null,
    "interviewReport": null,
    "createdAt": "2026-04-28T00:00:00.000Z",
    "updatedAt": "2026-04-28T00:00:00.000Z"
  }
}
```

错误响应：
- `500 DB_ERROR`：数据库写入失败

实现备注：
- `mode` 默认值为 `explore`
- `stage` 固定初始化为 `basic_info`
- `title` 当前固定为 `求职旅程`
- 线上验证状态：
  - `121.41.99.231` 已验证返回 `201`

### 2.3 获取单个会话详情
- 用途：获取单个会话及其消息列表，用于恢复聊天上下文
- Method + Path：`GET /api/sessions/:id`
- 鉴权：无
- 请求 Headers：无特殊要求
- 路径参数：`id: string`
- 请求 Body：无

响应示例：

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "求职旅程",
    "mode": "explore",
    "stage": "explore",
    "basicInfoCompleted": true,
    "basicInfo": "{\"name\":\"张三\",\"school\":\"某大学\"}",
    "careerProfile": null,
    "recommendations": null,
    "resumeData": null,
    "interviewReport": null,
    "createdAt": "2026-04-28T00:00:00.000Z",
    "updatedAt": "2026-04-28T00:10:00.000Z",
    "messages": [
      {
        "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
        "sessionId": "550e8400-e29b-41d4-a716-446655440000",
        "role": "user",
        "content": "你好",
        "mode": "explore",
        "structuredData": null,
        "createdAt": "2026-04-28T00:10:00.000Z"
      }
    ]
  }
}
```

错误响应：
- `404 NOT_FOUND`：会话不存在
- `500 DB_ERROR`：数据库读取失败

实现备注：
- 当前消息列表未显式排序，返回顺序取决于 SQLite 查询结果

### 2.4 删除会话
- 用途：删除会话以及关联消息
- Method + Path：`DELETE /api/sessions/:id`
- 鉴权：无
- 请求 Headers：无特殊要求
- 路径参数：`id: string`
- 请求 Body：无

响应示例：

```json
{
  "data": {
    "success": true
  }
}
```

错误响应：
- `500 DB_ERROR`：数据库删除失败

实现备注：
- 当前先删 `messages`，再删 `sessions`
- 若 `id` 不存在，接口仍可能返回成功，不做额外存在性校验

### 2.5 提交基础信息
- 用途：保存用户基础档案，并推动会话进入职业探索阶段
- Method + Path：`POST /api/sessions/:id/basic-info`
- 鉴权：无
- 请求 Headers：
  - `Content-Type: application/json`
  - `Content-Type: application/x-www-form-urlencoded`（兼容）
- 路径参数：`id: string`

请求 Body：

```ts
type BasicInfo = {
  name: string
  phone: string
  email?: string
  school: string
  major: string
  grade: string
  jobTarget: string
  workExperience: string
  targetCity?: string
  interests?: string
}
```

请求示例：

```json
{
  "name": "张三",
  "phone": "13800000000",
  "email": "zhangsan@example.com",
  "school": "某大学",
  "major": "计算机科学与技术",
  "grade": "大四",
  "jobTarget": "前端开发工程师",
  "workExperience": "1年以下",
  "targetCity": "上海",
  "interests": "AI 产品、前端体验"
}
```

响应示例：

```json
{
  "data": {
    "success": true
  }
}
```

错误响应：
- `422 VALIDATION_ERROR`：缺少必填字段
- `500 DB_ERROR`：数据库更新失败

实现备注：
- 当前仅做必填字段非空校验，未接入 `zod`
- 当前必填字段为：`name`、`phone`、`school`、`major`、`grade`、`jobTarget`、`workExperience`
- 成功后会更新：
  - `basicInfo`
  - `basicInfoCompleted = true`
  - `stage = "explore"`
  - `updatedAt`
- 线上验证状态：
  - `121.41.99.231` 已验证返回 `200`
  - 兼容 `application/x-www-form-urlencoded` 格式

### 2.6 流式对话
- 用途：保存用户消息，基于会话上下文调用 AI 并以 SSE 流式返回回复，同时落库存档
- Method + Path：`POST /api/chat`
- 鉴权：无
- 请求 Headers：
  - `Content-Type: application/json`
  - 建议客户端接受 `text/event-stream`

请求 Body：

```ts
type ChatRequest = {
  sessionId: string
  content: string
  mode?: string
}
```

兼容请求格式：
- `application/json`
- `application/x-www-form-urlencoded`

请求示例：

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "content": "请帮我分析一下适合我的职业方向",
  "mode": "explore"
}
```

成功响应：
- HTTP `200`
- `Content-Type: text/event-stream`

SSE 事件格式：

```text
event: message
data: {"content":"分片文本"}

event: structured
data: {"type":"profile","data":{}}

event: error
data: {"message":"AI 服务暂时不可用，请稍后重试"}

event: done
data: {"finished":true}
```

错误响应：
- `400 BAD_REQUEST`：缺少 `sessionId` 或 `content`
- `404 NOT_FOUND`：会话不存在
- `500 INTERNAL`：请求体解析或接口顶层处理失败

实现备注：
- 当前会先把用户消息写入 `messages`
- 历史消息来源于当前会话下全部 `user` / `assistant` 消息
- 系统提示词由 `getSystemPrompt(mode, { basicInfo })` 生成
- AI 主链路调用 `src/lib/ai/openai.ts` 中的 OpenAI-compatible stream
- AI 完整文本会再经 `extractStructuredData()` 提取 ```json:structured` 代码块
- 提取后的结构化数据会：
  - 写入当前 assistant 消息的 `structuredData`
  - 通过 `structured` SSE 事件发送给前端
- 当前接口会把结构化结果自动回写到 `sessions` 表，并推进阶段：
  - `career_profile` -> 回写 `careerProfile`、`recommendations`，并把 `stage` 推进到 `resume`
  - `resume` -> 回写 `resumeData`，并把 `stage` 保持在 `resume`（需用户确认后才推进到 `interview`）
  - `interview_report` -> 回写 `interviewReport`，并把 `stage` 推进到 `review`
- AI 流处理中如发生异常，不会改变 HTTP 状态，而是通过 SSE `error` 事件通知前端，随后补发 `done` 事件
- 线上验证状态：
  - 新服务器 `121.41.99.231` 已完全打通，SSE 流式回复正常
  - 服务端已增加对 `application/x-www-form-urlencoded` 的兼容解析
  - 前端 `crypto.randomUUID()` 已替换为 `generateLocalId()` 兼容 HTTP 环境
  - 前端正确识别 `done` 事件并终止读取循环

## 3. 数据模型补充

### 3.1 Session

```ts
type ChatSession = {
  id: string
  title: string
  mode: string
  stage: 'basic_info' | 'explore' | 'resume' | 'interview' | 'review'
  createdAt: string
  updatedAt: string
  basicInfoCompleted: boolean
  basicInfo?: string
  careerProfile?: string
  recommendations?: string
  resumeData?: string
  interviewReport?: string
}
```

### 3.2 Message

```ts
type ChatMessage = {
  id: string
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  mode: string
  createdAt: string
  structuredData?: Record<string, unknown>
}
```

## 4. 当前未实现但已预留的能力
- `resume` 阶段提示词已存在，但未发现对应 API Route
- `interview` 阶段提示词已存在，但未发现对应 API Route
- `resumes`、`interviews` 数据表已建模，但当前接口未使用
- 简历导出、雷达图、结构化报告的完整服务端闭环尚未登记到现有 API 中

## 5. 当前流程约束
- 当前产品实现方向改为单条数据流，而非三个独立工具拼接
- 数据流目标为：
  - 基础信息 -> 职业画像 / 目标岗位 / 优势短板
  - 基础信息 + 职业画像 + 目标岗位 -> 简历生成
  - 表格式简历 + 目标岗位 -> 模拟面试
  - 用户回答 -> 复盘建议
- 目前已完成的数据承接：
  - 探索结果可承接到 `resume`
  - 简历结果可承接到 `interview`
  - 面试报告可承接到 `review`

## 6. 部署现状
- 新测试服务器：`121.41.99.231`
- 当前部署方式：`Node 20 + pnpm build + pm2 + nginx reverse proxy`
- 已确认可用：
  - `/chat` 页面访问
  - `GET /api/sessions`
  - `POST /api/sessions`
  - `POST /api/sessions/:id/basic-info`
  - `POST /api/chat`（SSE 流式回复正常，已验证 AI 对话完整输出）
  - `POST /api/upload`（图片上传，待验证）
- 运行配置：
  - `OPENAI_API_KEY`：已配置真实密钥（存于服务器 `.env`，不入 git）
  - `OPENAI_BASE_URL`：`http://47.104.6.123:3000/v1`
  - `AI_MODEL`：`deepseek-v4-flash`
  - PM2 固定为单实例 fork 模式
  - nginx 反代 80→3000，`/api/chat` 路径已关闭 proxy buffering
