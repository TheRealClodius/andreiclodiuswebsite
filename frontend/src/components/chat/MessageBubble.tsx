import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MessageBubble as StyledMessageBubble, MessageHeader /*, MessageTime */ } from '../../styles/chat'
import { AttachmentPreview, AIImageDisplay } from './index'
import { Message } from '../../hooks/useChatMessages'
import { GroupMessage } from '../../hooks/useGroupChat'
// import { formatTime } from '../../utils/chatUtils'
import { messageEntranceVariants } from '../../styles/chat/animations'

interface MessageBubbleProps {
  message: Message | GroupMessage
  isGroupChat?: boolean
  currentUser?: { id: string; nickname: string } | null
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isGroupChat = false, currentUser = null }) => {
  // Type guards to determine message type
  const isGroupMessage = (msg: Message | GroupMessage): msg is GroupMessage => {
    return 'sender' in msg || msg.type === 'system'
  }
  
  // Determine if this is a "human" message (user input from the current user)
  const isHumanMessage = isGroupChat 
    ? isGroupMessage(message) && message.type === 'user' && message.sender === currentUser?.nickname
    : message.type === 'human'
  
  // Determine if this is a system message
  const isSystemMessage = isGroupChat && isGroupMessage(message) && message.type === 'system'
  
  // Get sender name for header
  const getSenderName = () => {
    if (isGroupChat && isGroupMessage(message)) {
      if (message.type === 'system') return null // No header for system messages
      return message.sender || 'Unknown User'
    }
    return message.type !== 'human' ? 'Andrei' : null
  }

  const senderName = getSenderName()

  return (
    <StyledMessageBubble 
      initial="hidden"
      animate="visible"
      variants={messageEntranceVariants}
      $isHuman={isHumanMessage}
      style={{
        // System messages have different styling
        ...(isSystemMessage && {
          maxWidth: '90%',
          alignSelf: 'center',
          background: 'rgba(107, 114, 128, 0.1)',
          color: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#9ca3af' : '#6b7280',
          fontSize: '13px',
          fontStyle: 'italic',
          borderRadius: '16px',
          padding: '6px 12px',
          textAlign: 'center' as const
        })
      }}
    >
      {senderName && (
        <MessageHeader $isHuman={isHumanMessage}>
          {senderName}
        </MessageHeader>
      )}
      
      {/* Render message content */}
      {isSystemMessage ? (
        // System messages are plain text
        message.content || ''
      ) : !isHumanMessage && !isGroupChat ? (
        // AI messages in regular chat use markdown
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content || ''}
        </ReactMarkdown>
      ) : (
        // User messages and group chat messages are plain text
        message.content || ''
      )}
      
      {/* Handle attachments for regular chat messages */}
      {!isGroupChat && 'attachments' in message && message.attachments && message.attachments.length > 0 && (
        message.type === 'assistant' && 
        message.attachments.some(att => att.name === 'generated-image.png' || att.name.startsWith('generated-image')) ? (
          <AIImageDisplay attachments={message.attachments} />
        ) : (
          <AttachmentPreview attachments={message.attachments} />
        )
      )}
      
      {/* <MessageTime>
        {formatTime(message.timestamp)}
      </MessageTime> */}
    </StyledMessageBubble>
  )
}
