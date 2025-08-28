/**
 * Formats a Date object to a human-readable time string
 * @param date - The date to format
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export const formatTime = (date: Date): string => {
  try {
    return date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
  } catch (error) {
    console.error('Error formatting time:', error)
    return ''
  }
}

/**
 * Formats file size in bytes to human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Generates a unique message ID
 * @param prefix - Optional prefix for the ID
 * @returns Unique message ID
 */
export const generateMessageId = (prefix: string = 'msg'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Checks if a file type is an image
 * @param type - MIME type of the file
 * @returns True if the file is an image
 */
export const isImageType = (type: string): boolean => {
  return type.startsWith('image/')
}

/**
 * Validates message content
 * @param content - Message content to validate
 * @returns True if the message is valid
 */
export const isValidMessage = (content: string): boolean => {
  return content.trim().length > 0
}

/**
 * Sanitizes message content for display
 * @param content - Raw message content
 * @returns Sanitized content
 */
export const sanitizeMessage = (content: string): string => {
  return content.trim()
}

/**
 * Debounce function for input handling
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Scrolls an element to the bottom smoothly
 * @param element - Element to scroll
 */
export const scrollToBottom = (element: HTMLElement): void => {
  element.scrollTop = element.scrollHeight
}

/**
 * Auto-adjusts textarea height based on content
 * @param textarea - Textarea element
 * @param maxHeight - Maximum height in pixels
 */
export const adjustTextareaHeight = (textarea: HTMLTextAreaElement, maxHeight: number = 120): void => {
  textarea.style.height = 'auto'
  const scrollHeight = textarea.scrollHeight
  textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px'
  
  // Add/remove scrollbar class based on content height
  if (scrollHeight > maxHeight) {
    textarea.classList.add('has-scroll')
  } else {
    textarea.classList.remove('has-scroll')
  }
}

/**
 * Message attachment interface for sending files to backend
 */
export interface MessageAttachment {
  name: string
  mime_type: string
  data: string // base64 encoded
  size?: number
}

/**
 * Converts a file to base64 encoded attachment
 * @param file - File to convert
 * @returns Promise with attachment data
 */
export const convertFileToBase64 = (file: File): Promise<MessageAttachment> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      const result = reader.result as string
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = result.split(',')[1]
      
      resolve({
        name: file.name,
        mime_type: file.type,
        data: base64Data,
        size: file.size
      })
    }
    
    reader.onerror = () => {
      reject(new Error(`Failed to convert ${file.name} to base64`))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Converts multiple files to attachment format
 * @param files - Array of files to convert
 * @returns Promise with array of attachments
 */
export const convertFilesToAttachments = async (files: File[]): Promise<MessageAttachment[]> => {
  try {
    const promises = files.map(file => convertFileToBase64(file))
    return await Promise.all(promises)
  } catch (error) {
    console.error('Error converting files to attachments:', error)
    throw error
  }
}
