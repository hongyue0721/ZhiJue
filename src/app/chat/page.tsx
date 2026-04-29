import { ChatProvider } from '@/contexts/ChatContext'
import ChatLayout from '@/components/chat/ChatLayout'

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session || null

  return (
    <ChatProvider>
      <ChatLayout initialSessionId={sessionId} />
    </ChatProvider>
  )
}
