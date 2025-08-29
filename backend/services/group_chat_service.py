"""
Group Chat Service for managing multi-user chat rooms.
"""

import json
import time
import uuid
import logging
from typing import Dict, List, Optional, Set
from fastapi import WebSocket
from models.websocket import GroupUser, GroupChatResponse

logger = logging.getLogger(__name__)


class ChatRoom:
    """Represents a chat room with users."""
    
    def __init__(self, room_id: str = "general", max_users: int = 20):
        self.room_id = room_id
        self.max_users = max_users
        self.users: Dict[str, GroupUser] = {}  # user_id -> GroupUser
        self.connections: Dict[str, WebSocket] = {}  # user_id -> WebSocket
        self.nickname_to_user_id: Dict[str, str] = {}  # nickname -> user_id
        
    def is_full(self) -> bool:
        """Check if the room is at capacity."""
        return len(self.users) >= self.max_users
        
    def is_nickname_taken(self, nickname: str) -> bool:
        """Check if a nickname is already in use."""
        return nickname.lower() in [user.nickname.lower() for user in self.users.values()]
        
    def add_user(self, nickname: str, websocket: WebSocket) -> Optional[GroupUser]:
        """
        Add a user to the room.
        
        Args:
            nickname: User's desired nickname
            websocket: User's WebSocket connection
            
        Returns:
            GroupUser if added successfully, None if room is full or nickname taken
        """
        if self.is_full():
            return None
            
        if self.is_nickname_taken(nickname):
            # Generate a unique nickname
            base_nickname = nickname
            counter = 1
            while self.is_nickname_taken(f"{base_nickname}{counter}"):
                counter += 1
            nickname = f"{base_nickname}{counter}"
            
        user_id = str(uuid.uuid4())
        user = GroupUser(
            id=user_id,
            nickname=nickname,
            joined_at=time.time()
        )
        
        self.users[user_id] = user
        self.connections[user_id] = websocket
        self.nickname_to_user_id[nickname] = user_id
        
        logger.info(f"User '{nickname}' (ID: {user_id}) joined room '{self.room_id}'. Total users: {len(self.users)}")
        return user
        
    def remove_user(self, websocket: WebSocket) -> Optional[GroupUser]:
        """
        Remove a user from the room by WebSocket connection.
        
        Args:
            websocket: User's WebSocket connection
            
        Returns:
            GroupUser if removed successfully, None if not found
        """
        user_id = None
        for uid, conn in self.connections.items():
            if conn == websocket:
                user_id = uid
                break
                
        if not user_id or user_id not in self.users:
            return None
            
        user = self.users[user_id]
        del self.users[user_id]
        del self.connections[user_id]
        del self.nickname_to_user_id[user.nickname]
        
        logger.info(f"User '{user.nickname}' (ID: {user_id}) left room '{self.room_id}'. Total users: {len(self.users)}")
        return user
        
    def get_user_by_websocket(self, websocket: WebSocket) -> Optional[GroupUser]:
        """Get user by their WebSocket connection."""
        for user_id, conn in self.connections.items():
            if conn == websocket:
                return self.users.get(user_id)
        return None
        
    def get_users_list(self) -> List[GroupUser]:
        """Get list of all users in the room."""
        return list(self.users.values())
        
    def get_connections(self, exclude: WebSocket = None) -> List[WebSocket]:
        """Get all WebSocket connections except the excluded one."""
        return [conn for conn in self.connections.values() if conn != exclude]


class GroupChatService:
    """Service for managing group chat functionality."""
    
    def __init__(self):
        self.rooms: Dict[str, ChatRoom] = {}
        self.default_room_id = "general"
        self.max_users_per_room = 20
        
        # Create default room
        self.get_or_create_room(self.default_room_id)
        
    def get_or_create_room(self, room_id: str = None) -> ChatRoom:
        """Get an existing room or create a new one."""
        if room_id is None:
            room_id = self.default_room_id
            
        if room_id not in self.rooms:
            self.rooms[room_id] = ChatRoom(room_id, self.max_users_per_room)
            logger.info(f"Created new chat room: {room_id}")
            
        return self.rooms[room_id]
        
    async def join_room(self, nickname: str, websocket: WebSocket, room_id: str = None) -> GroupChatResponse:
        """
        Handle user joining a room.
        
        Args:
            nickname: User's desired nickname
            websocket: User's WebSocket connection
            room_id: Target room ID (defaults to general)
            
        Returns:
            GroupChatResponse with join result
        """
        room = self.get_or_create_room(room_id)
        
        if room.is_full():
            return GroupChatResponse(
                type="room_full",
                error="Chat room is full (20 users maximum)"
            )
            
        user = room.add_user(nickname, websocket)
        if not user:
            return GroupChatResponse(
                type="error",
                error="Failed to join room"
            )
            
        # Notify all other users about the new user
        logger.info(f"User '{user.nickname}' joined room '{room.room_id}'. Notifying {len(room.users) - 1} other users")
        await self._broadcast_to_room(
            room,
            GroupChatResponse(
                type="user_joined",
                sender=user.nickname,
                userId=user.id,
                users=room.get_users_list(),
                userCount=len(room.users)
            ),
            exclude=websocket
        )
        
        # Return success response to the joining user
        return GroupChatResponse(
            type="room_joined",
            users=room.get_users_list(),
            userCount=len(room.users)
        )
        
    async def leave_room(self, websocket: WebSocket, room_id: str = None) -> Optional[GroupChatResponse]:
        """
        Handle user leaving a room.
        
        Args:
            websocket: User's WebSocket connection
            room_id: Room ID (defaults to general)
            
        Returns:
            GroupChatResponse with leave result, None if user not found
        """
        room = self.get_or_create_room(room_id)
        user = room.remove_user(websocket)
        
        if not user:
            return None
            
        # Notify all remaining users about the user leaving
        await self._broadcast_to_room(
            room,
            GroupChatResponse(
                type="user_left",
                sender=user.nickname,
                users=room.get_users_list(),
                userCount=len(room.users)
            )
        )
        
        return GroupChatResponse(
            type="user_left",
            sender=user.nickname
        )
        
    async def send_message(self, message: str, websocket: WebSocket, room_id: str = None) -> GroupChatResponse:
        """
        Handle sending a message to the room.
        
        Args:
            message: Message content
            websocket: Sender's WebSocket connection
            room_id: Room ID (defaults to general)
            
        Returns:
            GroupChatResponse with message result
        """
        room = self.get_or_create_room(room_id)
        user = room.get_user_by_websocket(websocket)
        
        if not user:
            return GroupChatResponse(
                type="error",
                error="User not found in room"
            )
            
        # Broadcast message to all users in the room
        response = GroupChatResponse(
            type="message",
            message=message,
            sender=user.nickname,
            userId=user.id
        )
        
        await self._broadcast_to_room(room, response, exclude=None)  # Include sender in broadcast
        return response
        
    async def get_room_users(self, websocket: WebSocket, room_id: str = None) -> GroupChatResponse:
        """Get list of users in the room."""
        room = self.get_or_create_room(room_id)
        
        return GroupChatResponse(
            type="user_list",
            users=room.get_users_list(),
            userCount=len(room.users)
        )
        
    async def handle_disconnect(self, websocket: WebSocket) -> None:
        """Handle user disconnection from any room."""
        for room in self.rooms.values():
            user = room.get_user_by_websocket(websocket)
            if user:
                await self.leave_room(websocket, room.room_id)
                break
                
    async def _broadcast_to_room(
        self, 
        room: ChatRoom, 
        response: GroupChatResponse, 
        exclude: WebSocket = None
    ) -> int:
        """
        Broadcast a message to all users in a room.
        
        Args:
            room: Target room
            response: Response to broadcast
            exclude: WebSocket to exclude from broadcast
            
        Returns:
            Number of successful sends
        """
        connections = room.get_connections(exclude)
        successful_sends = 0
        failed_connections = []
        
        logger.info(f"Broadcasting {response.type} to {len(connections)} connections (excluding sender: {exclude is not None})")
        
        for websocket in connections:
            try:
                # Wrap the response in the group_chat_response envelope
                wrapped_response = {
                    "type": "group_chat_response",
                    "data": response.dict()
                }
                await websocket.send_text(json.dumps(wrapped_response))
                successful_sends += 1
                logger.debug(f"Successfully broadcast {response.type} to a connection")
            except Exception as e:
                logger.warning(f"Failed to send {response.type} message to user: {str(e)}")
                failed_connections.append(websocket)
                
        # Only clean up failed connections for non-join messages to avoid removing users immediately after joining
        if response.type != "user_joined":
            for websocket in failed_connections:
                logger.info(f"Removing user due to failed connection (message type: {response.type})")
                room.remove_user(websocket)
        else:
            logger.info(f"Skipping connection cleanup for user_joined message - {len(failed_connections)} failed connections")
            
        logger.info(f"Broadcast {response.type} completed: {successful_sends} successful, {len(failed_connections)} failed")
        return successful_sends
