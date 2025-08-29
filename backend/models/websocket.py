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


# Group Chat Models
class GroupUser(BaseModel):
    """User in a group chat room."""
    id: str = Field(..., description="Unique user identifier")
    nickname: str = Field(..., min_length=1, max_length=20, description="User's nickname")
    joined_at: float = Field(..., description="Unix timestamp when user joined")


class GroupChatMessage(BaseWebSocketMessage):
    """Base model for group chat messages."""
    type: str
    room_id: str = Field(default="general", description="Chat room identifier")


class JoinRoomMessage(GroupChatMessage):
    """Message to join a group chat room."""
    type: Literal["join_room"] = "join_room"
    nickname: str = Field(..., min_length=1, max_length=20, description="User's desired nickname")


class LeaveRoomMessage(GroupChatMessage):
    """Message to leave a group chat room."""
    type: Literal["leave_room"] = "leave_room"


class SendGroupMessage(GroupChatMessage):
    """Message to send to the group chat."""
    type: Literal["send_message"] = "send_message"
    message: str = Field(..., min_length=1, description="Message content")


class GroupChatResponse(BaseWebSocketMessage):
    """Response from group chat system."""
    type: Literal[
        "room_joined", 
        "room_full", 
        "user_joined", 
        "user_left", 
        "message", 
        "user_list", 
        "error"
    ]
    message: Optional[str] = None
    sender: Optional[str] = None  # nickname of sender
    userId: Optional[str] = None  # unique user identifier
    users: Optional[List[GroupUser]] = None
    userCount: Optional[int] = None
    error: Optional[str] = None
