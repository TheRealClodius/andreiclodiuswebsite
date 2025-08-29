import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { IoChatbubbleEllipses, IoWarning, IoPeople } from 'react-icons/io5'
import { useSystemTheme } from '../../hooks/useSystemTheme'

interface NicknameSetupProps {
  onSubmit: (nickname: string) => void
  status: 'idle' | 'joining' | 'full' | 'joined'
  isConnected: boolean
}

const SetupContainer = styled.div<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  background: ${props => props.$isDark ? 'rgba(26, 26, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)'};
`

const WelcomeIcon = styled(motion.div)<{ $isDark: boolean }>`
  font-size: 4rem;
  color: ${props => props.$isDark ? '#6366f1' : '#4f46e5'};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Title = styled(motion.h1)<{ $isDark: boolean }>`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f3f4f6' : '#111827'};
  margin: 0 0 0.5rem 0;
  text-align: center;
`

const Subtitle = styled(motion.p)<{ $isDark: boolean }>`
  font-size: 1rem;
  color: ${props => props.$isDark ? '#9ca3af' : '#6b7280'};
  margin: 0 0 2rem 0;
  text-align: center;
  max-width: 400px;
  line-height: 1.5;
`

const NicknameForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
  gap: 1rem;
`

const NicknameInput = styled.input<{ $isDark: boolean }>`
  padding: 0.875rem 1rem;
  border: 2px solid ${props => props.$isDark ? 'rgba(75, 85, 99, 0.4)' : 'rgba(209, 213, 219, 0.8)'};
  border-radius: 12px;
  background: ${props => props.$isDark ? 'rgba(17, 24, 39, 0.4)' : 'rgba(255, 255, 255, 0.8)'};
  color: ${props => props.$isDark ? '#f3f4f6' : '#111827'};
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$isDark ? '#6366f1' : '#4f46e5'};
    box-shadow: 0 0 0 3px ${props => props.$isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)'};
  }
  
  &::placeholder {
    color: ${props => props.$isDark ? '#6b7280' : '#9ca3af'};
  }
`

const JoinButton = styled.button<{ $isDark: boolean; $disabled: boolean }>`
  padding: 0.875rem 1.5rem;
  background: ${props => props.$disabled ? 
    (props.$isDark ? 'rgba(75, 85, 99, 0.4)' : 'rgba(156, 163, 175, 0.5)') :
    (props.$isDark ? '#6366f1' : '#4f46e5')};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  ${props => !props.$disabled && `
    &:hover {
      background: ${props.$isDark ? '#5b58eb' : '#4338ca'};
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`

const StatusMessage = styled(motion.div)<{ $isDark: boolean; $type: 'error' | 'info' | 'warning' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-top: 1rem;
  
  background: ${props => {
    if (props.$type === 'error') return props.$isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.8)'
    if (props.$type === 'warning') return props.$isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(254, 243, 199, 0.8)'
    return props.$isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(219, 234, 254, 0.8)'
  }};
  
  color: ${props => {
    if (props.$type === 'error') return props.$isDark ? '#fca5a5' : '#dc2626'
    if (props.$type === 'warning') return props.$isDark ? '#fbbf24' : '#d97706'
    return props.$isDark ? '#93c5fd' : '#2563eb'
  }};
  
  border: 1px solid ${props => {
    if (props.$type === 'error') return props.$isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.3)'
    if (props.$type === 'warning') return props.$isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.3)'
    return props.$isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.3)'
  }};
`

export const NicknameSetup: React.FC<NicknameSetupProps> = ({ 
  onSubmit, 
  status, 
  isConnected 
}) => {
  const [nickname, setNickname] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const isDark = useSystemTheme()

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedNickname = nickname.trim()
    
    if (trimmedNickname && status !== 'joining') {
      onSubmit(trimmedNickname)
    }
  }

  const renderStatusMessage = () => {
    if (!isConnected) {
      return (
        <StatusMessage 
          $isDark={isDark} 
          $type="warning"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <IoWarning />
          Chat server not available - Backend not implemented yet
        </StatusMessage>
      )
    }

    if (status === 'joining') {
      return (
        <StatusMessage 
          $isDark={isDark} 
          $type="info"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <IoPeople />
          Joining chat room...
        </StatusMessage>
      )
    }

    if (status === 'full') {
      return (
        <StatusMessage 
          $isDark={isDark} 
          $type="error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <IoWarning />
          Chat is full for now, sorry! (20 users max)
        </StatusMessage>
      )
    }

    return null
  }

  const isDisabled = !nickname.trim() || status === 'joining'

  return (
    <SetupContainer $isDark={isDark}>
      <WelcomeIcon 
        $isDark={isDark}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <IoChatbubbleEllipses />
      </WelcomeIcon>
      
      <Title 
        $isDark={isDark}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Chat with Friends
      </Title>
      
      <Subtitle 
        $isDark={isDark}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Join the group chat and connect with up to 20 friends in real-time
      </Subtitle>

      <NicknameForm 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <NicknameInput
          ref={inputRef}
          type="text"
          placeholder="Enter your nickname..."
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          $isDark={isDark}
          disabled={status === 'joining'}
        />
        
        <JoinButton
          type="submit"
          $isDark={isDark}
          $disabled={isDisabled}
          disabled={isDisabled}
        >
          {status === 'joining' ? 'Joining...' : 'Join Chat'}
        </JoinButton>
      </NicknameForm>

      {renderStatusMessage()}
    </SetupContainer>
  )
}
