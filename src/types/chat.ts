/** 对话模式 */
export type ChatMode = 'explore' | 'resume' | 'interview'

/** 消息角色 */
export type MessageRole = 'user' | 'assistant' | 'system'

/** 单条消息 */
export interface ChatMessage {
  id: string
  sessionId: string
  role: MessageRole
  content: string
  mode: ChatMode
  createdAt: string
  /** 附带的结构化数据（职业画像、推荐岗位、简历JSON、雷达图等） */
  structuredData?: Record<string, unknown>
}

/** 会话 */
export interface ChatSession {
  id: string
  title: string
  mode: ChatMode
  createdAt: string
  updatedAt: string
  /** 用户基础信息是否已填写 */
  basicInfoCompleted: boolean
}

/** 用户基础信息（强制收集） */
export interface BasicInfo {
  name: string
  education: string       // 学历：高中/大专/本科/硕士/博士
  major: string           // 专业
  graduationYear: string  // 毕业年份
  workExperience: string  // 工作经验：无/1年以下/1-3年/3-5年/5年以上
  targetCity?: string     // 目标城市
  interests?: string      // 兴趣方向
}

/** SSE 事件类型 */
export type SSEEventType = 'message' | 'done' | 'error' | 'structured'

/** SSE 事件 */
export interface SSEEvent {
  type: SSEEventType
  data: string
}
