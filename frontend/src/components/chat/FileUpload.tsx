import React from 'react'
import { HiX, HiDocument } from 'react-icons/hi'
import { 
  SelectedFiles, 
  FileChip, 
  FileName, 
  FilePreview, 
  FilePreviewImage
} from '../../styles/chat'
import { Button } from '../../design-system'
import { isImageType } from '../../utils/chatUtils'

interface FileChipsProps {
  selectedFiles: File[]
  onRemoveFile: (index: number) => void
}

export const FileChips: React.FC<FileChipsProps> = ({ 
  selectedFiles, 
  onRemoveFile 
}) => {
  if (selectedFiles.length === 0) return null

  return (
    <SelectedFiles>
      {selectedFiles.map((file, index) => (
        <FileChip key={`${file.name}-${index}`}>
          <FilePreview>
            {isImageType(file.type) ? (
              <FilePreviewImage 
                src={URL.createObjectURL(file)} 
                alt={file.name}
              />
            ) : (
              <HiDocument size={14} />
            )}
          </FilePreview>
          <FileName>{file.name}</FileName>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFile(index)}
            asMotion
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              padding: 0,
              minHeight: 'auto'
            }}
          >
            <HiX size={14} />
          </Button>
        </FileChip>
      ))}
    </SelectedFiles>
  )
}
