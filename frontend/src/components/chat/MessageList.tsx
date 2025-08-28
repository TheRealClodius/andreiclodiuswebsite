import React, { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { 
  MessagesContainer, 
  EmptyState, 
  EmptyStateTitle, 
  EmptyStateSubtitle,
  StatusIndicator 
} from '../../styles/chat'
import { MessageBubble } from './MessageBubble'
import { Message } from '../../hooks/useChatMessages'
import { ConnectionStatus } from '../../hooks/useWebSocket'
import { scrollToBottom } from '../../utils/chatUtils'

interface MessageListProps {
  messages: Message[]
  isAiTyping: boolean
  connectionStatus: ConnectionStatus
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isAiTyping, 
  connectionStatus 
}) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages are added
  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      scrollToBottom(messagesContainerRef.current)
    }
  }, [messages])

  return (
    <MessagesContainer ref={messagesContainerRef}>
      {messages.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>Chat with Andrei</EmptyStateTitle>
          <EmptyStateSubtitle>
            Start a conversation with Andrei's AI clone. Ask questions, get advice, or just have a friendly chat.
          </EmptyStateSubtitle>
          {connectionStatus !== 'connected' && (
            <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.7 }}>
              Status: {connectionStatus === 'connecting' ? 'Connecting...' : 
                      connectionStatus === 'error' ? 'Connection error' : 'Disconnected'}
            </div>
          )}
        </EmptyState>
      ) : (
        <>
          <AnimatePresence>
            {messages.filter(msg => msg && msg.id).map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>
          <StatusIndicator $isTyping={isAiTyping}>
            Andrei is typing...
          </StatusIndicator>
        </>
      )}
      <div ref={messagesEndRef} />
    </MessagesContainer>
  )
}
