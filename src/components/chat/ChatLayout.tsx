'use client'

import { useEffect, useCallback, useState } from 'react'
import { Menu } from 'lucide-react'
import { useChat } from '@/contexts/ChatContext'
import Sidebar from './Sidebar'
import MessageList from './MessageList'
import InputBox from './InputBox'
import BasicInfoForm from './BasicInfoForm'
import ModeBadge from './ModeBadge'
import type { BasicInfo, ChatMode } from '@/types/chat'
import { toast } from 'sonner'

export default function ChatLayout() {
  const { state, dispatch, createSession, submitBasicInfo, sendMessage, switchMode } = useChat()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized && !state.currentSession) {
      createSession('explore').then(() => setInitialized(true))
    }
  }, [initialized, state.currentSession, createSession])

  const handleBasicInfoSubmit = useCallback(async (info: BasicInfo) => {
    if (!state.currentSession) return
    const success = await submitBasicInfo(state.currentSession.id, info)
    if (success) {
      toast.success('信息已保存，开始对话吧！')
      // 发送初始消息触发 AI 开场
      await sendMessage(`你好，我是${info.name}，${info.education}学历，${info.major}专业，${info.graduationYear}年毕业，${info.workExperience}工作经验。${info.interests ? `我对${info.interests}比较感兴趣。` : ''}请帮我分析一下我的职业方向。`)
    } else {
      toast.error('保存失败，请重试')
    }
  }, [state.currentSession, submitBasicInfo, sendMessage])

  const handleModeSwitch = useCallback(async (mode: ChatMode) => {
    switchMode(mode)
    await createSession(mode)
  }, [switchMode, createSession])

  const showBasicInfoForm = state.currentSession && !state.currentSession.basicInfoCompleted && state.messages.length === 0

  return (
    <div className="h-screen flex bg-zinc-950">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-200"
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {(['explore', 'resume', 'interview'] as ChatMode[]).map((mode) => (
              <ModeBadge
                key={mode}
                mode={mode}
                active={state.mode === mode}
                onClick={() => handleModeSwitch(mode)}
              />
            ))}
          </div>
        </header>

        {/* Content area */}
        {showBasicInfoForm ? (
          <BasicInfoForm onSubmit={handleBasicInfoSubmit} isLoading={state.isLoading} />
        ) : (
          <>
            <MessageList messages={state.messages} isStreaming={state.isStreaming} />
            <InputBox
              onSend={sendMessage}
              disabled={state.isStreaming || state.isLoading}
              placeholder={
                state.mode === 'explore'
                  ? '和小觉聊聊你的职业困惑...'
                  : state.mode === 'resume'
                  ? '告诉小觉你的经历，帮你生成简历...'
                  : '回答面试官的问题...'
              }
            />
          </>
        )}
      </div>
    </div>
  )
}
