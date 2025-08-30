import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
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

const DropdownContainer = styled(motion.div)<{ $position: DropdownPosition }>`
  position: absolute;
  ${props => props.$position.top !== undefined ? `top: ${props.$position.top}px;` : ''}
  ${props => props.$position.bottom !== undefined ? `bottom: ${props.$position.bottom}px;` : ''}
  ${props => props.$position.left !== undefined ? `left: ${props.$position.left}px;` : ''}
  ${props => props.$position.right !== undefined ? `right: ${props.$position.right}px;` : ''}
  transform-origin: ${props => props.$position.transformOrigin};
  background: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(42, 42, 42, 0.95)' // Dark background in dark mode
      : 'rgba(255, 255, 255, 0.95)' // Light background in light mode
  };
  backdrop-filter: blur(20px);
  border: 1px solid ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(255, 255, 255, 0.1)' // Light border in dark mode
      : 'rgba(0, 0, 0, 0.1)' // Dark border in light mode
  };
  border-radius: 8px;
  box-shadow: 0 8px 32px ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(0, 0, 0, 0.5)' // Stronger shadow in dark mode
      : 'rgba(0, 0, 0, 0.3)' // Normal shadow in light mode
  };
  min-width: 180px;
  z-index: 11000;
  overflow: visible;
  padding: 4px 4px 4px 4px;
`

const Submenu = styled(motion.div)`
  position: absolute;
  top: -5px;
  left: 100%;
  background: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(42, 42, 42, 0.99)' // Dark background in dark mode
      : 'rgba(255, 255, 255, 0.99)' // Light background in light mode
  };
  border: 1px solid ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(255, 255, 255, 0.1)' // Light border in dark mode
      : 'rgba(0, 0, 0, 0.1)' // Dark border in light mode
  };
  border-radius: 8px;
  box-shadow: 0 8px 32px ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(0, 0, 0, 0.5)' // Stronger shadow in dark mode
      : 'rgba(0, 0, 0, 0.3)' // Normal shadow in light mode
  };
  min-width: 160px;
  z-index: 11001;
  overflow: hidden;
  padding: 4px 4px 4px 4px;
`

const createDropdownVariants = (transformOrigin: string) => ({
  initial: { 
    opacity: 0, 
    y: transformOrigin.includes('bottom') ? 2 : -2, 
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 0.5,
      opacity: { duration: 0.15 },
      staggerChildren: 0.02,
      delayChildren: 0.01
    }
  },
  exit: { 
    opacity: 0, 
    y: transformOrigin.includes('bottom') ? 2 : -2,
    scale: 0.95,
    transition: {
      duration: 0.12,
      ease: [0.4, 0, 1, 1],
      staggerChildren: 0.01,
      staggerDirection: -1
    }
  }
})

const dropdownItemVariants = {
  initial: { 
    opacity: 0, 
    x: 0,
    transition: { duration: 0.1 }
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      mass: 0.3
    }
  },
  exit: { 
    opacity: 0, 
    x: -2,
    transition: { 
      duration: 0.08,
      ease: [0.4, 0, 1, 1]
    }
  }
}

const submenuVariants = {
  initial: { 
    opacity: 0, 
    x: -2, 
    transformOrigin: "left center"
  },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 450,
      damping: 22,
      mass: 0.4,
      opacity: { duration: 0.12 },
      staggerChildren: 0.015,
      delayChildren: 0.005
    }
  },
  exit: { 
    opacity: 0, 
    x: -2, 
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 1, 1],
      staggerChildren: 0.008,
      staggerDirection: -1
    }
  }
}

const submenuItemVariants = {
  initial: { 
    opacity: 0, 
    x: -2,
    transition: { duration: 0.08 }
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 600,
      damping: 35,
      mass: 0.2
    }
  },
  exit: { 
    opacity: 0, 
    x: -2,
    transition: { 
      duration: 0.06,
      ease: [0.4, 0, 1, 1]
    }
  }
}

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

  const dropdownVariants = createDropdownVariants(position.transformOrigin)

  const handleItemClick = (item: DropdownItemData) => {
    if (!item.submenu && item.onClick) {
      item.onClick()
      onClose?.()
    }
  }

  const createSubmenuItems = (submenuItems: DropdownItemData[]) => {
    return submenuItems.map(subItem => (
      <motion.div
        key={subItem.id}
        variants={submenuItemVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <DropdownItem
          item={{
            ...subItem,
            onClick: () => handleItemClick(subItem)
          }}
        />
      </motion.div>
    ))
  }

  return (
    <DropdownContainer
      ref={dropdownRef}
      $position={position}
      variants={dropdownVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {items.map(item => (
        <motion.div
          key={item.id}
          variants={dropdownItemVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <DropdownItem
            item={item}
            onHover={setHoveredSubmenu}
          >
            <AnimatePresence>
              {item.submenu && hoveredSubmenu === item.id && (
                <Submenu
                  variants={submenuVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {createSubmenuItems(item.submenu)}
                </Submenu>
              )}
            </AnimatePresence>
          </DropdownItem>
        </motion.div>
      ))}
    </DropdownContainer>
  )
}
