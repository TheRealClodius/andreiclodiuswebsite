import React from 'react'
import styled from 'styled-components'
import { HiChevronDown } from 'react-icons/hi'

interface MessageActionsButtonProps {
  onClick: () => void
  className?: string
}

const ActionsButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? '#424242' // Solid dark gray in dark mode
      : '#f5f5f5' // Solid light gray in light mode
  };
  color: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? '#e0e0e0' // Light icon in dark mode
      : '#666666' // Dark icon in light mode
  };
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background-color 0.2s ease, color 0.2s ease;
  box-shadow: 0 2px 4px ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(0, 0, 0, 0.3)' // Subtle shadow in dark mode
      : 'rgba(0, 0, 0, 0.1)' // Subtle shadow in light mode
  };
  
  &:hover {
    background: ${() => 
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? '#424242' // Same background as idle
        : '#f5f5f5' // Same background as idle
    };
    color: ${() => 
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? '#ffffff' // Brighter icon on hover in dark mode
        : '#333333' // Darker icon on hover in light mode
    };
  }
  
  &:active {
    background: ${() => 
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? '#525252' // Slightly lighter on click in dark mode
        : '#e0e0e0' // Slightly darker on click in light mode
    };
    transform: scale(0.95);
  }
`

export const MessageActionsButton: React.FC<MessageActionsButtonProps> = ({ 
  onClick, 
  className 
}) => {
  return (
    <ActionsButton onClick={onClick} className={className}>
      <HiChevronDown size={14} />
    </ActionsButton>
  )
}
