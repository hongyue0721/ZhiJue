import Anthropic from '@anthropic-ai/sdk'

/** Anthropic 客户端单例 */
let client: Anthropic | null = null

export function getAnthropicClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY 环境变量未设置')
    }
    client = new Anthropic({ apiKey })
  }
  return client
}

/** 默认模型 */
export const DEFAULT_MODEL = 'claude-sonnet-4-20250514'

/** 调用 Anthropic 流式接口 */
export async function streamChat(params: {
  systemPrompt: string
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  maxTokens?: number
}) {
  const anthropic = getAnthropicClient()

  const stream = anthropic.messages.stream({
    model: DEFAULT_MODEL,
    max_tokens: params.maxTokens ?? 4096,
    system: params.systemPrompt,
    messages: params.messages,
  })

  return stream
}

/** 调用 Anthropic 非流式接口（用于结构化数据提取） */
export async function chatCompletion(params: {
  systemPrompt: string
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  maxTokens?: number
}): Promise<string> {
  const anthropic = getAnthropicClient()

  const response = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: params.maxTokens ?? 4096,
    system: params.systemPrompt,
    messages: params.messages,
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  return textBlock?.text ?? ''
}
