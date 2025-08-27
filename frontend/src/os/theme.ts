import { OSWindowTheme } from './types'

// OS Constants - Single source of truth for all window dimensions
export const OS_CONSTANTS = {
  HEADER_HEIGHT: 32,
  BORDER_RADIUS: 12,
  CONTROL_BUTTON_SIZE: 12,
  CONTROL_BUTTON_GAP: 8,
  RESIZE_HANDLE: {
    EDGE_WIDTH: 12,
    CORNER_SIZE: 16
  },
  ANIMATIONS: {
    DURATION: '250ms',
    EASING: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
} as const

// Default OS window theme
export const DEFAULT_OS_THEME: OSWindowTheme = {
  background: 'rgba(255, 255, 255, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  headerBackground: 'transparent',
  headerBorder: '1px solid transparent',
  titleColor: '#333',
  shadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
}

// Dark OS theme for apps that need it
export const DARK_OS_THEME: OSWindowTheme = {
  background: 'rgba(26, 26, 26, 0.98)',
  border: '1px solid rgba(60, 60, 60, 0.3)',
  headerBackground: 'transparent',
  headerBorder: '1px solid rgba(60, 60, 60, 0.3)',
  titleColor: '#e0e0e0',
  shadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
}

// Create final theme by merging base theme with app overrides
export const createWindowTheme = (
  isDark = false, 
  overrides?: Partial<OSWindowTheme>
): OSWindowTheme => {
  const baseTheme = isDark ? DARK_OS_THEME : DEFAULT_OS_THEME
  return {
    ...baseTheme,
    ...overrides
  }
}
