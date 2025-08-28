import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MessageBubble as StyledMessageBubble, MessageHeader /*, MessageTime */ } from '../../styles/chat'
import { AttachmentPreview, AIImageDisplay } from './index'
import { ImageLoadingIndicator } from './ImageLoadingIndicator'
import { Message } from '../../hooks/useChatMessages'
// import { formatTime } from '../../utils/chatUtils'
import { messageEntranceVariants } from '../../styles/chat/animations'

interface MessageBubbleProps {
  message: Message
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <StyledMessageBubble 
      initial="hidden"
      animate="visible"
      variants={messageEntranceVariants}
      $isHuman={message.type === 'human'}
    >
      {message.type !== 'human' && (
        <MessageHeader $isHuman={false}>
          Andrei
        </MessageHeader>
      )}
      
      {message.type !== 'human' ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content || ''}
        </ReactMarkdown>
      ) : (
        message.content || ''
      )}
      
      {message.attachments && message.attachments.length > 0 && (
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
