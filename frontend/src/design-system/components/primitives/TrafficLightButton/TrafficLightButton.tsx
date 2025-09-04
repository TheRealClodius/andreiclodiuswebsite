/**
 * TrafficLight Button - macOS-style window control button
 * 
 * Standard close/minimize/maximize buttons with fixed colors and sizes.
 * Used in window headers for OS-level controls.
 */

import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Theme } from '../../../theme'

// Traffic light button types
export type TrafficLightType = 'close' | 'minimize' | 'maximize'

// Type for button props without motion conflicts and HTML type conflict
type ButtonHTMLProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
  'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'type'>

// Props interface
export interface TrafficLightButtonProps extends ButtonHTMLProps {
  variant: TrafficLightType  // renamed from 'type' to avoid HTML button type conflict
  showIcon?: boolean
  asMotion?: boolean
}

// Helper function to get button colors
const getButtonColors = (theme: Theme, variant: TrafficLightType) => {
  return theme.palette.interactive.trafficLight[variant]
}

// Styled button component
const StyledTrafficLightButton = styled.button<{
  $variant: TrafficLightType
  $showIcon: boolean
}>`
  /* Fixed size for traffic light buttons */
  width: ${({ theme }) => theme.semanticSpacing.window.controlButtonSize};
  height: ${({ theme }) => theme.semanticSpacing.window.controlButtonSize};
  border-radius: 50%;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  outline: none;
  
  /* Colors based on variant */
  ${({ theme, $variant }) => {
    const colors = getButtonColors(theme, $variant)
    return `
      background: ${colors.background};
      
      &:hover:not(:disabled) {
        background: ${colors.backgroundHover};
      }
      
      &:active:not(:disabled) {
        background: ${colors.backgroundActive};
      }
    `
  }}
  
  /* Color transitions using motion tokens */
  transition: background-color ${({ theme }) => theme.motion.duration.slower}ms cubic-bezier(${({ theme }) => theme.motion.easing.easeOut[0]}, ${({ theme }) => theme.motion.easing.easeOut[1]}, ${({ theme }) => theme.motion.easing.easeOut[2]}, ${({ theme }) => theme.motion.easing.easeOut[3]});
  
  &:hover:not(:disabled) {
    transition: background-color ${({ theme }) => theme.motion.duration.normal}ms cubic-bezier(${({ theme }) => theme.motion.easing.easeIn[0]}, ${({ theme }) => theme.motion.easing.easeIn[1]}, ${({ theme }) => theme.motion.easing.easeIn[2]}, ${({ theme }) => theme.motion.easing.easeIn[3]});
  }
  
  /* Icon styling */
  ${({ $showIcon, $variant }) => $showIcon && `
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      
      ${$variant === 'close' ? `
        width: 4px;
        height: 4px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
      ` : $variant === 'minimize' ? `
        width: 6px;
        height: 1px;
        background: rgba(0, 0, 0, 0.6);
      ` : `
        width: 6px;
        height: 6px;
        border: 1px solid rgba(0, 0, 0, 0.6);
        background: transparent;
      `}
    }
  `}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Focus state */
  &:focus-visible {
    box-shadow: ${({ theme }) => theme.createFocusRing(theme.palette.interactive.focus.ring)};
  }
`

// Motion wrapper
const MotionTrafficLightButton = motion(StyledTrafficLightButton)

// Component
export const TrafficLightButton = forwardRef<HTMLButtonElement, TrafficLightButtonProps>(({
  variant,
  showIcon = false,
  asMotion = false,
  ...props
}, ref) => {
  if (asMotion) {
    // Use design system motion tokens for consistency
    const motionProps = {
      transition: { 
        duration: 250 / 1000, // theme.motion.duration.normal converted to seconds
        ease: [0.4, 0, 1, 1] // theme.motion.easing.easeIn
      }
    }

    return (
      <MotionTrafficLightButton
        ref={ref}
        type="button"
        $variant={variant}
        $showIcon={showIcon}
        {...motionProps}
        {...props}
      />
    )
  }

  return (
    <StyledTrafficLightButton
      ref={ref}
      type="button"
      $variant={variant}
      $showIcon={showIcon}
      {...props}
    />
  )
})

TrafficLightButton.displayName = 'TrafficLightButton'
