import styled from 'styled-components'
import { motion } from 'framer-motion'
import { pulseAnimation } from '../../design-system/tokens/motion'

export const MessageBubble = styled(motion.div)<{ $isHuman: boolean }>`
  max-width: ${props => props.$isHuman ? '70%' : '85%'};
  align-self: ${props => props.$isHuman ? 'flex-end' : 'flex-start'};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`}; /* 8px 12px */
  border-radius: ${({ theme }) => theme.semanticRadii.chat.bubble.base};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-family: ${({ theme }) => theme.fontFamily.sans.join(', ')};
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  line-height: ${({ theme }) => theme.lineHeight.relaxed};
  word-wrap: break-word;
  position: relative;
  
  ${props => props.$isHuman ? `
    background: ${props.theme.palette.chat.bubble.user.background};
    color: ${props.theme.palette.chat.bubble.user.text};
    border-bottom-right-radius: ${props.theme.semanticRadii.chat.bubble.tail};
  ` : `
    background: ${props.theme.palette.chat.bubble.assistant.background};
    color: ${props.theme.palette.chat.bubble.assistant.text};
    border-bottom-left-radius: ${props.theme.semanticRadii.chat.bubble.tail};
    border: 1px solid ${props.theme.palette.chat.bubble.assistant.border};
    
    /* Markdown styling for AI messages */
    & strong {
      font-weight: ${props.theme.fontWeight.semibold};
      color: ${props.theme.palette.chat.markdown.strong};
    }
    
    & em {
      font-style: italic;
      opacity: 0.9;
      color: ${props.theme.palette.chat.markdown.emphasis};
    }
    
    & code {
      background: ${props.theme.palette.chat.markdown.codeBackground};
      color: ${props.theme.palette.chat.markdown.code};
      padding: ${props.theme.spacing[0]} ${props.theme.spacing[1]}; /* 2px 4px */
      border-radius: ${props.theme.semanticRadii.chat.code};
      font-family: ${props.theme.fontFamily.mono.join(', ')};
      font-size: 0.9em;
    }
    
    & pre {
      background: ${props.theme.palette.chat.markdown.codeBlockBackground};
      border: 1px solid ${props.theme.palette.chat.markdown.codeBlockBorder};
      border-radius: ${props.theme.semanticRadii.chat.codeBlock};
      padding: ${props.theme.spacing[3]}; /* 12px */
      overflow-x: auto;
      margin: ${props.theme.spacing[2]} 0; /* 8px 0 */
      
      & code {
        background: none;
        color: inherit;
        padding: 0;
        border-radius: 0;
        font-size: 0.85em;
      }
    }
    
    & a {
      color: ${props.theme.palette.chat.markdown.link};
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
        color: ${props.theme.palette.chat.markdown.linkHover};
      }
    }
    
    & ul, & ol {
      margin: ${props.theme.spacing[2]} 0; /* 8px 0 */
      padding-left: ${props.theme.spacing[5]}; /* 20px */
    }
    
    & li {
      margin: ${props.theme.spacing[1]} 0; /* 4px 0 */
    }
    
    & h1, & h2, & h3, & h4, & h5, & h6 {
      margin: ${props.theme.spacing[3]} 0 ${props.theme.spacing[2]} 0; /* 12px 0 8px 0 */
      font-weight: ${props.theme.fontWeight.semibold};
      color: ${props.theme.palette.chat.markdown.heading};
    }
    
    & h1 { 
      font-size: ${props.theme.fontSize.lg}; 
      font-family: ${props.theme.fontFamily.sans.join(', ')};
    }
    & h2 { 
      font-size: ${props.theme.fontSize.base}; 
      font-family: ${props.theme.fontFamily.sans.join(', ')};
    }
    & h3 { 
      font-size: ${props.theme.fontSize.sm}; 
      font-family: ${props.theme.fontFamily.sans.join(', ')};
    }
    & h4, & h5, & h6 { 
      font-size: ${props.theme.fontSize.sm}; 
      font-family: ${props.theme.fontFamily.sans.join(', ')};
    }
    
    & p {
      margin: ${props.theme.spacing[2]} 0; /* 8px 0 */
      line-height: ${props.theme.lineHeight.relaxed};
      
      &:first-child {
        margin-top: 0;
      }
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    & blockquote {
      border-left: 3px solid ${props.theme.palette.chat.markdown.blockquoteBorder};
      padding-left: ${props.theme.spacing[3]}; /* 12px */
      margin: ${props.theme.spacing[2]} 0; /* 8px 0 */
      opacity: 0.8;
    }
    
    /* Table styling */
    & table {
      width: 100%;
      border-collapse: collapse;
      margin: ${props.theme.spacing[3]} 0; /* 12px 0 */
      border-radius: ${props.theme.semanticRadii.chat.table};
      overflow: hidden;
      border: 1px solid ${props.theme.palette.chat.markdown.tableBorder};
    }
    
    & th, & td {
      padding: ${props.theme.spacing[2]} ${props.theme.spacing[3]}; /* 8px 12px */
      border-bottom: 0px solid ${props.theme.palette.chat.markdown.tableCellBorder};
      text-align: left;
      vertical-align: top;
    }
    
    & th {
      background: ${props.theme.palette.chat.markdown.tableHeaderBackground};
      font-weight: ${props.theme.fontWeight.semibold};
      color: ${props.theme.palette.chat.markdown.tableHeaderText};
    }
    
    & tr:nth-child(odd) {
      background: ${props.theme.palette.chat.markdown.tableRowOdd};
    }
    
    & tr:nth-child(even) {
      background: ${props.theme.palette.chat.markdown.tableRowEven};
    }
    
    & tr:last-child td {
      border-bottom: none;
    }
    
    & td:first-child, & th:first-child {
      padding-left: ${props.theme.spacing[4]}; /* 16px */
    }
    
    & td:last-child, & th:last-child {
      padding-right: ${props.theme.spacing[4]}; /* 16px */
    }
  `}
`

export const MessageHeader = styled.div<{ $isHuman: boolean; $userColor?: string }>`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[1]}; /* 4px */
  opacity: 0.9;
  color: ${props => {
    if (props.$userColor) {
      // Use custom user color for group chat
      return props.$userColor;
    }
    // Default colors for non-group chat
    return props.$isHuman 
      ? props.theme.palette.chat.header.userText
      : props.theme.palette.chat.header.assistantText;
  }};
`

export const MessageTime = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  font-family: ${({ theme }) => theme.fontFamily.sans.join(', ')};
  opacity: 0.6;
  margin-top: ${({ theme }) => theme.spacing[1]}; /* 4px */
  text-align: right;
`

export const StatusIndicator = styled.div<{ $isTyping: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]}; /* 8px */
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`}; /* 8px 16px */
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.palette.chat.status.text};
  opacity: ${props => props.$isTyping ? 1 : 0};
  transition: opacity 0.3s ease;
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.palette.chat.status.indicator};
    animation: ${props => props.$isTyping ? `${pulseAnimation} 1.5s infinite` : 'none'};
  }
`
