/**
 * Input - Primitive input component
 * 
 * A foundational input component that uses design tokens for all styling.
 * Supports multiple variants, sizes, and states.
 */

import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { Theme } from '../../../theme'

// Input variant types
export type InputVariant = 'default' | 'filled' | 'ghost'
export type InputSize = 'sm' | 'md' | 'lg'

// Type for input props without HTML size conflict
type InputHTMLProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>

// Input props interface
export interface InputProps extends InputHTMLProps {
  variant?: InputVariant
  size?: InputSize
  error?: boolean
  helperText?: string
  label?: string
  fullWidth?: boolean
}

// Helper function to get variant colors
const getVariantColors = (theme: Theme, variant: InputVariant, error: boolean) => {
  const { palette } = theme
  
  if (error) {
    return {
      background: palette.status.error.backgroundMuted,
      border: palette.status.error.border,
      borderFocus: palette.status.error.borderEmphasis,
      text: palette.text.primary,
      placeholder: palette.text.tertiary,
    }
  }
  
  switch (variant) {
    case 'filled':
      return {
        background: palette.background.secondary,
        border: palette.border.muted,
        borderFocus: palette.interactive.focus.ring,
        text: palette.text.primary,
        placeholder: palette.text.tertiary,
      }
    case 'ghost':
      return {
        background: 'transparent',
        border: 'transparent',
        borderFocus: palette.interactive.focus.ring,
        text: palette.text.primary,
        placeholder: palette.text.tertiary,
      }
    case 'default':
    default:
      return {
        background: palette.background.primary,
        border: palette.border.default,
        borderFocus: palette.interactive.focus.ring,
        text: palette.text.primary,
        placeholder: palette.text.tertiary,
      }
  }
}

// Helper function to get size styles
const getSizeStyles = (theme: Theme, size: InputSize) => {
  const { semanticSpacing, semanticTypography, radii } = theme
  
  switch (size) {
    case 'sm':
      return {
        padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
        fontSize: semanticTypography.input.sm?.fontSize || theme.fontSize.sm,
        lineHeight: semanticTypography.input.sm?.lineHeight || theme.lineHeight.normal,
        borderRadius: radii.sm,
        minHeight: theme.spacing[8],
      }
    case 'lg':
      return {
        padding: `${theme.spacing[4]} ${theme.spacing[4]}`,
        fontSize: semanticTypography.input.lg?.fontSize || theme.fontSize.lg,
        lineHeight: semanticTypography.input.lg?.lineHeight || theme.lineHeight.normal,
        borderRadius: radii.md,
        minHeight: theme.spacing[12],
      }
    case 'md':
    default:
      return {
        padding: semanticSpacing.component.inputPadding,
        fontSize: semanticTypography.input.fontSize,
        lineHeight: semanticTypography.input.lineHeight,
        borderRadius: radii.md,
        minHeight: theme.spacing[10],
      }
  }
}

// Styled input component
const StyledInput = styled.input<{
  $variant: InputVariant
  $size: InputSize
  $error: boolean
  $fullWidth: boolean
}>`
  /* Reset and base styles */
  border: none;
  outline: none;
  font-family: ${({ theme }) => theme.fontFamily.sans.join(', ')};
  transition: all ${({ theme }) => theme.motion.duration.fast}ms ${({ theme }) => theme.motion.easing.easeOut.join(', ')};
  
  /* Size-based styles */
  ${({ theme, $size }) => {
    const styles = getSizeStyles(theme, $size)
    return `
      padding: ${styles.padding};
      font-size: ${styles.fontSize};
      line-height: ${styles.lineHeight};
      border-radius: ${styles.borderRadius};
      min-height: ${styles.minHeight};
    `
  }}
  
  /* Variant-based styles */
  ${({ theme, $variant, $error }) => {
    const colors = getVariantColors(theme, $variant, $error)
    return `
      background-color: ${colors.background};
      color: ${colors.text};
      border: 1px solid ${colors.border};
      
      &::placeholder {
        color: ${colors.placeholder};
      }
      
      &:focus {
        border-color: ${colors.borderFocus};
        box-shadow: 0 0 0 2px ${colors.borderFocus}20;
      }
    `
  }}
  
  /* Full width */
  ${({ $fullWidth }) => $fullWidth && `
    width: 100%;
  `}
  
  /* Disabled state */
  &:disabled {
    background-color: ${({ theme }) => theme.palette.background.disabled};
    color: ${({ theme }) => theme.palette.text.disabled};
    cursor: not-allowed;
    opacity: 0.6;
  }
`

// Label component
const Label = styled.label<{ $size: InputSize }>`
  display: block;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  
  ${({ theme, $size }) => {
    switch ($size) {
      case 'sm':
        return `font-size: ${theme.fontSize.xs};`
      case 'lg':
        return `font-size: ${theme.fontSize.base};`
      case 'md':
      default:
        return `font-size: ${theme.fontSize.sm};`
    }
  }}
`

// Helper text component
const HelperText = styled.div<{ $error: boolean, $size: InputSize }>`
  margin-top: ${({ theme }) => theme.spacing[1]};
  
  ${({ theme, $size }) => {
    switch ($size) {
      case 'sm':
        return `font-size: ${theme.fontSize.xs};`
      case 'lg':
        return `font-size: ${theme.fontSize.sm};`
      case 'md':
      default:
        return `font-size: ${theme.fontSize.xs};`
    }
  }}
  
  color: ${({ theme, $error }) => 
    $error 
      ? theme.palette.status.error.text 
      : theme.palette.text.tertiary
  };
`

// Container for the full input component
const InputContainer = styled.div<{ $fullWidth: boolean }>`
  ${({ $fullWidth }) => $fullWidth && `
    width: 100%;
  `}
`

// Input component
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  size = 'md',
  error = false,
  helperText,
  label,
  fullWidth = false,
  ...props
}, ref) => {
  return (
    <InputContainer $fullWidth={fullWidth}>
      {label && (
        <Label $size={size} htmlFor={props.id}>
          {label}
        </Label>
      )}
      <StyledInput
        ref={ref}
        $variant={variant}
        $size={size}
        $error={error}
        $fullWidth={fullWidth}
        {...props}
      />
      {helperText && (
        <HelperText $error={error} $size={size}>
          {helperText}
        </HelperText>
      )}
    </InputContainer>
  )
})

Input.displayName = 'Input'
