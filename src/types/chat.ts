/** 流程阶段 */
export type FlowStage = 'basic_info' | 'explore' | 'resume' | 'interview' | 'review'

/** 兼容旧版模式切换组件 */
export type ChatMode = 'explore' | 'resume' | 'interview'

/** 消息角色 */
export type MessageRole = 'user' | 'assistant' | 'system'

/** 单条消息 */
export interface ChatMessage {
  id: string
  sessionId: string
  role: MessageRole
  content: string
  mode: string // stage name
  createdAt: string
  structuredData?: Record<string, unknown>
}

/** 会话 */
export interface ChatSession {
  id: string
  title: string
  mode: string
  stage: FlowStage
  createdAt: string
  updatedAt: string
  basicInfoCompleted: boolean
  basicInfo?: string
  careerProfile?: string
  recommendations?: string
  resumeData?: string
  interviewReport?: string
}

/** 用户基础信息（强制收集） */
export interface BasicInfo {
  name: string
  phone: string
  email?: string
  school: string
  major: string
  grade: string           // 年级：大一/大二/大三/大四/研一/研二/研三
  jobTarget: string       // 求职目标
  workExperience: string  // 工作经验：无/1年以下/1-3年/3-5年/5年以上
  targetCity?: string
  interests?: string
  avatar?: string         // 头像 URL
}

export interface CareerProfileStructured {
  profile: {
    summary: string
    strengths: string[]
    growthAreas: string[]
    personalityTraits: string[]
    careerDirection: string
  }
  recommendations: Array<{
    title: string
    company: string
    matchScore: number
    reason: string
    salaryRange: string
    requirements: string[]
  }>
}

/** SSE 事件类型 */
export type SSEEventType = 'message' | 'done' | 'error' | 'structured'

/** SSE 事件 */
export interface SSEEvent {
  type: SSEEventType
  data: string
}
