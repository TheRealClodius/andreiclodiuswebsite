/**
 * Typography Tokens - Consistent text styling system
 * 
 * Provides font families, sizes, weights, and line heights
 * for consistent typography across the entire OS.
 */

// Font families
export const fontFamily = {
  sans: [
    'Inter',
    '-apple-system', 
    'BlinkMacSystemFont',
    'system-ui',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif'
  ],
  mono: [
    'SF Mono',
    'Monaco', 
    'Cascadia Code',
    'Roboto Mono',
    'Consolas',
    'Liberation Mono',
    'Menlo',
    'Courier New',
    'monospace'
  ],
} as const

// Font size scale (based on modular scale)
export const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
  '6xl': '3.75rem', // 60px
  '7xl': '4.5rem',  // 72px
  '8xl': '6rem',    // 96px
  '9xl': '8rem',    // 128px
} as const

// Font weights
export const fontWeight = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const

// Line heights
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const

// Letter spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const

// Semantic typography tokens for UI elements
export const semanticTypography = {
  // Headings
  heading: {
    h1: {
      fontSize: fontSize['4xl'],
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.tight,
      letterSpacing: letterSpacing.tight,
    },
    h2: {
      fontSize: fontSize['3xl'],
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.tight,
      letterSpacing: letterSpacing.tight,
    },
    h3: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.semibold,
      lineHeight: lineHeight.snug,
      letterSpacing: letterSpacing.tight,
    },
    h4: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.semibold,
      lineHeight: lineHeight.snug,
      letterSpacing: letterSpacing.normal,
    },
    h5: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.normal,
      letterSpacing: letterSpacing.normal,
    },
    h6: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.normal,
      letterSpacing: letterSpacing.normal,
    },
  },
  
  // Body text
  body: {
    large: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.relaxed,
    },
    base: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.normal,
    },
    small: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.normal,
    },
  },
  
  // Labels and captions
  label: {
    large: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.normal,
    },
    base: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.normal,
    },
    small: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.normal,
    },
  },
  
  caption: {
    base: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.normal,
    },
    small: {
      fontSize: '0.625rem', // 10px
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.normal,
    },
  },
  
  // Code and monospace
  code: {
    inline: {
      fontSize: '0.9em', // Relative to parent
      fontFamily: fontFamily.mono,
      fontWeight: fontWeight.normal,
    },
    block: {
      fontSize: '0.85em', // Relative to parent
      fontFamily: fontFamily.mono,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.relaxed,
    },
  },
  
  // Chat-specific typography (from your current styles)
  chat: {
    message: {
      fontSize: fontSize.sm,     // 14px (from MessageBubble)
      lineHeight: lineHeight.normal, // 1.5 (from MessageBubble)
      fontWeight: fontWeight.normal,
    },
    messageHeader: {
      fontSize: fontSize.xs,     // 12px (from MessageHeader)
      fontWeight: fontWeight.semibold, // 600 (from MessageHeader)
    },
    messageTime: {
      fontSize: '0.625rem',     // 10px (from MessageTime)
      fontWeight: fontWeight.normal,
    },
    statusIndicator: {
      fontSize: fontSize.xs,     // 12px (from StatusIndicator)
      fontWeight: fontWeight.normal,
    },
  },
  
  // Button typography
  button: {
    lg: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.none,
    },
    base: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.none,
    },
    sm: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.none,
    },
  },
  
  // Form typography
  input: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    sm: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.normal,
    },
    lg: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.normal,
    },
  },
  
  placeholder: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  
  // Window and OS typography (from your current system)
  window: {
    title: {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.none,
    },
  },
} as const

// Type definitions
export type FontFamilyTokens = typeof fontFamily
export type FontSizeTokens = typeof fontSize
export type FontWeightTokens = typeof fontWeight
export type LineHeightTokens = typeof lineHeight
export type LetterSpacingTokens = typeof letterSpacing
export type SemanticTypographyTokens = typeof semanticTypography
