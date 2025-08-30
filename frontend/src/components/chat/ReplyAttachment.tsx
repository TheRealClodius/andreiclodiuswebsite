import React from 'react'
import styled from 'styled-components'
import { Message } from '../../hooks/useChatMessages'
import { GroupMessage } from '../../hooks/useGroupChat'
import { getUserColor } from '../../utils/userColors'

interface ReplyAttachmentProps {
  replyToMessage: Message | GroupMessage
  isHumanMessage?: boolean // Whether this reply is inside a human/user message (blue)
}

const ReplyContainer = styled.div<{ $isHumanMessage: boolean }>`
  background: ${props => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (props.$isHumanMessage) {
      // Human message (blue bubble) - darker background
      return isDark 
        ? 'rgba(0, 0, 0, 0.15)' // Darker background in dark mode
        : 'rgba(255, 255, 255, 0.25)' // Light background in light mode
    } else {
      // AI/other message (gray bubble) - lighter background
      return isDark 
        ? 'rgba(255, 255, 255, 0.08)' // Light background in dark mode
        : 'rgba(0, 0, 0, 0.05)' // Dark background in light mode
    }
  }};
  border-left: 3px solid ${props => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (props.$isHumanMessage) {
      // Human message - white/light accent
      return isDark 
        ? 'rgba(255, 255, 255, 0.4)' 
        : 'rgba(255, 255, 255, 0.7)'
    } else {
      // AI/other message - blue accent
      return isDark 
        ? 'rgba(147, 197, 253, 0.6)' 
        : 'rgba(59, 130, 246, 0.6)'
    }
  }};
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
`

const OriginalSender = styled.div<{ $isHumanMessage: boolean; $userColor?: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${props => {
    if (props.$userColor) {
      // Use specific user color
      return props.$userColor;
    }
    
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (props.$isHumanMessage) {
      // Human message - white/light text
      return isDark 
        ? 'rgba(255, 255, 255, 0.9)' 
        : 'rgba(255, 255, 255, 0.95)'
    } else {
      // AI/other message - blue text
      return isDark 
        ? 'rgba(147, 197, 253, 0.9)' 
        : 'rgba(59, 130, 246, 0.9)'
    }
  }};
  margin-bottom: 4px;
`

const OriginalMessage = styled.div<{ $isHumanMessage: boolean }>`
  font-size: 13px;
  line-height: 1.4;
  color: ${props => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (props.$isHumanMessage) {
      // Human message - white/light text with good contrast
      return isDark 
        ? 'rgba(255, 255, 255, 0.75)' 
        : 'rgba(255, 255, 255, 0.85)'
    } else {
      // AI/other message - standard text colors
      return isDark 
        ? 'rgba(255, 255, 255, 0.8)' 
        : 'rgba(0, 0, 0, 0.7)'
    }
  }};
  word-wrap: break-word;
  overflow-wrap: break-word;
  
  /* Limit to 3 lines max */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const ReplyAttachment: React.FC<ReplyAttachmentProps> = ({ replyToMessage, isHumanMessage = false }) => {
  // Get sender name for display
  const getSenderName = () => {
    if (replyToMessage.type === 'user' && 'sender' in replyToMessage) {
      return replyToMessage.sender || 'Unknown User'
    }
    if (replyToMessage.type === 'system') {
      return 'System'
    }
    return replyToMessage.type !== 'human' ? 'Andrei' : 'You'
  }

  const senderName = getSenderName()
  const messageContent = replyToMessage.content || ''
  
  // Get user color for the original sender (if it's a group message)
  const getOriginalSenderColor = () => {
    // Only apply colors when NOT inside a blue bubble (accessibility)
    if (!isHumanMessage && replyToMessage.type === 'user' && 'sender' in replyToMessage && replyToMessage.sender) {
      return getUserColor(replyToMessage.sender)
    }
    return undefined // Use default colors for non-group messages or inside blue bubbles
  }

  const originalSenderColor = getOriginalSenderColor()

  return (
    <ReplyContainer $isHumanMessage={isHumanMessage}>
      <OriginalSender 
        $isHumanMessage={isHumanMessage} 
        $userColor={originalSenderColor}
      >
        {senderName}
      </OriginalSender>
      <OriginalMessage $isHumanMessage={isHumanMessage}>{messageContent}</OriginalMessage>
    </ReplyContainer>
  )
}
