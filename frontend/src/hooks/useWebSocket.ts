import { useCallback, useEffect, useRef, useState } from 'react'

export interface WebSocketMessage {
  type: string
  data?: any
  error?: string
}

export interface UseWebSocketOptions {
  url: string
  onMessage?: (data: any) => void
  reconnectDelay?: number
  heartbeatInterval?: number // Ping interval in ms
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export const useWebSocket = ({ url, onMessage, reconnectDelay = 3000, heartbeatInterval = 30000 }: UseWebSocketOptions) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')
  const wsRef = useRef<WebSocket | null>(null)
  const connectionStatusRef = useRef<ConnectionStatus>('disconnected')
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }
    
    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log('💓 Sending heartbeat ping')
        wsRef.current.send(JSON.stringify({ type: 'ping' }))
      }
    }, heartbeatInterval)
  }, [heartbeatInterval])

  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      console.log('💔 Stopping heartbeat')
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
  }, [])

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
      const ws = new WebSocket(url)
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected')
        setConnectionStatus('connected')
        connectionStatusRef.current = 'connected'
        wsRef.current = ws
        startHeartbeat() // Start sending heartbeat pings
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          // Handle heartbeat responses
          if (data.type === 'pong') {
            console.log('💗 Received heartbeat pong')
            return
          }
          
          // Handle regular messages
          onMessage?.(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      ws.onclose = () => {
        console.log('❌ WebSocket disconnected')
        stopHeartbeat() // Stop heartbeat when connection closes
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
          }, reconnectDelay)
        }
      }
      
      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        stopHeartbeat() // Stop heartbeat on error
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
  }, [url, onMessage, reconnectDelay, startHeartbeat, stopHeartbeat])

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const payload = typeof message === 'string' ? message : JSON.stringify(message)
      console.log('📤 Sending WebSocket message:', payload)
      wsRef.current.send(payload)
      return true
    } else {
      console.error('❌ WebSocket not connected, state:', wsRef.current?.readyState)
      // Try to reconnect
      connectWebSocket()
      return false
    }
  }, [connectWebSocket])

  const disconnect = useCallback(() => {
    console.log('🧹 Disconnecting WebSocket')
    stopHeartbeat() // Stop heartbeat when disconnecting
    connectionStatusRef.current = 'error' // Prevent reconnection
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setConnectionStatus('disconnected')
  }, [stopHeartbeat])

  // Initialize WebSocket connection (only once)
  useEffect(() => {
    connectWebSocket()
    
    // Cleanup on unmount
    return () => {
      disconnect()
    }
  }, []) // Remove connectWebSocket dependency to prevent re-initialization

  return {
    connectionStatus,
    sendMessage,
    disconnect,
    reconnect: connectWebSocket,
    isConnected: connectionStatus === 'connected'
  }
}
