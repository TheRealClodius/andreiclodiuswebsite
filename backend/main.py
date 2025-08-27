from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
import logging
from typing import Dict, List

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Andrei Clodius Website API",
    description="Backend for the OS-like personal website",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection manager for real-time features
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_data: Dict[WebSocket, dict] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_data[websocket] = {}
        logger.info(f"New WebSocket connection. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if websocket in self.connection_data:
            del self.connection_data[websocket]
        logger.info(f"WebSocket disconnected. Total: {len(self.active_connections)}")

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_text(json.dumps(message))

    async def broadcast(self, message: dict):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except:
                disconnected.append(connection)
        
        # Clean up disconnected connections
        for connection in disconnected:
            self.disconnect(connection)

manager = ConnectionManager()

@app.get("/")
async def root():
    return {"message": "Andrei Clodius Website API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "connections": len(manager.active_connections)}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            message_type = message.get("type", "unknown")
            
            if message_type == "ping":
                await manager.send_personal_message({"type": "pong"}, websocket)
            elif message_type == "broadcast":
                # Broadcast to all other connections
                await manager.broadcast({
                    "type": "broadcast",
                    "data": message.get("data", {}),
                    "from": message.get("from", "unknown")
                })
            else:
                logger.info(f"Received message: {message}")
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# API Routes for future features
@app.get("/api/apps")
async def get_available_apps():
    """Get list of available applications"""
    return {
        "apps": [
            {
                "id": "notes",
                "name": "Notes",
                "icon": "📝",
                "description": "Simple note-taking application"
            }
        ]
    }

@app.post("/api/notes")
async def save_note(note_data: dict):
    """Save a note (placeholder for future database integration)"""
    logger.info(f"Saving note: {note_data}")
    return {"success": True, "message": "Note saved successfully"}

@app.get("/api/notes")
async def get_notes():
    """Get all notes (placeholder for future database integration)"""
    return {"notes": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
