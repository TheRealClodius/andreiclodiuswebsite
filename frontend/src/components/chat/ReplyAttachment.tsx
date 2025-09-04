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
  background: ${props => props.$isHumanMessage 
    ? props.theme.palette.chat.reply.userBackground
    : props.theme.palette.chat.reply.assistantBackground
  };
  border-left: 3px solid ${props => props.$isHumanMessage 
    ? props.theme.palette.chat.reply.userBorder
    : props.theme.palette.chat.reply.assistantBorder
  };
  border-radius: ${({ theme }) => theme.semanticRadii.chat.bubble.tail};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`}; /* 8px 12px */
  margin-bottom: ${({ theme }) => theme.spacing[2]}; /* 8px */
`

const OriginalSender = styled.div<{ $isHumanMessage: boolean; $userColor?: string }>`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${props => {
    if (props.$userColor) {
      // Use specific user color
      return props.$userColor;
    }
    
    return props.$isHumanMessage 
      ? props.theme.palette.chat.reply.userSender
      : props.theme.palette.chat.reply.assistantSender;
  }};
  margin-bottom: ${({ theme }) => theme.spacing[1]}; /* 4px */
`

const OriginalMessage = styled.div<{ $isHumanMessage: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  line-height: ${({ theme }) => theme.lineHeight.snug};
  color: ${props => props.$isHumanMessage 
    ? props.theme.palette.chat.reply.userText
    : props.theme.palette.chat.reply.assistantText
  };
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
