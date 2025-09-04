/**
 * Custom Theme Definitions
 * 
 * Define custom themes that extend the base light/dark themes
 * with custom colors, radii, and other token overrides.
 */

import { CustomTheme } from './ThemeProvider'

// Example: Classic theme with warmer colors and rounded corners
export const classicTheme: CustomTheme = {
  name: 'classic',
  displayName: 'Classic',
  baseTheme: 'light', // Extends light theme
  overrides: {
    // Custom color overrides for classic theme
    palette: {
      background: {
        primary: '#fefcf7',     // Warm white
        secondary: '#faf6f0',   // Warm gray
        tertiary: '#f5f0e8',    // Warmer gray
        accent: '#f0e6d6',      // Warm accent
      },
      text: {
        primary: '#3a2f2a',     // Warm dark brown
        secondary: '#6b5b50',   // Medium brown
        tertiary: '#8a7a6f',    // Light brown
        accent: '#8b4513',      // Saddle brown
      },
      interactive: {
        button: {
          primary: {
            background: '#8b4513',        // Saddle brown
            backgroundHover: '#a0522d',   // Sienna
            backgroundActive: '#654321',  // Dark brown
            text: '#fefcf7',             // Warm white
            border: '#8b4513',
          },
          secondary: {
            background: '#deb887',        // Burlywood
            backgroundHover: '#cdaa7d',   // Darker burlywood
            backgroundActive: '#bc9a6a',  // Even darker
            text: '#3a2f2a',             // Warm dark
            border: '#bc9a6a',
          },
        },
        link: {
          default: '#8b4513',    // Saddle brown
          hover: '#a0522d',      // Sienna
          visited: '#654321',    // Dark brown
        },
      },
      border: {
        default: '#e6d7c3',     // Warm border
        muted: '#f0e6d6',       // Very light warm
        emphasis: '#d2bfa1',    // Stronger warm border
        accent: '#deb887',      // Burlywood border
      },
      // Chat colors for classic theme
      chat: {
        bubble: {
          user: {
            background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
            text: '#fefcf7',
          },
          assistant: {
            background: 'rgba(139, 69, 19, 0.08)',  // Warm brown tint
            text: '#3a2f2a',
            border: 'rgba(139, 69, 19, 0.15)',
          },
        },
        code: {
          background: 'rgba(139, 69, 19, 0.1)',
          text: '#8b4513',
          block: {
            background: 'rgba(139, 69, 19, 0.05)',
            border: 'rgba(139, 69, 19, 0.15)',
          },
        },
      },
    },
    
    // Custom border radius overrides for more rounded classic look
    semanticRadii: {
      button: {
        base: '12px',      // More rounded buttons
        large: '16px',
        pill: '9999px',
      },
      card: {
        base: '16px',      // More rounded cards
        large: '20px',
      },
      chat: {
        bubble: {
          base: '24px',                         // More rounded bubbles
          user: '24px 24px 8px 24px',          // User with classic rounded corner
          assistant: '24px 24px 24px 8px',     // Assistant with classic rounded corner
        },
        input: '16px',     // More rounded input
      },
      window: {
        base: '16px',      // More rounded windows
        header: '16px 16px 0 0',
        content: '0 0 16px 16px',
      },
    },
  },
}

// Example: High contrast theme for accessibility
export const highContrastTheme: CustomTheme = {
  name: 'high-contrast',
  displayName: 'High Contrast',
  baseTheme: 'dark',
  overrides: {
    palette: {
      background: {
        primary: '#000000',     // Pure black
        secondary: '#1a1a1a',   // Very dark gray
        tertiary: '#2d2d2d',    // Dark gray
      },
      text: {
        primary: '#ffffff',     // Pure white
        secondary: '#f0f0f0',   // Near white
        tertiary: '#d0d0d0',    // Light gray
      },
      border: {
        default: '#ffffff',     // White borders for high contrast
        emphasis: '#ffff00',    // Yellow for emphasis
      },
      interactive: {
        button: {
          primary: {
            background: '#ffff00',    // Yellow button
            backgroundHover: '#ffff33',
            text: '#000000',          // Black text
            border: '#ffffff',
          },
        },
        link: {
          default: '#00ffff',     // Cyan links
          hover: '#33ffff',
        },
        focus: {
          ring: '#ffff00',        // Yellow focus ring
        },
      },
    },
  },
}

// Import the pink themes
import { pinkLightTheme, pinkDarkTheme } from './pinkTheme'

// Export all custom themes
export const customThemes = {
  classic: classicTheme,
  'high-contrast': highContrastTheme,
  'pink-light': pinkLightTheme,
  'pink-dark': pinkDarkTheme,
} as const

// Auto-register all themes (optional - can be done manually)
export const registerAllThemes = () => {
  // This would be called in your app initialization
  // We'll make this available but not auto-execute
  return Object.values(customThemes)
}
