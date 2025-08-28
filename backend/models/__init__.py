"""
Data models and Pydantic schemas for the application.
"""

from .websocket import (
    WebSocketMessage,
    ChatMessage,
    ChatResponse,
    ChatResponseChunk,
    ChatComplete,
    BroadcastMessage,
    PingMessage,
    ErrorMessage
)
from .api import (
    AppInfo,
    AppsResponse,
    NoteData,
    NotesResponse,
    HealthResponse
)

__all__ = [
    "WebSocketMessage",
    "ChatMessage", 
    "ChatResponse",
    "ChatResponseChunk",
    "ChatComplete",
    "BroadcastMessage",
    "PingMessage",
    "ErrorMessage",
    "AppInfo",
    "AppsResponse", 
    "NoteData",
    "NotesResponse",
    "HealthResponse"
]
