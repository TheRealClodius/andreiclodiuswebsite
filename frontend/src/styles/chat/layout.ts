import styled from 'styled-components'

export const ChatContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'linear-gradient(to bottom, transparent 0%, rgba(26, 26, 26, 0.98) 100%)'
      : 'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.95) 100%)'
  };
  color: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? '#e0e0e0'     // Light text in dark mode
      : '#333'        // Dark text in light mode
  };
`

interface ChatContainerWithBackgroundProps {
  $backgroundImage?: string | null
}

export const ChatContainerWithBackground = styled.div<ChatContainerWithBackgroundProps>`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  
  /* Background image */
  ${props => props.$backgroundImage && `
    background-image: url(${props.$backgroundImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `}
  
  /* Overlay for readability */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${() => 
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'linear-gradient(to bottom, transparent 0%, rgba(26, 26, 26, 0.85) 100%)'
        : 'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.85) 100%)'
    };
    pointer-events: none;
    z-index: 1;
  }
  
  /* Ensure content is above overlay */
  > * {
    position: relative;
    z-index: 2;
  }
  
  color: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? '#e0e0e0'     // Light text in dark mode
      : '#333'        // Dark text in light mode
  };
`

export const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
  overflow-y: auto;
  min-height: 0;
  
  /* Hide scrollbar completely */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* For Firefox */
  scrollbar-width: none;
`

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? '#b0b0b0'     // Muted light text in dark mode
      : '#666'        // Muted dark text in light mode
  };
  padding: 40px;
`

export const EmptyStateTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? '#e0e0e0'     // Light text in dark mode
      : '#333'        // Dark text in light mode
  };
`

export const EmptyStateSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  opacity: 0.7;
  max-width: 300px;
`
