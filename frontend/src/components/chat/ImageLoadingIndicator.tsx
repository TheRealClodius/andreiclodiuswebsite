import React from 'react'
import styled, { keyframes } from 'styled-components'

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 8px 0;
`

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top: 2px solid #007AFF;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`

const LoadingText = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  animation: ${pulse} 2s ease-in-out infinite;
`

const LoadingDots = styled.span`
  &::after {
    content: '';
    animation: ${pulse} 1.5s ease-in-out infinite;
  }
  
  @keyframes dots {
    0%, 20% { content: ''; }
    40% { content: '.'; }
    60% { content: '..'; }
    80%, 100% { content: '...'; }
  }
  
  &::after {
    animation: dots 2s linear infinite;
  }
`

export const ImageLoadingIndicator: React.FC = () => {
  return (
    <LoadingContainer>
      <LoadingSpinner />
      <LoadingText>
        Generating image<LoadingDots />
      </LoadingText>
    </LoadingContainer>
  )
}
