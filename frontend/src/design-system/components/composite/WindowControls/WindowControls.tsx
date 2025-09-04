/**
 * Window Controls - Traffic light button group
 * 
 * A composite component that groups the macOS-style traffic light buttons
 * (close, minimize, maximize) with proper spacing and functionality.
 */

import React from 'react'
import styled from 'styled-components'
import { TrafficLightButton } from '../../primitives'

// Props interface
export interface WindowControlsProps {
  onClose?: () => void
  onMaximize?: () => void
  showIcons?: boolean
  asMotion?: boolean
  className?: string
}

// Styled container for traffic light buttons
const ControlsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.semanticSpacing.window.controlButtonGap};
  align-items: center;
`

// Component
export const WindowControls: React.FC<WindowControlsProps> = ({
  onClose,
  onMaximize,
  showIcons = false,
  asMotion = false,
  className,
}) => {
  return (
    <ControlsContainer className={className}>
      <TrafficLightButton
        variant="close"
        showIcon={showIcons}
        asMotion={asMotion}
        onClick={(e) => {
          e.stopPropagation()
          onClose?.()
        }}
        aria-label="Close window"
      />
      
      <TrafficLightButton
        variant="maximize"
        showIcon={false}
        asMotion={asMotion}
        onClick={(e) => {
          e.stopPropagation()
          onMaximize?.()
        }}
        aria-label="Maximize window"
      />
    </ControlsContainer>
  )
}

WindowControls.displayName = 'WindowControls'
