import React, { useState, useEffect, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { useWindowStore } from '../stores/windowStore'

interface NotesAppProps {
  windowId: string
}

// Simple note persistence using localStorage
class NotesStorage {
  private static readonly STORAGE_KEY = 'dark-notes-storage'

  static getAllNotes(): Record<string, { title: string; content: string; lastModified: Date }> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return {}
      const parsed = JSON.parse(stored)
      // Convert lastModified strings back to Date objects
      Object.keys(parsed).forEach(key => {
        parsed[key].lastModified = new Date(parsed[key].lastModified)
      })
      return parsed
    } catch {
      return {}
    }
  }

  static getNote(noteId: string): { title: string; content: string; lastModified: Date } | null {
    const notes = this.getAllNotes()
    return notes[noteId] || null
  }

  static saveNote(noteId: string, content: string, title?: string): void {
    const notes = this.getAllNotes()
    notes[noteId] = {
      title: title || this.generateTitle(content),
      content,
      lastModified: new Date()
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes))
  }

  static deleteNote(noteId: string): void {
    const notes = this.getAllNotes()
    delete notes[noteId]
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes))
  }

  private static generateTitle(content: string): string {
    if (!content.trim()) return 'Untitled Note'
    
    // Use first line as title, or first 30 characters
    const firstLine = content.split('\n')[0].trim()
    if (firstLine.length > 30) {
      return firstLine.substring(0, 30) + '...'
    }
    return firstLine || 'Untitled Note'
  }

  static getNotesList(): Array<{ id: string; title: string; lastModified: Date }> {
    const notes = this.getAllNotes()
    return Object.keys(notes).map(id => ({
      id,
      title: notes[id].title,
      lastModified: notes[id].lastModified
    })).sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
  }
}

// Subtle wave sweep animation
const waveAnimation = keyframes`
  0% {
    background-position: -600px 0;
  }
  100% {
    background-position: 600px 0;
  }
`

const NotesContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  color: #e0e0e0; /* Explicit light color for Safari compatibility */
`

// Wrapper for textarea and custom placeholder
const TextareaWrapper = styled.div`
  flex: 1;
  position: relative;
`

// Custom animated placeholder
const CustomPlaceholder = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 20px;
  left: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  font-style: italic;
  pointer-events: none;
  user-select: none;
  opacity: ${props => props.$show ? 0.6 : 0};
  transition: opacity 0.2s ease;
  z-index: 1;
  
  /* Wave gradient effect - Safari compatible */
  background: linear-gradient(
    90deg,
    rgba(128, 128, 128, 0.5) 0%,
    rgba(128, 128, 128, 0.5) 20%,
    rgba(200, 200, 200, 0.9) 30%,
    rgba(128, 128, 128, 0.5) 50%,
    rgba(128, 128, 128, 0.5) 100%
  );
  background-size: 600px 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: ${props => props.$show ? waveAnimation : 'none'} 3s ease-in-out infinite;
  
  /* Safari fallback */
  @supports not (-webkit-background-clip: text) {
    color: rgba(128, 128, 128, 0.6);
    background: none;
    -webkit-text-fill-color: initial;
  }
`

const NotesTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  background: transparent;
  color: #e0e0e0; /* Explicit light color for Safari compatibility */
  position: relative;
  z-index: 2;
  
  /* Remove all focus/selection background changes for consistency */
  &:focus {
    outline: none;
    background: transparent;
  }
  
  /* Override browser selection colors to maintain dark theme */
  &::selection {
    background: rgba(255, 255, 255, 0.2);
    color: #e0e0e0;
  }
  
  &::-moz-selection {
    background: rgba(255, 255, 255, 0.2);
    color: #e0e0e0;
  }
`

const NotesStatus = styled.div`
  padding: 8px 20px;
  font-size: 12px;
  color: #b0b0b0; /* Explicit muted light color for Safari compatibility */
  background: transparent;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StatusItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const NotesApp: React.FC<NotesAppProps> = ({ windowId }) => {
  const { getWindow, updateWindowData } = useWindowStore()
  const window = getWindow(windowId)
  
  const [content, setContent] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [noteId, setNoteId] = useState<string>('')

  // Initialize noteId and load content
  useEffect(() => {
    const windowNoteId = window?.data?.noteId
    if (windowNoteId) {
      // Loading existing note
      setNoteId(windowNoteId)
      const savedNote = NotesStorage.getNote(windowNoteId)
      if (savedNote) {
        setContent(savedNote.content)
        setLastSaved(savedNote.lastModified)
      }
    } else {
      // Creating new note
      const newNoteId = `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      setNoteId(newNoteId)
      updateWindowData(windowId, { noteId: newNoteId })
    }
  }, [windowId, window?.data?.noteId, updateWindowData])

  // Auto-save functionality
  const saveContent = useCallback(() => {
    if (noteId && content !== undefined) {
      // Save to persistent storage
      NotesStorage.saveNote(noteId, content)
      // Also update window data for immediate access
      updateWindowData(windowId, { content, noteId })
      setLastSaved(new Date())
    }
  }, [windowId, content, noteId, updateWindowData])

  // Save every 2 seconds when content changes
  useEffect(() => {
    if (!noteId) return // Don't save until noteId is set
    
    const timer = setTimeout(() => {
      const savedNote = NotesStorage.getNote(noteId)
      const lastSavedContent = savedNote?.content || ''
      
      if (content !== lastSavedContent) {
        saveContent()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [content, saveContent, noteId])

  // Update word and character counts
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0
    setWordCount(words)
    setCharCount(content.length)
  }, [content])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save on Cmd+S (Mac) or Ctrl+S (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      saveContent()
    }
  }

  const formatLastSaved = (date: Date | null) => {
    if (!date) return 'Not saved'
    
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    
    if (diffSeconds < 60) return 'Saved just now'
    if (diffSeconds < 3600) return `Saved ${Math.floor(diffSeconds / 60)}m ago`
    return `Saved at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  return (
    <NotesContainer>
      <TextareaWrapper>
        <CustomPlaceholder $show={content.length === 0}>
          Start typing in the dark...
        </CustomPlaceholder>
        <NotesTextarea
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </TextareaWrapper>
      <NotesStatus>
        <StatusItem>
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
        </StatusItem>
        <StatusItem>
          {formatLastSaved(lastSaved)}
        </StatusItem>
      </NotesStatus>
    </NotesContainer>
  )
}
