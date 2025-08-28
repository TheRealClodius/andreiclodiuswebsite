"""
WebSocket message models and schemas.
"""

from typing import Any, Dict, Optional, Union, Literal, List
from pydantic import BaseModel, Field


class BaseWebSocketMessage(BaseModel):
    """Base model for all WebSocket messages."""
    type: str
    timestamp: Optional[float] = None
    
    class Config:
        extra = "allow"


class PingMessage(BaseWebSocketMessage):
    """Ping message for connection health check."""
    type: Literal["ping"] = "ping"


class PongMessage(BaseWebSocketMessage):
    """Pong response to ping message."""
    type: Literal["pong"] = "pong"


class MessageAttachment(BaseModel):
    """Attachment data for chat messages."""
    name: str = Field(..., description="Filename of the attachment")
    mime_type: str = Field(..., description="MIME type of the attachment")
    data: str = Field(..., description="Base64 encoded attachment data")
    size: Optional[int] = Field(None, description="File size in bytes")


class ChatMessage(BaseWebSocketMessage):
    """Chat message from user to AI agent."""
    type: Literal["chat_message"] = "chat_message"
    content: str = Field(..., min_length=1, description="The chat message content")
    message_id: str = Field(..., description="Unique identifier for this message")
    attachments: List[MessageAttachment] = Field(default_factory=list, description="Message attachments")


class ChatResponseChunk(BaseWebSocketMessage):
    """Individual chunk of AI response."""
    type: Literal["content_chunk"] = "content_chunk"
    content: str = Field(..., description="Content chunk")
    message_id: str = Field(..., description="ID of the original message")
    is_final: bool = Field(default=False, description="Whether this is the final chunk")





class ChatComplete(BaseWebSocketMessage):
    """Message completion signal."""
    type: Literal["message_complete"] = "message_complete"
    message_id: str = Field(..., description="ID of the completed message")
    full_content: str = Field(..., description="Complete response content")


class BroadcastMessage(BaseWebSocketMessage):
    """Broadcast message to all connected clients."""
    type: Literal["broadcast"] = "broadcast"
    data: Dict[str, Any] = Field(default_factory=dict)
    from_client: str = Field(default="unknown", alias="from")


class ErrorMessage(BaseWebSocketMessage):
    """Error message for WebSocket communication."""
    type: Literal["chat_error"] = "chat_error"
    error: str = Field(..., description="Error message")
    message_id: Optional[str] = Field(None, description="Related message ID if applicable")


# Union type for all possible WebSocket messages
WebSocketMessage = Union[
    PingMessage,
    PongMessage,
    ChatMessage,
    ChatResponseChunk,
    ChatComplete,
    BroadcastMessage,
    ErrorMessage
]


class ChatResponse(BaseModel):
    """Response wrapper for chat API."""
    type: str
    data: Dict[str, Any]
