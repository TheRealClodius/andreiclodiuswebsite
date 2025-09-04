/**
 * Header Button - Transparent button for headers and menus
 * 
 * Used for menu buttons, logo buttons, and other header controls.
 * Supports text, icons, and active/open states.
 */

import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Theme } from '../../../theme'

// Type for button props without motion conflicts
type ButtonHTMLProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
  'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'>

// Props interface
export interface HeaderButtonProps extends ButtonHTMLProps {
  children: React.ReactNode
  isOpen?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  asMotion?: boolean
}

// Helper function to get button colors
const getButtonColors = (theme: Theme) => {
  return theme.palette.interactive.header
}

// Styled button component
const StyledHeaderButton = styled.button<{
  $isOpen: boolean
}>`
  /* Reset and base styles */
  border: none;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.semanticSpacing.header.logoGap};
  padding: ${({ theme }) => theme.semanticSpacing.header.buttonPadding};
  font-family: ${({ theme }) => theme.fontFamily.sans.join(', ')};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border-radius: ${({ theme }) => theme.radii.sm};
  user-select: none;
  
  /* Use GPU acceleration for smooth performance */
  transform: translate3d(0, 0, 0);
  
  /* Colors and states */
  ${({ theme, $isOpen }) => {
    const colors = getButtonColors(theme)
    return `
      background: ${$isOpen ? colors.backgroundOpen : colors.background};
      color: ${colors.text};
      
      &:hover:not(:disabled) {
        background: ${$isOpen ? colors.backgroundOpen : colors.backgroundHover};
      }
      
      &:active:not(:disabled) {
        background: ${colors.backgroundActive};
      }
    `
  }}
  
  /* Smooth transitions using design tokens */
  transition: all ${({ theme }) => theme.motion.duration.fast}ms ${({ theme }) => theme.motion.easing.easeOut.join(', ')};
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: ${({ theme }) => getButtonColors(theme).textMuted};
  }
  
  /* Focus state */
  &:focus-visible {
    box-shadow: ${({ theme }) => theme.createFocusRing(theme.palette.interactive.focus.ring)};
  }
`

// Motion wrapper
const MotionHeaderButton = motion(StyledHeaderButton)

// Component
export const HeaderButton = forwardRef<HTMLButtonElement, HeaderButtonProps>(({
  children,
  isOpen = false,
  icon,
  iconPosition = 'left',
  asMotion = false,
  ...props
}, ref) => {
  const content = (
    <>
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </>
  )

  if (asMotion) {
    const motionProps = {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { type: "spring" as const, stiffness: 400, damping: 25 }
    }

    return (
      <MotionHeaderButton
        ref={ref}
        $isOpen={isOpen}
        {...motionProps}
        {...props}
      >
        {content}
      </MotionHeaderButton>
    )
  }

  return (
    <StyledHeaderButton
      ref={ref}
      $isOpen={isOpen}
      {...props}
    >
      {content}
    </StyledHeaderButton>
  )
})

HeaderButton.displayName = 'HeaderButton'
