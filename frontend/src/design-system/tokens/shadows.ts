/**
 * Shadow Tokens - Centralized shadow system
 * 
 * Provides consistent elevation, focus states, and depth across the OS.
 * All shadows automatically adapt to light/dark themes.
 */

// Base shadow values (elevation scale)
export const shadowLevels = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const

// OS-specific window shadows (your current values)
export const windowShadows = {
  light: '0 20px 60px rgba(0, 0, 0, 0.2)',
  dark: '0 20px 60px rgba(0, 0, 0, 0.4)',
  floating: '0 8px 32px rgba(0, 0, 0, 0.12)',
  modal: '0 25px 50px rgba(0, 0, 0, 0.15)',
} as const

// Focus ring shadows (consistent across components)
export const focusShadows = {
  ring: '0 0 0 2px', // Base ring, color from theme.palette.interactive.focus.ring
  ringLarge: '0 0 0 3px', // Larger ring for emphasis
  ringSubtle: '0 0 0 1px', // Subtle ring for minimal focus
} as const

// Interactive shadows (hover, active states)
export const interactiveShadows = {
  hover: '0 4px 12px rgba(0, 0, 0, 0.15)',
  active: '0 2px 4px rgba(0, 0, 0, 0.1)',
  pressed: 'inset 0 2px 0 rgba(0, 0, 0, 0.1)',
} as const

// Semantic shadow tokens for specific UI patterns
export const semanticShadows = {
  // Window chrome and containers
  window: {
    floating: windowShadows.floating,
    modal: windowShadows.modal,
    light: windowShadows.light,
    dark: windowShadows.dark,
  },
  
  // Dropdown and menu shadows
  dropdown: {
    base: shadowLevels.lg,
    floating: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
  
  // Card and panel shadows
  card: {
    flat: shadowLevels.none,
    raised: shadowLevels.sm,
    floating: shadowLevels.md,
    elevated: shadowLevels.lg,
  },
  
  // Button and interactive element shadows
  button: {
    rest: shadowLevels.none,
    hover: interactiveShadows.hover,
    active: interactiveShadows.active,
    pressed: interactiveShadows.pressed,
  },
  
  // Focus states (with color from theme)
  focus: {
    ring: focusShadows.ring,
    ringLarge: focusShadows.ringLarge,
    ringSubtle: focusShadows.ringSubtle,
  },
  
  // Chat and messaging shadows
  chat: {
    message: shadowLevels.sm,
    messageHover: interactiveShadows.hover,
    attachment: shadowLevels.base,
  },
  
  // Tooltip and overlay shadows
  tooltip: shadowLevels.md,
  popover: shadowLevels.lg,
  modal: shadowLevels['2xl'],
  
  // Input and form shadows
  input: {
    rest: shadowLevels.none,
    focus: focusShadows.ring, // + theme color
    error: focusShadows.ring, // + error color
  },
} as const

// Combined shadows export
export const shadows = {
  levels: shadowLevels,
  window: windowShadows,
  focus: focusShadows,
  interactive: interactiveShadows,
  semantic: semanticShadows,
} as const

// Helper function to create focus ring with theme color
export const createFocusRing = (color: string, size: keyof typeof focusShadows = 'ring') => {
  return `${focusShadows[size]} ${color}`
}

// Helper function to combine multiple shadows
export const combineShadows = (...shadowValues: string[]) => {
  return shadowValues.filter(shadow => shadow && shadow !== 'none').join(', ')
}

// Type definitions
export type ShadowLevels = typeof shadowLevels
export type WindowShadows = typeof windowShadows
export type FocusShadows = typeof focusShadows
export type InteractiveShadows = typeof interactiveShadows
export type SemanticShadows = typeof semanticShadows
export type ShadowTokens = typeof shadows
