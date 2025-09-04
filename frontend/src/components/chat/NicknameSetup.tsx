import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { motion as framerMotion } from 'framer-motion'
import { Button } from '../../design-system'
import { motion } from '../../design-system'
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

const WelcomeIcon = styled(framerMotion.div)<{ $isDark: boolean }>`
  font-size: 4rem;
  color: ${props => props.$isDark ? '#6366f1' : '#4f46e5'};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Title = styled(framerMotion.h1)<{ $isDark: boolean }>`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f3f4f6' : '#111827'};
  margin: 0 0 0.5rem 0;
  text-align: center;
`

const Subtitle = styled(framerMotion.p)<{ $isDark: boolean }>`
  font-size: 1rem;
  color: ${props => props.$isDark ? '#9ca3af' : '#6b7280'};
  margin: 0 0 2rem 0;
  text-align: center;
  max-width: 400px;
  line-height: 1.5;
`

const NicknameForm = styled(framerMotion.form)`
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

// JoinButton replaced with Button primitive

const StatusMessage = styled(framerMotion.div)<{ $isDark: boolean; $type: 'error' | 'info' | 'warning' }>`
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
          {...motion.presets.statusMessage}
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
          {...motion.presets.statusMessage}
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
          {...motion.presets.statusMessage}
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
        {...motion.presets.scaleIn}
        transition={{ ...motion.presets.scaleIn.transition, delay: 0.1 }}
      >
        <IoChatbubbleEllipses />
      </WelcomeIcon>
      
      <Title 
        $isDark={isDark}
        {...motion.presets.staggered}
        transition={{ ...motion.presets.staggered.transition, delay: 0.2 }}
      >
        Chat with Friends
      </Title>
      
      <Subtitle 
        $isDark={isDark}
        {...motion.presets.staggered}
        transition={{ ...motion.presets.staggered.transition, delay: 0.3 }}
      >
        Join the group chat and connect with up to 20 friends in real-time
      </Subtitle>

      <NicknameForm 
        onSubmit={handleSubmit}
        {...motion.presets.staggered}
        transition={{ ...motion.presets.staggered.transition, delay: 0.4 }}
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
        
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isDisabled}
          loading={status === 'joining'}
          asMotion
        >
          Join Chat
        </Button>
      </NicknameForm>

      {renderStatusMessage()}
    </SetupContainer>
  )
}
