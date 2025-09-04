import React from 'react'
import { HiX, HiReply } from 'react-icons/hi'
import styled from 'styled-components'
import { Message } from '../../hooks/useChatMessages'
import { Button } from '../../design-system'
import { GroupMessage } from '../../hooks/useGroupChat'

interface ReplyChipProps {
  message: Message | GroupMessage
  onRemove: () => void
}

const ReplyChipContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  padding: 0px 12px;
`

const ReplyChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(59, 130, 246, 0.15)' // Blue tint in dark mode
      : 'rgba(59, 130, 246, 0.08)' // Blue tint in light mode
  };
  border: 1px solid ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(59, 130, 246, 0.25)' // Blue border in dark mode
      : 'rgba(59, 130, 246, 0.2)' // Blue border in light mode
  };
  border-radius: 20px;
  padding: 4px 6px 4px 12px;
  font-size: 12px;
  font-weight: 550;
  color: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(147, 197, 253, 0.9)' // Light blue text in dark mode
      : 'rgba(37, 99, 235, 0.9)' // Dark blue text in light mode
  };
  max-width: 300px;
  transition: all 0.2s ease;
`

const ReplyIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(59, 130, 246, 0.2)' // Blue background in dark mode
      : 'rgba(59, 130, 246, 0.1)' // Blue background in light mode
  };
  flex-shrink: 0;
  color: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(147, 197, 253, 0.8)' // Light blue icon in dark mode
      : 'rgba(37, 99, 235, 0.7)' // Dark blue icon in light mode
  };
`

const ReplyContent = styled.div`
  flex: 1;
  min-width: 0;
  
  .reply-to {
    font-size: 10px;
    font-weight: 600;
    opacity: 0.8;
    margin-bottom: 2px;
    color: ${() => 
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(147, 197, 253, 0.7)' // Light blue text in dark mode
        : 'rgba(37, 99, 235, 0.7)' // Dark blue text in light mode
    };
  }
  
  .reply-message {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }
`

// RemoveReplyButton replaced with Button primitive

export const ReplyChipComponent: React.FC<ReplyChipProps> = ({ 
  message, 
  onRemove 
}) => {
  // Get sender name for display
  const getSenderName = () => {
    if (message.type === 'user' && 'sender' in message) {
      return message.sender || 'Unknown User'
    }
    if (message.type === 'system') {
      return 'System'
    }
    return message.type !== 'human' ? 'Andrei' : 'You'
  }

  const senderName = getSenderName()
  const messageContent = message.content || ''
  const truncatedContent = messageContent.length > 80 
    ? messageContent.slice(0, 80) + '...' 
    : messageContent

  return (
    <ReplyChipContainer>
      <ReplyChip>
        <ReplyIcon>
          <HiReply size={14} />
        </ReplyIcon>
        <ReplyContent>
          <div className="reply-to">
            Replying to {senderName}
          </div>
          <div className="reply-message">
            {truncatedContent}
          </div>
        </ReplyContent>
              <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        asMotion
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '6px',
          padding: 0,
          minHeight: 'auto'
        }}
      >
        <HiX size={14} />
      </Button>
      </ReplyChip>
    </ReplyChipContainer>
  )
}
