import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { WindowHeader } from '../design-system'
import { useWindowStore, type WindowState as WindowType } from '../stores/windowStore'
import { createResizeHandler, getResizeHandleStyle, RESIZE_DIRECTIONS } from '../os/behaviors'
import { HEADER_HEIGHT } from '../constants/layout'

interface WindowProps {
  window: WindowType
  children: React.ReactNode
  isActive: boolean
}

// Window component using WindowChrome with design system
const WindowContainer = styled(motion.div)<{ $isActive: boolean; $isInteracting: boolean; $isMaximized: boolean; $windowZIndex: number }>`
  position: absolute;
  background: ${props => props.theme.windowColors.background};
  border-radius: ${props => props.$isMaximized ? '0px' : props.theme.semanticRadii.window.base};
  box-shadow: ${props => props.theme.semanticShadows.window.floating};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.windowColors.border};
  overflow: hidden;
  z-index: ${props => props.$windowZIndex};
  transition: ${props => props.$isInteracting ? 'none' : 'all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'};

  &:hover {
    box-shadow: ${props => props.theme.semanticShadows.window.floating};
  }
`

// Resize handle component
const ResizeHandle = styled.div<{ direction: string }>`
  position: absolute;
  ${props => getResizeHandleStyle(props.direction)}
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;

  ${WindowContainer}:hover & {
    opacity: 1;
  }
`

const WindowContent = styled.div`
  height: calc(100% - 32px);
  overflow: hidden;
`

export const Window: React.FC<WindowProps> = ({ window, children, isActive }) => {
  const { 
    updateWindowPosition, 
    closeWindow, 
    focusWindow,
    toggleMaximize
  } = useWindowStore()
  
  // Get theme mode from styled-components theme context
  // This will automatically follow system theme or any active custom theme
  const dragRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isInteracting, setIsInteracting] = useState(false)

  // Create resize handler using the OS behaviors
  const handleResize = createResizeHandler(
    window.id,
    window.position,
    window.isMaximized,
    (id, pos) => {
      setIsInteracting(true)
      updateWindowPosition(id, pos)
    },
    () => setIsInteracting(false), // Reset interaction state when resize ends
    window.constraints
  )

  // Handle maximize with proper focus + toggle behavior
  const handleMaximize = () => {
    focusWindow(window.id) // Bring window to front
    toggleMaximize(window.id)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) {
      focusWindow(window.id)
    }
    
    // Don't allow dragging if window is maximized
    if (window.isMaximized) {
      return
    }
    
    // Calculate offset relative to current window position, not the DOM element
    setDragOffset({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y
    })
    setIsDragging(true)
    setIsInteracting(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragRef.current) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y
        
        // Apply OS-level constraints: windows cannot go above the WindowArea (which is already below header)
        // and should stay within reasonable bounds
        const constrainedX = Math.max(-window.position.width + 100, Math.min(globalThis.innerWidth - 100, newX))
        const constrainedY = Math.max(0, Math.min(globalThis.innerHeight - HEADER_HEIGHT - 100, newY))
        
        updateWindowPosition(window.id, { x: constrainedX, y: constrainedY })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsInteracting(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
      }, [isDragging, dragOffset, window.id, updateWindowPosition])

  return (
    <WindowContainer
      ref={dragRef}
      $isActive={isActive}
      $isInteracting={isInteracting}
      $isMaximized={window.isMaximized}
      $windowZIndex={window.zIndex}
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.position.width,
        height: window.position.height,
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <WindowHeader
        title={window.title}
        onClose={() => closeWindow(window.id)}
        onMaximize={handleMaximize}
        onMouseDown={handleMouseDown}
        showIcons={true}
        asMotion={true}
      />
      <WindowContent>
        {children}
      </WindowContent>
      
      {/* Resize handles for all directions */}
      {!window.isMaximized && RESIZE_DIRECTIONS.map(direction => (
        <ResizeHandle
          key={direction}
          direction={direction}
          onMouseDown={handleResize(direction)}
        />
      ))}
    </WindowContainer>
  )
}