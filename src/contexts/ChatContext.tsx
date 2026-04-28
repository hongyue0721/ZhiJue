'use client'

import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import type { ChatMessage, ChatSession, ChatMode, BasicInfo } from '@/types/chat'
import type { CareerProfile, JobRecommendation } from '@/types/profile'
import type { ResumeData } from '@/types/resume'
import type { InterviewReport, RadarData } from '@/types/interview'

interface ChatState {
  sessions: ChatSession[]
  currentSession: ChatSession | null
  messages: ChatMessage[]
  mode: ChatMode
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
  | { type: 'SET_MODE'; payload: ChatMode }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'SET_BASIC_INFO'; payload: BasicInfo }
  | { type: 'SET_CAREER_PROFILE'; payload: CareerProfile }
  | { type: 'SET_RECOMMENDATIONS'; payload: JobRecommendation[] }
  | { type: 'SET_RESUME_DATA'; payload: ResumeData }
  | { type: 'SET_INTERVIEW_REPORT'; payload: InterviewReport }
  | { type: 'TOGGLE_SIDEBAR' }

const initialState: ChatState = {
  sessions: [],
  currentSession: null,
  messages: [],
  mode: 'explore',
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
    case 'SET_MODE':
      return { ...state, mode: action.payload }
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
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    default:
      return state
  }
}

interface ChatContextValue {
  state: ChatState
  dispatch: React.Dispatch<ChatAction>
  createSession: (mode?: ChatMode) => Promise<ChatSession | null>
  loadSession: (id: string) => Promise<void>
  loadSessions: () => Promise<void>
  deleteSession: (id: string) => Promise<void>
  submitBasicInfo: (sessionId: string, info: BasicInfo) => Promise<boolean>
  sendMessage: (content: string) => Promise<void>
  switchMode: (mode: ChatMode) => void
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

  const createSession = useCallback(async (mode: ChatMode = 'explore'): Promise<ChatSession | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      })
      const json = await res.json()
      const session = json.data as ChatSession
      dispatch({ type: 'SET_CURRENT_SESSION', payload: session })
      dispatch({ type: 'SET_MESSAGES', payload: [] })
      dispatch({ type: 'SET_MODE', payload: mode })
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
      dispatch({ type: 'SET_MODE', payload: data.mode })

      if (data.basicInfo) {
        try {
          dispatch({ type: 'SET_BASIC_INFO', payload: JSON.parse(data.basicInfo) })
        } catch {
          // ignore
        }
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
        return true
      }
      return false
    } catch (err) {
      console.error('[ChatContext] 提交基础信息失败:', err)
      return false
    }
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!state.currentSession || state.isStreaming) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sessionId: state.currentSession.id,
      role: 'user',
      content,
      mode: state.mode,
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_MESSAGE', payload: userMsg })

    // 添加空的 assistant 消息用于流式填充
    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sessionId: state.currentSession.id,
      role: 'assistant',
      content: '',
      mode: state.mode,
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_MESSAGE', payload: assistantMsg })
    dispatch({ type: 'SET_STREAMING', payload: true })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: state.currentSession.id,
          content,
          mode: state.mode,
        }),
      })

      if (!res.ok) {
        throw new Error('请求失败')
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('无法读取响应流')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6)
            try {
              const eventData = JSON.parse(dataStr)
              if (eventData.content) {
                dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: eventData.content })
              }
            } catch {
              // ignore parse errors for non-JSON lines
            }
          }
          if (line.startsWith('event: structured')) {
            // Next line should be data
            // Handle in the next iteration
          }
          if (line.startsWith('event: done')) {
            // Stream finished
          }
        }
      }
    } catch (err) {
      console.error('[ChatContext] 发送消息失败:', err)
    } finally {
      dispatch({ type: 'SET_STREAMING', payload: false })
    }
  }, [state.currentSession, state.mode, state.isStreaming])

  const switchMode = useCallback((mode: ChatMode) => {
    dispatch({ type: 'SET_MODE', payload: mode })
  }, [])

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
        switchMode,
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
