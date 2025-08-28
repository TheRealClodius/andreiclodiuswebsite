"""
Application management service.
"""

import logging
from typing import List, Dict, Any, Optional
from models.api import AppInfo, NoteData, NoteResponse

logger = logging.getLogger(__name__)


class AppService:
    """Service for managing applications and their data."""
    
    def __init__(self):
        """Initialize the app service."""
        # In-memory storage for demo purposes
        # In production, this would use a database
        self.notes_storage: Dict[str, NoteData] = {}
        self.next_note_id = 1
        
        logger.info("AppService initialized")
    
    def get_available_apps(self) -> List[AppInfo]:
        """
        Get list of available applications.
        
        Returns:
            List of available application info
        """
        return [
            AppInfo(
                id="notes",
                name="Notes",
                icon="📝",
                description="Simple note-taking application",
                version="1.0.0",
                enabled=True
            ),
            AppInfo(
                id="chat",
                name="AI Chat",
                icon="🤖", 
                description="Chat with Andrei's AI clone",
                version="1.0.0",
                enabled=True
            ),
            AppInfo(
                id="calculator",
                name="Calculator",
                icon="🧮",
                description="Basic calculator application",
                version="1.0.0",
                enabled=False  # Not implemented yet
            ),
            AppInfo(
                id="terminal",
                name="Terminal",
                icon="💻",
                description="Web-based terminal emulator",
                version="1.0.0",
                enabled=False  # Not implemented yet
            )
        ]
    
    def get_app_by_id(self, app_id: str) -> Optional[AppInfo]:
        """
        Get application info by ID.
        
        Args:
            app_id: Application identifier
            
        Returns:
            Application info if found, None otherwise
        """
        apps = self.get_available_apps()
        return next((app for app in apps if app.id == app_id), None)
    
    def save_note(self, note_data: Dict[str, Any]) -> NoteResponse:
        """
        Save a note to storage.
        
        Args:
            note_data: Note data dictionary
            
        Returns:
            Save operation response
        """
        try:
            # Create note ID if not provided
            note_id = note_data.get("id")
            if not note_id:
                note_id = str(self.next_note_id)
                self.next_note_id += 1
            
            # Create NoteData instance
            note = NoteData(
                id=note_id,
                title=note_data.get("title", "Untitled"),
                content=note_data.get("content", ""),
                tags=note_data.get("tags", [])
            )
            
            # Store the note
            self.notes_storage[note_id] = note
            
            logger.info(f"Saved note with ID: {note_id}")
            
            return NoteResponse(
                success=True,
                message="Note saved successfully",
                note=note
            )
            
        except Exception as e:
            logger.error(f"Error saving note: {str(e)}")
            return NoteResponse(
                success=False,
                message=f"Failed to save note: {str(e)}"
            )
    
    def get_note(self, note_id: str) -> Optional[NoteData]:
        """
        Get a specific note by ID.
        
        Args:
            note_id: Note identifier
            
        Returns:
            Note data if found, None otherwise
        """
        return self.notes_storage.get(note_id)
    
    def get_all_notes(self, page: int = 1, per_page: int = 50) -> List[NoteData]:
        """
        Get all notes with pagination.
        
        Args:
            page: Page number (1-based)
            per_page: Items per page
            
        Returns:
            List of notes for the requested page
        """
        notes = list(self.notes_storage.values())
        
        # Sort by creation time (newest first)
        notes.sort(key=lambda x: x.created_at or 0, reverse=True)
        
        # Apply pagination
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        
        return notes[start_idx:end_idx]
    
    def delete_note(self, note_id: str) -> NoteResponse:
        """
        Delete a note from storage.
        
        Args:
            note_id: Note identifier
            
        Returns:
            Delete operation response
        """
        try:
            if note_id in self.notes_storage:
                del self.notes_storage[note_id]
                logger.info(f"Deleted note with ID: {note_id}")
                return NoteResponse(
                    success=True,
                    message="Note deleted successfully"
                )
            else:
                return NoteResponse(
                    success=False,
                    message="Note not found"
                )
                
        except Exception as e:
            logger.error(f"Error deleting note: {str(e)}")
            return NoteResponse(
                success=False,
                message=f"Failed to delete note: {str(e)}"
            )
    
    def search_notes(self, query: str) -> List[NoteData]:
        """
        Search notes by title or content.
        
        Args:
            query: Search query string
            
        Returns:
            List of matching notes
        """
        if not query.strip():
            return []
        
        query_lower = query.lower()
        matching_notes = []
        
        for note in self.notes_storage.values():
            title_match = query_lower in note.title.lower()
            content_match = query_lower in note.content.lower()
            tag_match = any(query_lower in tag.lower() for tag in note.tags)
            
            if title_match or content_match or tag_match:
                matching_notes.append(note)
        
        # Sort by relevance (title matches first, then content matches)
        matching_notes.sort(key=lambda x: (
            query_lower not in x.title.lower(),  # Title matches first
            x.created_at or 0
        ), reverse=True)
        
        return matching_notes
    
    def get_notes_count(self) -> int:
        """Get total number of notes."""
        return len(self.notes_storage)
    
    def get_notes_by_tag(self, tag: str) -> List[NoteData]:
        """
        Get notes that have a specific tag.
        
        Args:
            tag: Tag to search for
            
        Returns:
            List of notes with the specified tag
        """
        return [
            note for note in self.notes_storage.values()
            if tag.lower() in [t.lower() for t in note.tags]
        ]
