import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { WindowState, useWindowStore } from '../stores/windowStore'
import { createDragHandler, createResizeHandler, getResizeHandleStyle } from '../os/behaviors'

interface WindowProps {
  window: WindowState
  children: React.ReactNode
  isDark?: boolean
}

// Main window container with OS-level styling and animations
const WindowContainer = styled(motion.div)<{ $isMaximized: boolean; $zIndex: number; $isInteracting: boolean; $isDark: boolean }>`
  position: fixed;
  background: ${props => props.$isDark ? 'rgba(26, 26, 26, 0.98)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.$isDark ? 'rgba(60, 60, 60, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: ${props => props.$isMaximized ? '0px' : '12px'};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: ${props => props.$zIndex};

  /* Smooth but snappy transitions for maximize/minimize (disabled during interaction) */
  transition: ${props => props.$isInteracting ? 'none' : 'all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'};

  ${props => props.$isMaximized && `
    border-radius: 0;
    border: none;
  `}
`

const WindowHeader = styled.div<{ $isDark: boolean }>`
  height: 32px;
  background: transparent;
  border-bottom: 1px solid ${props => props.$isDark ? 'rgba(60, 60, 60, 0.3)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  cursor: grab;
  user-select: none;
  backdrop-filter: blur(20px);

  &:active {
    cursor: grabbing;
  }
`

const WindowTitle = styled.div<{ $isDark: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.$isDark ? '#e0e0e0' : '#333'};
  text-align: center;
  flex: 1;
`

const WindowControls = styled.div`
  display: flex;
  gap: 8px;
`

const ControlButton = styled.button<{ $hoverColor: string; $isDark: boolean; $showIcon?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  cursor: pointer;
  transition: background-color 0.6s ease;
  flex-shrink: 0;
  padding: 4px;
  position: relative;
  
  &:hover {
    background: ${props => props.$hoverColor};
    transition: background-color 0.2s ease;
  }

  ${props => props.$showIcon && `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 4px;
      height: 4px;
      background: rgba(0, 0, 0, 1);
      border-radius: 50%;
    }
  `}
`

const WindowContent = styled.div`
  height: calc(100% - 32px);
  overflow: auto;
`

// OS-level resize handles
const ResizeHandle = styled.div<{ $direction: string }>`
  position: absolute;
  z-index: 10;
  ${props => getResizeHandleStyle(props.$direction)}
`

export const Window: React.FC<WindowProps> = ({ window, children, isDark = false }) => {
  const [isInteracting, setIsInteracting] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)
  
  const { 
    closeWindow, 
    focusWindow, 
    updateWindowPosition, 
    toggleMaximize 
  } = useWindowStore()

  // Create OS-level drag handler that also manages interaction state
  const handleMouseDown = createDragHandler(
    window.id,
    window.position,
    window.isMaximized,
    (id, pos) => {
      setIsInteracting(true)
      updateWindowPosition(id, pos)
    },
    focusWindow,
    () => setIsInteracting(false) // Reset interaction state when drag ends
  )

  // Create OS-level resize handler that also manages interaction state  
  const handleResize = createResizeHandler(
    window.id,
    window.position,
    window.isMaximized,
    (id, pos) => {
      setIsInteracting(true)
      updateWindowPosition(id, pos)
    },
    () => setIsInteracting(false) // Reset interaction state when resize ends
  )

  const handleWindowClick = () => {
    focusWindow(window.id)
  }

  if (window.isMinimized) {
    return null
  }

  return (
    <WindowContainer
      ref={windowRef}
      $isMaximized={window.isMaximized}
      $zIndex={window.zIndex}
      $isInteracting={isInteracting}
      $isDark={isDark}
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.position.width,
        height: window.position.height
      }}
      onClick={handleWindowClick}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <WindowHeader onMouseDown={handleMouseDown} $isDark={isDark}>
        <WindowControls>
          <ControlButton 
            $hoverColor="#ff5f57"
            $isDark={isDark}
            $showIcon={true}
            onClick={(e) => {
              e.stopPropagation()
              closeWindow(window.id)
            }}
          />

          <ControlButton 
            $hoverColor="#28ca42"
            $isDark={isDark}
            onClick={(e) => {
              e.stopPropagation()
              focusWindow(window.id) // Bring window to front
              toggleMaximize(window.id)
            }}
          />
        </WindowControls>
        <WindowTitle $isDark={isDark}>{window.title}</WindowTitle>
        <div style={{ width: '32px' }} /> {/* Spacer for center alignment */}
      </WindowHeader>
      
      <WindowContent>
        {children}
      </WindowContent>
      
      {!window.isMaximized && (
        <>
          {/* Edge handles */}
          <ResizeHandle $direction="n" onMouseDown={handleResize('n')} />
          <ResizeHandle $direction="s" onMouseDown={handleResize('s')} />
          <ResizeHandle $direction="e" onMouseDown={handleResize('e')} />
          <ResizeHandle $direction="w" onMouseDown={handleResize('w')} />
          
          {/* Corner handles */}
          <ResizeHandle $direction="ne" onMouseDown={handleResize('ne')} />
          <ResizeHandle $direction="nw" onMouseDown={handleResize('nw')} />
          <ResizeHandle $direction="se" onMouseDown={handleResize('se')} />
          <ResizeHandle $direction="sw" onMouseDown={handleResize('sw')} />
        </>
      )}
    </WindowContainer>
  )
}
