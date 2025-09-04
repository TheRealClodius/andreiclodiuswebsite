import React from 'react'
import { HeaderButton } from '../../design-system'

interface MenuButtonProps {
  label: string
  isOpen: boolean
  onClick: (e: React.MouseEvent) => void
  textColor?: string
}

export const MenuButton: React.FC<MenuButtonProps> = ({ label, isOpen, onClick }) => {
  return (
    <HeaderButton
      isOpen={isOpen}
      onClick={onClick}
      asMotion
    >
      {label}
    </HeaderButton>
  )
}