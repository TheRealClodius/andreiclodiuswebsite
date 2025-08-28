"""
API request and response models.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Health check response model."""
    status: str = Field(..., description="Health status")
    connections: int = Field(..., description="Number of active WebSocket connections")
    timestamp: Optional[float] = Field(None, description="Response timestamp")


class AppInfo(BaseModel):
    """Information about an available application."""
    id: str = Field(..., description="Unique application identifier")
    name: str = Field(..., description="Display name of the application")
    icon: str = Field(..., description="Icon representation (emoji or path)")
    description: str = Field(..., description="Brief description of the app")
    version: Optional[str] = Field(None, description="Application version")
    enabled: bool = Field(default=True, description="Whether the app is currently enabled")


class AppsResponse(BaseModel):
    """Response containing available applications."""
    apps: List[AppInfo] = Field(..., description="List of available applications")
    total: int = Field(..., description="Total number of applications")


class NoteData(BaseModel):
    """Data model for a note."""
    id: Optional[str] = Field(None, description="Note identifier")
    title: str = Field(..., min_length=1, max_length=200, description="Note title")
    content: str = Field(..., description="Note content")
    created_at: Optional[float] = Field(None, description="Creation timestamp")
    updated_at: Optional[float] = Field(None, description="Last update timestamp")
    tags: List[str] = Field(default_factory=list, description="Note tags")


class NoteResponse(BaseModel):
    """Response for single note operations."""
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Response message")
    note: Optional[NoteData] = Field(None, description="Note data if applicable")


class NotesResponse(BaseModel):
    """Response containing multiple notes."""
    notes: List[NoteData] = Field(..., description="List of notes")
    total: int = Field(..., description="Total number of notes")
    page: int = Field(default=1, description="Current page number")
    per_page: int = Field(default=50, description="Items per page")


class ApiResponse(BaseModel):
    """Generic API response wrapper."""
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Response message")
    data: Optional[Dict[str, Any]] = Field(None, description="Response data")
    error: Optional[str] = Field(None, description="Error message if applicable")
