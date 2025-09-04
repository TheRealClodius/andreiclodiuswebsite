/**
 * Window Header - Complete window header component
 * 
 * A composite component that combines window controls, title, and layout
 * for consistent window header styling across the OS.
 */

import React from 'react'
import styled from 'styled-components'
import { WindowControls } from '../WindowControls'

// Props interface
export interface WindowHeaderProps {
  title: string
  onClose?: () => void
  onMaximize?: () => void
  onMouseDown?: (e: React.MouseEvent) => void
  showIcons?: boolean
  asMotion?: boolean
  children?: React.ReactNode
  className?: string
}

// Styled header container
const HeaderContainer = styled.div`
  height: ${({ theme }) => theme.semanticSpacing.window.headerHeight};
  background: ${({ theme }) => theme.windowColors.headerBackground};
  border-bottom: 1px solid ${({ theme }) => theme.windowColors.headerBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.semanticSpacing.window.headerPadding};
  cursor: grab;
  user-select: none;
  backdrop-filter: blur(20px);

  &:active {
    cursor: grabbing;
  }
`

// Styled title
const WindowTitle = styled.div`
  font-size: ${({ theme }) => theme.semanticTypography.window?.title?.fontSize || theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.semanticTypography.window?.title?.fontWeight || theme.fontWeight.medium};
  color: ${({ theme }) => theme.windowColors.titleColor};
  text-align: center;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

// Spacer for layout balance
const Spacer = styled.div`
  width: ${({ theme }) => theme.semanticSpacing.window.titleSpacing};
  flex-shrink: 0;
`

// Component
export const WindowHeader: React.FC<WindowHeaderProps> = ({
  title,
  onClose,
  onMaximize,
  onMouseDown,
  showIcons = false,
  asMotion = false,
  children,
  className,
}) => {
  return (
    <HeaderContainer onMouseDown={onMouseDown} className={className}>
      <WindowControls
        onClose={onClose}
        onMaximize={onMaximize}
        showIcons={showIcons}
        asMotion={asMotion}
      />
      
      <WindowTitle>{title}</WindowTitle>
      
      {children ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {children}
        </div>
      ) : (
        <Spacer />
      )}
    </HeaderContainer>
  )
}

WindowHeader.displayName = 'WindowHeader'
