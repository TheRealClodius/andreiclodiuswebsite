"""
Configuration management for the backend application.
Centralizes all environment variables and application settings.
"""

import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # API Configuration
    app_name: str = "Andrei Clodius Website API"
    app_description: str = "Backend for the OS-like personal website"
    app_version: str = "1.0.0"
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    reload: bool = True
    log_level: str = "INFO"
    
    # CORS Configuration
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000", 
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173"
    ]
    cors_credentials: bool = True
    cors_methods: List[str] = ["*"]
    cors_headers: List[str] = ["*"]
    
    # AI/Chat Configuration
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    gemini_image_model: str = "gemini-2.5-flash-image-preview"  # For image generation (nano-banana)
    chat_history_limit: int = 10
    response_chunk_size: int = 50
    stream_delay: float = 0.03
    
    # WebSocket Configuration
    websocket_heartbeat_interval: int = 30
    
    # Database Configuration (for future use)
    database_url: str = "sqlite:///./app.db"
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Load Gemini API key from environment
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")
    
    class Config:
        env_file = ".env.local"
        case_sensitive = False


# Global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get the application settings instance."""
    return settings
