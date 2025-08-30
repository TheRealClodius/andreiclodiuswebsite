import React, { useRef, useEffect, useCallback } from 'react'
import { IoArrowUp } from 'react-icons/io5'
import { HiPlus } from 'react-icons/hi'
import { 
  InputContainer, 
  InputWrapper, 
  PromptInput, 
  SendButton,
  PlusButton 
} from '../../styles/chat'
import { FileChips } from './FileUpload'
import { ReplyChip } from './index'
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
        <PlusButton onClick={handlePlusClick}>
          <HiPlus size={14} />
        </PlusButton>
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
        <SendButton 
          $disabled={!canSend}
          onClick={onSendMessage}
          disabled={!canSend}
        >
          <IoArrowUp size={16} />
        </SendButton>
      </InputWrapper>
    </InputContainer>
  )
}
