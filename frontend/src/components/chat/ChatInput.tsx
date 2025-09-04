import React, { useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { IoArrowUp } from 'react-icons/io5'
import { HiPlus } from 'react-icons/hi'
import { 
  InputContainer, 
  InputWrapper, 
  PromptInput
} from '../../styles/chat'
import { Button } from '../../design-system'
import { FileChips } from './FileUpload'
import { ReplyChip } from './index'

// Styled wrapper to fix transform conflicts
const PlusButtonWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  z-index: 2;
  
  /* Override any transforms from the Button component */
  button {
    width: 100%;
    height: 100%;
    border-radius: ${({ theme }) => theme.semanticRadii.button.small} !important;
    padding: 0 !important;
    min-height: auto !important;
    
    &:hover:not(:disabled),
    &:active:not(:disabled) {
      transform: none !important;
    }
  }
`

// Styled wrapper for send button  
const SendButtonWrapper = styled.div`
  button {
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radii.sm} !important; /* Use 4px radii.sm token directly */
    padding: 0 !important;
    min-height: auto !important;
    border: none !important; /* Remove any border/outline */
    outline: none !important;
  }
`
import { Message } from '../../hooks/useChatMessages'
import { GroupMessage } from '../../hooks/useGroupChat'
import { adjustTextareaHeight } from '../../utils/chatUtils'

interface ChatInputProps {
  inputValue: string
  selectedFiles: File[]
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: (index: number) => void
  onSendMessage: () => void
  shouldFocusInput: boolean
  setShouldFocusInput: (focus: boolean) => void
  placeholder?: string
  replyToMessage?: Message | GroupMessage | null
  onCancelReply?: () => void
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  selectedFiles,
  onInputChange,
  onKeyDown,
  onFileSelect,
  onRemoveFile,
  onSendMessage,
  shouldFocusInput,
  setShouldFocusInput,
  placeholder = "Go ahead...",
  replyToMessage,
  onCancelReply
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-resize textarea
  const handleInputResize = useCallback(() => {
    if (inputRef.current) {
      adjustTextareaHeight(inputRef.current)
    }
  }, [])

  useEffect(() => {
    handleInputResize()
  }, [inputValue, handleInputResize])

  // Handle input focus after actions
  useEffect(() => {
    if (shouldFocusInput && inputRef.current) {
      inputRef.current.focus()
      setShouldFocusInput(false)
    }
  }, [shouldFocusInput, setShouldFocusInput])

  const handlePlusClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const canSend = inputValue.trim() || selectedFiles.length > 0

  return (
    <InputContainer>
      {replyToMessage && onCancelReply && (
        <ReplyChip 
          message={replyToMessage}
          onRemove={onCancelReply}
        />
      )}
      
      <FileChips
        selectedFiles={selectedFiles}
        onRemoveFile={onRemoveFile}
      />
      
      <InputWrapper>
        <PlusButtonWrapper>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePlusClick}
            asMotion
          >
            <HiPlus size={14} />
          </Button>
        </PlusButtonWrapper>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          style={{ display: 'none' }}
          onChange={onFileSelect}
        />
        <PromptInput
          ref={inputRef}
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={1}
        />
        <SendButtonWrapper>
          <Button
            variant="primary"
            size="sm"
            disabled={!canSend}
            onClick={onSendMessage}
            asMotion
          >
            <IoArrowUp size={16} />
          </Button>
        </SendButtonWrapper>
      </InputWrapper>
    </InputContainer>
  )
}
