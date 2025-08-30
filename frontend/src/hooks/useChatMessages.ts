import { useCallback, useRef, useState } from 'react'

export interface Message {
  id: string
  type: 'human' | 'ai' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
  attachments?: Array<{
    name: string
    type: string
    size: number
    url?: string
  }>
  replyTo?: Message // Message being replied to
}

export interface ChatResponse {
  type: 'typing_start' | 'typing_end' | 'content_chunk' | 'message_complete' | 'error' | 'image_generated' | 'image_generating'
  content?: string
  full_content?: string
  message_id?: string
  error?: string
  image_data?: string  // base64 encoded image
  mime_type?: string   // image MIME type
}

interface UseChatMessagesOptions {
  onMessagesChange?: (messages: Message[]) => void
}

export const useChatMessages = (options: UseChatMessagesOptions = {}) => {
  const { onMessagesChange } = options
  const [messages, setMessages] = useState<Message[]>([])
  const [isAiTyping, setIsAiTyping] = useState(false)
  const currentAiMessageRef = useRef<string>('')
  const currentMessageIdRef = useRef<string>('')

  const addUserMessage = useCallback((content: string, attachments?: Message['attachments']) => {
    const userMessage: Message = {
      id: `human-${Date.now()}`,
      type: 'human',
      content: content.trim(),
      timestamp: new Date(),
      ...(attachments && attachments.length > 0 && { attachments })
    }
    
    setMessages(prev => {
      const newMessages = [...prev, userMessage]
      // Notify of messages change after user message
      setTimeout(() => onMessagesChange?.(newMessages), 0)
      return newMessages
    })
    return userMessage
  }, [onMessagesChange])

  const handleChatResponse = useCallback((responseData: ChatResponse) => {
    switch (responseData.type) {
      case 'typing_start':
        setIsAiTyping(true)
        currentAiMessageRef.current = ''
        currentMessageIdRef.current = responseData.message_id || ''
        break
      
      case 'image_generated':
        // Handle generated image
        console.log('🖼️ PROCESSING IMAGE_GENERATED EVENT')
        console.log('🖼️ Has image_data:', !!responseData.image_data)
        console.log('🖼️ Has mime_type:', !!responseData.mime_type)
        console.log('🖼️ Image data length:', responseData.image_data?.length)
        
        if (responseData.image_data && responseData.mime_type) {
          console.log('🖼️ Creating image message!')
          const imageMessage: Message = {
            id: `assistant-${Date.now()}`,
            type: 'assistant',
            content: 'Here\'s the image I generated for you:',
            timestamp: new Date(),
            attachments: [{
              name: 'generated-image.png',
              type: responseData.mime_type,
              size: 0,
              url: `data:${responseData.mime_type};base64,${responseData.image_data}`
            }]
          }
          
          console.log('🖼️ Image message:', imageMessage)
          
          setMessages(prev => {
            const newMessages = [...prev, imageMessage]
            console.log('🖼️ Added image message, total messages:', newMessages.length)
            setTimeout(() => onMessagesChange?.(newMessages), 0)
            return newMessages
          })
        } else {
          console.warn('🖼️ Missing image_data or mime_type!')
        }
        break
        
      case 'typing_end':
        setIsAiTyping(false)
        break
        
      case 'content_chunk':
        currentAiMessageRef.current += responseData.content || ''
        // Update the streaming message in real-time
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage && lastMessage.type === 'ai' && lastMessage.isStreaming) {
            // Update existing streaming message
            return prev.map((msg, index) => 
              index === prev.length - 1 
                ? { ...msg, content: currentAiMessageRef.current }
                : msg
            )
          } else {
            // Create new streaming message
            return [...prev, {
              id: `ai-${responseData.message_id}`,
              type: 'ai' as const,
              content: currentAiMessageRef.current,
              timestamp: new Date(),
              isStreaming: true
            }]
          }
        })
        break
        
      case 'message_complete':
        // Finalize the message
        setMessages(prev => {
          const newMessages = prev.map((msg, index) => 
            index === prev.length - 1 && msg.type === 'ai' && msg.isStreaming
              ? { ...msg, content: responseData.full_content || msg.content, isStreaming: false }
              : msg
          )
          // Notify of messages change after AI message completes
          setTimeout(() => onMessagesChange?.(newMessages), 0)
          return newMessages
        })
        currentAiMessageRef.current = ''
        currentMessageIdRef.current = ''
        break
        
      case 'error':
        console.error('Chat error:', responseData.error)
        setIsAiTyping(false)
        // Add error message
        setMessages(prev => {
          const newMessages = [...prev, {
            id: `error-${Date.now()}`,
            type: 'ai' as const,
            content: `Sorry, I encountered an error: ${responseData.error}`,
            timestamp: new Date(),
            isStreaming: false
          }]
          // Notify of messages change after error message
          setTimeout(() => onMessagesChange?.(newMessages), 0)
          return newMessages
        })
        break
    }
  }, [onMessagesChange])

  const addErrorMessage = useCallback((error: string) => {
    setIsAiTyping(false)
    setMessages(prev => {
      const newMessages = [...prev, {
        id: `error-${Date.now()}`,
        type: 'ai' as const,
        content: `Sorry, I encountered an error: ${error}`,
        timestamp: new Date(),
        isStreaming: false
      }]
      // Notify of messages change after error message
      setTimeout(() => onMessagesChange?.(newMessages), 0)
      return newMessages
    })
  }, [onMessagesChange])

  const clearMessages = useCallback(() => {
    setMessages([])
    setIsAiTyping(false)
    currentAiMessageRef.current = ''
    currentMessageIdRef.current = ''
  }, [])

  const updateMessages = useCallback((newMessages: Message[]) => {
    setMessages(newMessages)
  }, [])

  return {
    messages,
    isAiTyping,
    addUserMessage,
    handleChatResponse,
    addErrorMessage,
    clearMessages,
    updateMessages
  }
}
