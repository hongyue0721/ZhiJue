'use client'

import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import type { ChatMessage, ChatSession, FlowStage, BasicInfo, CareerProfileStructured } from '@/types/chat'
import type { CareerProfile, JobRecommendation } from '@/types/profile'
import type { ResumeData } from '@/types/resume'
import type { InterviewReport } from '@/types/interview'

/** 生成 UUID（兼容非 HTTPS 环境，crypto.randomUUID 仅在安全上下文可用） */
function generateLocalId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
  } catch {
    // ignore
  }
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6]! & 0x0f) | 0x40
  bytes[8] = (bytes[8]! & 0x3f) | 0x80
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

interface ChatState {
  sessions: ChatSession[]
  currentSession: ChatSession | null
  messages: ChatMessage[]
  stage: FlowStage
  isLoading: boolean
  isStreaming: boolean
  basicInfo: BasicInfo | null
  careerProfile: CareerProfile | null
  recommendations: JobRecommendation[]
  resumeData: ResumeData | null
  interviewReport: InterviewReport | null
  sidebarOpen: boolean
}

type ChatAction =
  | { type: 'SET_SESSIONS'; payload: ChatSession[] }
  | { type: 'SET_CURRENT_SESSION'; payload: ChatSession | null }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_LAST_MESSAGE'; payload: string }
  | { type: 'REMOVE_LAST_ASSISTANT_MESSAGE' }
  | { type: 'SET_STAGE'; payload: FlowStage }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'SET_BASIC_INFO'; payload: BasicInfo | null }
  | { type: 'SET_CAREER_PROFILE'; payload: CareerProfile | null }
  | { type: 'SET_RECOMMENDATIONS'; payload: JobRecommendation[] }
  | { type: 'SET_RESUME_DATA'; payload: ResumeData | null }
  | { type: 'SET_INTERVIEW_REPORT'; payload: InterviewReport | null }
  | { type: 'MERGE_CURRENT_SESSION'; payload: Partial<ChatSession> }
  | { type: 'TOGGLE_SIDEBAR' }

const initialState: ChatState = {
  sessions: [],
  currentSession: null,
  messages: [],
  stage: 'basic_info',
  isLoading: false,
  isStreaming: false,
  basicInfo: null,
  careerProfile: null,
  recommendations: [],
  resumeData: null,
  interviewReport: null,
  sidebarOpen: false,
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload }
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSession: action.payload }
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload }
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] }
    case 'UPDATE_LAST_MESSAGE': {
      const msgs = [...state.messages]
      const last = msgs[msgs.length - 1]
      if (last && last.role === 'assistant') {
        msgs[msgs.length - 1] = { ...last, content: last.content + action.payload }
      }
      return { ...state, messages: msgs }
    }
    case 'REMOVE_LAST_ASSISTANT_MESSAGE': {
      const last = state.messages[state.messages.length - 1]
      if (last?.role !== 'assistant' || last.content.trim() !== '') {
        return state
      }
      return { ...state, messages: state.messages.slice(0, -1) }
    }
    case 'SET_STAGE':
      return { ...state, stage: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_STREAMING':
      return { ...state, isStreaming: action.payload }
    case 'SET_BASIC_INFO':
      return { ...state, basicInfo: action.payload }
    case 'SET_CAREER_PROFILE':
      return { ...state, careerProfile: action.payload }
    case 'SET_RECOMMENDATIONS':
      return { ...state, recommendations: action.payload }
    case 'SET_RESUME_DATA':
      return { ...state, resumeData: action.payload }
    case 'SET_INTERVIEW_REPORT':
      return { ...state, interviewReport: action.payload }
    case 'MERGE_CURRENT_SESSION':
      return state.currentSession
        ? { ...state, currentSession: { ...state.currentSession, ...action.payload } }
        : state
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    default:
      return state
  }
}

const STAGE_ORDER: FlowStage[] = ['basic_info', 'explore', 'resume', 'interview', 'review']

const STAGE_LABELS: Record<FlowStage, string> = {
  basic_info: '基础信息',
  explore: '职业探索',
  resume: '简历生成',
  interview: '模拟面试',
  review: '复盘总结',
}

interface ChatContextValue {
  state: ChatState
  dispatch: React.Dispatch<ChatAction>
  createSession: () => Promise<ChatSession | null>
  loadSession: (id: string) => Promise<void>
  loadSessions: () => Promise<void>
  deleteSession: (id: string) => Promise<void>
  submitBasicInfo: (sessionId: string, info: BasicInfo) => Promise<boolean>
  sendMessage: (content: string) => Promise<void>
  confirmResumeAndAdvance: () => void
  regenerateResume: () => Promise<void>
  advanceStage: () => void
  stageLabel: (stage: FlowStage) => string
  stageIndex: (stage: FlowStage) => number
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/sessions')
      const json = await res.json()
      dispatch({ type: 'SET_SESSIONS', payload: json.data || [] })
    } catch (err) {
      console.error('[ChatContext] 加载会话列表失败:', err)
    }
  }, [])

  const createSession = useCallback(async (): Promise<ChatSession | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'explore' }),
      })
      const json = await res.json()
      const session = json.data as ChatSession
      if (!res.ok || !session) {
        throw new Error(json.error?.message || '创建会话失败')
      }
      dispatch({ type: 'SET_CURRENT_SESSION', payload: session })
      dispatch({ type: 'SET_MESSAGES', payload: [] })
      dispatch({ type: 'SET_STAGE', payload: 'basic_info' })
      dispatch({ type: 'SET_BASIC_INFO', payload: null })
      dispatch({ type: 'SET_CAREER_PROFILE', payload: null })
      dispatch({ type: 'SET_RECOMMENDATIONS', payload: [] })
      dispatch({ type: 'SET_RESUME_DATA', payload: null })
      dispatch({ type: 'SET_INTERVIEW_REPORT', payload: null })
      await loadSessions()
      return session
    } catch (err) {
      console.error('[ChatContext] 创建会话失败:', err)
      return null
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [loadSessions])

  const loadSession = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const res = await fetch(`/api/sessions/${id}`)
      const json = await res.json()
      const data = json.data
      dispatch({ type: 'SET_CURRENT_SESSION', payload: data })
      dispatch({ type: 'SET_MESSAGES', payload: data.messages || [] })
      dispatch({ type: 'SET_STAGE', payload: data.stage || 'basic_info' })

      if (data.basicInfo) {
        try { dispatch({ type: 'SET_BASIC_INFO', payload: JSON.parse(data.basicInfo) }) } catch { /* ignore */ }
      }
      if (data.careerProfile) {
        try { dispatch({ type: 'SET_CAREER_PROFILE', payload: JSON.parse(data.careerProfile) }) } catch { /* ignore */ }
      }
      if (data.recommendations) {
        try { dispatch({ type: 'SET_RECOMMENDATIONS', payload: JSON.parse(data.recommendations) }) } catch { /* ignore */ }
      }
      if (data.resumeData) {
        try { dispatch({ type: 'SET_RESUME_DATA', payload: JSON.parse(data.resumeData) }) } catch { /* ignore */ }
      }
      if (data.interviewReport) {
        try { dispatch({ type: 'SET_INTERVIEW_REPORT', payload: JSON.parse(data.interviewReport) }) } catch { /* ignore */ }
      }
    } catch (err) {
      console.error('[ChatContext] 加载会话失败:', err)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const deleteSession = useCallback(async (id: string) => {
    try {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE' })
      if (state.currentSession?.id === id) {
        dispatch({ type: 'SET_CURRENT_SESSION', payload: null })
        dispatch({ type: 'SET_MESSAGES', payload: [] })
      }
      await loadSessions()
    } catch (err) {
      console.error('[ChatContext] 删除会话失败:', err)
    }
  }, [state.currentSession, loadSessions])

  const submitBasicInfo = useCallback(async (sessionId: string, info: BasicInfo): Promise<boolean> => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/basic-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      })
      if (res.ok) {
        dispatch({ type: 'SET_BASIC_INFO', payload: info })
        dispatch({ type: 'SET_STAGE', payload: 'explore' })
        dispatch({
          type: 'MERGE_CURRENT_SESSION',
          payload: {
            basicInfo: JSON.stringify(info),
            basicInfoCompleted: true,
            stage: 'explore',
          },
        })
        return true
      }
      return false
    } catch (err) {
      console.error('[ChatContext] 提交基础信息失败:', err)
      return false
    }
  }, [])

  const advanceStage = useCallback(() => {
    const currentIdx = STAGE_ORDER.indexOf(state.stage)
    if (currentIdx < STAGE_ORDER.length - 1) {
      const nextStage = STAGE_ORDER[currentIdx + 1]!
      dispatch({ type: 'SET_STAGE', payload: nextStage })
    }
  }, [state.stage])

  const sendMessage = useCallback(async (content: string) => {
      if (!state.currentSession || state.isStreaming) {
      console.warn('[ChatContext] sendMessage 被阻止:', { hasSession: !!state.currentSession, isStreaming: state.isStreaming })
      return
    }

    const userMsg: ChatMessage = {
      id: generateLocalId(),
      sessionId: state.currentSession.id,
      role: 'user',
      content,
      mode: state.stage,
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_MESSAGE', payload: userMsg })

    const assistantMsg: ChatMessage = {
      id: generateLocalId(),
      sessionId: state.currentSession.id,
      role: 'assistant',
      content: '',
      mode: state.stage,
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_MESSAGE', payload: assistantMsg })
    dispatch({ type: 'SET_STREAMING', payload: true })

    try {
      const formBody = new URLSearchParams({
        sessionId: state.currentSession.id,
        content,
        mode: state.stage,
      })

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: formBody.toString(),
      })

      if (!res.ok) throw new Error('请求失败')

      const reader = res.body?.getReader()
      if (!reader) throw new Error('无法读取响应流')

      const decoder = new TextDecoder()
      let buffer = ''
      let sawAssistantContent = false
      let receivedDone = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const events = buffer.split('\n\n')
        buffer = events.pop() || ''

        for (const rawEvent of events) {
          const lines = rawEvent.split('\n')
          const eventName = lines.find((line) => line.startsWith('event: '))?.slice(7).trim()
          const dataLine = lines.find((line) => line.startsWith('data: '))
          if (!eventName || !dataLine) continue

          try {
            const eventData = JSON.parse(dataLine.slice(6))

            if (eventName === 'message' && eventData.content) {
              sawAssistantContent = true
              dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: eventData.content })
            }

            if (eventName === 'structured') {
              if (eventData.type === 'career_profile') {
                const structured = eventData.data as CareerProfileStructured
                dispatch({ type: 'SET_CAREER_PROFILE', payload: structured.profile })
                dispatch({ type: 'SET_RECOMMENDATIONS', payload: structured.recommendations })
                dispatch({ type: 'SET_STAGE', payload: 'resume' })
                dispatch({
                  type: 'MERGE_CURRENT_SESSION',
                  payload: {
                    careerProfile: JSON.stringify(structured.profile),
                    recommendations: JSON.stringify(structured.recommendations),
                    stage: 'resume',
                  },
                })
                // 用已有 basicInfo 创建骨架简历，立即渲染预览区
                if (state.basicInfo) {
                  const now = new Date().toISOString()
                  const skeleton: ResumeData = {
                    id: generateLocalId(),
                    sessionId: state.currentSession?.id || '',
                    basicInfo: {
                      name: state.basicInfo.name,
                      phone: state.basicInfo.phone,
                      email: state.basicInfo.email || '',
                      location: state.basicInfo.targetCity || '',
                      title: state.basicInfo.jobTarget,
                      avatar: state.basicInfo.avatar || '',
                    },
                    education: [{
                      school: state.basicInfo.school,
                      degree: state.basicInfo.grade,
                      major: state.basicInfo.major,
                      startDate: '',
                      endDate: '',
                    }],
                    workExperience: [],
                    projects: [],
                    skills: [],
                    selfEvaluation: structured.profile.summary || '',
                    createdAt: now,
                    updatedAt: now,
                  }
                  dispatch({ type: 'SET_RESUME_DATA', payload: skeleton })
                }
              }

              if (eventData.type === 'resume') {
                const resume = eventData.data as ResumeData
                dispatch({ type: 'SET_RESUME_DATA', payload: resume })
                dispatch({
                  type: 'MERGE_CURRENT_SESSION',
                  payload: {
                    resumeData: JSON.stringify(resume),
                  },
                })
              }

              if (eventData.type === 'interview_report') {
                const report = eventData.data as InterviewReport
                dispatch({ type: 'SET_INTERVIEW_REPORT', payload: report })
                dispatch({ type: 'SET_STAGE', payload: 'review' })
                dispatch({
                  type: 'MERGE_CURRENT_SESSION',
                  payload: {
                    interviewReport: JSON.stringify(report),
                    stage: 'review',
                  },
                })
              }
            }
            if (eventName === 'done') {
              receivedDone = true
              break
            }
          } catch {
            // ignore
          }
        }

        if (receivedDone) break
      }

      if (!sawAssistantContent) {
        dispatch({ type: 'REMOVE_LAST_ASSISTANT_MESSAGE' })
      }
    } catch (err) {
      console.error('[ChatContext] 发送消息失败:', err)
      dispatch({ type: 'REMOVE_LAST_ASSISTANT_MESSAGE' })
    } finally {
      dispatch({ type: 'SET_STREAMING', payload: false })
    }
  }, [state.currentSession, state.stage, state.isStreaming])

  const stageLabel = useCallback((stage: FlowStage) => STAGE_LABELS[stage], [])
  const stageIndex = useCallback((stage: FlowStage) => STAGE_ORDER.indexOf(stage), [])

  const confirmResumeAndAdvance = useCallback(() => {
    dispatch({ type: 'SET_STAGE', payload: 'interview' })
    dispatch({ type: 'MERGE_CURRENT_SESSION', payload: { stage: 'interview' } })
  }, [])

  const regenerateResume = useCallback(async () => {
    if (!state.currentSession || state.isStreaming) return
    dispatch({ type: 'SET_RESUME_DATA', payload: null })
    dispatch({ type: 'MERGE_CURRENT_SESSION', payload: { resumeData: undefined } })
    const message = '请根据我的职业画像和基础信息重新生成一份简历，之前的内容可以忽略，重新帮我整理。'
    await sendMessage(message)
  }, [state.currentSession, state.isStreaming, sendMessage])

  return (
    <ChatContext.Provider
      value={{
        state,
        dispatch,
        createSession,
        loadSession,
        loadSessions,
        deleteSession,
        submitBasicInfo,
        sendMessage,
        confirmResumeAndAdvance,
        regenerateResume,
        advanceStage,
        stageLabel,
        stageIndex,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
