"""
WebSocket connection management service.
"""

import json
import logging
from typing import Dict, List
from fastapi import WebSocket
from models.websocket import WebSocketMessage, ErrorMessage

logger = logging.getLogger(__name__)


class WebSocketService:
    """Service for managing WebSocket connections and message broadcasting."""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_data: Dict[WebSocket, dict] = {}
        
    async def connect(self, websocket: WebSocket) -> None:
        """Accept a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_data[websocket] = {}
        logger.info(f"New WebSocket connection. Total: {len(self.active_connections)}")
        
    def disconnect(self, websocket: WebSocket) -> None:
        """Remove a WebSocket connection."""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if websocket in self.connection_data:
            del self.connection_data[websocket]
        logger.info(f"WebSocket disconnected. Total: {len(self.active_connections)}")
        
    async def send_message(self, message: dict, websocket: WebSocket) -> bool:
        """
        Send a message to a specific WebSocket connection.
        
        Args:
            message: Message dictionary to send
            websocket: Target WebSocket connection
            
        Returns:
            bool: True if message sent successfully, False otherwise
        """
        try:
            await websocket.send_text(json.dumps(message))
            return True
        except Exception as e:
            logger.warning(f"Failed to send message to WebSocket: {str(e)}")
            self.disconnect(websocket)
            return False
            
    async def broadcast(self, message: dict, exclude: WebSocket = None) -> int:
        """
        Broadcast a message to all connected clients.
        
        Args:
            message: Message dictionary to broadcast
            exclude: WebSocket connection to exclude from broadcast
            
        Returns:
            int: Number of successful deliveries
        """
        successful_sends = 0
        disconnected = []
        
        for connection in self.active_connections:
            if connection == exclude:
                continue
                
            try:
                await connection.send_text(json.dumps(message))
                successful_sends += 1
            except Exception as e:
                logger.warning(f"Failed to broadcast to connection: {str(e)}")
                disconnected.append(connection)
        
        # Clean up disconnected connections
        for connection in disconnected:
            self.disconnect(connection)
            
        return successful_sends
        
    async def send_error(self, error_msg: str, websocket: WebSocket, 
                        message_id: str = None) -> bool:
        """
        Send an error message to a WebSocket connection.
        
        Args:
            error_msg: Error message to send
            websocket: Target WebSocket connection
            message_id: Optional message ID for context
            
        Returns:
            bool: True if error sent successfully, False otherwise
        """
        error_message = ErrorMessage(
            error=error_msg,
            message_id=message_id
        )
        return await self.send_message(error_message.dict(), websocket)
        
    def get_connection_count(self) -> int:
        """Get the number of active connections."""
        return len(self.active_connections)
        
    def is_connected(self, websocket: WebSocket) -> bool:
        """Check if a WebSocket is still connected."""
        return websocket in self.active_connections
        
    def get_connection_data(self, websocket: WebSocket) -> dict:
        """Get stored data for a WebSocket connection."""
        return self.connection_data.get(websocket, {})
        
    def set_connection_data(self, websocket: WebSocket, data: dict) -> None:
        """Set stored data for a WebSocket connection."""
        if websocket in self.connection_data:
            self.connection_data[websocket].update(data)
        else:
            self.connection_data[websocket] = data
