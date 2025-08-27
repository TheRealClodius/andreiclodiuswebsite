import React from 'react'
import styled from 'styled-components'
import { OSWindowState, OSWindowCallbacks } from './types'
import { createWindowTheme, OS_CONSTANTS } from './theme'

interface WindowChromeProps {
  window: OSWindowState
  callbacks: OSWindowCallbacks
  isDark?: boolean
  isInteracting?: boolean
  onHeaderMouseDown: (e: React.MouseEvent) => void
  children: React.ReactNode
}

// OS-level window container - single source of truth for all windows
const WindowContainer = styled.div<{ 
  $theme: ReturnType<typeof createWindowTheme>
  $isMaximized: boolean
  $zIndex: number
  $isInteracting: boolean 
}>`
  position: fixed;
  background: ${props => props.$theme.background};
  backdrop-filter: blur(20px);
  border: ${props => props.$theme.border};
  border-radius: ${props => props.$isMaximized ? '0px' : `${OS_CONSTANTS.BORDER_RADIUS}px`};
  box-shadow: ${props => props.$theme.shadow};
  overflow: hidden;
  z-index: ${props => props.$zIndex};

  /* OS-level smooth transitions - disabled during user interaction */
  transition: ${props => props.$isInteracting ? 'none' : `all ${OS_CONSTANTS.ANIMATIONS.DURATION} ${OS_CONSTANTS.ANIMATIONS.EASING}`};

  ${props => props.$isMaximized && `
    border-radius: 0;
    border: none;
  `}
`

// OS-level window header - single source of truth
const WindowHeader = styled.div<{ $theme: ReturnType<typeof createWindowTheme> }>`
  height: ${OS_CONSTANTS.HEADER_HEIGHT}px;
  background: ${props => props.$theme.headerBackground};
  border-bottom: ${props => props.$theme.headerBorder};
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

// OS-level window title
const WindowTitle = styled.div<{ $theme: ReturnType<typeof createWindowTheme> }>`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.$theme.titleColor};
  text-align: center;
  flex: 1;
`

// OS-level traffic light controls
const WindowControls = styled.div`
  display: flex;
  gap: ${OS_CONSTANTS.CONTROL_BUTTON_GAP}px;
`

// OS-level control button
const ControlButton = styled.button<{ $color: string }>`
  width: ${OS_CONSTANTS.CONTROL_BUTTON_SIZE}px;
  height: ${OS_CONSTANTS.CONTROL_BUTTON_SIZE}px;
  border-radius: 50%;
  border: none;
  background: ${props => props.$color};
  cursor: pointer;
  opacity: 0.9;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    opacity: 1;
  }
`

// Window content area
const WindowContent = styled.div`
  height: calc(100% - ${OS_CONSTANTS.HEADER_HEIGHT}px);
  overflow: auto;
`

export const WindowChrome: React.FC<WindowChromeProps> = ({
  window,
  callbacks,
  isDark = false,
  isInteracting = false,
  onHeaderMouseDown,
  children
}) => {
  // Create theme by merging OS defaults with app-specific overrides
  const theme = createWindowTheme(isDark, window.themeOverrides)

  return (
    <WindowContainer
      $theme={theme}
      $isMaximized={window.isMaximized}
      $zIndex={window.zIndex}
      $isInteracting={isInteracting}
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.position.width,
        height: window.position.height
      }}
      onClick={() => callbacks.onFocus(window.id)}
    >
      {/* OS-level window header */}
      <WindowHeader onMouseDown={onHeaderMouseDown} $theme={theme}>
        <WindowControls>
          <ControlButton 
            $color="#ff5f57" 
            onClick={(e) => {
              e.stopPropagation()
              callbacks.onClose(window.id)
            }}
          />
          <ControlButton 
            $color="#ffbd2e" 
            onClick={(e) => {
              e.stopPropagation()
              callbacks.onMinimize(window.id)
            }}
          />
          <ControlButton 
            $color="#28ca42" 
            onClick={(e) => {
              e.stopPropagation()
              callbacks.onMaximize(window.id)
            }}
          />
        </WindowControls>
        <WindowTitle $theme={theme}>{window.title}</WindowTitle>
        <div style={{ width: '32px' }} /> {/* Spacer for center alignment */}
      </WindowHeader>
      
      {/* App content goes here */}
      <WindowContent>
        {children}
      </WindowContent>
    </WindowContainer>
  )
}
