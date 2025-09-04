import React from 'react'
import styled from 'styled-components'
import { motion as framerMotion } from 'framer-motion'
import { motion } from '../../design-system'

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

const StyledDropdownItem = styled(framerMotion.div)<{ $hasSubmenu?: boolean }>`
  position: relative;
  width: 100%;
  background: transparent;
  border: none;
  padding: ${props => props.theme.semanticSpacing.interactive.dropdownItemPadding};
  text-align: left;
  color: ${props => props.theme.palette.text.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${props => props.theme.fontSize.sm};
  border-radius: ${props => props.theme.semanticRadii.dropdown.item};
  transition: background-color 0.15s ease;

  &:hover {
    background: ${props => props.theme.palette.interactive.button.ghost.backgroundHover};
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
  color: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? '#b0b0b0' // Light icon color in dark mode
      : '#666' // Dark icon color in light mode
  };
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
      {...motion.presets.itemHover}
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
