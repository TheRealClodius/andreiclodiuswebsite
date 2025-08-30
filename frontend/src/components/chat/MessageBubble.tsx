import React, { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AnimatePresence } from 'framer-motion'
import { MessageBubble as StyledMessageBubble, MessageHeader /*, MessageTime */ } from '../../styles/chat'
import { AttachmentPreview, AIImageDisplay, MessageActionsButton, MessageActionsMenu, ReplyAttachment, type MessageAction } from './index'
import { Message } from '../../hooks/useChatMessages'
import { GroupMessage } from '../../hooks/useGroupChat'
// import { formatTime } from '../../utils/chatUtils'
import { messageEntranceVariants } from '../../styles/chat/animations'
import { getUserColor } from '../../utils/userColors'
import styled from 'styled-components'

interface MessageBubbleProps {
  message: Message | GroupMessage
  isGroupChat?: boolean
  currentUser?: { id: string; nickname: string } | null
  actions?: MessageAction[]
}

const MessageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`

const BubbleActionsButton = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  bottom: 12px;
  right: 12px;
  z-index: 10;
  
  .message-actions {
    opacity: ${props => props.$isVisible ? 1 : 0};
    transform: translateY(${props => props.$isVisible ? 0 : 2}px);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
`

const StyledMessageBubbleWithActions = styled(StyledMessageBubble)<{ $isHuman: boolean }>`
  position: relative;
`

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isGroupChat = false, 
  currentUser = null,
  actions = []
}) => {
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [showActionsButton, setShowActionsButton] = useState(false)
  const actionsButtonRef = useRef<HTMLDivElement>(null)
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
      // Don't show name for user's own messages (blue bubbles) - it's redundant since it shows in input
      if (isHumanMessage) return null
      return message.sender || 'Unknown User'
    }
    // For non-group chat, only show name for AI messages (not user's own messages)
    return message.type !== 'human' ? 'Andrei' : null
  }

  const senderName = getSenderName()
  
  // Get user color for group chat names (but not for blue bubbles due to accessibility)
  const getUserNameColor = () => {
    if (isGroupChat && isGroupMessage(message) && message.sender && !isHumanMessage) {
      // Only apply colors to other users' messages (gray bubbles), not our own (blue bubbles)
      return getUserColor(message.sender)
    }
    return undefined // Use default colors for non-group chat or our own messages
  }

  const userNameColor = getUserNameColor()

  // Handle click outside to close actions menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsButtonRef.current && !actionsButtonRef.current.contains(event.target as Node)) {
        setShowActionsMenu(false)
        setShowActionsButton(false) // Also hide the button when clicking outside
      }
    }

    if (showActionsMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showActionsMenu])

  // Action handlers
  const handleActionsClick = () => {
    setShowActionsMenu(prev => !prev)
  }

  const handleMenuClose = () => {
    setShowActionsMenu(false)
    // Don't automatically hide the button here - let mouse leave handle it
  }

  const handleBubbleMouseEnter = () => {
    setShowActionsButton(true)
  }

  const handleBubbleMouseLeave = () => {
    // Only hide the button if the menu is not open
    if (!showActionsMenu) {
      setShowActionsButton(false)
    }
  }

  // When menu closes and mouse is not over bubble, hide the button
  useEffect(() => {
    if (!showActionsMenu && !showActionsButton) {
      setShowActionsButton(false)
    }
  }, [showActionsMenu, showActionsButton])

  const handleActionClick = (action: MessageAction) => {
    action.onClick()
    setShowActionsMenu(false)
    setShowActionsButton(false)
  }

  // Don't show actions for system messages
  const showActions = !isSystemMessage && actions.length > 0

  const BubbleComponent = showActions ? StyledMessageBubbleWithActions : StyledMessageBubble

  return (
    <MessageContainer>
      <BubbleComponent 
        initial="hidden"
        animate="visible"
        variants={messageEntranceVariants}
        $isHuman={isHumanMessage}
        onMouseEnter={handleBubbleMouseEnter}
        onMouseLeave={handleBubbleMouseLeave}
        style={isSystemMessage ? {
          maxWidth: '90%',
          alignSelf: 'center',
          background: 'rgba(107, 114, 128, 0.1)',
          color: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#9ca3af' : '#6b7280',
          fontSize: '13px',
          fontStyle: 'italic',
          borderRadius: '16px',
          padding: '6px 12px',
          textAlign: 'center' as const
        } : undefined}
      >
        {senderName && (
          <MessageHeader $isHuman={isHumanMessage} $userColor={userNameColor}>
            {senderName}
          </MessageHeader>
        )}
        
        {/* Render reply attachment if message is replying to another */}
        {'replyTo' in message && message.replyTo && (
          <ReplyAttachment 
            replyToMessage={message.replyTo} 
            isHumanMessage={isHumanMessage}
          />
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
        
        {/* Actions button inside bubble */}
        {showActions && (
          <BubbleActionsButton 
            ref={actionsButtonRef}
            $isVisible={showActionsButton || showActionsMenu}
          >
            <MessageActionsButton 
              onClick={handleActionsClick}
              className="message-actions"
            />
            <AnimatePresence>
              {showActionsMenu && (
                <MessageActionsMenu
                  actions={actions.map(action => ({
                    ...action,
                    onClick: () => handleActionClick(action)
                  }))}
                  onClose={handleMenuClose}
                />
              )}
            </AnimatePresence>
          </BubbleActionsButton>
        )}
        
        {/* <MessageTime>
          {formatTime(message.timestamp)}
        </MessageTime> */}
      </BubbleComponent>
    </MessageContainer>
  )
}
