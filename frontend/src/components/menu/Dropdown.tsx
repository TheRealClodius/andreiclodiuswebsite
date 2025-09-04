import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { motion as framerMotion, AnimatePresence } from 'framer-motion'
import { motion } from '../../design-system'
import { DropdownItem, DropdownItemData } from './DropdownItem'

interface DropdownProps {
  items: DropdownItemData[]
  onClose?: () => void
  enableSmartPositioning?: boolean
}

interface DropdownPosition {
  top?: number
  bottom?: number
  left?: number
  right?: number
  transformOrigin: string
}

const DropdownContainer = styled(framerMotion.div)<{ $position: DropdownPosition }>`
  position: absolute;
  ${props => props.$position.top !== undefined ? `top: ${props.$position.top}px;` : ''}
  ${props => props.$position.bottom !== undefined ? `bottom: ${props.$position.bottom}px;` : ''}
  ${props => props.$position.left !== undefined ? `left: ${props.$position.left}px;` : ''}
  ${props => props.$position.right !== undefined ? `right: ${props.$position.right}px;` : ''}
  transform-origin: ${props => props.$position.transformOrigin};
  background: ${props => props.theme.palette.background.elevated};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.palette.border.default};
  border-radius: ${props => props.theme.semanticRadii.dropdown.base};
  box-shadow: ${props => props.theme.semanticShadows.dropdown.floating};
  min-width: 180px;
  z-index: 11000;
  overflow: visible;
  padding: ${props => props.theme.semanticSpacing.interactive.dropdownPadding};
`

const Submenu = styled(framerMotion.div)`
  position: absolute;
  top: -5px;
  left: 100%;
  background: ${props => props.theme.palette.background.elevated};
  border: 1px solid ${props => props.theme.palette.border.default};
  border-radius: ${props => props.theme.semanticRadii.menu.base};
  box-shadow: ${props => props.theme.semanticShadows.dropdown.floating};
  min-width: 160px;
  z-index: 11001;
  overflow: hidden;
  padding: ${props => props.theme.semanticSpacing.interactive.dropdownPadding};
`









export const Dropdown: React.FC<DropdownProps> = ({ items, onClose, enableSmartPositioning = false }) => {
  const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null)
  const [position, setPosition] = useState<DropdownPosition>({
    top: 33,
    left: 0,
    transformOrigin: 'top left'
  })
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Smart positioning logic (only when enabled)
  useEffect(() => {
    if (!enableSmartPositioning) return
    if (!dropdownRef.current) return

    const calculateOptimalPosition = (): DropdownPosition => {
      const dropdown = dropdownRef.current!
      const parent = dropdown.offsetParent as HTMLElement
      
      if (!parent) return position

      // Get container bounds (window or closest scrollable parent)
      const container = parent.closest('[data-window-content]') || document.documentElement
      const containerRect = container.getBoundingClientRect()
      const parentRect = parent.getBoundingClientRect()
      
      // Dropdown dimensions (approximate)
      const dropdownWidth = 180
      const dropdownHeight = items.length * 40 + 8 // Approximate item height + padding
      
      // Available space in each direction
      const spaceBelow = containerRect.bottom - parentRect.bottom
      const spaceAbove = parentRect.top - containerRect.top
      const spaceRight = containerRect.right - parentRect.left
      const spaceLeft = parentRect.right - containerRect.left
      
      // Determine vertical placement
      const shouldPlaceAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow
      
      // Determine horizontal placement
      const shouldPlaceLeft = spaceRight < dropdownWidth && spaceLeft > spaceRight
      
      // Calculate position
      const newPosition: DropdownPosition = {
        transformOrigin: ''
      }
      
      if (shouldPlaceAbove) {
        newPosition.bottom = 26
        newPosition.transformOrigin += 'bottom'
      } else {
        newPosition.top = 26
        newPosition.transformOrigin += 'top'
      }
      
      if (shouldPlaceLeft) {
        newPosition.right = 0
        newPosition.transformOrigin += ' right'
      } else {
        newPosition.left = 0
        newPosition.transformOrigin += ' left'
      }
      
      return newPosition
    }

    const newPosition = calculateOptimalPosition()
    setPosition(newPosition)
  }, [items.length, enableSmartPositioning])

  // Dropdown animations now handled by motion tokens

  const handleItemClick = (item: DropdownItemData) => {
    if (!item.submenu && item.onClick) {
      item.onClick()
      onClose?.()
    }
  }

  const createSubmenuItems = (submenuItems: DropdownItemData[]) => {
    return submenuItems.map(subItem => (
              <framerMotion.div
          key={subItem.id}
          {...motion.presets.submenuSlide}
        >
          <DropdownItem
            item={{
              ...subItem,
              onClick: () => handleItemClick(subItem)
            }}
          />
        </framerMotion.div>
    ))
  }

  return (
    <DropdownContainer
      ref={dropdownRef}
      $position={position}
      {...motion.presets.dropdownEntrance}
    >
      {items.map(item => (
        <framerMotion.div
          key={item.id}
          {...motion.presets.dropdownItem}
        >
          <DropdownItem
            item={item}
            onHover={setHoveredSubmenu}
          >
            <AnimatePresence>
              {item.submenu && hoveredSubmenu === item.id && (
                <Submenu
                  {...motion.presets.submenuSlide}
                >
                  {createSubmenuItems(item.submenu)}
                </Submenu>
              )}
            </AnimatePresence>
          </DropdownItem>
        </framerMotion.div>
      ))}
    </DropdownContainer>
  )
}
