import React, { useState, useEffect, useRef, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { IoArrowUp } from 'react-icons/io5'
import { HiPlus, HiX, HiDocument } from 'react-icons/hi'
import { useWindowStore } from '../stores/windowStore'

interface AndreiChatAppProps {
  windowId: string
}

interface Message {
  id: string
  type: 'human' | 'ai'
  content: string
  timestamp: Date
  isStreaming?: boolean
  attachments?: Array<{
    name: string
    type: string
    size: number
    url?: string
  }>
}

// Gentle pulse for typing indicator
const pulseAnimation = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`



const ChatContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  color: #e0e0e0;
`

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
  overflow-y: auto;
  min-height: 0;
  
  /* Hide scrollbar completely */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* For Firefox */
  scrollbar-width: none;
`

const MessageBubble = styled(motion.div)<{ $isHuman: boolean }>`
  max-width: 70%;
  align-self: ${props => props.$isHuman ? 'flex-end' : 'flex-start'};
  padding: 8px 10px;
  border-radius: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  position: relative;
  
  ${props => props.$isHuman ? `
    background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
    color: white;
    border-bottom-right-radius: 6px;
  ` : `
    background: rgba(255, 255, 255, 0.08);
    color: #e0e0e0;
    border-bottom-left-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  `}
`

const MessageHeader = styled.div<{ $isHuman: boolean }>`
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 4px;
  opacity: 0.8;
  color: ${props => props.$isHuman ? 'rgba(190, 202, 255, 0.9)' : '#b0b0b0'};
`

const MessageTime = styled.div`
  font-size: 10px;
  opacity: 0.6;
  margin-top: 4px;
  text-align: right;
`

const InputContainer = styled.div`
  padding: 20px;
  // border-top: 0.5px solid rgba(128, 128, 128, 0);
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgb(27, 26, 26) 100%
  );
  position: relative;
  margin-top: -80px;
  padding-top: 16px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 130px;
    backdrop-filter: blur(12px);
    -webkit-mask: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0.8) 30%,
      rgba(255, 255, 255, 0.4) 60%,
      rgba(255, 255, 255, 0) 100%
    );
    mask: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0.85) 30%,
      rgba(255, 255, 255, 0.5) 60%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 2;
  }
`

const InputWrapper = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  gap: 8px;
  align-items: center;
  background: rgba(198, 212, 0, 0);
`

const PlusButton = styled.button`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: rgba(224, 224, 224, 0.5);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  z-index: 2;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(224, 224, 224, 0.8);
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-50%) scale(0.95);
  }
`

const SelectedFiles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
  padding: 0px 12px;
`

const FileChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 16px;
  padding: 4px 6px 4px 12px;
  font-size: 12px;
  font-weight: 550;
  color:rgba(224, 224, 224, 0.81);
  max-width: 200px;
`

const FileName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`

const FilePreview = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  color: rgba(224, 224, 224, 0.6);
`

const FilePreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
`

const RemoveFileButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: rgba(224, 224, 224, 0.5);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(224, 224, 224, 0.8);
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(0.95);
  }
`

const AttachmentPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`

const AttachmentItem = styled.div<{ $isImage: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  max-width: 200px;
  font-size: 12px;
  
  ${props => props.$isImage && `
    flex-direction: column;
    align-items: stretch;
  `}
`

const AttachmentImage = styled.img`
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 4px;
`

const AttachmentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
`

const AttachmentName = styled.span`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const AttachmentSize = styled.span`
  font-size: 10px;
  opacity: 0.7;
`

const PromptInput = styled.textarea`
  flex: 1;
  min-height: 26px;
  max-height: 120px;
  padding: 12px 12px 14px 38px;
  border: 1px solid rgba(102, 102, 102, 0.2);
  border-radius: 24px;
  background: rgba(24, 23, 23, 0.91);
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-size: 14px;
  line-height: 1.4;
  resize: none;
  outline: none;
  text-align: left;
  
  /* Clip scrollbar to rounded shape */
  &.has-scroll {
    clip-path: inset(0 0 0 0 round 24px);
  }
  
  &::placeholder {
    color: rgba(224, 224, 224, 0.5);
  }
  
  &:focus {
    border-color: rgba(111, 111, 111, 0.2);
    background: rgba(19, 19, 19, 0.5);
  }
  
  /* Hide scrollbar by default */
  &::-webkit-scrollbar {
    width: 0px;
    display: none;
  }
  
  /* Show scrollbar when content is expanded */
  &.has-scroll::-webkit-scrollbar {
    width: 8px;             /* Make wider to include spacing */
    display: block;
  }
  
  &.has-scroll::-webkit-scrollbar-track {
    background: transparent;
    border-left: 2px solid transparent;  /* Creates left spacing */
    border-right: 2px solid transparent; /* Creates right spacing */
    border-radius: 24px;                 /* Match prompt input border-radius */
  }
  
  &.has-scroll::-webkit-scrollbar-thumb {
    background: rgb(0, 0, 255);
    border-radius: 24px;                 /* Match prompt input border-radius */
    border-left: 1px solid transparent;  /* Inset from left */
    border-right: 3px solid transparent; /* Inset from right */
    background-clip: padding-box;        /* Clips background to exclude borders */
  }
`

const SendButton = styled.button<{ $disabled: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: none;
  background: ${props => props.$disabled 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(180, 180, 180, 0.9)'
  };
  color: ${props => props.$disabled ? 'rgba(255, 255, 255, 0.3)' : '#333'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  outline: none;
  
  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(180, 180, 180, 0.25);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.95);
    transition: all 0.1s ease;
  }
`

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #b0b0b0;
  padding: 40px;
`

const EmptyStateTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #e0e0e0;
`

const EmptyStateSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  opacity: 0.7;
  max-width: 300px;
`

const StatusIndicator = styled.div<{ $isTyping: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 12px;
  color: #b0b0b0;
  opacity: ${props => props.$isTyping ? 1 : 0};
  transition: opacity 0.3s ease;
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #007AFF;
    animation: ${props => props.$isTyping ? `${pulseAnimation} 1.5s infinite` : 'none'};
  }
`

export const AndreiChatApp: React.FC<AndreiChatAppProps> = ({ windowId }) => {
  const { getWindow, updateWindowData } = useWindowStore()
  const window = getWindow(windowId)
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [shouldFocusInput, setShouldFocusInput] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const currentAiMessageRef = useRef<string>('')
  const currentMessageIdRef = useRef<string>('')
  const connectionStatusRef = useRef<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')



  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      const scrollHeight = inputRef.current.scrollHeight
      inputRef.current.style.height = Math.min(scrollHeight, 120) + 'px'
      
      // Add/remove scrollbar class based on content height
      if (scrollHeight > 120) {
        inputRef.current.classList.add('has-scroll')
      } else {
        inputRef.current.classList.remove('has-scroll')
      }
    }
  }, [])

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue, adjustTextareaHeight])

  // Handle input focus after actions
  useEffect(() => {
    if (shouldFocusInput && inputRef.current) {
      inputRef.current.focus()
      setShouldFocusInput(false)
    }
  }, [shouldFocusInput])

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    try {
      // Don't create a new connection if one already exists
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        console.log('WebSocket already exists, skipping connection')
        return
      }

      console.log('🔌 Creating new WebSocket connection...')
      setConnectionStatus('connecting')
      connectionStatusRef.current = 'connecting'
      const ws = new WebSocket('ws://localhost:8000/ws')
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected')
        setConnectionStatus('connected')
        connectionStatusRef.current = 'connected'
        wsRef.current = ws
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleWebSocketMessage(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      ws.onclose = () => {
        console.log('❌ WebSocket disconnected')
        setConnectionStatus('disconnected')
        connectionStatusRef.current = 'disconnected'
        wsRef.current = null
        
        // Only reconnect if the connection was unexpectedly closed, not on cleanup
        if (connectionStatusRef.current === 'disconnected') {
          setTimeout(() => {
            if (connectionStatusRef.current === 'disconnected') {
              console.log('🔄 Attempting to reconnect...')
              connectWebSocket()
            }
          }, 3000)
        }
      }
      
      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        setConnectionStatus('error')
        connectionStatusRef.current = 'error'
        // Close the connection to prevent resource leaks
        if (wsRef.current) {
          wsRef.current.close()
          wsRef.current = null
        }
      }
      
    } catch (error) {
      console.error('❌ Error connecting to WebSocket:', error)
      setConnectionStatus('error')
      connectionStatusRef.current = 'error'
    }
  }, [])

  // Auto-scroll to bottom when messages are added
  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  // Initialize WebSocket connection (only once)
  useEffect(() => {
    connectWebSocket()
    
    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up WebSocket connection')
      connectionStatusRef.current = 'error' // Prevent reconnection
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, []) // Remove connectWebSocket dependency to prevent re-initialization

  // Load messages from window data
  useEffect(() => {
    const windowMessages = window?.data?.messages
    if (windowMessages) {
      setMessages(windowMessages)
    }
  }, [window?.data?.messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handlePlusClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files])
      // Reset the input so the same file can be selected again
      e.target.value = ''
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleWebSocketMessage = useCallback((data: any) => {
    console.log('📨 Received WebSocket message:', data)
    console.log('📨 Message type:', data.type)
    console.log('📨 Message data:', data.data)
    
    if (data.type === 'chat_response') {
      const responseData = data.data
      
      switch (responseData.type) {
        case 'typing_start':
          setIsAiTyping(true)
          currentAiMessageRef.current = ''
          currentMessageIdRef.current = responseData.message_id
          break
          
        case 'typing_end':
          setIsAiTyping(false)
          break
          
        case 'content_chunk':
          currentAiMessageRef.current += responseData.content
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
          setMessages(prev => prev.map((msg, index) => 
            index === prev.length - 1 && msg.type === 'ai' && msg.isStreaming
              ? { ...msg, content: responseData.full_content, isStreaming: false }
              : msg
          ))
          setShouldFocusInput(true)
          currentAiMessageRef.current = ''
          currentMessageIdRef.current = ''
          break
          
        case 'error':
          console.error('Chat error:', responseData.error)
          setIsAiTyping(false)
          // Add error message
          setMessages(prev => [...prev, {
            id: `error-${Date.now()}`,
            type: 'ai' as const,
            content: `Sorry, I encountered an error: ${responseData.error}`,
            timestamp: new Date(),
            isStreaming: false
          }])
          setShouldFocusInput(true)
          break
      }
    } else if (data.type === 'chat_error') {
      console.error('Chat error:', data.error)
      setIsAiTyping(false)
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        type: 'ai' as const,
        content: `Sorry, I encountered an error: ${data.error}`,
        timestamp: new Date(),
        isStreaming: false
      }])
      setShouldFocusInput(true)
    }
  }, [])

  const sendChatMessage = useCallback((message: string, messageId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const payload = {
        type: 'chat_message',
        content: message,
        message_id: messageId
      }
      console.log('📤 Sending chat message:', payload)
      wsRef.current.send(JSON.stringify(payload))
    } else {
      console.error('❌ WebSocket not connected, state:', wsRef.current?.readyState)
      // Try to reconnect and then send
      connectWebSocket()
    }
  }, [connectWebSocket])

  const handleSendMessage = useCallback(async () => {
    try {
      if (!inputValue.trim() && selectedFiles.length === 0) return

      // Prepare attachments
      const attachments = selectedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file) // For preview purposes
      }))

      const messageId = `msg-${Date.now()}`
      const userMessage: Message = {
        id: `human-${Date.now()}`,
        type: 'human',
        content: inputValue.trim(),
        timestamp: new Date(),
        ...(attachments.length > 0 && { attachments })
      }
      
      const newMessages = [...messages, userMessage]
      setMessages(newMessages)
      const messageContent = inputValue.trim()
      setInputValue('')
      setSelectedFiles([]) // Clear selected files
      setShouldFocusInput(true) // Focus input after sending
      
      // Save to window data
      updateWindowData(windowId, { messages: newMessages })

      // Send message to AI via WebSocket
      sendChatMessage(messageContent, messageId)
      
    } catch (error) {
      console.error('Error in handleSendMessage:', error)
    }
  }, [inputValue, selectedFiles, messages, updateWindowData, windowId, sendChatMessage])

  const formatTime = (date: Date) => {
    try {
      return date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
    } catch (error) {
      console.error('Error formatting time:', error)
      return ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <ChatContainer>
      <MessagesContainer ref={messagesContainerRef}>
        {messages.length === 0 ? (
          <EmptyState>
            <EmptyStateTitle>Chat with Andrei</EmptyStateTitle>
            <EmptyStateSubtitle>
              Start a conversation with Andrei's AI clone. Ask questions, get advice, or just have a friendly chat.
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
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30
                  }}
                  $isHuman={message.type === 'human'}
                >
                {message.type === 'ai' && (
                  <MessageHeader $isHuman={false}>
                    Andrei
                  </MessageHeader>
                )}
                {message.content || ''}
                {message.attachments && message.attachments.length > 0 && (
                  <AttachmentPreview>
                    {message.attachments.map((attachment, index) => {
                      const isImage = attachment.type.startsWith('image/')
                      return (
                        <AttachmentItem key={index} $isImage={isImage}>
                          {isImage && attachment.url && (
                            <AttachmentImage 
                              src={attachment.url} 
                              alt={attachment.name}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          )}
                          <AttachmentInfo>
                            <AttachmentName>{attachment.name}</AttachmentName>
                            <AttachmentSize>{formatFileSize(attachment.size)}</AttachmentSize>
                          </AttachmentInfo>
                        </AttachmentItem>
                      )
                    })}
                  </AttachmentPreview>
                )}
                <MessageTime>
                  {formatTime(message.timestamp)}
                </MessageTime>
              </MessageBubble>
            ))}
            </AnimatePresence>
            <StatusIndicator $isTyping={isAiTyping}>
              Andrei is typing...
            </StatusIndicator>
          </>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer>
        {selectedFiles.length > 0 && (
          <SelectedFiles>
            {selectedFiles.map((file, index) => (
              <FileChip key={`${file.name}-${index}`}>
                <FilePreview>
                  {file.type.startsWith('image/') ? (
                    <FilePreviewImage 
                      src={URL.createObjectURL(file)} 
                      alt={file.name}
                    />
                  ) : (
                    <HiDocument size={14} />
                  )}
                </FilePreview>
                <FileName>{file.name}</FileName>
                <RemoveFileButton onClick={() => removeFile(index)}>
                  <HiX size={14} />
                </RemoveFileButton>
              </FileChip>
            ))}
          </SelectedFiles>
        )}
        <InputWrapper>
          <PlusButton onClick={handlePlusClick}>
            <HiPlus size={14} />
          </PlusButton>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <PromptInput
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Go ahead..."
            rows={1}
          />
          <SendButton 
            $disabled={!inputValue.trim() && selectedFiles.length === 0}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() && selectedFiles.length === 0}
          >
            <IoArrowUp size={16} />
          </SendButton>
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  )
}
