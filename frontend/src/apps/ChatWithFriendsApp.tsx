import React, { useState, useEffect } from 'react'
import { HiClipboard, HiReply } from 'react-icons/hi'
import { useWindowStore } from '../stores/windowStore'
import { MessageList, ChatInput, NicknameSetup, type MessageAction } from '../components/chat'
import { ChatContainer } from '../styles/chat'
import { useGroupChat, type GroupMessage } from '../hooks'
import { Message } from '../hooks/useChatMessages'

interface ChatWithFriendsAppProps {
  windowId: string
}



export const ChatWithFriendsApp: React.FC<ChatWithFriendsAppProps> = ({ windowId }) => {
  const { getWindow, updateWindowData } = useWindowStore()
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
      setRoomStatus(status)
      if (status === 'joined') {
        setHasJoinedRoom(true)
      }
    }
  })

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
    
    try {
      await joinRoom(enteredNickname)
    } catch (error) {
      console.error('Failed to join room:', error)
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
    if (!content || !hasJoinedRoom) return

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

  // Show nickname setup if user hasn't joined room yet
  if (!hasJoinedRoom) {
    return (
      <ChatContainer>
        <NicknameSetup
          onSubmit={handleNicknameSubmit}
          status={roomStatus}
          isConnected={isConnected}
        />
      </ChatContainer>
    )
  }

  // Show group chat interface
  return (
    <ChatContainer>
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
    </ChatContainer>
  )
}
