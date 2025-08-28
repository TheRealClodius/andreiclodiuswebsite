"""
WebSocket route handlers and message processing.
"""

import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from models.websocket import (
    ChatMessage, 
    PingMessage, 
    BroadcastMessage,
    WebSocketMessage
)
from services.websocket_service import WebSocketService
from services.chat_service import ChatService

logger = logging.getLogger(__name__)

# Create WebSocket router
websocket_router = APIRouter(tags=["websocket"])

# Global service instances (in production, these would be proper singletons)
websocket_service = WebSocketService()
chat_service: ChatService = None
chat_service_initialized = False


def get_websocket_service() -> WebSocketService:
    """Dependency to provide websocket service instance."""
    return websocket_service


async def get_chat_service() -> ChatService:
    """Dependency to provide chat service instance."""
    global chat_service, chat_service_initialized
    
    if not chat_service_initialized:
        try:
            chat_service = ChatService()
            chat_service_initialized = True
            logger.info("Chat service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize chat service: {str(e)}")
            raise e
    
    return chat_service


@websocket_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Main WebSocket endpoint for real-time communication.
    
    Handles various message types:
    - ping/pong for connection health
    - chat_message for AI conversations
    - broadcast for multi-client messaging
    """
    ws_service = get_websocket_service()
    await ws_service.connect(websocket)
    
    try:
        while True:
            # Receive and parse message
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Get message type
            message_type = message.get("type", "unknown")
            logger.info(f"Received WebSocket message: {message_type}")
            
            # Route message based on type
            if message_type == "ping":
                await handle_ping(websocket, message, ws_service)
            elif message_type == "chat_message":
                await handle_chat_message(websocket, message, ws_service)
            elif message_type == "broadcast":
                await handle_broadcast(websocket, message, ws_service)
            else:
                logger.warning(f"Unknown message type: {message_type}")
                await ws_service.send_error(
                    f"Unknown message type: {message_type}",
                    websocket
                )
                
    except WebSocketDisconnect:
        ws_service.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        ws_service.disconnect(websocket)


async def handle_ping(websocket: WebSocket, message: dict, ws_service: WebSocketService):
    """
    Handle ping messages for connection health check.
    
    Args:
        websocket: WebSocket connection
        message: Ping message data
        ws_service: WebSocket service instance
    """
    await ws_service.send_message({"type": "pong"}, websocket)


async def handle_chat_message(websocket: WebSocket, message: dict, ws_service: WebSocketService):
    """
    Handle chat messages for AI conversation.
    
    Args:
        websocket: WebSocket connection
        message: Chat message data
        ws_service: WebSocket service instance
    """
    try:
        # Validate chat message
        chat_msg = ChatMessage(**message)
        
        # Get chat service
        try:
            chat_svc = await get_chat_service()
        except Exception as e:
            logger.error(f"Failed to get chat service: {str(e)}")
            await ws_service.send_error(
                "Chat service unavailable. Please check configuration.",
                websocket,
                chat_msg.message_id
            )
            return
        
        # Process message and stream response
        response_count = 0
        async for response_chunk in chat_svc.send_message_stream(
            chat_msg.content, 
            chat_msg.message_id,
            chat_msg.attachments
        ):
            response_count += 1
            
            # Check if websocket is still connected
            if not ws_service.is_connected(websocket):
                logger.warning(f"WebSocket disconnected during streaming at chunk {response_count}")
                break
            
            # Send response chunk
            await ws_service.send_message({
                "type": "chat_response",
                "data": response_chunk
            }, websocket)
        
        logger.info(f"Finished processing chat message {chat_msg.message_id}, sent {response_count} chunks")
        
    except Exception as e:
        logger.error(f"Error handling chat message: {str(e)}")
        message_id = message.get("message_id", "unknown")
        await ws_service.send_error(str(e), websocket, message_id)


async def handle_broadcast(websocket: WebSocket, message: dict, ws_service: WebSocketService):
    """
    Handle broadcast messages to all connected clients.
    
    Args:
        websocket: WebSocket connection
        message: Broadcast message data
        ws_service: WebSocket service instance
    """
    try:
        # Validate broadcast message
        broadcast_msg = BroadcastMessage(**message)
        
        # Broadcast to all other connections
        successful_sends = await ws_service.broadcast({
            "type": "broadcast",
            "data": broadcast_msg.data,
            "from": broadcast_msg.from_client
        }, exclude=websocket)
        
        logger.info(f"Broadcast message sent to {successful_sends} clients")
        
    except Exception as e:
        logger.error(f"Error handling broadcast: {str(e)}")
        await ws_service.send_error(str(e), websocket)


# Additional WebSocket endpoints for specific features
@websocket_router.websocket("/ws/chat")
async def chat_websocket(websocket: WebSocket):
    """
    Dedicated WebSocket endpoint for chat-only communication.
    Simplified version that only handles chat messages.
    """
    ws_service = get_websocket_service()
    await ws_service.connect(websocket)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Only handle chat messages on this endpoint
            if message.get("type") == "chat_message":
                await handle_chat_message(websocket, message, ws_service)
            else:
                await ws_service.send_error(
                    "This endpoint only supports chat messages",
                    websocket
                )
                
    except WebSocketDisconnect:
        ws_service.disconnect(websocket)
    except Exception as e:
        logger.error(f"Chat WebSocket error: {str(e)}")
        ws_service.disconnect(websocket)
