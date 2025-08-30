import React from 'react'
import styled from 'styled-components'

interface MenuButtonProps {
  label: string
  isOpen: boolean
  onClick: (e: React.MouseEvent) => void
  textColor?: string
}

const StyledMenuButton = styled.button<{ $isOpen: boolean; $textColor: string }>`
  background: ${props => props.$isOpen ? 'rgba(255, 255, 255, 0.15)' : 'transparent'};
  border: none;
  color: ${props => props.$textColor};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 550;
  border-radius: 6px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Override hover when open to maintain open state styling */
  ${props => props.$isOpen && `
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  `}
`

export const MenuButton: React.FC<MenuButtonProps> = ({ label, isOpen, onClick, textColor = 'white' }) => {
  return (
    <StyledMenuButton 
      $isOpen={isOpen} 
      $textColor={textColor}
      onClick={onClick}
    >
      {label}
    </StyledMenuButton>
  )
}
