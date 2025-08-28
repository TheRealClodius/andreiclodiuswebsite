"""
REST API route handlers.
"""

import logging
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from models.api import (
    HealthResponse, 
    AppsResponse, 
    NoteData, 
    NoteResponse, 
    NotesResponse,
    ApiResponse
)
from services.app_service import AppService
from services.websocket_service import WebSocketService

logger = logging.getLogger(__name__)

# Create API router
api_router = APIRouter(prefix="/api", tags=["api"])

# Dependency to get app service instance
def get_app_service() -> AppService:
    """Dependency to provide app service instance."""
    return AppService()

# Dependency to get websocket service instance  
def get_websocket_service() -> WebSocketService:
    """Dependency to provide websocket service instance."""
    # This would normally be injected from the main app
    # For now, we'll create a basic instance for connection counting
    return WebSocketService()


@api_router.get("/health", response_model=HealthResponse)
async def health_check(ws_service: WebSocketService = Depends(get_websocket_service)):
    """
    Health check endpoint.
    
    Returns:
        Health status and connection information
    """
    import time
    
    return HealthResponse(
        status="healthy",
        connections=ws_service.get_connection_count(),
        timestamp=time.time()
    )


@api_router.get("/apps", response_model=AppsResponse)
async def get_available_apps(app_service: AppService = Depends(get_app_service)):
    """
    Get list of available applications.
    
    Returns:
        List of available applications with their info
    """
    try:
        apps = app_service.get_available_apps()
        return AppsResponse(
            apps=apps,
            total=len(apps)
        )
    except Exception as e:
        logger.error(f"Error getting apps: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve apps")


@api_router.get("/apps/{app_id}")
async def get_app_info(app_id: str, app_service: AppService = Depends(get_app_service)):
    """
    Get information about a specific application.
    
    Args:
        app_id: Application identifier
        
    Returns:
        Application information
    """
    app = app_service.get_app_by_id(app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return app


@api_router.post("/notes", response_model=NoteResponse)
async def save_note(note_data: Dict[str, Any], app_service: AppService = Depends(get_app_service)):
    """
    Save a note.
    
    Args:
        note_data: Note data to save
        
    Returns:
        Save operation result
    """
    try:
        result = app_service.save_note(note_data)
        if not result.success:
            raise HTTPException(status_code=400, detail=result.message)
        return result
    except Exception as e:
        logger.error(f"Error saving note: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save note")


@api_router.get("/notes", response_model=NotesResponse)
async def get_notes(
    page: int = 1, 
    per_page: int = 50,
    search: str = None,
    tag: str = None,
    app_service: AppService = Depends(get_app_service)
):
    """
    Get notes with optional filtering.
    
    Args:
        page: Page number (1-based)
        per_page: Items per page
        search: Search query for title/content
        tag: Filter by tag
        
    Returns:
        List of notes with pagination info
    """
    try:
        if search:
            notes = app_service.search_notes(search)
        elif tag:
            notes = app_service.get_notes_by_tag(tag)
        else:
            notes = app_service.get_all_notes(page=page, per_page=per_page)
        
        return NotesResponse(
            notes=notes,
            total=len(notes),
            page=page,
            per_page=per_page
        )
    except Exception as e:
        logger.error(f"Error getting notes: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve notes")


@api_router.get("/notes/{note_id}", response_model=NoteData)
async def get_note(note_id: str, app_service: AppService = Depends(get_app_service)):
    """
    Get a specific note by ID.
    
    Args:
        note_id: Note identifier
        
    Returns:
        Note data
    """
    note = app_service.get_note(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    return note


@api_router.delete("/notes/{note_id}", response_model=NoteResponse)
async def delete_note(note_id: str, app_service: AppService = Depends(get_app_service)):
    """
    Delete a note by ID.
    
    Args:
        note_id: Note identifier
        
    Returns:
        Delete operation result
    """
    try:
        result = app_service.delete_note(note_id)
        if not result.success:
            raise HTTPException(status_code=404, detail=result.message)
        return result
    except Exception as e:
        logger.error(f"Error deleting note: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete note")


@api_router.get("/notes/stats", response_model=ApiResponse)
async def get_notes_stats(app_service: AppService = Depends(get_app_service)):
    """
    Get notes statistics.
    
    Returns:
        Statistics about notes storage
    """
    try:
        total_notes = app_service.get_notes_count()
        
        return ApiResponse(
            success=True,
            message="Notes statistics retrieved successfully",
            data={
                "total_notes": total_notes,
                "storage_type": "in_memory"  # For demo purposes
            }
        )
    except Exception as e:
        logger.error(f"Error getting notes stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve statistics")
