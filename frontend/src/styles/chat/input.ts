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
  border-radius: ${({ theme }) => theme.semanticRadii.chat.input};
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
    border-radius: ${({ theme }) => theme.semanticRadii.chat.input};
  }
  
  &.has-scroll::-webkit-scrollbar-thumb {
    background: rgb(0, 0, 255);
    border-radius: ${({ theme }) => theme.semanticRadii.chat.input};
    border-left: 1px solid transparent;
    border-right: 3px solid transparent;
    background-clip: padding-box;
  }
`

// PlusButton removed - replaced with Button primitive from design system

// SendButton removed - replaced with Button primitive from design system
