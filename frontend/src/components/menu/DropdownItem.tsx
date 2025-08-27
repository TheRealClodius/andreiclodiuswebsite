import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

export interface DropdownItemData {
  id: string
  label: string
  onClick?: () => void
  submenu?: DropdownItemData[]
  icon?: React.ComponentType<{ size?: number; className?: string }>
}

interface DropdownItemProps {
  item: DropdownItemData
  onHover?: (itemId: string | null) => void
  children?: React.ReactNode
}

const StyledDropdownItem = styled(motion.div)<{ $hasSubmenu?: boolean }>`
  position: relative;
  width: 100%;
  background: transparent;
  border: none;
  padding: 4px 6px;
  text-align: left;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  border-radius: 3px;
  transition: background-color 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
`

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  color: #666;
`

const SubmenuIndicator = styled.span`
  font-size: 12px;
  opacity: 0.6;
`

export const DropdownItem: React.FC<DropdownItemProps> = ({ 
  item, 
  onHover, 
  children 
}) => {
  const hasSubmenu = item.submenu && item.submenu.length > 0

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!hasSubmenu && item.onClick) {
      item.onClick()
    }
  }

  const handleMouseEnter = () => {
    if (hasSubmenu && onHover) {
      onHover(item.id)
    }
  }

  const handleMouseLeave = () => {
    if (hasSubmenu && onHover) {
      onHover(null)
    }
  }

  return (
    <StyledDropdownItem
      $hasSubmenu={hasSubmenu}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        scale: 1,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25, 
          mass: 0.3 
        } 
      }}
      whileTap={{ 
        scale: 1,
        transition: { duration: 0.1 }
      }}
    >
      <ItemContent>
        {item.icon && (
          <IconWrapper>
            <item.icon size={14} />
          </IconWrapper>
        )}
        {item.label}
      </ItemContent>
      {hasSubmenu && <SubmenuIndicator>▶</SubmenuIndicator>}
      {children}
    </StyledDropdownItem>
  )
}
