import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

/** 流程阶段 */
// basic_info -> explore -> resume -> interview -> review

/** 会话表 */
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  title: text('title').notNull().default('新对话'),
  mode: text('mode').notNull().default('explore'),
  /** 当前流程阶段: basic_info | explore | resume | interview | review */
  stage: text('stage').notNull().default('basic_info'),
  basicInfoCompleted: integer('basic_info_completed', { mode: 'boolean' }).notNull().default(false),
  basicInfo: text('basic_info'), // JSON string of BasicInfo
  /** 职业画像 JSON */
  careerProfile: text('career_profile'),
  /** 推荐岗位 JSON */
  recommendations: text('recommendations'),
  /** 简历数据 JSON */
  resumeData: text('resume_data'),
  /** 面试报告 JSON */
  interviewReport: text('interview_report'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

/** 消息表 */
export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => sessions.id),
  role: text('role').notNull(), // user | assistant | system
  content: text('content').notNull(),
  mode: text('mode').notNull(), // explore | resume | interview
  structuredData: text('structured_data'), // JSON string
  createdAt: text('created_at').notNull(),
})

/** 简历表 */
export const resumes = sqliteTable('resumes', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => sessions.id),
  data: text('data').notNull(), // JSON string of ResumeData
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

/** 面试表 */
export const interviews = sqliteTable('interviews', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => sessions.id),
  resumeId: text('resume_id').references(() => resumes.id),
  status: text('status').notNull().default('in_progress'),
  currentQuestionIndex: integer('current_question_index').notNull().default(0),
  totalQuestions: integer('total_questions').notNull().default(6),
  questions: text('questions').notNull().default('[]'),
  report: text('report'),
  createdAt: text('created_at').notNull(),
  completedAt: text('completed_at'),
})
