import { keyframes } from 'styled-components'

// Gentle pulse for typing indicator
export const pulseAnimation = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`

// Message entrance animation
export const messageEntranceVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 500, 
      damping: 30
    }
  }
}
