/**
 * Theme Provider - Centralized theme management for the OS
 * 
 * Provides runtime theme switching, token access, and system theme detection
 * for consistent theming across all components and applications.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import {
  motion,
  pulseAnimation,
  colors,
  lightTheme,
  darkTheme,
  windowColors,
  spacing,
  semanticSpacing,
  spacingPatterns,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  semanticTypography,
  radii,
  semanticRadii,
  radiiPatterns,
  shadows,
  shadowLevels,
  windowShadows,
  focusShadows,
  interactiveShadows,
  semanticShadows,
  createFocusRing,
  combineShadows,
} from '../tokens'

// Theme mode type - extensible for custom themes
export type ThemeMode = 'light' | 'dark' | 'system' | string

// Deep partial type that makes all nested properties optional and flexible
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : any
}

// Theme override interface for custom themes - allows any values
export interface ThemeOverrides {
  // Allow partial overrides of any token category with flexible typing
  colors?: DeepPartial<typeof colors>
  palette?: DeepPartial<typeof lightTheme>
  windowColors?: DeepPartial<typeof windowColors.light>
  spacing?: DeepPartial<typeof spacing>
  semanticSpacing?: DeepPartial<typeof semanticSpacing>
  spacingPatterns?: DeepPartial<typeof spacingPatterns>
  fontFamily?: DeepPartial<typeof fontFamily>
  fontSize?: DeepPartial<typeof fontSize>
  fontWeight?: DeepPartial<typeof fontWeight>
  lineHeight?: DeepPartial<typeof lineHeight>
  letterSpacing?: DeepPartial<typeof letterSpacing>
  semanticTypography?: DeepPartial<typeof semanticTypography>
  radii?: DeepPartial<typeof radii>
  semanticRadii?: DeepPartial<typeof semanticRadii>
  radiiPatterns?: DeepPartial<typeof radiiPatterns>
  shadows?: DeepPartial<typeof shadows>
  shadowLevels?: DeepPartial<typeof shadowLevels>
  windowShadows?: DeepPartial<typeof windowShadows>
  focusShadows?: DeepPartial<typeof focusShadows>
  interactiveShadows?: DeepPartial<typeof interactiveShadows>
  semanticShadows?: DeepPartial<typeof semanticShadows>
}

// Custom theme definition
export interface CustomTheme {
  name: string
  displayName: string
  baseTheme: 'light' | 'dark' // Which built-in theme to extend
  overrides: ThemeOverrides
}

// Complete theme object that components will receive
export interface Theme {
  // Theme mode info
  mode: 'light' | 'dark' | 'custom'
  themeName: string
  
  // All design tokens (potentially overridden)
  motion: typeof motion
  pulseAnimation: typeof pulseAnimation
  colors: typeof colors
  palette: typeof lightTheme | typeof darkTheme
  windowColors: typeof windowColors.light | typeof windowColors.dark
  spacing: typeof spacing
  semanticSpacing: typeof semanticSpacing
  spacingPatterns: typeof spacingPatterns
  fontFamily: typeof fontFamily
  fontSize: typeof fontSize
  fontWeight: typeof fontWeight
  lineHeight: typeof lineHeight
  letterSpacing: typeof letterSpacing
  semanticTypography: typeof semanticTypography
  radii: typeof radii
  semanticRadii: typeof semanticRadii
  radiiPatterns: typeof radiiPatterns
  shadows: typeof shadows
  shadowLevels: typeof shadowLevels
  windowShadows: typeof windowShadows
  focusShadows: typeof focusShadows
  interactiveShadows: typeof interactiveShadows
  semanticShadows: typeof semanticShadows
  createFocusRing: typeof createFocusRing
  combineShadows: typeof combineShadows
}

// Theme registry for custom themes
const customThemes = new Map<string, CustomTheme>()

// Register a custom theme
export const registerTheme = (theme: CustomTheme) => {
  customThemes.set(theme.name, theme)
}

// Get all available themes
export const getAvailableThemes = () => {
  return {
    builtin: ['light', 'dark', 'system'] as const,
    custom: Array.from(customThemes.keys())
  }
}

// Theme context
interface ThemeContextValue {
  themeMode: ThemeMode
  actualMode: 'light' | 'dark' | 'custom' // Resolved theme type
  setThemeMode: (mode: ThemeMode) => void
  theme: Theme
  registerTheme: (theme: CustomTheme) => void
  getAvailableThemes: () => ReturnType<typeof getAvailableThemes>
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Deep merge utility for theme overrides
const deepMerge = (target: any, source: any): any => {
  const result = { ...target }
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  
  return result
}

// System theme detection hook
const useSystemTheme = (): 'light' | 'dark' => {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return systemTheme
}

// Resolve theme based on mode
const resolveTheme = (themeMode: ThemeMode, systemTheme: 'light' | 'dark'): {
  mode: 'light' | 'dark' | 'custom'
  themeName: string
  baseTheme: 'light' | 'dark'
  customTheme?: CustomTheme
} => {
  // Handle built-in themes
  if (themeMode === 'light' || themeMode === 'dark') {
    return { mode: themeMode, themeName: themeMode, baseTheme: themeMode }
  }
  
  if (themeMode === 'system') {
    return { mode: systemTheme, themeName: 'system', baseTheme: systemTheme }
  }
  
  // Handle custom themes
  const customTheme = customThemes.get(themeMode)
  if (customTheme) {
    return { 
      mode: 'custom', 
      themeName: customTheme.name, 
      baseTheme: customTheme.baseTheme,
      customTheme 
    }
  }
  
  // Fallback to light theme
  console.warn(`Unknown theme "${themeMode}", falling back to light theme`)
  return { mode: 'light', themeName: 'light', baseTheme: 'light' }
}

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode
  defaultMode?: ThemeMode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultMode = 'system' 
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(defaultMode)
  const systemTheme = useSystemTheme()
  
  // Resolve theme configuration
  const resolvedTheme = resolveTheme(themeMode, systemTheme)
  
  // Create base theme tokens
  const baseTokens = {
    motion,
    pulseAnimation,
    colors,
    palette: resolvedTheme.baseTheme === 'dark' ? darkTheme : lightTheme,
    windowColors: resolvedTheme.baseTheme === 'dark' ? windowColors.dark : windowColors.light,
    spacing,
    semanticSpacing,
    spacingPatterns,
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    semanticTypography,
    radii,
    semanticRadii,
    radiiPatterns,
    shadows,
    shadowLevels,
    windowShadows,
    focusShadows,
    interactiveShadows,
    semanticShadows,
    createFocusRing,
    combineShadows,
  }

  // Apply custom theme overrides if present
  const finalTokens = resolvedTheme.customTheme 
    ? deepMerge(baseTokens, resolvedTheme.customTheme.overrides)
    : baseTokens

  // Create complete theme object
  const theme: Theme = {
    mode: resolvedTheme.mode,
    themeName: resolvedTheme.themeName,
    ...finalTokens,
  }

  const contextValue: ThemeContextValue = {
    themeMode,
    actualMode: resolvedTheme.mode,
    setThemeMode,
    theme,
    registerTheme,
    getAvailableThemes,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  )
}

// Utility function to get current system theme outside of React components
export const getCurrentSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

// Helper hook for quick access to theme information
export const useThemeMode = () => {
  const { actualMode, theme } = useTheme()
  return { mode: actualMode, name: theme.themeName }
}

// Helper hook for quick access to color palette
export const usePalette = () => {
  const { theme } = useTheme()
  return theme.palette
}

// Helper hook for quick access to window colors
export const useWindowColors = () => {
  const { theme } = useTheme()
  return theme.windowColors
}
