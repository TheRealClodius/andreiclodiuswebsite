"""
Modular FastAPI backend for Andrei Clodius Website.
This file serves as the main application entry point with clean separation of concerns.
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import configuration and routes
from config.settings import get_settings
from routes.api_routes import api_router
from routes.websocket_routes import websocket_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get application settings
settings = get_settings()

# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_credentials,
    allow_methods=settings.cors_methods,
    allow_headers=settings.cors_headers,
)

# Include routers
app.include_router(api_router)
app.include_router(websocket_router)


@app.get("/")
async def root():
    """Root endpoint with basic API information."""
    return {
        "message": settings.app_name,
        "version": settings.app_version,
        "status": "running"
    }


@app.on_event("startup")
async def startup_event():
    """Initialize services on application startup."""
    logger.info("🚀 Starting up backend services...")
    
    # Pre-initialize chat service to check configuration
    try:
        from services.chat_service import ChatService
        chat_service = ChatService()
        logger.info("✅ Chat service configuration validated")
    except Exception as e:
        logger.warning(f"⚠️ Chat service configuration issue: {e}")
        logger.info("🔧 Chat service will be initialized on first message")
    
    logger.info("✅ Backend startup complete")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown."""
    logger.info("🛑 Shutting down backend services...")
    # Add any cleanup logic here
    logger.info("✅ Backend shutdown complete")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
        log_level=settings.log_level.lower()
    )
