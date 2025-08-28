import styled from 'styled-components'

export const SelectedFiles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
  padding: 0px 12px;
`

export const FileChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(255, 255, 255, 0.15)' // More visible in dark mode
      : 'rgba(0, 0, 0, 0.08)' // Subtle dark background in light mode
  };
  border: 1px solid ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(129, 129, 129, 0.1)' // Subtle border in dark mode
      : 'rgba(203, 203, 203, 0.1)' // Subtle border in light mode
  };
  border-radius: 20px;
  padding: 4px 6px 4px 12px;
  font-size: 12px;
  font-weight: 550;
  color: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(224, 224, 224, 0.9)' // Light text in dark mode
      : 'rgba(60, 60, 60, 0.9)' // Dark text in light mode
  };
  max-width: 200px;
`

export const FileName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`

export const FilePreview = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(255, 255, 255, 0.08)' // Light background in dark mode
      : 'rgba(0, 0, 0, 0.05)'        // Dark background in light mode
  };
  flex-shrink: 0;
  color: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(224, 224, 224, 0.6)'   // Light icon in dark mode
      : 'rgba(100, 100, 100, 0.7)'   // Dark icon in light mode
  };
`

export const FilePreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
`

export const RemoveFileButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(224, 224, 224, 0.5)'   // Light icon in dark mode
      : 'rgba(100, 100, 100, 0.6)'   // Dark icon in light mode
  };
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${() => 
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(255, 255, 255, 0.1)'  // Light hover background in dark mode
        : 'rgba(0, 0, 0, 0.05)'       // Dark hover background in light mode
    };
    color: ${() => 
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(224, 224, 224, 0.8)'  // Brighter light icon in dark mode
        : 'rgba(60, 60, 60, 0.9)'     // Darker icon in light mode
    };
  }
  
  &:active {
    background: ${() => 
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(255, 255, 255, 0.15)' // Brighter active background in dark mode
        : 'rgba(0, 0, 0, 0.08)'       // Darker active background in light mode
    };
    transform: scale(0.95);
  }
`
