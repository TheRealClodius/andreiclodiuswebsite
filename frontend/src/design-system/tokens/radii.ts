/**
 * Border Radius Tokens - Consistent corner radius system
 * 
 * Provides a range of border radius values for different UI elements
 * from sharp corners to fully rounded elements.
 */

// Base border radius scale
export const radii = {
  none: '0',
  xs: '0.125rem',  // 2px
  sm: '0.25rem',   // 4px
  base: '0.375rem', // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.25rem', // 20px
  '3xl': '1.5rem',  // 24px
  full: '9999px',   // Fully rounded
} as const

// Semantic border radius tokens for UI elements
export const semanticRadii = {
  // Interactive elements
  button: {
    small: radii.sm,     // 4px
    base: radii.base,    // 6px
    large: radii.md,     // 8px
    pill: radii.full,    // Fully rounded pill buttons
  },
  
  input: {
    base: radii.base,    // 6px - consistent with buttons
    large: radii.md,     // 8px
  },
  
  // Layout elements
  card: {
    small: radii.md,     // 8px
    base: radii.lg,      // 12px
    large: radii.xl,     // 16px
  },
  
  modal: {
    base: radii.lg,      // 12px
    large: radii.xl,     // 16px
  },
  
  // Window and OS elements (from your current system)
  window: {
    base: radii.lg,      // 12px (from OS_CONSTANTS.BORDER_RADIUS)
    header: `${radii.lg} ${radii.lg} 0 0`, // Top corners only
    content: `0 0 ${radii.lg} ${radii.lg}`, // Bottom corners only
  },
  
  // Chat-specific radii (extracted from your current styles)
  chat: {
    bubble: {
      base: '20px',              // From MessageBubble border-radius
      user: '20px 20px 6px 20px', // User bubble with bottom-right reduction
      assistant: '20px 20px 20px 6px', // Assistant bubble with bottom-left reduction
      tail: '6px',               // Tail corner reduction
    },
    attachment: radii.md,        // 8px for attachment previews
    input: radii.lg,             // 12px for chat input
    code: radii.sm,              // 4px for inline code
    codeBlock: radii.md,         // 8px for code blocks
    table: radii.md,             // 8px for tables
  },
  
  // Menu and dropdown elements
  dropdown: {
    base: radii.md,      // 8px
    item: radii.sm,      // 4px for individual items
  },
  
  menu: {
    base: radii.md,      // 8px
    item: radii.sm,      // 4px for menu items
  },
  
  // Status and notification elements
  badge: {
    base: radii.base,    // 6px
    pill: radii.full,    // Fully rounded badges
  },
  
  notification: {
    base: radii.md,      // 8px
    large: radii.lg,     // 12px
  },
  
  // Code and content elements
  code: {
    inline: radii.sm,    // 4px (from current MessageBubble code styling)
    block: radii.md,     // 8px (from current MessageBubble pre styling)
  },
  
  // Image and media elements
  image: {
    base: radii.md,      // 8px
    large: radii.lg,     // 12px
    avatar: radii.full,  // Circular avatars
  },
  
  // Table elements
  table: {
    base: radii.md,      // 8px (from current MessageBubble table styling)
    cell: radii.none,    // No radius for table cells
  },
} as const

// Border radius patterns for common combinations
export const radiiPatterns = {
  // Top corners only
  top: {
    sm: `${radii.sm} ${radii.sm} 0 0`,
    base: `${radii.base} ${radii.base} 0 0`,
    md: `${radii.md} ${radii.md} 0 0`,
    lg: `${radii.lg} ${radii.lg} 0 0`,
  },
  
  // Bottom corners only
  bottom: {
    sm: `0 0 ${radii.sm} ${radii.sm}`,
    base: `0 0 ${radii.base} ${radii.base}`,
    md: `0 0 ${radii.md} ${radii.md}`,
    lg: `0 0 ${radii.lg} ${radii.lg}`,
  },
  
  // Left corners only
  left: {
    sm: `${radii.sm} 0 0 ${radii.sm}`,
    base: `${radii.base} 0 0 ${radii.base}`,
    md: `${radii.md} 0 0 ${radii.md}`,
    lg: `${radii.lg} 0 0 ${radii.lg}`,
  },
  
  // Right corners only
  right: {
    sm: `0 ${radii.sm} ${radii.sm} 0`,
    base: `0 ${radii.base} ${radii.base} 0`,
    md: `0 ${radii.md} ${radii.md} 0`,
    lg: `0 ${radii.lg} ${radii.lg} 0`,
  },
} as const

// Type definitions
export type RadiiTokens = typeof radii
export type SemanticRadiiTokens = typeof semanticRadii
export type RadiiPatternTokens = typeof radiiPatterns
