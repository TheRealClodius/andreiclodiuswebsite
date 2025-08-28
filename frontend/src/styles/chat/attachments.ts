import styled from 'styled-components'

export const AttachmentPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`

export const AttachmentItem = styled.div<{ $isImage: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  max-width: 200px;
  font-size: 12px;
  
  ${props => props.$isImage && `
    flex-direction: column;
    align-items: stretch;
  `}
`

export const AttachmentImage = styled.img`
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 4px;
`

export const AttachmentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
`

export const AttachmentName = styled.span`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const AttachmentSize = styled.span`
  font-size: 10px;
  opacity: 0.7;
`
