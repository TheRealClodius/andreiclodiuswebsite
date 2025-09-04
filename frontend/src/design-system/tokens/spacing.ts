/**
 * Spacing Tokens - Consistent spacing system
 * 
 * Based on a 4px base unit (0.25rem) for mathematical consistency
 * and semantic tokens for common UI patterns.
 */

// Base spacing scale (4px base unit)
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px  
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  9: '2.25rem',   // 36px
  10: '2.5rem',   // 40px
  11: '2.75rem',  // 44px
  12: '3rem',     // 48px
  14: '3.5rem',   // 56px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  28: '7rem',     // 112px
  32: '8rem',     // 128px
  36: '9rem',     // 144px
  40: '10rem',    // 160px
  44: '11rem',    // 176px
  48: '12rem',    // 192px
  52: '13rem',    // 208px
  56: '14rem',    // 224px
  60: '15rem',    // 240px
  64: '16rem',    // 256px
  72: '18rem',    // 288px
  80: '20rem',    // 320px
  96: '24rem',    // 384px
} as const

// Semantic spacing tokens for common UI patterns
export const semanticSpacing = {
  // Component internal spacing
  component: {
    buttonPadding: {
      sm: `${spacing[2]} ${spacing[3]}`,   // 8px 12px
      md: `${spacing[3]} ${spacing[4]}`,   // 12px 16px
      lg: `${spacing[4]} ${spacing[6]}`,   // 16px 24px
    },
    buttonMinHeight: {
      sm: spacing[8],                      // 32px
      md: spacing[10],                     // 40px  
      lg: spacing[12],                     // 48px
    },
    inputPadding: `${spacing[3]} ${spacing[4]}`,     // 12px 16px
    cardPadding: spacing[6],                          // 24px
    modalPadding: spacing[8],                         // 32px
  },
  
  // Layout spacing
  layout: {
    sectionGap: spacing[16],                          // 64px
    containerPadding: spacing[6],                     // 24px
    pageMargin: spacing[8],                           // 32px
  },
  
  // Window and OS-specific spacing (from your current system)
  window: {
    headerHeight: spacing[8],                         // 32px (from OS_CONSTANTS.HEADER_HEIGHT)
    borderRadius: spacing[3],                         // 12px (from OS_CONSTANTS.BORDER_RADIUS)
    controlButtonSize: spacing[3],                    // 12px (from OS_CONSTANTS.CONTROL_BUTTON_SIZE)
    controlButtonGap: spacing[2],                     // 8px (from OS_CONSTANTS.CONTROL_BUTTON_GAP)
    resizeHandleWidth: spacing[3],                    // 12px (from OS_CONSTANTS.RESIZE_HANDLE.EDGE_WIDTH)
    resizeCornerSize: spacing[4],                     // 16px (from OS_CONSTANTS.RESIZE_HANDLE.CORNER_SIZE)
    headerPadding: spacing[3],                        // 12px (header horizontal padding)
    titleSpacing: spacing[8],                         // 32px (spacer width for title alignment)
  },
  
  // Header/menu specific spacing
  header: {
    height: spacing[8],                               // 32px (header height)
    padding: spacing[1],                              // 4px (header padding)
    buttonPadding: `0px ${spacing[2]}`,               // 0px 8px (header button padding)
    buttonGap: spacing[1],                            // 4px (gap between header items)
    logoGap: spacing[1],                              // 4px (gap in logo button)
  },
  
  // Chat-specific spacing (extracted from your current chat styles)
  chat: {
    messageBubbleGap: spacing[4],                     // 16px
    messagePadding: `${spacing[2]} ${spacing[3]}`,   // 8px 12px (from MessageBubble padding)
    messageContainerPadding: spacing[5],             // 20px (from MessagesContainer padding)
    messageListGap: spacing[4],                      // 16px (from MessagesContainer gap)
    inputPadding: spacing[4],                        // 16px
    attachmentGap: spacing[2],                       // 8px
  },
  
  // Status and notification spacing
  status: {
    messagePadding: `${spacing[2]} ${spacing[4]}`,   // 8px 16px
    notificationGap: spacing[2],                     // 8px
    badgePadding: `${spacing[1]} ${spacing[2]}`,     // 4px 8px
  },
  
  // Interactive element spacing
  interactive: {
    dropdownPadding: spacing[1],                     // 4px (from Dropdown padding)
    dropdownItemPadding: `${spacing[1]} ${spacing[2]}`, // 4px 8px (from DropdownItem)
    menuItemGap: spacing[2],                         // 8px
    iconGap: spacing[2],                             // 8px
  },
} as const

// Common spacing patterns
export const spacingPatterns = {
  // Stack spacing (vertical gaps)
  stack: {
    xs: spacing[1],   // 4px
    sm: spacing[2],   // 8px
    md: spacing[4],   // 16px
    lg: spacing[6],   // 24px
    xl: spacing[8],   // 32px
  },
  
  // Inline spacing (horizontal gaps)
  inline: {
    xs: spacing[1],   // 4px
    sm: spacing[2],   // 8px  
    md: spacing[3],   // 12px
    lg: spacing[4],   // 16px
    xl: spacing[6],   // 24px
  },
  
  // Inset spacing (padding)
  inset: {
    xs: spacing[2],   // 8px
    sm: spacing[3],   // 12px
    md: spacing[4],   // 16px
    lg: spacing[6],   // 24px
    xl: spacing[8],   // 32px
  },
} as const

// Type definitions
export type SpacingTokens = typeof spacing
export type SemanticSpacingTokens = typeof semanticSpacing
export type SpacingPatternTokens = typeof spacingPatterns
