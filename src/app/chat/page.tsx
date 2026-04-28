import { ChatProvider } from '@/contexts/ChatContext'
import ChatLayout from '@/components/chat/ChatLayout'

export default function ChatPage() {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  )
}
