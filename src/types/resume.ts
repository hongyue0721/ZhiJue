/** 简历结构化数据 */
export interface ResumeData {
  id: string
  sessionId: string
  basicInfo: ResumeBasicInfo
  education: ResumeEducation[]
  workExperience: ResumeWorkExperience[]
  projects: ResumeProject[]
  skills: string[]
  selfEvaluation: string
  createdAt: string
  updatedAt: string
}

export interface ResumeBasicInfo {
  name: string
  phone?: string
  email?: string
  location?: string
  title?: string          // 求职意向
  avatar?: string         // 头像 URL
}

export interface ResumeEducation {
  school: string
  degree: string
  major: string
  startDate: string
  endDate: string
  gpa?: string
  highlights?: string[]
}

export interface ResumeWorkExperience {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  highlights: string[]
}

export interface ResumeProject {
  name: string
  role: string
  startDate: string
  endDate: string
  description: string
  highlights: string[]
  techStack?: string[]
}

/** 兼容旧版 Markdown 简历预览 */
export interface ResumeDocument {
  markdown: string
}
