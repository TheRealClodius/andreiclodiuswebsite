import { useCallback, useState } from 'react'
import { useWebSocket } from './useWebSocket'
import { useChatMessages, ChatResponse } from './useChatMessages'
import { useFileUpload } from './useFileUpload'
import { generateMessageId, convertFilesToAttachments, MessageAttachment } from '../utils/chatUtils'

interface UseChatOptions {
  websocketUrl: string
  onMessagesUpdate?: (messages: any[]) => void
}

export const useChat = ({ websocketUrl, onMessagesUpdate }: UseChatOptions) => {
  const [shouldFocusInput, setShouldFocusInput] = useState(false)

  const {
    messages,
    isAiTyping,
    addUserMessage,
    handleChatResponse,
    addErrorMessage,
    clearMessages,
    updateMessages
  } = useChatMessages({
    onMessagesChange: onMessagesUpdate
  })

  const {
    selectedFiles,
    removeFile,
    clearFiles,
    getAttachments,
    handleFileSelect,
    hasFiles
  } = useFileUpload()

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((data: any) => {
    console.log('📨 Received WebSocket message:', data)
    console.log('📨 Message type:', data.type)
    
    if (data.type === 'chat_response') {
      const responseData: ChatResponse = data.data
      console.log('📨 Chat response type:', responseData.type)
      console.log('📨 Full response data:', JSON.stringify(responseData, null, 2))
      
      // Special logging for image events
      if (responseData.type === 'image_generating') {
        console.log('🖼️ Image generation started!')
      } else if (responseData.type === 'image_generated') {
        console.log('🖼️ Image generated! Has image_data:', !!responseData.image_data)
        console.log('🖼️ Image data length:', responseData.image_data?.length)
        console.log('🖼️ MIME type:', responseData.mime_type)
      }
      
      handleChatResponse(responseData)
      
      // Focus input when message is complete
      if (responseData.type === 'message_complete' || responseData.type === 'error') {
        setShouldFocusInput(true)
      }
    } else if (data.type === 'chat_error') {
      console.error('Chat error:', data.error)
      addErrorMessage(data.error)
      setShouldFocusInput(true)
    }
  }, [handleChatResponse, addErrorMessage])

  const { connectionStatus, sendMessage, isConnected } = useWebSocket({
    url: websocketUrl,
    onMessage: handleWebSocketMessage
  })

  const sendChatMessage = useCallback((content: string, messageId: string, attachments: MessageAttachment[] = []) => {
    const payload = {
      type: 'chat_message',
      content,
      message_id: messageId,
      attachments
    }
    console.log('📤 Sending chat message:', payload)
    return sendMessage(payload)
  }, [sendMessage])

  const handleSendMessage = useCallback(async (content: string) => {
    try {
      if (!content.trim() && !hasFiles) return false

      // Create user message with attachments for display
      const displayAttachments = getAttachments()
      addUserMessage(content, displayAttachments)
      
      // Convert files to base64 attachments for backend
      let backendAttachments: MessageAttachment[] = []
      if (hasFiles) {
        try {
          backendAttachments = await convertFilesToAttachments(selectedFiles)
          console.log(`📎 Converted ${backendAttachments.length} attachments for backend`)
        } catch (error) {
          console.error('Error converting files to attachments:', error)
          addErrorMessage('Failed to process file attachments')
          return false
        }
      }
      
      // Clear files after adding to message
      clearFiles()
      setShouldFocusInput(true)
      
      // Send message to AI via WebSocket
      const messageId = generateMessageId()
      const sent = sendChatMessage(content, messageId, backendAttachments)
      
      return sent
    } catch (error) {
      console.error('Error in handleSendMessage:', error)
      addErrorMessage('Failed to send message')
      return false
    }
  }, [
    hasFiles, 
    selectedFiles,
    getAttachments, 
    addUserMessage, 
    clearFiles, 
    sendChatMessage, 
    addErrorMessage
  ])

  // Expose all necessary state and functions
  return {
    // Messages
    messages,
    isAiTyping,
    clearMessages,
    updateMessages,
    
    // Files
    selectedFiles,
    handleFileSelect,
    removeFile,
    hasFiles,
    
    // Connection
    connectionStatus,
    isConnected,
    
    // Actions
    handleSendMessage,
    
    // UI State
    shouldFocusInput,
    setShouldFocusInput
  }
}
