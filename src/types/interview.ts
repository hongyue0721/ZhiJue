/** 面试会话 */
export interface InterviewSession {
  id: string
  sessionId: string
  resumeId?: string
  status: 'in_progress' | 'completed'
  currentQuestionIndex: number
  totalQuestions: number
  questions: InterviewQuestion[]
  createdAt: string
  completedAt?: string
}

/** 面试题目 */
export interface InterviewQuestion {
  id: string
  type: 'behavioral' | 'technical' | 'situational' | 'self_intro'
  question: string
  answer?: string
  feedback?: string
  score?: number          // 0-10
}

/** 面试报告 */
export interface InterviewReport {
  interviewId: string
  overallScore: number    // 0-100
  radar: RadarData
  questionFeedbacks: QuestionFeedback[]
  summary: string
  strengths: string[]
  improvements: string[]
  suggestions: string[]
}

/** 雷达图数据（六维） */
export interface RadarData {
  labels: string[]        // 六个维度名称
  scores: number[]        // 对应分数 0-100
}

/** 逐题点评 */
export interface QuestionFeedback {
  questionId: string
  question: string
  answer: string
  score: number
  feedback: string
  betterAnswer?: string
}
