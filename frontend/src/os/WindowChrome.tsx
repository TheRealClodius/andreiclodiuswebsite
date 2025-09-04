import React from 'react'
import styled from 'styled-components'
import { OSWindowState, OSWindowCallbacks } from './types'
import { createWindowTheme, OS_CONSTANTS } from './theme'
import { WindowHeader } from '../design-system'

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

// Remove the old header components - now using design system WindowHeader

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
      {/* OS-level window header using design system */}
      <WindowHeader
        title={window.title}
        onMouseDown={onHeaderMouseDown}
        onClose={() => callbacks.onClose(window.id)}
        onMaximize={() => callbacks.onMaximize(window.id)}
        showIcons
        asMotion
      />
      
      {/* App content goes here */}
      <WindowContent>
        {children}
      </WindowContent>
    </WindowContainer>
  )
}
