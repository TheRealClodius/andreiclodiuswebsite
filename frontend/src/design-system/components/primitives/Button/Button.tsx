/**
 * Button - Primitive button component
 * 
 * A foundational button component that uses design tokens for all styling.
 * Supports multiple variants, sizes, and interaction states.
 */

import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Theme } from '../../../theme'

// Button variant types
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

// Button props interface
export interface ButtonProps extends ButtonHTMLProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  asMotion?: boolean // Enable Framer Motion animations
}

// Helper function to get variant colors
const getVariantColors = (theme: Theme, variant: ButtonVariant) => {
  const { palette } = theme
  
  switch (variant) {
    case 'primary':
      return {
        background: palette.interactive.button.primary.background,
        backgroundHover: palette.interactive.button.primary.backgroundHover,
        backgroundActive: palette.interactive.button.primary.backgroundActive,
        backgroundDisabled: palette.interactive.button.primary.backgroundDisabled,
        text: palette.interactive.button.primary.text,
        textDisabled: palette.interactive.button.primary.textDisabled,
        border: palette.interactive.button.primary.border,
        borderHover: palette.interactive.button.primary.borderHover,
      }
    case 'secondary':
      return {
        background: palette.interactive.button.secondary.background,
        backgroundHover: palette.interactive.button.secondary.backgroundHover,
        backgroundActive: palette.interactive.button.secondary.backgroundActive,
        backgroundDisabled: palette.interactive.button.secondary.backgroundDisabled,
        text: palette.interactive.button.secondary.text,
        textDisabled: palette.interactive.button.secondary.textDisabled,
        border: palette.interactive.button.secondary.border,
        borderHover: palette.interactive.button.secondary.borderHover,
      }
    case 'ghost':
      return {
        background: 'transparent',
        backgroundHover: palette.interactive.button.ghost.backgroundHover,
        backgroundActive: palette.interactive.button.ghost.backgroundActive,
        backgroundDisabled: 'transparent',
        text: palette.interactive.button.ghost.text,
        textDisabled: palette.interactive.button.ghost.textDisabled,
        border: 'transparent',
        borderHover: 'transparent',
      }
    case 'danger':
      return {
        background: palette.interactive.button.danger.background,
        backgroundHover: palette.interactive.button.danger.backgroundHover,
        backgroundActive: palette.interactive.button.danger.backgroundActive,
        backgroundDisabled: palette.interactive.button.danger.backgroundDisabled,
        text: palette.interactive.button.danger.text,
        textDisabled: palette.interactive.button.danger.textDisabled,
        border: palette.interactive.button.danger.border,
        borderHover: palette.interactive.button.danger.borderHover,
      }
    default:
      return getVariantColors(theme, 'primary')
  }
}

// Helper function to get size styles
const getSizeStyles = (theme: Theme, size: ButtonSize) => {
  const { semanticSpacing, semanticTypography, radii } = theme
  
  switch (size) {
    case 'sm':
      return {
        padding: semanticSpacing.component.buttonPadding.sm,
        fontSize: semanticTypography.button.sm.fontSize,
        fontWeight: semanticTypography.button.sm.fontWeight,
        lineHeight: semanticTypography.button.sm.lineHeight,
        borderRadius: radii.sm,
        minHeight: semanticSpacing.component.buttonMinHeight?.sm || theme.spacing[8],
      }
    case 'lg':
      return {
        padding: semanticSpacing.component.buttonPadding.lg,
        fontSize: semanticTypography.button.lg.fontSize,
        fontWeight: semanticTypography.button.lg.fontWeight,
        lineHeight: semanticTypography.button.lg.lineHeight,
        borderRadius: radii.md,
        minHeight: semanticSpacing.component.buttonMinHeight?.lg || theme.spacing[12],
      }
    case 'md':
    default:
      return {
        padding: semanticSpacing.component.buttonPadding.md,
        fontSize: semanticTypography.button.base.fontSize,
        fontWeight: semanticTypography.button.base.fontWeight,
        lineHeight: semanticTypography.button.base.lineHeight,
        borderRadius: radii.md,
        minHeight: semanticSpacing.component.buttonMinHeight?.md || theme.spacing[10],
      }
  }
}

// Styled button component
const StyledButton = styled.button<{
  $variant: ButtonVariant
  $size: ButtonSize
  $fullWidth: boolean
  $loading: boolean
}>`
  /* Reset and base styles */
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border: none;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fontFamily.sans.join(', ')};
  text-decoration: none;
  outline: none;
  transition: all ${({ theme }) => theme.motion.duration.fast}ms ${({ theme }) => theme.motion.easing.easeOut.join(', ')};
  user-select: none;
  white-space: nowrap;
  
  /* Size-based styles */
  ${({ theme, $size }) => {
    const styles = getSizeStyles(theme, $size)
    return `
      padding: ${styles.padding};
      font-size: ${styles.fontSize};
      font-weight: ${styles.fontWeight};
      line-height: ${styles.lineHeight};
      border-radius: ${styles.borderRadius};
      min-height: ${styles.minHeight};
    `
  }}
  
  /* Variant-based styles */
  ${({ theme, $variant }) => {
    const colors = getVariantColors(theme, $variant)
    return `
      background-color: ${colors.background};
      color: ${colors.text};
      border: 1px solid ${colors.border};
    `
  }}
  
  /* Full width */
  ${({ $fullWidth }) => $fullWidth && `
    width: 100%;
  `}
  
  /* Loading state */
  ${({ $loading }) => $loading && `
    pointer-events: none;
  `}
  
  /* Hover state */
  &:hover:not(:disabled) {
    ${({ theme, $variant }) => {
      const colors = getVariantColors(theme, $variant)
      return `
        background-color: ${colors.backgroundHover};
        border-color: ${colors.borderHover};
        transform: translateY(-1px);
      `
    }}
  }
  
  /* Active state */
  &:active:not(:disabled) {
    ${({ theme, $variant }) => {
      const colors = getVariantColors(theme, $variant)
      return `
        background-color: ${colors.backgroundActive};
        transform: translateY(0);
      `
    }}
  }
  
  /* Focus state */
  &:focus-visible {
    box-shadow: ${({ theme }) => theme.createFocusRing(theme.palette.interactive.focus.ring)};
    outline: none; /* Remove browser default outline */
  }
  
  /* Remove any default focus outline */
  &:focus {
    outline: none;
  }
  
  /* Disabled state */
  &:disabled {
    ${({ theme, $variant }) => {
      const colors = getVariantColors(theme, $variant)
      return `
        background-color: ${colors.backgroundDisabled};
        color: ${colors.textDisabled};
        cursor: not-allowed;
        transform: none;
      `
    }}
  }
`

// Motion wrapper for animated buttons  
const MotionButton = motion(StyledButton)

// Type for button props without motion conflicts
type ButtonHTMLProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
  'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'>


// Loading spinner component
const LoadingSpinner = styled.div`
  width: 1em;
  height: 1em;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: ${({ theme }) => theme.pulseAnimation} 1s linear infinite;
`

// Button component
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  asMotion = false,
  disabled,
  ...props
}, ref) => {
  if (asMotion) {
    const motionProps = {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { type: "spring" as const, stiffness: 400, damping: 25 }
    }

    return (
      <MotionButton
        ref={ref}
        $variant={variant}
        $size={size}
        $fullWidth={fullWidth}
        $loading={loading}
        disabled={disabled || loading}
        {...motionProps}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {!loading && icon && iconPosition === 'left' && icon}
        {!loading && children}
        {!loading && icon && iconPosition === 'right' && icon}
      </MotionButton>
    )
  }

  return (
    <StyledButton
      ref={ref}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && icon}
      {!loading && children}
      {!loading && icon && iconPosition === 'right' && icon}
    </StyledButton>
  )
})

Button.displayName = 'Button'
