import { useCallback, useState, useRef, useEffect } from 'react'
import { useWebSocket } from './useWebSocket'
import { generateMessageId } from '../utils/chatUtils'
import { Message } from './useChatMessages'

// Extend the base Message interface for group chat
export interface GroupMessage {
  id: string
  type: 'user' | 'system'
  content: string
  sender?: string // nickname for user messages
  timestamp: Date
  userId?: string // unique user identifier
  replyTo?: GroupMessage // Message being replied to
}

export interface GroupUser {
  id: string
  nickname: string
  joined_at: number  // Backend uses snake_case and Unix timestamp
}

export interface GroupChatResponse {
  type: 'user_joined' | 'user_left' | 'message' | 'room_full' | 'room_joined' | 'user_list' | 'error'
  message?: string
  sender?: string
  userId?: string
  users?: GroupUser[]
  userCount?: number
  error?: string
  replyTo?: {
    id: string
    content: string
    sender: string
    type: string
  }
}

interface UseGroupChatOptions {
  websocketUrl: string
  onMessagesUpdate?: (messages: GroupMessage[]) => void
  onRoomStatusChange?: (status: 'idle' | 'joining' | 'full' | 'joined') => void
}

export const useGroupChat = ({ websocketUrl, onMessagesUpdate, onRoomStatusChange }: UseGroupChatOptions) => {
  const [messages, setMessages] = useState<GroupMessage[]>([])
  const [users, setUsers] = useState<GroupUser[]>([])
  const [userCount, setUserCount] = useState(0)
  const [currentUser, setCurrentUser] = useState<{ id: string; nickname: string } | null>(null)
  const joiningNicknameRef = useRef<string | null>(null) // Store nickname being used to join
  const lastJoinedNicknameRef = useRef<string | null>(null) // Store last successfully joined nickname for reconnection
  const [shouldFocusInput, setShouldFocusInput] = useState(false)
  
  // Handle WebSocket messages for group chat
  const handleWebSocketMessage = useCallback((data: any) => {
    console.log('📨 Received Group Chat message:', data)
    
    if (data.type === 'group_chat_response') {
      const responseData: GroupChatResponse = data.data
      console.log('📨 Group chat response type:', responseData.type)
      
      switch (responseData.type) {
        case 'room_joined':
          console.log('✅ Successfully joined room')
          console.log('📊 Room joined response data:', responseData)
          onRoomStatusChange?.('joined')
          if (responseData.users) {
            setUsers(responseData.users)
            setUserCount(responseData.users.length)
            
            // Set the current user from the server response
            // Find the user that matches our joining nickname
            console.log('🔍 Trying to match joiningNickname:', joiningNicknameRef.current, 'with users:', responseData.users)
            console.log('🔍 joiningNicknameRef status:', joiningNicknameRef.current ? 'HAS VALUE' : 'NULL/UNDEFINED')
            
            if (joiningNicknameRef.current) {
              console.log('🔍 Looking for exact match:', joiningNicknameRef.current)
              const myUser = responseData.users.find(user => user.nickname === joiningNicknameRef.current)
              console.log('🔍 Exact match result:', myUser)
              
              if (myUser) {
                setCurrentUser({ id: myUser.id, nickname: myUser.nickname })
                lastJoinedNicknameRef.current = myUser.nickname // Store for reconnection
                console.log('👤 Set current user (exact match):', myUser)
                console.log('👤 currentUser should now be:', { id: myUser.id, nickname: myUser.nickname })
                joiningNicknameRef.current = null // Clear joining state
              } else {
                // Fallback: find user with similar nickname (in case server modified it)
                console.log('🔍 Trying similar match with prefix:', joiningNicknameRef.current)
                const similarUser = responseData.users.find(user => user.nickname.startsWith(joiningNicknameRef.current!))
                console.log('🔍 Similar match result:', similarUser)
                
                if (similarUser) {
                  setCurrentUser({ id: similarUser.id, nickname: similarUser.nickname })
                  lastJoinedNicknameRef.current = similarUser.nickname // Store for reconnection
                  console.log('👤 Set current user (similar match):', similarUser)
                  console.log('👤 currentUser should now be:', { id: similarUser.id, nickname: similarUser.nickname })
                  joiningNicknameRef.current = null // Clear joining state
                } else {
                  console.log('❌ No matching user found! joiningNickname:', joiningNicknameRef.current, 'available users:', responseData.users?.map(u => u.nickname))
                }
              }
            } else {
              console.log('❌ joiningNickname is null/undefined - cannot match user!')
              console.log('❌ This means joiningNicknameRef.current was not set during joinRoom call')
            }
          }
          break
          
        case 'room_full':
          console.log('❌ Room is full')
          onRoomStatusChange?.('full')
          break
          
        case 'user_joined':
          if (responseData.sender && responseData.userId) {
            // Add system message about user joining
            const joinMessage: GroupMessage = {
              id: generateMessageId(),
              type: 'system',
              content: `${responseData.sender} joined the chat`,
              timestamp: new Date()
            }
            
            setMessages(prev => {
              const newMessages = [...prev, joinMessage]
              setTimeout(() => onMessagesUpdate?.(newMessages), 0)
              return newMessages
            })
            
            // Update user list if provided
            if (responseData.users) {
              setUsers(responseData.users)
              setUserCount(responseData.users.length)
            }
          }
          break
          
        case 'user_left':
          if (responseData.sender) {
            // Add system message about user leaving
            const leaveMessage: GroupMessage = {
              id: generateMessageId(),
              type: 'system',
              content: `${responseData.sender} left the chat`,
              timestamp: new Date()
            }
            
            setMessages(prev => {
              const newMessages = [...prev, leaveMessage]
              setTimeout(() => onMessagesUpdate?.(newMessages), 0)
              return newMessages
            })
            
            // Update user list if provided
            if (responseData.users) {
              setUsers(responseData.users)
              setUserCount(responseData.users.length)
            }
          }
          break
          
        case 'message':
          if (responseData.message && responseData.sender) {
            // Check if this message is from us (either matching user ID, or no currentUser set yet and this matches our pending message)
            if (currentUser && responseData.userId === currentUser.id) {
              // This is definitely our message - update nickname if needed
              if (responseData.sender !== currentUser.nickname) {
                console.log(`🔄 Updating current user nickname from "${currentUser.nickname}" to "${responseData.sender}" (auto-join detected)`)
                setCurrentUser(prev => prev ? { ...prev, nickname: responseData.sender || prev.nickname } : null)
              }
            }
            
            // Add user message
            const chatMessage: GroupMessage = {
              id: generateMessageId(),
              type: 'user',
              content: responseData.message,
              sender: responseData.sender,
              userId: responseData.userId,
              timestamp: new Date(),
              ...(responseData.replyTo && { 
                replyTo: {
                  id: responseData.replyTo.id,
                  type: responseData.replyTo.type as 'user' | 'system',
                  content: responseData.replyTo.content,
                  sender: responseData.replyTo.sender,
                  timestamp: new Date() // We don't have original timestamp, use current
                }
              })
            }
            
            setMessages(prev => {
              const newMessages = [...prev, chatMessage]
              setTimeout(() => onMessagesUpdate?.(newMessages), 0)
              return newMessages
            })
          }
          break
          
        case 'user_list':
          if (responseData.users) {
            setUsers(responseData.users)
            setUserCount(responseData.users.length)
          }
          break
          
        case 'error':
          console.error('Group chat error:', responseData.error)
          onRoomStatusChange?.('idle')
          break
      }
    } else if (data.type === 'group_chat_error') {
      console.error('Group chat error:', data.error)
      onRoomStatusChange?.('idle')
    }
  }, [onMessagesUpdate, onRoomStatusChange])

  const { connectionStatus, sendMessage, isConnected } = useWebSocket({
    url: websocketUrl,
    onMessage: handleWebSocketMessage,
    heartbeatInterval: 30000 // Send heartbeat every 30 seconds
  })

  const joinRoom = useCallback(async (nickname: string) => {
    const trimmedNickname = nickname.trim()
    const payload = {
      type: 'join_room',
      nickname: trimmedNickname,
      room_id: 'general'  // Add required room_id field
    }
    
    console.log('📤 Sending join room request:', payload)
    joiningNicknameRef.current = trimmedNickname // Store the nickname we're trying to join with
    const sent = sendMessage(payload)
    
    if (sent) {
      console.log('✅ Join room request sent, waiting for server response...')
      return true
    } else {
      joiningNicknameRef.current = null // Clear joining state on failure
      throw new Error('Failed to send join room request')
    }
  }, [sendMessage])

  // Handle WebSocket reconnection - automatically rejoin room
  const handleReconnection = useCallback(() => {
    if (lastJoinedNicknameRef.current) {
      console.log('🔄 WebSocket reconnected, rejoining room with nickname:', lastJoinedNicknameRef.current)
      // Add a small delay to ensure connection is stable
      setTimeout(() => {
        if (lastJoinedNicknameRef.current) {
          joinRoom(lastJoinedNicknameRef.current)
        }
      }, 1000)
    }
  }, [joinRoom])

  // Monitor connection status and handle reconnections
  useEffect(() => {
    if (connectionStatus === 'connected' && lastJoinedNicknameRef.current && !currentUser) {
      console.log('🔄 Connection restored, attempting to rejoin room')
      handleReconnection()
    }
  }, [connectionStatus, currentUser, handleReconnection])

  const leaveRoom = useCallback(() => {
    if (!currentUser) return
    
    const payload = {
      type: 'leave_room',
      room_id: 'general'  // Add required room_id field
    }
    
    console.log('📤 Sending leave room request:', payload)
    sendMessage(payload)
    setCurrentUser(null)
  }, [sendMessage, currentUser])

  const sendGroupMessage = useCallback(async (content: string, replyTo?: GroupMessage | Message) => {
    if (!content.trim()) {
      console.log('❌ Cannot send empty message')
      return false
    }
    
    if (!currentUser) {
      console.log('❌ Cannot send message - user not joined. Current user:', currentUser)
      return false
    }

    const payload = {
      type: 'send_message',
      message: content.trim(),
      room_id: 'general',  // Add required room_id field
      ...(replyTo && { replyTo: {
        id: replyTo.id,
        content: replyTo.content,
        sender: replyTo.type === 'user' && 'sender' in replyTo ? replyTo.sender : (replyTo.type !== 'human' ? 'Andrei' : 'You'),
        type: replyTo.type
      }})
    }
    
    console.log('📤 Sending group message:', payload, 'Current user:', currentUser)
    const sent = sendMessage(payload)
    
    if (sent) {
      setShouldFocusInput(true)
    } else {
      console.log('❌ Failed to send message via WebSocket')
    }
    
    return sent
  }, [sendMessage, currentUser])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const updateMessages = useCallback((newMessages: GroupMessage[]) => {
    setMessages(newMessages)
  }, [])

  return {
    // Messages
    messages,
    clearMessages,
    updateMessages,
    
    // Users
    users,
    userCount,
    currentUser,
    
    // Connection
    connectionStatus,
    isConnected,
    
    // Room actions
    joinRoom,
    leaveRoom,
    sendGroupMessage,
    
    // UI State
    shouldFocusInput,
    setShouldFocusInput
  }
}
