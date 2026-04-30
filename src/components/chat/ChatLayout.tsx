'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { ChevronRight, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useChat } from '@/contexts/ChatContext'
import MessageList from './MessageList'
import InputBox from './InputBox'
import BasicInfoForm from './BasicInfoForm'
import ResumePreview from './ResumePreview'
import ResumeExportButtons from './ResumeExportButtons'
import InterviewReport from './InterviewReport'
import RadarChart from './RadarChart'
import type { BasicInfo, FlowStage } from '@/types/chat'
import type { ResumeData } from '@/types/resume'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const STAGES: { key: FlowStage; label: string }[] = [
  { key: 'basic_info', label: '基础信息' },
  { key: 'explore', label: '职业探索' },
  { key: 'resume', label: '简历生成' },
  { key: 'interview', label: '模拟面试' },
  { key: 'review', label: '复盘总结' },
]

function A4Frame({ children }: { children: React.ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [frameWidth, setFrameWidth] = useState(0)

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setFrameWidth(entry.contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const A4_W = 210 / 25.4 * 96
  const scale = frameWidth > 0 ? Math.min(frameWidth / A4_W, 1) : 1

  return (
    <div
      ref={frameRef}
      className="flex-1 w-full overflow-y-auto overflow-x-hidden flex justify-center"
    >
      <div
        id="resume-print-area"
        style={{
          width: '210mm',
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default function ChatLayout({ initialSessionId }: { initialSessionId?: string | null } = {}) {
  const router = useRouter()
  const {
    state,
    createSession,
    loadSession,
    submitBasicInfo,
    sendMessage,
    confirmResumeAndAdvance,
    regenerateResume,
  } = useChat()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) return
    if (initialSessionId) {
      loadSession(initialSessionId).then(() => setInitialized(true))
    } else if (!state.currentSession) {
      createSession().then(() => setInitialized(true))
    }
  }, [initialized, initialSessionId, state.currentSession, createSession, loadSession])

  useEffect(() => {
    if (!state.currentSession && state.sessions.length > 0) {
      void loadSession(state.sessions[0]!.id)
    }
  }, [state.currentSession, state.sessions, loadSession])

  const handleBasicInfoSubmit = useCallback(async (info: BasicInfo) => {
    if (!state.currentSession) return
    const success = await submitBasicInfo(state.currentSession.id, info)
    if (success) {
      toast.success('信息已保存，开始职业探索！')
      const intro = `你好，我是${info.name}，来自${info.school}${info.major}专业，${info.grade}。我的求职目标是${info.jobTarget}，工作经验${info.workExperience}。${info.interests ? `我对${info.interests}比较感兴趣。` : ''}${info.targetCity ? `目标城市是${info.targetCity}。` : ''}请帮我分析一下我的职业方向。`
      window.setTimeout(() => {
        void sendMessage(intro)
      }, 0)
    } else {
      toast.error('保存失败，请重试')
    }
  }, [state.currentSession, submitBasicInfo, sendMessage])

  const handleConfirmResume = useCallback(() => {
    confirmResumeAndAdvance()
    toast.success('简历已确认，进入模拟面试！')
  }, [confirmResumeAndAdvance])

  const handleRegenerateResume = useCallback(() => {
    void regenerateResume()
    toast.info('正在重新生成简历...')
  }, [regenerateResume])

  const currentStageIndex = STAGES.findIndex(s => s.key === state.stage)

  const getPlaceholder = () => {
    switch (state.stage) {
      case 'explore': return '和小觉聊聊你的职业困惑...'
      case 'resume': return '告诉小觉你的经历，帮你生成简历...'
      case 'interview': return '回答面试官的问题...'
      case 'review': return '还有什么想问的...'
      default: return '输入你的消息...'
    }
  }

  const isResumeStage = state.stage === 'resume'
  const isReviewStage = state.stage === 'review' && state.interviewReport != null

  const resumeWithAvatar: ResumeData | null = state.resumeData ? {
    ...state.resumeData,
    basicInfo: {
      ...state.resumeData.basicInfo,
      avatar: state.basicInfo?.avatar || state.resumeData.basicInfo.avatar,
    },
  } : null

  return (
    <div className="h-screen flex flex-col bg-notion-bg">
      <header className="px-4 py-2.5 border-b border-notion-border">
        <div className="flex items-center gap-2.5 mb-2.5">
          <button
            className="p-1.5 text-notion-text-secondary hover:text-notion-text hover:bg-notion-hover rounded-notion transition-colors duration-100"
            onClick={() => router.push('/home')}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-notion-sm font-medium text-notion-text">求职旅程</h2>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          {STAGES.map((stage, index) => (
            <div key={stage.key} className="flex items-center">
              <div
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-notion text-notion-xs font-medium whitespace-nowrap transition-all duration-100',
                  index < currentStageIndex
                    ? 'text-notion-accent bg-notion-accent/10'
                    : index === currentStageIndex
                    ? 'text-notion-text bg-notion-hover'
                    : 'text-notion-text-tertiary'
                )}
              >
                <span className={cn(
                  'w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold',
                  index < currentStageIndex
                    ? 'bg-notion-accent text-white'
                    : index === currentStageIndex
                    ? 'bg-notion-text text-white'
                    : 'bg-notion-hover text-notion-text-tertiary'
                )}>
                  {index < currentStageIndex ? '\u2713' : index + 1}
                </span>
                {stage.label}
              </div>
              {index < STAGES.length - 1 && (
                <ChevronRight className="w-3 h-3 text-notion-text-tertiary mx-0.5 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </header>

      {state.stage === 'basic_info' ? (
        <BasicInfoForm onSubmit={handleBasicInfoSubmit} isLoading={state.isLoading} />
      ) : isResumeStage ? (
        <div className="flex-1 flex min-h-0">
          <div className="flex-[6] flex flex-col min-h-0 border-r border-notion-border">
            <MessageList messages={state.messages} isStreaming={state.isStreaming} />
            <InputBox
              onSend={sendMessage}
              disabled={state.isStreaming || state.isLoading || !state.currentSession}
              placeholder={getPlaceholder()}
            />
          </div>

          <div className="flex-[4] flex flex-col min-h-0" style={{ background: '#F5F0E8' }}>
            {resumeWithAvatar ? (
              <>
                <A4Frame>
                  <ResumePreview data={resumeWithAvatar} />
                </A4Frame>

                <div className="flex items-center justify-center gap-2 py-2.5 px-3 flex-wrap flex-shrink-0 border-t border-notion-border">
                  <button
                    onClick={handleRegenerateResume}
                    disabled={state.isStreaming}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-notion text-notion-text-secondary text-notion-xs font-medium hover:bg-notion-hover hover:text-notion-text transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    重新生成
                  </button>
                  <ResumeExportButtons data={resumeWithAvatar} />
                  <button
                    onClick={handleConfirmResume}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-notion bg-notion-text text-white text-notion-xs font-medium hover:bg-notion-text/90 transition-all duration-100"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    确认简历
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-notion-text-tertiary text-notion-sm text-center px-4">
                <div>
                  <p className="text-notion-lg mb-2">📄</p>
                  <p>与小觉对话收集信息后，简历将在这里实时预览</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : isReviewStage ? (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="rounded-notion-md border border-notion-border bg-notion-surface p-5 text-center">
              <p className="text-notion-xs uppercase tracking-[0.2em] text-notion-text-tertiary mb-1 font-medium">整体评分</p>
              <p className="text-4xl font-bold text-notion-accent">{state.interviewReport!.overallScore}</p>
            </div>

            {state.interviewReport!.radar && (
              <div className="rounded-notion-md border border-notion-border bg-notion-surface p-5">
                <p className="text-notion-xs uppercase tracking-[0.2em] text-notion-text-tertiary mb-3 font-medium">六维能力分析</p>
                <RadarChart data={state.interviewReport!.radar} />
              </div>
            )}

            {state.interviewReport!.questionFeedbacks.length > 0 && (
              <div className="rounded-notion-md border border-notion-border bg-notion-surface p-5">
                <p className="text-notion-xs uppercase tracking-[0.2em] text-notion-text-tertiary mb-3 font-medium">逐题点评</p>
                <div className="space-y-3">
                  {state.interviewReport!.questionFeedbacks.map((qf, idx) => (
                    <div key={qf.questionId} className="border-b border-notion-border pb-3 last:border-0 last:pb-0">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-notion-accent/15 text-notion-accent flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-notion-sm text-notion-text font-medium">{qf.question}</p>
                          <p className="text-notion-xs text-notion-text-tertiary mt-1">你的回答：{qf.answer}</p>
                          <p className="text-notion-xs text-notion-accent mt-1">评分：{qf.score}/10</p>
                          <p className="text-notion-xs text-notion-text-secondary mt-1">{qf.feedback}</p>
                          {qf.betterAnswer && (
                            <p className="text-notion-xs text-notion-blue mt-1">参考答案：{qf.betterAnswer}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <InterviewReport report={state.interviewReport!} />

            <div className="border-t border-notion-border pt-3">
              <MessageList messages={state.messages} isStreaming={state.isStreaming} />
            </div>

            <InputBox
              onSend={sendMessage}
              disabled={state.isStreaming || state.isLoading || !state.currentSession}
              placeholder={getPlaceholder()}
            />
          </div>
        </div>
      ) : (
        <>
          <MessageList messages={state.messages} isStreaming={state.isStreaming} />
          <InputBox
            onSend={sendMessage}
            disabled={state.isStreaming || state.isLoading || !state.currentSession}
            placeholder={getPlaceholder()}
          />
        </>
      )}
    </div>
  )
}
