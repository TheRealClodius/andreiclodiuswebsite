import React from 'react'
import { HiChevronDown } from 'react-icons/hi'
import styled from 'styled-components'

interface MessageActionsButtonProps {
  onClick: () => void
  className?: string
  isOnUserBubble?: boolean  // Whether this button is on a user (blue) bubble
}

const StyledActionsButton = styled.button<{ $isOnUserBubble?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.semanticRadii.button.small};
  padding: 0;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fontFamily.sans.join(', ')};
  
  /* Always visible when bubble is hovered - adapt colors based on bubble type */
  background: ${({ theme, $isOnUserBubble }) => $isOnUserBubble 
    ? theme.palette.chat.messageActions.userBackground
    : theme.palette.chat.messageActions.assistantBackground
  };
  color: ${({ theme, $isOnUserBubble }) => $isOnUserBubble 
    ? theme.palette.chat.messageActions.userText
    : theme.palette.chat.messageActions.assistantText
  };
  
  /* Subtle hover state for additional feedback */
  &:hover {
    background: ${({ theme, $isOnUserBubble }) => $isOnUserBubble 
      ? theme.palette.chat.messageActions.userBackgroundHover
      : theme.palette.chat.messageActions.assistantBackgroundHover
    };
    transform: scale(1.05);
  }
  
  /* Active state */
  &:active {
    transform: scale(0.95);
  }
  
  /* Smooth transitions */
  transition: all ${({ theme }) => theme.motion.duration.fast}ms ${({ theme }) => theme.motion.easing.easeOut.join(', ')};
  
  /* Focus ring for accessibility */
  &:focus-visible {
    box-shadow: ${({ theme }) => theme.createFocusRing(theme.palette.interactive.focus.ring)};
    outline: none;
  }
`

export const MessageActionsButton: React.FC<MessageActionsButtonProps> = ({ 
  onClick, 
  className,
  isOnUserBubble = false
}) => {
  return (
    <StyledActionsButton
      onClick={onClick}
      className={className}
      $isOnUserBubble={isOnUserBubble}
      aria-label="Message actions"
    >
      <HiChevronDown size={14} />
    </StyledActionsButton>
  )
}