import React, { useState, useEffect } from 'react'
import { HiClipboard, HiRefresh, HiColorSwatch } from 'react-icons/hi'
import { useWindowStore } from '../stores/windowStore'
import { useBackgroundStore } from '../stores/backgroundStore'
import { useChat } from '../hooks'
import { MessageList, ChatInput, type MessageAction } from '../components/chat'
import { ChatContainer } from '../styles/chat'
import { Message } from '../hooks/useChatMessages'
import { GroupMessage } from '../hooks/useGroupChat'

interface AndreiChatAppProps {
  windowId: string
}

export const AndreiChatApp: React.FC<AndreiChatAppProps> = ({ windowId }) => {
  const { getWindow, updateWindowData } = useWindowStore()
  const { setChatBackgroundImage } = useBackgroundStore()
  const window = getWindow(windowId)
  
  const [inputValue, setInputValue] = useState('')

  // Initialize chat with WebSocket connection
  const {
    messages,
    isAiTyping,
    selectedFiles,
    handleFileSelect,
    removeFile,
    connectionStatus,
    handleSendMessage,
    shouldFocusInput,
    setShouldFocusInput,
    updateMessages
  } = useChat({
    websocketUrl: 'ws://localhost:8000/ws',
    onMessagesUpdate: (newMessages) => {
      // Save messages to window data
      updateWindowData(windowId, { messages: newMessages })
    }
  })

  // Load messages from window data on mount
  useEffect(() => {
    const windowMessages = window?.data?.messages
    if (windowMessages) {
      updateMessages(windowMessages)
    }
  }, [window?.data?.messages, updateMessages])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = async () => {
    const content = inputValue.trim()
    if (!content && selectedFiles.length === 0) return

    // Clear input immediately (like original implementation)
    setInputValue('')
    
    // Send message
    await handleSendMessage(content)
  }

  // Andrei chat specific message actions
  const getAndreiChatActions = (message: Message | GroupMessage): MessageAction[] => {
    const actions: MessageAction[] = []
    
    // Copy action (for all messages)
    actions.push({
      id: 'copy',
      label: 'Copy',
      icon: HiClipboard,
      onClick: () => {
        if (message.content) {
          navigator.clipboard.writeText(message.content).then(() => {
            console.log('Message copied to clipboard')
          }).catch(err => {
            console.error('Failed to copy message:', err)
          })
        }
      }
    })
    
    // Set as background action (only for AI responses with generated images)
    if ((message.type === 'assistant' || message.type === 'ai') && 
        'attachments' in message && 
        message.attachments && 
        message.attachments.length > 0) {
      
      // Check if this message contains a generated image
      const hasGeneratedImage = message.attachments.some(att => 
        att.name === 'generated-image.png' || 
        att.name.startsWith('generated-image') ||
        (att.type.startsWith('image/') && att.url?.startsWith('data:image'))
      )
      
      if (hasGeneratedImage) {
        actions.push({
          id: 'set-background',
          label: 'Set as Chat with Friends background',
          icon: HiColorSwatch,
          onClick: () => {
            const imageAttachment = message.attachments?.find(att => 
              att.name === 'generated-image.png' || 
              att.name.startsWith('generated-image') ||
              (att.type.startsWith('image/') && att.url?.startsWith('data:image'))
            )
            
            if (imageAttachment?.url) {
              setChatBackgroundImage(imageAttachment.url)
              console.log('🖼️ Set chat background image')
              
              // Show a brief confirmation message (optional)
              // You could add a toast notification here if you have one
            }
          }
        })
      }
    }
    
    // Regenerate action (only for AI responses in regular chat)
    if (message.type === 'assistant' || message.type === 'ai') {
      actions.push({
        id: 'regenerate',
        label: 'Regenerate',
        icon: HiRefresh,
        onClick: () => {
          console.log('Regenerating AI response...')
          // TODO: Implement regeneration logic
          // This would typically resend the previous user message
        }
      })
    }
    
    return actions
  }

  return (
    <ChatContainer>
      <MessageList
        messages={messages}
        isAiTyping={isAiTyping}
        connectionStatus={connectionStatus}
        getMessageActions={getAndreiChatActions}
      />
      
      <ChatInput
        inputValue={inputValue}
        selectedFiles={selectedFiles}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFileSelect={handleFileSelect}
        onRemoveFile={removeFile}
        onSendMessage={handleSend}
        shouldFocusInput={shouldFocusInput}
        setShouldFocusInput={setShouldFocusInput}
      />
    </ChatContainer>
  )
}
