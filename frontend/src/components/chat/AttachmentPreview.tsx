import React from 'react'
import { 
  AttachmentPreview as StyledAttachmentPreview, 
  AttachmentItem, 
  AttachmentImage, 
  AttachmentInfo, 
  AttachmentName, 
  AttachmentSize 
} from '../../styles/chat'
import { formatFileSize, isImageType } from '../../utils/chatUtils'

interface Attachment {
  name: string
  type: string
  size: number
  url?: string
}

interface AttachmentPreviewProps {
  attachments: Attachment[]
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ attachments }) => {
  return (
    <StyledAttachmentPreview>
      {attachments.map((attachment, index) => {
        const isImage = isImageType(attachment.type)
        
        return (
          <AttachmentItem key={index} $isImage={isImage}>
            {isImage && attachment.url && (
              <AttachmentImage 
                src={attachment.url} 
                alt={attachment.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <AttachmentInfo>
              <AttachmentName>{attachment.name}</AttachmentName>
              <AttachmentSize>{formatFileSize(attachment.size)}</AttachmentSize>
            </AttachmentInfo>
          </AttachmentItem>
        )
      })}
    </StyledAttachmentPreview>
  )
}
