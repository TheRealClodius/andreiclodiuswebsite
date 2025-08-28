import { useCallback, useState } from 'react'

export interface FileAttachment {
  name: string
  type: string
  size: number
  url?: string
}

export const useFileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const addFiles = useCallback((files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files])
  }, [])

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearFiles = useCallback(() => {
    // Clean up object URLs to prevent memory leaks
    selectedFiles.forEach(file => {
      const url = URL.createObjectURL(file)
      URL.revokeObjectURL(url)
    })
    setSelectedFiles([])
  }, [selectedFiles])

  const getAttachments = useCallback((): FileAttachment[] => {
    return selectedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file) // For preview purposes
    }))
  }, [selectedFiles])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      addFiles(files)
      // Reset the input so the same file can be selected again
      event.target.value = ''
    }
  }, [addFiles])

  return {
    selectedFiles,
    addFiles,
    removeFile,
    clearFiles,
    getAttachments,
    handleFileSelect,
    hasFiles: selectedFiles.length > 0
  }
}
