import React, { useState, useEffect } from 'react'
import { HiClipboard, HiReply } from 'react-icons/hi'
import { useWindowStore } from '../stores/windowStore'
import { useBackgroundStore } from '../stores/backgroundStore'
import { MessageList, ChatInput, NicknameSetup, type MessageAction } from '../components/chat'
import { ChatContainerWithBackground } from '../styles/chat'
import { useGroupChat, type GroupMessage } from '../hooks'
import { Message } from '../hooks/useChatMessages'

interface ChatWithFriendsAppProps {
  windowId: string
}



export const ChatWithFriendsApp: React.FC<ChatWithFriendsAppProps> = ({ windowId }) => {
  const { getWindow, updateWindowData } = useWindowStore()
  const { chatBackgroundImage, setChatBackgroundImage } = useBackgroundStore()
  const window = getWindow(windowId)
  
  const [inputValue, setInputValue] = useState('')
  const [nickname, setNickname] = useState('')
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false)
  const [roomStatus, setRoomStatus] = useState<'idle' | 'joining' | 'full' | 'joined'>('idle')
  const [replyToMessage, setReplyToMessage] = useState<Message | GroupMessage | null>(null)

  // Initialize group chat with WebSocket connection
  const {
    messages,
    isConnected,
    connectionStatus,
    userCount,
    users,
    currentUser,
    joinRoom,
    sendGroupMessage,
    shouldFocusInput,
    setShouldFocusInput,
    updateMessages
  } = useGroupChat({
    websocketUrl: 'ws://localhost:8000/ws/group-chat',
    onMessagesUpdate: (newMessages: GroupMessage[]) => {
      // Save messages to window data
      updateWindowData(windowId, { messages: newMessages })
    },
    onRoomStatusChange: (status: 'idle' | 'joining' | 'full' | 'joined') => {
      console.log('🔄 Room status changed to:', status)
      setRoomStatus(status)
      if (status === 'joined') {
        console.log('✅ Successfully joined room, enabling message sending')
        setHasJoinedRoom(true)
      } else if (status === 'idle') {
        console.log('❌ Room status reset to idle, disabling message sending')
        setHasJoinedRoom(false)
      }
    }
  })

  // Debug current state
  useEffect(() => {
    console.log('🔍 Current ChatWithFriends state:', {
      hasJoinedRoom,
      roomStatus,
      isConnected,
      connectionStatus,
      currentUser: currentUser?.nickname || 'none',
      userCount,
      nickname
    })
  }, [hasJoinedRoom, roomStatus, isConnected, connectionStatus, currentUser, userCount, nickname])

  // Load messages from window data on mount
  useEffect(() => {
    const windowMessages = window?.data?.messages
    if (windowMessages) {
      updateMessages(windowMessages)
    }
  }, [window?.data?.messages, updateMessages])

  // Leave room when component unmounts or window closes
  // Temporarily disabled due to hot reload issues in development
  useEffect(() => {
    return () => {
      // Only leave room on actual window close, not hot reloads
      console.log('🧹 Component cleanup - skipping leaveRoom() to avoid hot reload issues')
    }
  }, [])

  const handleNicknameSubmit = async (enteredNickname: string) => {
    setNickname(enteredNickname)
    setRoomStatus('joining')
    
    console.log('🚪 Attempting to join room with nickname:', enteredNickname)
    
    try {
      await joinRoom(enteredNickname)
      console.log('✅ Join room request sent successfully')
    } catch (error) {
      console.error('❌ Failed to join room:', error)
      setRoomStatus('idle')
    }
  }

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
    if (!content || !hasJoinedRoom) {
      console.log('❌ Cannot send message:', { 
        hasContent: !!content, 
        hasJoinedRoom, 
        isConnected,
        connectionStatus,
        currentUser
      })
      return
    }

    console.log('📤 Attempting to send message:', { 
      content, 
      hasJoinedRoom, 
      isConnected,
      connectionStatus,
      currentUser
    })

    // Clear input and reply state immediately
    setInputValue('')
    const currentReply = replyToMessage
    setReplyToMessage(null)
    
    // Send message to group with reply context if replying
    await sendGroupMessage(content, currentReply || undefined)
  }

  const handleReplyToMessage = (message: Message | GroupMessage) => {
    setReplyToMessage(message)
    setShouldFocusInput(true)
  }

  const handleCancelReply = () => {
    setReplyToMessage(null)
  }

  // Group chat specific message actions
  const getGroupChatActions = (message: Message | GroupMessage): MessageAction[] => {
    const actions: MessageAction[] = []
    
    // Copy action
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
    
    // Reply action (only for non-system messages)
    if (message.type !== 'system') {
      actions.push({
        id: 'reply',
        label: 'Reply',
        icon: HiReply,
        onClick: () => handleReplyToMessage(message)
      })
    }
    
    return actions
  }

  // Handle context menu for background clearing
  const handleBackgroundContextMenu = (e: React.MouseEvent) => {
    if (!chatBackgroundImage) return
    
    e.preventDefault()
    
    const isDarkMode = globalThis.window?.matchMedia('(prefers-color-scheme: dark)').matches
    
    // Create a simple context menu
    const contextMenu = document.createElement('div')
    contextMenu.style.position = 'fixed'
    contextMenu.style.left = `${e.clientX}px`
    contextMenu.style.top = `${e.clientY}px`
    contextMenu.style.backgroundColor = isDarkMode ? '#2a2a2a' : '#ffffff'
    contextMenu.style.border = isDarkMode ? '1px solid #444' : '1px solid #ccc'
    contextMenu.style.borderRadius = '8px'
    contextMenu.style.padding = '8px 0'
    contextMenu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
    contextMenu.style.zIndex = '9999'
    contextMenu.style.minWidth = '160px'
    contextMenu.style.fontFamily = 'system-ui, -apple-system, sans-serif'
    contextMenu.style.fontSize = '14px'
    
    const clearOption = document.createElement('div')
    clearOption.textContent = '🗑️ Clear background'
    clearOption.style.padding = '8px 16px'
    clearOption.style.cursor = 'pointer'
    clearOption.style.color = isDarkMode ? '#e0e0e0' : '#333'
    clearOption.style.transition = 'background-color 0.1s'
    
    clearOption.addEventListener('mouseover', () => {
      clearOption.style.backgroundColor = isDarkMode ? '#3a3a3a' : '#f5f5f5'
    })
    
    clearOption.addEventListener('mouseout', () => {
      clearOption.style.backgroundColor = 'transparent'
    })
    
    clearOption.addEventListener('click', () => {
      setChatBackgroundImage(null)
      console.log('🖼️ Cleared chat background')
      document.body.removeChild(contextMenu)
    })
    
    contextMenu.appendChild(clearOption)
    document.body.appendChild(contextMenu)
    
    // Remove context menu when clicking elsewhere
    const removeContextMenu = (event: MouseEvent) => {
      if (!contextMenu.contains(event.target as Node)) {
        if (document.body.contains(contextMenu)) {
          document.body.removeChild(contextMenu)
        }
        document.removeEventListener('click', removeContextMenu)
      }
    }
    
    setTimeout(() => {
      document.addEventListener('click', removeContextMenu)
    }, 0)
  }

  // Show nickname setup if user hasn't joined room yet
  if (!hasJoinedRoom) {
    return (
      <ChatContainerWithBackground 
        $backgroundImage={chatBackgroundImage}
        onContextMenu={handleBackgroundContextMenu}
      >
        <NicknameSetup
          onSubmit={handleNicknameSubmit}
          status={roomStatus}
          isConnected={isConnected}
        />
      </ChatContainerWithBackground>
    )
  }

  // Show group chat interface
  return (
    <ChatContainerWithBackground 
      $backgroundImage={chatBackgroundImage}
      onContextMenu={handleBackgroundContextMenu}
    >
      <MessageList
        messages={messages}
        isAiTyping={false} // No AI in group chat
        connectionStatus={connectionStatus}
        userCount={userCount}
        users={users}
        currentUser={currentUser}
        onReplyToMessage={handleReplyToMessage}
        getMessageActions={getGroupChatActions}
      />
      
      <ChatInput
        inputValue={inputValue}
        selectedFiles={[]} // No file support initially
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFileSelect={() => {}} // Disabled for now
        onRemoveFile={() => {}} // Disabled for now
        onSendMessage={handleSend}
        shouldFocusInput={shouldFocusInput}
        setShouldFocusInput={setShouldFocusInput}
        placeholder={`Message as ${nickname}...`}
        replyToMessage={replyToMessage}
        onCancelReply={handleCancelReply}
      />
    </ChatContainerWithBackground>
  )
}
