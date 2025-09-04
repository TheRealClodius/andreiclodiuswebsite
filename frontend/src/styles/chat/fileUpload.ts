import styled from 'styled-components'

export const SelectedFiles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
  padding: 0px 12px;
`

export const FileChip = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.palette.background.secondary};
  border: 1px solid ${({ theme }) => theme.palette.border.muted};
  border-radius: ${({ theme }) => theme.semanticRadii.chat.attachment};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]} ${theme.spacing[1]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.palette.text.secondary};
  max-width: 200px;
`

export const FileName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`

export const FilePreview = styled.div`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.semanticRadii.chat.attachment};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.palette.background.tertiary};
  flex-shrink: 0;
  color: ${({ theme }) => theme.palette.text.tertiary};
`

export const FilePreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.semanticRadii.chat.attachment};
`

// RemoveFileButton removed - replaced with Button primitive from design system
