import React from 'react'

interface AIImageAttachment {
  name: string
  type: string
  size: number
  url?: string
}

interface AIImageDisplayProps {
  attachments: AIImageAttachment[]
}

export const AIImageDisplay: React.FC<AIImageDisplayProps> = ({ attachments }) => {
  return (
    <div style={{ margin: '12px 0', padding: 0 }}>
      {attachments.map((attachment, index) => {
        if (!attachment.url) return null
        
        return (
          <img 
            key={index}
            src={attachment.url} 
            alt="AI generated image"
            style={{ 
              borderRadius: '12px', 
              maxWidth: '100%', 
              height: 'auto',
              display: 'block',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )
      })}
    </div>
  )
}
