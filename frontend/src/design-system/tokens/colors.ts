/**
 * Color Tokens - Centralized color system
 * 
 * This provides a complete color palette with semantic naming
 * for consistent theming across light and dark modes.
 */

// Base color palette - foundational colors
export const colors = {
  // Grayscale palette
  white: '#ffffff',
  black: '#000000',
  
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  
  // Brand colors - based on your current blue theme
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // Status colors
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  yellow: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
  },
} as const

// Semantic color tokens for light theme
export const lightTheme = {
  // Background colors
  background: {
    primary: colors.white,
    secondary: colors.gray[50],
    tertiary: colors.gray[100],
    accent: colors.blue[50],
    elevated: colors.white,
    disabled: colors.gray[100],
  },
  
  // Text colors
  text: {
    primary: colors.gray[900],
    secondary: colors.gray[600],
    tertiary: colors.gray[400],
    inverse: colors.white,
    accent: colors.blue[600],
    disabled: colors.gray[400],
  },
  
  // Border colors
  border: {
    default: colors.gray[200],
    muted: colors.gray[100],
    emphasis: colors.gray[300],
    accent: colors.blue[200],
  },
  
  // Interactive colors
  interactive: {
    // Buttons
    button: {
      primary: {
        background: colors.blue[600],
        backgroundHover: colors.blue[700],
        backgroundActive: colors.blue[800],
        backgroundDisabled: colors.gray[200],
        text: colors.white,
        textDisabled: colors.gray[400],
        border: colors.blue[600],
        borderHover: colors.blue[700],
      },
      secondary: {
        background: colors.gray[100],
        backgroundHover: colors.gray[200],
        backgroundActive: colors.gray[300],
        backgroundDisabled: colors.gray[50],
        text: colors.gray[900],
        textDisabled: colors.gray[400],
        border: colors.gray[300],
        borderHover: colors.gray[400],
      },
      ghost: {
        background: 'transparent',
        backgroundHover: colors.gray[100],
        backgroundActive: colors.gray[200],
        backgroundDisabled: 'transparent',
        text: colors.gray[700],
        textDisabled: colors.gray[400],
        border: 'transparent',
        borderHover: 'transparent',
      },
      danger: {
        background: colors.red[600],
        backgroundHover: colors.red[700],
        backgroundActive: colors.red[800],
        backgroundDisabled: colors.gray[200],
        text: colors.white,
        textDisabled: colors.gray[400],
        border: colors.red[600],
        borderHover: colors.red[700],
      },
    },
    
    // Traffic light buttons (macOS-style window controls)
    trafficLight: {
      close: {
        background: 'rgba(0, 0, 0, 0.12)',       // Neutral gray for light backgrounds
        backgroundHover: '#ff5f57',               // Red on hover
        backgroundActive: '#ff4136',              // Darker red on active
      },
      minimize: {
        background: 'rgba(0, 0, 0, 0.12)',       // Neutral gray for light backgrounds
        backgroundHover: '#ffbd2e',               // Yellow on hover
        backgroundActive: '#ffaa00',              // Darker yellow on active
      },
      maximize: {
        background: 'rgba(0, 0, 0, 0.12)',       // Neutral gray for light backgrounds
        backgroundHover: '#28ca42',               // Green on hover
        backgroundActive: '#20a532',              // Darker green on active
      },
    },
    
    // Header/menu buttons
    header: {
      background: 'transparent',
      backgroundHover: 'rgba(255, 255, 255, 0.1)',
      backgroundActive: 'rgba(255, 255, 255, 0.15)',
      backgroundOpen: 'rgba(255, 255, 255, 0.15)',
      text: colors.white,
      textMuted: colors.gray[300],
    },
    
    // Links
    link: {
      default: colors.blue[600],
      hover: colors.blue[700],
      visited: colors.blue[800],
    },
    
    // Focus states
    focus: {
      ring: colors.blue[500],
      background: colors.blue[50],
    },
  },
  
  // Status colors
  status: {
    error: {
      background: colors.red[50],
      backgroundMuted: colors.red[50],
      text: colors.red[700],
      border: colors.red[300],
      borderEmphasis: colors.red[400],
      accent: colors.red[500],
    },
    warning: {
      background: colors.yellow[50],
      backgroundMuted: colors.yellow[50],
      text: colors.yellow[800],
      border: colors.yellow[300],
      borderEmphasis: colors.yellow[400],
      accent: colors.yellow[500],
    },
    success: {
      background: colors.green[50],
      backgroundMuted: colors.green[50],
      text: colors.green[700],
      border: colors.green[300],
      borderEmphasis: colors.green[400],
      accent: colors.green[500],
    },
    info: {
      background: colors.blue[50],
      backgroundMuted: colors.blue[50],
      text: colors.blue[700],
      border: colors.blue[300],
      borderEmphasis: colors.blue[400],
      accent: colors.blue[500],
    },
  },
  
  // Chat-specific colors (extracted from your current styles)
  chat: {
    bubble: {
      user: {
        background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
        text: colors.white,
      },
      assistant: {
        background: 'rgba(0, 0, 0, 0.06)',
        text: colors.gray[800],
        border: 'rgba(0, 0, 0, 0.08)',
      },
      system: {
        background: 'rgba(107, 114, 128, 0.1)',
        text: colors.gray[600],
      },
    },
    
    // Markdown styling in chat messages
    markdown: {
      strong: colors.gray[900],
      emphasis: colors.gray[700],
      heading: colors.gray[900],
      link: colors.blue[700],
      linkHover: colors.blue[800],
      code: colors.red[600],
      codeBackground: 'rgba(0, 0, 0, 0.08)',
      codeBlockBackground: 'rgba(0, 0, 0, 0.05)',
      codeBlockBorder: 'rgba(0, 0, 0, 0.1)',
      blockquoteBorder: 'rgba(0, 0, 0, 0.2)',
      tableBorder: 'rgba(0, 0, 0, 0.1)',
      tableCellBorder: 'rgba(0, 0, 0, 0.08)',
      tableHeaderBackground: 'rgba(0, 0, 0, 0.1)',
      tableHeaderText: colors.gray[900],
      tableRowOdd: 'rgba(255, 255, 255, 0.45)',
      tableRowEven: 'rgba(0, 0, 0, 0.02)',
    },
    
    // Message headers (sender names)
    header: {
      userText: 'rgba(190, 202, 255, 0.9)',
      assistantText: colors.gray[500],
    },
    
    // Status indicators (typing, etc.)
    status: {
      text: colors.gray[500],
      indicator: colors.blue[500],
    },
    
    // Reply attachment styling
    reply: {
      userBackground: 'rgba(255, 255, 255, 0.25)',
      userBorder: 'rgba(255, 255, 255, 0.7)',
      userSender: 'rgba(255, 255, 255, 0.95)',
      userText: 'rgba(255, 255, 255, 0.85)',
      assistantBackground: 'rgba(0, 0, 0, 0.05)',
      assistantBorder: 'rgba(59, 130, 246, 0.6)',
      assistantSender: 'rgba(59, 130, 246, 0.9)',
      assistantText: 'rgba(0, 0, 0, 0.7)',
    },
    
    // Message actions button (always visible on bubble hover)
    messageActions: {
      // For assistant/AI bubbles (gray background)
      assistantBackground: 'rgba(0, 0, 0, 0.1)',        // Darker on light background
      assistantBackgroundHover: 'rgba(0, 0, 0, 0.15)',  
      assistantText: colors.gray[700],
      
      // For user bubbles (blue background) - lighter so it's visible
      userBackground: 'rgba(255, 255, 255, 1)',       // Light on blue background
      userBackgroundHover: 'rgba(255, 255, 255, 0.3)',  
      userText: 'rgba(255, 255, 255, 0.9)',             // White icon
    },
    
    code: {
      background: 'rgba(0, 0, 0, 0.08)',
      text: '#d63384',
      block: {
        background: 'rgba(0, 0, 0, 0.05)',
        border: 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
} as const

// Semantic color tokens for dark theme
export const darkTheme = {
  // Background colors
  background: {
    primary: colors.gray[900],
    secondary: colors.gray[800],
    tertiary: colors.gray[700],
    accent: colors.blue[950],
    elevated: colors.gray[800],
    disabled: colors.gray[800],
  },
  
  // Text colors
  text: {
    primary: colors.gray[100],
    secondary: colors.gray[400],
    tertiary: colors.gray[500],
    inverse: colors.gray[900],
    accent: colors.blue[400],
    disabled: colors.gray[600],
  },
  
  // Border colors
  border: {
    default: colors.gray[700],
    muted: colors.gray[800],
    emphasis: colors.gray[600],
    accent: colors.blue[800],
  },
  
  // Interactive colors
    interactive: {
    // Buttons  
    button: {
      primary: {
        background: colors.blue[600],
        backgroundHover: colors.blue[500],
        backgroundActive: colors.blue[700],
        backgroundDisabled: colors.gray[700],
        text: colors.white,
        textDisabled: colors.gray[500],
        border: colors.blue[600],
        borderHover: colors.blue[500],
      },
      secondary: {
        background: colors.gray[700],
        backgroundHover: colors.gray[600],
        backgroundActive: colors.gray[500],
        backgroundDisabled: colors.gray[800],
        text: colors.gray[100],
        textDisabled: colors.gray[600],
        border: colors.gray[600],
        borderHover: colors.gray[500],
      },
      ghost: {
        background: 'transparent',
        backgroundHover: colors.gray[800],
        backgroundActive: colors.gray[700],
        backgroundDisabled: 'transparent',
        text: colors.gray[300],
        textDisabled: colors.gray[600],
        border: 'transparent',
        borderHover: 'transparent',
      },
      danger: {
        background: colors.red[600],
        backgroundHover: colors.red[500],
        backgroundActive: colors.red[700],
        backgroundDisabled: colors.gray[700],
        text: colors.white,
        textDisabled: colors.gray[500],
        border: colors.red[600],
        borderHover: colors.red[500],
      },
    },
    
    // Traffic light buttons (macOS-style window controls) - dark theme
    trafficLight: {
      close: {
        background: 'rgba(255, 255, 255, 0.15)',  // Light gray for dark backgrounds
        backgroundHover: '#ff5f57',                // Red on hover
        backgroundActive: '#ff4136',               // Darker red on active
      },
      minimize: {
        background: 'rgba(255, 255, 255, 0.15)',  // Light gray for dark backgrounds
        backgroundHover: '#ffbd2e',                // Yellow on hover
        backgroundActive: '#ffaa00',               // Darker yellow on active
      },
      maximize: {
        background: 'rgba(255, 255, 255, 0.15)',  // Light gray for dark backgrounds
        backgroundHover: '#28ca42',                // Green on hover
        backgroundActive: '#20a532',               // Darker green on active
      },
    },
    
    // Header/menu buttons - dark theme
    header: {
      background: 'transparent',
      backgroundHover: 'rgba(255, 255, 255, 0.1)',
      backgroundActive: 'rgba(255, 255, 255, 0.15)',
      backgroundOpen: 'rgba(255, 255, 255, 0.15)',
      text: colors.white,
      textMuted: colors.gray[400],
    },
    
    // Links
    link: {
      default: colors.blue[400],
      hover: colors.blue[300],
      visited: colors.blue[500],
    },
    
    // Focus states
    focus: {
      ring: colors.blue[500],
      background: colors.blue[950],
    },
  },
  
  // Status colors
  status: {
    error: {
      background: colors.red[950],
      backgroundMuted: colors.red[900],
      text: colors.red[400],
      border: colors.red[800],
      borderEmphasis: colors.red[700],
      accent: colors.red[500],
    },
    warning: {
      background: colors.yellow[950],
      text: colors.yellow[400],
      border: colors.yellow[800],
      accent: colors.yellow[500],
    },
    success: {
      background: colors.green[950],
      text: colors.green[400],
      border: colors.green[800],
      accent: colors.green[500],
    },
    info: {
      background: colors.blue[950],
      text: colors.blue[400],
      border: colors.blue[800],
      accent: colors.blue[500],
    },
  },
  
  // Chat-specific colors (extracted from your current styles)
  chat: {
    bubble: {
      user: {
        background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
        text: colors.white,
      },
      assistant: {
        background: 'rgba(255, 255, 255, 0.08)',
        text: colors.gray[200],
        border: 'rgba(255, 255, 255, 0.1)',
      },
      system: {
        background: 'rgba(107, 114, 128, 0.1)',
        text: colors.gray[400],
      },
    },
    
    // Markdown styling in chat messages
    markdown: {
      strong: colors.white,
      emphasis: colors.gray[300],
      heading: colors.white,
      link: colors.blue[300],
      linkHover: colors.blue[200],
      code: colors.red[400],
      codeBackground: 'rgba(255, 255, 255, 0.15)',
      codeBlockBackground: 'rgba(255, 255, 255, 0.1)',
      codeBlockBorder: 'rgba(255, 255, 255, 0.2)',
      blockquoteBorder: 'rgba(255, 255, 255, 0.3)',
      tableBorder: 'rgba(255, 255, 255, 0.2)',
      tableCellBorder: 'rgba(255, 255, 255, 0.1)',
      tableHeaderBackground: 'rgba(255, 255, 255, 0.1)',
      tableHeaderText: colors.white,
      tableRowOdd: 'rgba(0, 0, 0, 0.2)',
      tableRowEven: 'rgba(255, 255, 255, 0.03)',
    },
    
    // Message headers (sender names)
    header: {
      userText: 'rgba(190, 202, 255, 0.9)',
      assistantText: colors.gray[400],
    },
    
    // Status indicators (typing, etc.)
    status: {
      text: colors.gray[400],
      indicator: colors.blue[400],
    },
    
    // Reply attachment styling
    reply: {
      userBackground: 'rgba(0, 0, 0, 0.15)',
      userBorder: 'rgba(255, 255, 255, 0.4)',
      userSender: 'rgba(255, 255, 255, 0.9)',
      userText: 'rgba(255, 255, 255, 0.75)',
      assistantBackground: 'rgba(255, 255, 255, 0.08)',
      assistantBorder: 'rgba(147, 197, 253, 0.6)',
      assistantSender: 'rgba(147, 197, 253, 0.9)',
      assistantText: 'rgba(255, 255, 255, 0.8)',
    },
    
    // Message actions button (always visible on bubble hover)
    messageActions: {
      // For assistant/AI bubbles (gray background)
      assistantBackground: 'rgba(255, 255, 255, 0.15)',   // Light on dark background
      assistantBackgroundHover: 'rgba(255, 255, 255, 0.2)',
      assistantText: colors.gray[300],
      
      // For user bubbles (blue background) - same as light theme
      userBackground: 'rgba(255, 255, 255, 0.2)',         // Light on blue background  
      userBackgroundHover: 'rgba(255, 255, 255, 0.3)',
      userText: 'rgba(255, 255, 255, 0.9)',               // White icon
    },
    
    code: {
      background: 'rgba(255, 255, 255, 0.15)',
      text: '#ff6b6b',
      block: {
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'rgba(255, 255, 255, 0.2)',
      },
    },
  },
} as const

// Window-specific colors (from your current OS theme)
export const windowColors = {
  light: {
    background: 'rgba(255, 255, 255, 0.95)',
    border: 'rgba(255, 255, 255, 0.2)', 
    headerBackground: 'transparent',
    headerBorder: 'transparent',
    titleColor: colors.gray[800],
    shadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
  },
  dark: {
    background: 'rgba(26, 26, 26, 0.98)',
    border: 'rgba(60, 60, 60, 0.3)',
    headerBackground: 'transparent', 
    headerBorder: 'rgba(60, 60, 60, 0.3)',
    titleColor: colors.gray[200],
    shadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
  },
} as const

// Type definitions
export type ColorTokens = typeof colors
export type LightThemeTokens = typeof lightTheme
export type DarkThemeTokens = typeof darkTheme
export type WindowColorTokens = typeof windowColors
