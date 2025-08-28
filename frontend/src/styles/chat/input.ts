import styled from 'styled-components'

export const InputContainer = styled.div`
  padding: 20px;
  background: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? `linear-gradient(
          to bottom,
          transparent 0%,
          rgb(27, 26, 26) 100%
        )` 
      : `linear-gradient(
          to bottom,
          transparent 0%,
          rgb(245, 245, 245) 100%
        )`
  };
  position: relative;
  margin-top: -80px;
  padding-top: 16px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 130px;
    backdrop-filter: blur(12px);
    -webkit-mask: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0.8) 30%,
      rgba(255, 255, 255, 0.4) 60%,
      rgba(255, 255, 255, 0) 100%
    );
    mask: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0.85) 30%,
      rgba(255, 255, 255, 0.5) 60%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 2;
  }
`

export const InputWrapper = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  gap: 8px;
  align-items: center;
  background: rgba(198, 212, 0, 0);
`

export const PromptInput = styled.textarea`
  flex: 1;
  min-height: 26px;
  max-height: 120px;
  padding: 12px 12px 14px 38px;
  border: 1px solid ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(102, 102, 102, 0.2)' 
      : 'rgba(0, 0, 0, 0.15)'
  };
  border-radius: 24px;
  background: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(24, 23, 23, 0.91)' 
      : 'rgba(255, 255, 255, 0.9)'
  };
  color: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? '#e0e0e0' 
      : '#333333'
  };
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-size: 14px;
  line-height: 1.4;
  resize: none;
  outline: none;
  text-align: left;
  
  /* Clip scrollbar to rounded shape */
  &.has-scroll {
    clip-path: inset(0 0 0 0 round 24px);
  }
  
  &::placeholder {
    color: ${() => 
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(224, 224, 224, 0.5)' 
        : 'rgba(100, 100, 100, 0.6)'
    };
  }
  
  &:focus {
    border-color: ${() => 
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(111, 111, 111, 0.3)' 
        : 'rgba(65, 69, 73, 0.4)'
    };
    background: ${() => 
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(19, 19, 19, 0.6)' 
        : 'rgba(255, 255, 255, 0.95)'
    };
  }
  
  /* Hide scrollbar by default */
  &::-webkit-scrollbar {
    width: 0px;
    display: none;
  }
  
  /* Show scrollbar when content is expanded */
  &.has-scroll::-webkit-scrollbar {
    width: 8px;
    display: block;
  }
  
  &.has-scroll::-webkit-scrollbar-track {
    background: transparent;
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
    border-radius: 24px;
  }
  
  &.has-scroll::-webkit-scrollbar-thumb {
    background: rgb(0, 0, 255);
    border-radius: 24px;
    border-left: 1px solid transparent;
    border-right: 3px solid transparent;
    background-clip: padding-box;
  }
`

export const PlusButton = styled.button`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(224, 224, 224, 0.5)' 
      : 'rgba(100, 100, 100, 0.6)'
  };
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background-color 0.2s ease, color 0.2s ease;
  z-index: 2;
  
  &:hover {
    background: ${() => 
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.08)'
    };
    color: ${() => 
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(224, 224, 224, 0.8)' 
        : 'rgba(60, 60, 60, 0.9)'
    };
  }
  
  &:active {
    background: ${() => 
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(255, 255, 255, 0.15)' 
        : 'rgba(0, 0, 0, 0.12)'
    };
    transform: translateY(-50%) scale(0.95);
  }
`

export const SendButton = styled.button<{ $disabled: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: none;
  background: ${props => {
    if (props.$disabled) {
      // Use proper contrast for disabled state that works in both themes
      return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(157, 157, 157, 0.1)' // Slightly more visible in dark mode
        : 'rgba(97, 97, 97, 0.1)' // Dark background in light mode
    }
    // Active state - works in both themes
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'rgba(255, 255, 255, 0.85)' // Light button in dark mode
      : 'rgba(44, 44, 44, 0.9)' // Dark button in light mode
  }};
  color: ${props => {
    if (props.$disabled) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(255, 255, 255, 0.4)' 
        : 'rgba(0, 0, 0, 0.4)'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? '#000' // Dark text on light button in dark mode
      : '#fff' // Light text on dark button in light mode
  }};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  outline: none;
  
  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 4px 12px ${() => 
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'rgba(255, 255, 255, 0.25)'
        : 'rgba(0, 0, 0, 0.25)'
    };
  }
  
  &:active:not(:disabled) {
    transform: scale(0.95);
    transition: all 0.1s ease;
  }
`
