import type { BasicInfo } from '@/types/chat'
import type { CareerProfile } from '@/types/profile'
import type { ResumeData } from '@/types/resume'
import { getExploreSystemPrompt } from './explore'
import { getResumeSystemPrompt } from './resume'
import { getInterviewSystemPrompt } from './interview'

/** 根据阶段获取系统提示词 */
export function getSystemPrompt(
  mode: string,
  context?: {
    basicInfo?: BasicInfo
    profile?: CareerProfile
    resume?: ResumeData
  }
): string {
  switch (mode) {
    case 'explore':
      return getExploreSystemPrompt(context?.basicInfo)
    case 'resume':
      return getResumeSystemPrompt(context?.basicInfo, context?.profile)
    case 'interview':
      return getInterviewSystemPrompt(context?.resume)
    default:
      return getExploreSystemPrompt(context?.basicInfo)
  }
}
