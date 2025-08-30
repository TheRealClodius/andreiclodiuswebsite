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
    WebSocketMessage,
    JoinRoomMessage,
    LeaveRoomMessage,
    SendGroupMessage,
    GroupChatResponse
)
from services.websocket_service import WebSocketService
from services.chat_service import ChatService
from services.group_chat_service import GroupChatService

logger = logging.getLogger(__name__)

# Create WebSocket router
websocket_router = APIRouter(tags=["websocket"])

# Global service instances (in production, these would be proper singletons)
websocket_service = WebSocketService()
chat_service: ChatService = None
chat_service_initialized = False
group_chat_service = GroupChatService()


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


@websocket_router.websocket("/ws/group-chat")
async def group_chat_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for group chat functionality.
    
    Handles group chat message types:
    - join_room: Join a chat room with a nickname
    - leave_room: Leave the current chat room
    - send_message: Send a message to all users in the room
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
            logger.info(f"Received Group Chat message: {message_type}")
            
            # Route message based on type
            if message_type == "join_room":
                await handle_join_room(websocket, message)
            elif message_type == "leave_room":
                await handle_leave_room(websocket, message)
            elif message_type == "send_message":
                await handle_send_group_message(websocket, message)
            elif message_type == "ping":
                # Handle heartbeat ping - respond with pong
                await websocket.send_text(json.dumps({"type": "pong"}))
            else:
                logger.warning(f"Unknown group chat message type: {message_type}")
                await websocket.send_text(json.dumps({
                    "type": "group_chat_error",
                    "error": f"Unknown message type: {message_type}"
                }))
                
    except WebSocketDisconnect:
        # Handle user leaving when they disconnect
        await group_chat_service.handle_disconnect(websocket)
        ws_service.disconnect(websocket)
    except Exception as e:
        logger.error(f"Group Chat WebSocket error: {str(e)}")
        await group_chat_service.handle_disconnect(websocket)
        ws_service.disconnect(websocket)


async def handle_join_room(websocket: WebSocket, message: dict):
    """
    Handle user joining a chat room.
    
    Args:
        websocket: WebSocket connection
        message: Join room message data
    """
    try:
        # Validate join room message
        join_msg = JoinRoomMessage(**message)
        
        # Attempt to join the room
        response = await group_chat_service.join_room(
            join_msg.nickname,
            websocket,
            join_msg.room_id
        )
        
        # Send response back to client
        await websocket.send_text(json.dumps({
            "type": "group_chat_response",
            "data": response.dict()
        }))
        
        logger.info(f"User '{join_msg.nickname}' join attempt: {response.type}")
        
    except Exception as e:
        logger.error(f"Error handling join room: {str(e)}")
        await websocket.send_text(json.dumps({
            "type": "group_chat_error",
            "error": str(e)
        }))


async def handle_leave_room(websocket: WebSocket, message: dict):
    """
    Handle user leaving a chat room.
    
    Args:
        websocket: WebSocket connection
        message: Leave room message data
    """
    try:
        # Validate leave room message
        leave_msg = LeaveRoomMessage(**message)
        
        # Leave the room
        response = await group_chat_service.leave_room(websocket, leave_msg.room_id)
        
        if response:
            # Send confirmation to client
            await websocket.send_text(json.dumps({
                "type": "group_chat_response",
                "data": response.dict()
            }))
            logger.info(f"User left room successfully")
        
    except Exception as e:
        logger.error(f"Error handling leave room: {str(e)}")
        await websocket.send_text(json.dumps({
            "type": "group_chat_error",
            "error": str(e)
        }))


async def handle_send_group_message(websocket: WebSocket, message: dict):
    """
    Handle sending a message to the group chat.
    
    Args:
        websocket: WebSocket connection
        message: Group message data
    """
    try:
        logger.info(f"📨 Received group message payload: {message}")
        
        # Ensure backward compatibility - add missing fields with defaults
        if 'room_id' not in message:
            message['room_id'] = 'general'
        if 'replyTo' not in message:
            message['replyTo'] = None
            
        # Validate group message
        group_msg = SendGroupMessage(**message)
        logger.info(f"✅ Message validation successful")
        
        # Send message to the room
        response = await group_chat_service.send_message(
            group_msg.message,
            websocket,
            group_msg.room_id,
            group_msg.replyTo
        )
        
        logger.info(f"Group message sent: {response.type}")
        
    except Exception as e:
        logger.error(f"❌ Error handling group message: {str(e)}")
        logger.error(f"❌ Message payload was: {message}")
        await websocket.send_text(json.dumps({
            "type": "group_chat_error",
            "error": str(e)
        }))
