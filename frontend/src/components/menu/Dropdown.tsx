import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { DropdownItem, DropdownItemData } from './DropdownItem'

interface DropdownProps {
  items: DropdownItemData[]
  onClose?: () => void
}

const DropdownContainer = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  min-width: 180px;
  z-index: 11000;
  overflow: visible;
  padding: 4px 4px 4px 4px;
`

const Submenu = styled(motion.div)`
  position: absolute;
  top: -5px;
  left: 100%;
  background: rgba(255, 255, 255, 0.99);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  min-width: 160px;
  z-index: 11001;
  overflow: hidden;
  padding: 4px 4px 4px 4px;
`

const dropdownVariants = {
  initial: { 
    opacity: 0, 
    y: -2, 
    transformOrigin: "top left"
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
    y: -2, 
    transition: {
      duration: 0.12,
      ease: [0.4, 0, 1, 1],
      staggerChildren: 0.01,
      staggerDirection: -1
    }
  }
}

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

export const Dropdown: React.FC<DropdownProps> = ({ items, onClose }) => {
  const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null)

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
