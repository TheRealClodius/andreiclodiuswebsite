import styled from 'styled-components'
import { motion } from 'framer-motion'
import { pulseAnimation } from './animations'

export const MessageBubble = styled(motion.div)<{ $isHuman: boolean }>`
  max-width: ${props => props.$isHuman ? '70%' : '85%'};
  align-self: ${props => props.$isHuman ? 'flex-end' : 'flex-start'};
  padding: 8px 10px;
  border-radius: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  position: relative;
  
  ${props => props.$isHuman ? `
    background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
    color: white;
    border-bottom-right-radius: 6px;
  ` : `
    background: ${window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(255, 255, 255, 0.08)'  // Light background in dark mode
      : 'rgba(0, 0, 0, 0.06)'        // Dark background in light mode
    };
    color: ${window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? '#e0e0e0'                    // Light text in dark mode
      : '#333'                       // Dark text in light mode
    };
    border-bottom-left-radius: 6px;
    border: 1px solid ${window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'rgba(255, 255, 255, 0.1)'  // Light border in dark mode
      : 'rgba(0, 0, 0, 0.08)'        // Dark border in light mode
    };
    
    /* Markdown styling for AI messages */
    & strong {
      font-weight: 600;
      color: ${window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? '#fff'                     // Bright white for bold in dark mode
        : '#000'                     // Black for bold in light mode
      };
    }
    
    & em {
      font-style: italic;
      opacity: 0.9;
    }
    
    & code {
      background: ${window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(255, 255, 255, 0.15)' // Light code background in dark mode
        : 'rgba(0, 0, 0, 0.08)'        // Dark code background in light mode
      };
      color: ${window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? '#ff6b6b'                    // Light red for code in dark mode
        : '#d63384'                    // Dark red for code in light mode
      };
      padding: 2px 4px;
      border-radius: 4px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      font-size: 0.9em;
    }
    
    & pre {
      background: ${window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(255, 255, 255, 0.1)'  // Light code block background in dark mode
        : 'rgba(0, 0, 0, 0.05)'        // Dark code block background in light mode
      };
      border: 1px solid ${window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(255, 255, 255, 0.2)'  // Light border in dark mode
        : 'rgba(0, 0, 0, 0.1)'         // Dark border in light mode
      };
      border-radius: 8px;
      padding: 12px;
      overflow-x: auto;
      margin: 8px 0;
      
      & code {
        background: none;
        color: inherit;
        padding: 0;
        border-radius: 0;
        font-size: 0.85em;
      }
    }
    
    & a {
      color: ${window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? '#64b5f6'                    // Light blue for links in dark mode
        : '#1976d2'                    // Dark blue for links in light mode
      };
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    & ul, & ol {
      margin: 8px 0;
      padding-left: 20px;
    }
    
    & li {
      margin: 4px 0;
    }
    
    & h1, & h2, & h3, & h4, & h5, & h6 {
      margin: 12px 0 8px 0;
      font-weight: 600;
      color: ${window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? '#fff'                       // Bright white for headers in dark mode
        : '#000'                       // Black for headers in light mode
      };
    }
    
    & h1 { font-size: 1.3em; }
    & h2 { font-size: 1.2em; }
    & h3 { font-size: 1.1em; }
    & h4, & h5, & h6 { font-size: 1em; }
    
    & p {
      margin: 8px 0;
      line-height: 1.5;
      
      &:first-child {
        margin-top: 0;
      }
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    & blockquote {
      border-left: 3px solid ${window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(255, 255, 255, 0.3)'  // Light border in dark mode
        : 'rgba(0, 0, 0, 0.2)'         // Dark border in light mode
      };
      padding-left: 12px;
      margin: 8px 0;
      opacity: 0.8;
    }
    
    /* Table styling */
    & table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid ${window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(255, 255, 255, 0.2)'  // Light border in dark mode
        : 'rgba(0, 0, 0, 0.1)'         // Dark border in light mode
      };
    }
    
    & th, & td {
      padding: 8px 12px;
      border-bottom: 0px solid ${window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(255, 255, 255, 0.1)'  // Light border in dark mode
        : 'rgba(0, 0, 0, 0.08)'        // Dark border in light mode
      };
      text-align: left;
      vertical-align: top;
    }
    
    & th {
      background: ${window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(255, 255, 255, 0.1)'  // Light header background in dark mode
        : 'rgba(0, 0, 0, 0.1)'        // Dark header background in light mode
      };
      font-weight: 600;
      color: ${window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? '#fff'                       // White header text in dark mode
        : '#000'                       // Black header text in light mode
      };
    }
    
    & tr:nth-child(odd) {
      background: ${window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(0, 0, 0, 0.2)'        // Slightly darker than bubble in dark mode
        : 'rgba(255, 255, 255, 0.45)'  // Slightly lighter than bubble in light mode
      };
    }
    
    & tr:nth-child(even) {
      background: ${window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(255, 255, 255, 0.03)' // Subtle stripe in dark mode
        : 'rgba(0, 0, 0, 0.02)'        // Subtle stripe in light mode
      };
    }
    
    & tr:last-child td {
      border-bottom: none;
    }
    
    & td:first-child, & th:first-child {
      padding-left: 16px;
    }
    
    & td:last-child, & th:last-child {
      padding-right: 16px;
    }
  `}
`

export const MessageHeader = styled.div<{ $isHuman: boolean }>`
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 4px;
  opacity: 0.8;
  color: ${props => props.$isHuman ? 'rgba(190, 202, 255, 0.9)' : (
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? '#b0b0b0'      // Muted light text in dark mode
      : '#666'         // Muted dark text in light mode
  )};
`

export const MessageTime = styled.div`
  font-size: 10px;
  opacity: 0.6;
  margin-top: 4px;
  text-align: right;
`

export const StatusIndicator = styled.div<{ $isTyping: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 12px;
  color: ${() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? '#b0b0b0'      // Muted light text in dark mode
      : '#666'         // Muted dark text in light mode
  };
  opacity: ${props => props.$isTyping ? 1 : 0};
  transition: opacity 0.3s ease;
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #007AFF;
    animation: ${props => props.$isTyping ? `${pulseAnimation} 1.5s infinite` : 'none'};
  }
`
