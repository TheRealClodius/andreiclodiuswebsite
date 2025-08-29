import React from 'react'
import styled from 'styled-components'
import { AnimatePresence } from 'framer-motion'
import { MenuButton } from './MenuButton'
import { Dropdown } from './Dropdown'
import { DropdownItemData } from './DropdownItem'

interface MenuItemProps {
  label: string
  items: DropdownItemData[]
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  onHover?: () => void
  hasOpenSibling?: boolean
}

const MenuItemContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

export const MenuItem: React.FC<MenuItemProps> = ({ 
  label, 
  items, 
  isOpen, 
  onToggle, 
  onClose,
  onHover,
  hasOpenSibling
}) => {
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggle()
  }

  const handleMouseEnter = () => {
    if (hasOpenSibling && onHover) {
      onHover()
    }
  }

  return (
    <MenuItemContainer onMouseEnter={handleMouseEnter}>
      <MenuButton 
        label={label}
        isOpen={isOpen}
        onClick={handleButtonClick}
      />
      
      <AnimatePresence>
        {isOpen && (
          <Dropdown 
            items={items}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    </MenuItemContainer>
  )
}
