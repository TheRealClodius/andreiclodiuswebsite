import React, { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import { IoPeople } from 'react-icons/io5'
import { 
  MessagesContainer, 
  EmptyState, 
  EmptyStateTitle, 
  EmptyStateSubtitle,
  StatusIndicator 
} from '../../styles/chat'
import { MessageBubble } from './MessageBubble'
import { Message } from '../../hooks/useChatMessages'
import { GroupMessage, GroupUser } from '../../hooks/useGroupChat'
import { ConnectionStatus } from '../../hooks/useWebSocket'
import { scrollToBottom } from '../../utils/chatUtils'

interface MessageListProps {
  messages: Message[] | GroupMessage[]
  isAiTyping?: boolean // Optional for group chat
  connectionStatus: ConnectionStatus
  userCount?: number // For group chat
  users?: GroupUser[] // For group chat
  currentUser?: { id: string; nickname: string } | null // For group chat
}

const UserCountBadge = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: ${props => props.$isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.1)'};
  color: ${props => props.$isDark ? '#a5b4fc' : '#4338ca'};
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  margin: 8px 16px;
  border: 1px solid ${props => props.$isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(79, 70, 229, 0.2)'};
`

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isAiTyping = false, 
  connectionStatus,
  userCount,
  users,
  currentUser
}) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Determine if this is group chat based on props
  const isGroupChat = userCount !== undefined || users !== undefined

  // Auto-scroll to bottom when messages are added
  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      scrollToBottom(messagesContainerRef.current)
    }
  }, [messages])

  return (
    <MessagesContainer ref={messagesContainerRef}>
      {/* Show user count badge for group chat */}
      {isGroupChat && userCount !== undefined && userCount > 0 && (
        <UserCountBadge $isDark={window.matchMedia('(prefers-color-scheme: dark)').matches}>
          <IoPeople />
          {userCount} user{userCount !== 1 ? 's' : ''} online
        </UserCountBadge>
      )}

      {messages.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>
            {isGroupChat ? 'Group Chat' : 'Chat with Andrei'}
          </EmptyStateTitle>
          <EmptyStateSubtitle>
            {isGroupChat 
              ? 'Welcome to the group chat! Start chatting with other users.'
              : 'Start a conversation with Andrei\'s AI clone. Ask questions, get advice, or just have a friendly chat.'
            }
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
              <MessageBubble 
                key={message.id} 
                message={message} 
                isGroupChat={isGroupChat}
                currentUser={currentUser}
              />
            ))}
          </AnimatePresence>
          {/* Only show AI typing indicator for regular chat */}
          {!isGroupChat && (
            <StatusIndicator $isTyping={isAiTyping}>
              Andrei is typing...
            </StatusIndicator>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </MessagesContainer>
  )
}
