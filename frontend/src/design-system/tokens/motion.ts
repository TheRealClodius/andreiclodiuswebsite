/**
 * Motion Tokens - Centralized animation values for Framer Motion
 * 
 * These tokens standardize all animations across the OS to ensure
 * consistent timing, easing, and movement patterns.
 */

import { keyframes } from 'styled-components'

// CSS Keyframe animations
export const pulseAnimation = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`

// Duration values in milliseconds (Framer Motion format)
export const duration = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
} as const

// Spring physics configurations
export const spring = {
  // Gentle spring for subtle animations
  gentle: { 
    stiffness: 300, 
    damping: 25 
  },
  
  // Bouncy spring - matches your current MessageBubble animations
  bouncy: { 
    stiffness: 500, 
    damping: 30 
  },
  
  // Snappy spring for quick, responsive interactions
  snappy: { 
    stiffness: 700, 
    damping: 35 
  },
} as const

// Easing curves as arrays (Framer Motion format)
export const easing = {
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: [0.25, 0.46, 0.45, 0.94],
} as const

// Pre-configured animation presets matching your current patterns
export const presets = {
  // Message entrance animation (extracted from your MessageBubble)
  messageEntrance: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { type: "spring" as const, ...spring.bouncy }
  },
  
  // Window open animation (extracted from your Window component)
  windowOpen: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: duration.normal / 1000, ease: easing.easeOut }
  },
  
  // Simple fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: duration.fast / 1000 }
  },
  
  // Menu item entrance (extracted from your menu components)
  menuItemEntrance: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.fast / 1000, ease: easing.easeOut }
  },
  
  // Slide up animation
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring" as const, ...spring.gentle }
  },
  
  // Status message entrance (subtle slide up)
  statusMessage: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.fast / 1000 }
  },
  
  // Scale entrance for icons/important elements
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: duration.fast / 1000, ease: easing.easeOut }
  },
  
  // Staggered animations for sequential reveals
  staggered: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.normal / 1000, ease: easing.easeOut }
  },
  
  // Dropdown entrance animation
  dropdownEntrance: {
    initial: { opacity: 0, y: -2, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -2, scale: 0.95 },
    transition: { duration: duration.fast / 1000, ease: easing.easeOut }
  },
  
  // Dropdown item animation
  dropdownItem: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { type: "spring" as const, ...spring.bouncy, duration: duration.fast / 1000 }
  },
  
  // Submenu slide animation
  submenuSlide: {
    initial: { opacity: 0, x: -2 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -2 },
    transition: { type: "spring" as const, ...spring.gentle, duration: duration.fast / 1000 }
  },
  
  // Hover animations for interactive elements
  itemHover: {
    whileHover: { 
      scale: 1,
      transition: { type: "spring" as const, ...spring.snappy }
    },
    whileTap: { 
      scale: 1,
      transition: { duration: duration.instant / 1000 }
    }
  }
} as const

// Combined motion tokens export
export const motion = {
  duration,
  spring,
  easing,
  presets,
} as const

export type MotionTokens = typeof motion
