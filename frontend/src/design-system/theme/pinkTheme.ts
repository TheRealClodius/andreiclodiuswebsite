/**
 * Pink Sharp Themes - Sharp edges and pink everything!
 * 
 * Light and dark variants of the pink theme with sharp corner radius (1px) 
 * and a complete pink color palette.
 */

import { CustomTheme } from './ThemeProvider'
import { spacing } from '../tokens/spacing'

// Pink Light Theme
export const pinkLightTheme: CustomTheme = {
  name: 'pink-light',
  displayName: 'Pink Sharp (Light)',
  baseTheme: 'light', // Extends light theme
  overrides: {
    // Pink color palette overrides
    palette: {
      background: {
        primary: '#fdf2f8',     // Very light pink
        secondary: '#fce7f3',   // Light pink
        tertiary: '#fbcfe8',    // Medium light pink
        accent: '#f9a8d4',      // Pink accent
        elevated: '#fdf2f8',    // Same as primary for consistency
      },
      
      text: {
        primary: '#831843',     // Deep pink/burgundy
        secondary: '#be185d',   // Medium deep pink
        tertiary: '#ec4899',    // Bright pink
        inverse: '#fdf2f8',     // Light pink for dark backgrounds
        accent: '#be185d',      // Pink accent text
      },
      
      border: {
        default: '#f9a8d4',     // Pink border
        muted: '#fce7f3',       // Very light pink border
        emphasis: '#ec4899',    // Bright pink border
        accent: '#be185d',      // Deep pink accent border
      },
      
      interactive: {
        // Pink button system
        button: {
          primary: {
            background: '#be185d',        // Deep pink
            backgroundHover: '#9d174d',   // Darker pink
            backgroundActive: '#831843',  // Darkest pink
            text: '#fdf2f8',             // Light pink text
            border: '#be185d',
          },
          secondary: {
            background: '#fce7f3',        // Light pink
            backgroundHover: '#fbcfe8',   // Medium light pink
            backgroundActive: '#f9a8d4',  // Pink
            text: '#831843',             // Deep pink text
            border: '#f9a8d4',
          },
          ghost: {
            background: 'transparent',
            backgroundHover: '#fce7f3',   // Light pink hover
            backgroundActive: '#fbcfe8',  // Medium pink active
            text: '#be185d',             // Deep pink text
            border: 'transparent',
          },
        },
        
        // Pink links
        link: {
          default: '#be185d',    // Deep pink
          hover: '#9d174d',      // Darker pink
          visited: '#831843',    // Darkest pink
        },
        
        // Pink focus states
        focus: {
          ring: '#ec4899',       // Bright pink focus ring
          background: '#fdf2f8', // Light pink focus background
        },
      },
      
      // Pink status colors
      status: {
        error: {
          background: '#fef2f2',   // Light red-pink
          text: '#991b1b',         // Keep red for errors (accessibility)
          border: '#fca5a5',       // Light red border
          accent: '#ef4444',       // Red accent
        },
        warning: {
          background: '#fdf2f8',   // Pink background
          text: '#831843',         // Deep pink text
          border: '#f9a8d4',       // Pink border
          accent: '#ec4899',       // Pink accent
        },
        success: {
          background: '#fdf2f8',   // Pink background instead of green
          text: '#831843',         // Deep pink text
          border: '#f9a8d4',       // Pink border
          accent: '#be185d',       // Deep pink accent
        },
        info: {
          background: '#fdf2f8',   // Pink background
          text: '#be185d',         // Deep pink text
          border: '#f9a8d4',       // Pink border
          accent: '#ec4899',       // Bright pink accent
        },
      },
      
      // Pink chat colors
      chat: {
        bubble: {
          user: {
            background: 'linear-gradient(135deg, #be185d 0%, #9d174d 100%)', // Pink gradient
            text: '#fdf2f8',
          },
          assistant: {
            background: 'rgba(190, 24, 93, 0.08)',  // Light pink tint
            text: '#831843',                        // Deep pink text
            border: 'rgba(190, 24, 93, 0.15)',     // Pink border
          },
          system: {
            background: 'rgba(236, 72, 153, 0.1)',  // Bright pink background
            text: '#be185d',                        // Deep pink text
          },
        },
        
        code: {
          background: 'rgba(190, 24, 93, 0.1)',    // Pink code background
          text: '#be185d',                         // Deep pink code text
          block: {
            background: 'rgba(190, 24, 93, 0.05)', // Very light pink block background
            border: 'rgba(190, 24, 93, 0.15)',     // Pink border
          },
        },
      },
    },
    
    // Pink window colors (override OS window styling)
    windowColors: {
      background: 'rgba(253, 242, 248, 0.95)',  // Light pink window background  
      border: 'rgba(190, 24, 93, 0.3)',         // Pink window border
      headerBackground: 'rgba(253, 242, 248, 0.9)', // Light pink header
      headerBorder: 'rgba(190, 24, 93, 0.2)',   // Pink header border
      titleColor: '#831843',                    // Deep pink title color
      shadow: '0 20px 60px rgba(190, 24, 93, 0.3)', // Pink shadow
    },
    
    // Pink-tinted shadow system
    shadowLevels: {
      sm: '0 1px 2px 0 rgba(190, 24, 93, 0.08)',
      base: '0 1px 3px 0 rgba(190, 24, 93, 0.12), 0 1px 2px 0 rgba(190, 24, 93, 0.08)',
      md: '0 4px 6px -1px rgba(190, 24, 93, 0.12), 0 2px 4px -1px rgba(190, 24, 93, 0.08)',
      lg: '0 10px 15px -3px rgba(190, 24, 93, 0.15), 0 4px 6px -2px rgba(190, 24, 93, 0.08)',
      xl: '0 20px 25px -5px rgba(190, 24, 93, 0.18), 0 10px 10px -5px rgba(190, 24, 93, 0.06)',
      '2xl': '0 25px 50px -12px rgba(190, 24, 93, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(190, 24, 93, 0.08)',
    },
    
    windowShadows: {
      light: '0 20px 60px rgba(190, 24, 93, 0.25)',
      dark: '0 20px 60px rgba(190, 24, 93, 0.4)',
      floating: '0 8px 32px rgba(190, 24, 93, 0.15)',
      modal: '0 25px 50px rgba(190, 24, 93, 0.2)',
    },
    
    focusShadows: {
      ring: '0 0 0 2px rgba(236, 72, 153, 0.5)', // Pink focus ring
      ringLarge: '0 0 0 3px rgba(236, 72, 153, 0.5)',
      ringSubtle: '0 0 0 1px rgba(236, 72, 153, 0.3)',
    },
    
    interactiveShadows: {
      hover: '0 4px 12px rgba(190, 24, 93, 0.18)',
      active: '0 2px 4px rgba(190, 24, 93, 0.12)',
      pressed: 'inset 0 2px 0 rgba(190, 24, 93, 0.15)',
    },
    
    semanticShadows: {
      window: {
        floating: '0 8px 32px rgba(190, 24, 93, 0.15)',
        modal: '0 25px 50px rgba(190, 24, 93, 0.2)',
      },
      dropdown: {
        base: '0 4px 6px -1px rgba(190, 24, 93, 0.12), 0 2px 4px -1px rgba(190, 24, 93, 0.08)',
        floating: '0 10px 15px -3px rgba(190, 24, 93, 0.15), 0 4px 6px -2px rgba(190, 24, 93, 0.08)',
      },
      card: {
        raised: '0 1px 3px 0 rgba(190, 24, 93, 0.12), 0 1px 2px 0 rgba(190, 24, 93, 0.08)',
        floating: '0 4px 6px -1px rgba(190, 24, 93, 0.12), 0 2px 4px -1px rgba(190, 24, 93, 0.08)',
      },
      button: {
        hover: '0 4px 12px rgba(190, 24, 93, 0.18)',
        active: '0 2px 4px rgba(190, 24, 93, 0.12)',
      },
      focus: {
        ring: '0 0 0 2px rgba(236, 72, 153, 0.5)',
        ringSubtle: '0 0 0 1px rgba(236, 72, 153, 0.3)',
      },
      chat: {
        message: '0 1px 2px 0 rgba(190, 24, 93, 0.08)',
      },
    },
    
    // Pink themes use tighter spacing tokens from base system
    
    semanticSpacing: {
      // Tighter component spacing using base tokens
      component: {
        buttonPadding: {
          sm: `${spacing[1]} ${spacing[2]}`,    // 4px 8px (using tokens)
          md: `${spacing[2]} ${spacing[3]}`,    // 8px 12px (using tokens)
          lg: `${spacing[3]} ${spacing[4]}`,    // 12px 16px (using tokens)
        },
        inputPadding: `${spacing[2]} ${spacing[3]}`,  // 8px 12px (using tokens)
        cardPadding: spacing[4],                      // 16px (using tokens)
        modalPadding: spacing[5],                     // 20px (using tokens)
      },
      
      // Tighter layout spacing using base tokens
      layout: {
        containerPadding: spacing[4],                 // 16px (using tokens)
        pageMargin: spacing[5],                       // 20px (using tokens)
        sectionGap: spacing[8],                       // 32px (using tokens)
      },
      
      // Tighter window spacing using base tokens
      window: {
        headerPadding: spacing[2], // 8px (tighter than default spacing[3]=12px)
        titleSpacing: spacing[3],  // 12px (tighter than default spacing[8]=32px)
      },
      
      // Tighter header spacing using base tokens
      header: {
        height: spacing[8],                           // 32px (using tokens)
        padding: `${spacing[1]} ${spacing[3]}`,       // 4px 12px (using tokens)
        buttonPadding: spacing[1],                    // 4px (using tokens)
        buttonGap: spacing[1],                        // 4px (using tokens)
        logoGap: spacing[2],                          // 8px (using tokens)
      },
    },

    // Smaller, sharp edges everywhere - 1px border radius  
    semanticRadii: {
      // Smaller sharp buttons
      button: {
        small: '1px',
        base: '1px', 
        large: '1px',
        pill: '1px',        // Even pills are sharp!
      },
      
      // Sharp inputs
      input: {
        base: '1px',
        large: '1px',
      },
      
      // Sharp layout elements
      card: {
        small: '1px',
        base: '1px',
        large: '1px',
      },
      
      modal: {
        base: '1px',
        large: '1px',
      },
      
      // Sharp window elements
      window: {
        base: '1px',                // Sharp windows
        header: '1px 1px 0 0',      // Sharp header (top corners only)
        content: '0 0 1px 1px',     // Sharp content (bottom corners only)
      },
      
      // Sharp chat elements
      chat: {
        bubble: {
          base: '1px',                    // Sharp bubbles
          user: '1px 1px 1px 1px',       // All sharp corners
          assistant: '1px 1px 1px 1px',  // All sharp corners
        },
        attachment: '1px',
        input: '1px',               // Sharp chat input
      },
      
      // Sharp menu elements
      dropdown: {
        base: '1px',
        item: '1px',
      },
      
      menu: {
        base: '1px',
        item: '1px',
      },
      
      // Sharp status elements
      badge: {
        base: '1px',
        pill: '1px',        // Even badges are sharp
      },
      
      notification: {
        base: '1px',
        large: '1px',
      },
      
      // Sharp code elements
      code: {
        inline: '1px',
        block: '1px',
      },
      
      // Sharp image elements
      image: {
        base: '1px',
        large: '1px',
        avatar: '1px',      // Sharp avatars instead of circular
      },
      
      // Sharp table elements
      table: {
        base: '1px',
        cell: '0',          // No radius for cells
      },
    },
    
    // Update radius patterns to use 1px
    radiiPatterns: {
      top: {
        sm: '1px 1px 0 0',
        base: '1px 1px 0 0',
        md: '1px 1px 0 0',
        lg: '1px 1px 0 0',
      },
      bottom: {
        sm: '0 0 1px 1px',
        base: '0 0 1px 1px',
        md: '0 0 1px 1px',
        lg: '0 0 1px 1px',
      },
      left: {
        sm: '1px 0 0 1px',
        base: '1px 0 0 1px',
        md: '1px 0 0 1px',
        lg: '1px 0 0 1px',
      },
      right: {
        sm: '0 1px 1px 0',
        base: '0 1px 1px 0',
        md: '0 1px 1px 0',
        lg: '0 1px 1px 0',
      },
    },
  },
}

// Pink Dark Theme
export const pinkDarkTheme: CustomTheme = {
  name: 'pink-dark', 
  displayName: 'Pink Sharp (Dark)',
  baseTheme: 'dark', // Extends dark theme
  overrides: {
    // Pink color palette overrides for dark theme
    palette: {
      background: {
        primary: '#1a0d13',     // Very dark pink
        secondary: '#2d1320',   // Dark pink  
        tertiary: '#3d1a2d',    // Medium dark pink
        accent: '#4d223a',      // Pink accent
        elevated: '#1a0d13',    // Same as primary for consistency
      },
      
      text: {
        primary: '#fdf2f8',     // Light pink
        secondary: '#f3e8ff',   // Very light pink
        tertiary: '#e879f9',    // Bright pink
        inverse: '#1a0d13',     // Dark pink for light backgrounds
        accent: '#f3e8ff',      // Light pink accent text
      },
      
      border: {
        default: '#4d223a',     // Pink border
        muted: '#2d1320',       // Dark pink border
        emphasis: '#e879f9',    // Bright pink border
        accent: '#f3e8ff',      // Light pink accent border
      },
      
      interactive: {
        // Pink button system for dark theme
        button: {
          primary: {
            background: '#be185d',        // Deep pink
            backgroundHover: '#d946ef',   // Brighter pink
            backgroundActive: '#f3e8ff',  // Light pink
            text: '#fdf2f8',             // Light pink text
            border: '#be185d',
          },
          secondary: {
            background: '#2d1320',        // Dark pink
            backgroundHover: '#3d1a2d',   // Medium dark pink
            backgroundActive: '#4d223a',  // Pink
            text: '#fdf2f8',             // Light pink text
            border: '#4d223a',
          },
          ghost: {
            background: 'transparent',
            backgroundHover: '#2d1320',   // Dark pink hover
            backgroundActive: '#3d1a2d',  // Medium dark pink active
            text: '#f3e8ff',             // Light pink text
            border: 'transparent',
          },
        },
        
        // Pink links for dark theme
        link: {
          default: '#f3e8ff',    // Light pink
          hover: '#e879f9',      // Bright pink
          visited: '#d946ef',    // Medium bright pink
        },
        
        // Pink focus states for dark theme
        focus: {
          ring: '#e879f9',       // Bright pink focus ring
          background: '#1a0d13', // Dark pink focus background
        },
      },
      
      // Pink status colors for dark theme
      status: {
        error: {
          background: '#2d1b1b',   // Dark red-pink
          text: '#fca5a5',         // Light red for errors (accessibility)
          border: '#991b1b',       // Red border
          accent: '#ef4444',       // Red accent
        },
        warning: {
          background: '#1a0d13',   // Dark pink background
          text: '#fdf2f8',         // Light pink text
          border: '#4d223a',       // Pink border
          accent: '#e879f9',       // Bright pink accent
        },
        success: {
          background: '#1a0d13',   // Dark pink background instead of green
          text: '#fdf2f8',         // Light pink text
          border: '#4d223a',       // Pink border
          accent: '#f3e8ff',       // Light pink accent
        },
        info: {
          background: '#1a0d13',   // Dark pink background
          text: '#f3e8ff',         // Light pink text
          border: '#4d223a',       // Pink border
          accent: '#e879f9',       // Bright pink accent
        },
      },
      
      // Pink chat colors for dark theme
      chat: {
        bubble: {
          user: {
            background: 'linear-gradient(135deg, #be185d 0%, #d946ef 100%)', // Pink gradient
            text: '#fdf2f8',
          },
          assistant: {
            background: 'rgba(190, 24, 93, 0.15)',  // Dark pink tint
            text: '#fdf2f8',                        // Light pink text
            border: 'rgba(190, 24, 93, 0.25)',     // Pink border
          },
          system: {
            background: 'rgba(232, 121, 249, 0.15)',  // Bright pink background
            text: '#f3e8ff',                          // Light pink text
          },
        },
        
        code: {
          background: 'rgba(190, 24, 93, 0.15)',    // Dark pink code background
          text: '#f3e8ff',                          // Light pink code text
          block: {
            background: 'rgba(190, 24, 93, 0.08)', // Very dark pink block background
            border: 'rgba(190, 24, 93, 0.25)',     // Pink border
          },
        },
      },
    },
    
    // Pink window colors for dark theme (override OS window styling)
    windowColors: {
      background: 'rgba(26, 13, 19, 0.95)',     // Dark pink window background  
      border: 'rgba(190, 24, 93, 0.4)',         // Pink window border
      headerBackground: 'rgba(26, 13, 19, 0.9)', // Dark pink header
      headerBorder: 'rgba(190, 24, 93, 0.3)',   // Pink header border
      titleColor: '#fdf2f8',                    // Light pink title color
      shadow: '0 20px 60px rgba(190, 24, 93, 0.4)', // Pink shadow
    },
    
    // Pink-tinted shadow system for dark theme
    shadowLevels: {
      sm: '0 1px 2px 0 rgba(190, 24, 93, 0.15)',
      base: '0 1px 3px 0 rgba(190, 24, 93, 0.2), 0 1px 2px 0 rgba(190, 24, 93, 0.15)',
      md: '0 4px 6px -1px rgba(190, 24, 93, 0.2), 0 2px 4px -1px rgba(190, 24, 93, 0.15)',
      lg: '0 10px 15px -3px rgba(190, 24, 93, 0.25), 0 4px 6px -2px rgba(190, 24, 93, 0.15)',
      xl: '0 20px 25px -5px rgba(190, 24, 93, 0.3), 0 10px 10px -5px rgba(190, 24, 93, 0.1)',
      '2xl': '0 25px 50px -12px rgba(190, 24, 93, 0.4)',
      inner: 'inset 0 2px 4px 0 rgba(190, 24, 93, 0.15)',
    },
    
    windowShadows: {
      light: '0 20px 60px rgba(190, 24, 93, 0.4)',
      dark: '0 20px 60px rgba(190, 24, 93, 0.6)',
      floating: '0 8px 32px rgba(190, 24, 93, 0.25)',
      modal: '0 25px 50px rgba(190, 24, 93, 0.35)',
    },
    
    focusShadows: {
      ring: '0 0 0 2px rgba(232, 121, 249, 0.6)', // Brighter pink focus ring for dark
      ringLarge: '0 0 0 3px rgba(232, 121, 249, 0.6)',
      ringSubtle: '0 0 0 1px rgba(232, 121, 249, 0.4)',
    },
    
    interactiveShadows: {
      hover: '0 4px 12px rgba(190, 24, 93, 0.25)',
      active: '0 2px 4px rgba(190, 24, 93, 0.2)',
      pressed: 'inset 0 2px 0 rgba(190, 24, 93, 0.25)',
    },
    
    semanticShadows: {
      window: {
        floating: '0 8px 32px rgba(190, 24, 93, 0.25)',
        modal: '0 25px 50px rgba(190, 24, 93, 0.35)',
      },
      dropdown: {
        base: '0 4px 6px -1px rgba(190, 24, 93, 0.2), 0 2px 4px -1px rgba(190, 24, 93, 0.15)',
        floating: '0 10px 15px -3px rgba(190, 24, 93, 0.25), 0 4px 6px -2px rgba(190, 24, 93, 0.15)',
      },
      card: {
        raised: '0 1px 3px 0 rgba(190, 24, 93, 0.2), 0 1px 2px 0 rgba(190, 24, 93, 0.15)',
        floating: '0 4px 6px -1px rgba(190, 24, 93, 0.2), 0 2px 4px -1px rgba(190, 24, 93, 0.15)',
      },
      button: {
        hover: '0 4px 12px rgba(190, 24, 93, 0.25)',
        active: '0 2px 4px rgba(190, 24, 93, 0.2)',
      },
      focus: {
        ring: '0 0 0 2px rgba(232, 121, 249, 0.6)',
        ringSubtle: '0 0 0 1px rgba(232, 121, 249, 0.4)',
      },
      chat: {
        message: '0 1px 2px 0 rgba(190, 24, 93, 0.15)',
      },
    },
    
    // Pink dark theme uses tighter spacing tokens from base system
    
    semanticSpacing: {
      // Tighter component spacing using base tokens (same as light theme)
      component: {
        buttonPadding: {
          sm: `${spacing[1]} ${spacing[2]}`,    // 4px 8px (using tokens)
          md: `${spacing[2]} ${spacing[3]}`,    // 8px 12px (using tokens)
          lg: `${spacing[3]} ${spacing[4]}`,    // 12px 16px (using tokens)
        },
        inputPadding: `${spacing[2]} ${spacing[3]}`,  // 8px 12px (using tokens)
        cardPadding: spacing[4],                      // 16px (using tokens)
        modalPadding: spacing[5],                     // 20px (using tokens)
      },
      
      // Tighter layout spacing using base tokens
      layout: {
        containerPadding: spacing[4],                 // 16px (using tokens)
        pageMargin: spacing[5],                       // 20px (using tokens)
        sectionGap: spacing[8],                       // 32px (using tokens)
      },
      
      // Tighter window spacing using base tokens
      window: {
        headerPadding: spacing[2], // 8px (tighter than default spacing[3]=12px)
        titleSpacing: spacing[3],  // 12px (tighter than default spacing[8]=32px)
      },
      
      // Tighter header spacing using base tokens
      header: {
        height: spacing[8],                           // 32px (using tokens)
        padding: `${spacing[1]} ${spacing[3]}`,       // 4px 12px (using tokens)
        buttonPadding: spacing[1],                    // 4px (using tokens)
        buttonGap: spacing[1],                        // 4px (using tokens)
        logoGap: spacing[2],                          // 8px (using tokens)
      },
    },

    // Smaller, sharp edges everywhere - 1px border radius (same as light theme)
    semanticRadii: {
      // Smaller sharp buttons 
      button: {
        small: '1px',
        base: '1px',
        large: '1px', 
        pill: '1px',        // Even pills are sharp!
      },
      
      // Sharp inputs
      input: {
        base: '1px',
        large: '1px',
      },
      
      // Sharp layout elements
      card: {
        small: '1px',
        base: '1px',
        large: '1px',
      },
      
      modal: {
        base: '1px',
        large: '1px',
      },
      
      // Sharp window elements
      window: {
        base: '1px',                // Sharp windows
        header: '1px 1px 0 0',      // Sharp header (top corners only)
        content: '0 0 1px 1px',     // Sharp content (bottom corners only)
      },
      
      // Sharp chat elements
      chat: {
        bubble: {
          base: '1px',                    // Sharp bubbles
          user: '1px 1px 1px 1px',       // All sharp corners
          assistant: '1px 1px 1px 1px',  // All sharp corners
        },
        attachment: '1px',
        input: '1px',               // Sharp chat input
      },
      
      // Sharp menu elements
      dropdown: {
        base: '1px',
        item: '1px',
      },
      
      menu: {
        base: '1px',
        item: '1px',
      },
      
      // Sharp status elements
      badge: {
        base: '1px',
        pill: '1px',        // Even badges are sharp
      },
      
      notification: {
        base: '1px',
        large: '1px',
      },
      
      // Sharp code elements
      code: {
        inline: '1px',
        block: '1px',
      },
      
      // Sharp image elements
      image: {
        base: '1px',
        large: '1px',
        avatar: '1px',      // Sharp avatars instead of circular
      },
      
      // Sharp table elements
      table: {
        base: '1px',
        cell: '0',          // No radius for cells
      },
    },
    
    // Update radius patterns to use 1px (same as light theme)
    radiiPatterns: {
      top: {
        sm: '1px 1px 0 0',
        base: '1px 1px 0 0',
        md: '1px 1px 0 0',
        lg: '1px 1px 0 0',
      },
      bottom: {
        sm: '0 0 1px 1px',
        base: '0 0 1px 1px',
        md: '0 0 1px 1px',
        lg: '0 0 1px 1px',
      },
      left: {
        sm: '1px 0 0 1px',
        base: '1px 0 0 1px',
        md: '1px 0 0 1px',
        lg: '1px 0 0 1px',
      },
      right: {
        sm: '0 1px 1px 0',
        base: '0 1px 1px 0',
        md: '0 1px 1px 0',
        lg: '0 1px 1px 0',
      },
    },
  },
}

// No legacy exports needed - use pinkLightTheme and pinkDarkTheme directly
