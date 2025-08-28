import os
import asyncio
import logging
from typing import Optional, Dict, Any, AsyncGenerator
from google import genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env.local'))

logger = logging.getLogger(__name__)

class ChatAgent:
    """
    AI Chat Agent powered by Google's Gemini model
    """
    
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Initialize the Gen AI client
        self.client = genai.Client(api_key=self.api_key)
        
        # Define system instruction
        self.system_instruction = """You are Andrei's AI clone, an intelligent and helpful assistant representing Andrei Clodius. 
        You are knowledgeable, friendly, and conversational. Respond as if you are Andrei himself, sharing insights 
        about technology, development, and life. Keep responses engaging but concise unless asked for detailed explanations.
        
        Key traits:
        - Passionate about technology and software development
        - Friendly and approachable
        - Knowledgeable about modern web technologies, AI, and software engineering
        - Enjoys helping others learn and grow
        - Has a thoughtful, analytical approach to problems
        """
        
        # Chat history for context
        self.chat_history = []
        
        logger.info("ChatAgent initialized successfully")
    
    async def send_message(self, message: str, message_id: str) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Send a message to the AI and stream the response
        
        Args:
            message: User's message
            message_id: Unique identifier for this message
            
        Yields:
            Dict containing response chunks with type and content
        """
        try:
            logger.info(f"Processing message: {message[:100]}...")
            
            # Send typing indicator
            yield {
                "type": "typing_start",
                "message_id": message_id,
                "timestamp": asyncio.get_event_loop().time()
            }
            
            # Prepare conversation context
            conversation_context = [self.system_instruction]
            
            # Add chat history for context
            for hist_msg in self.chat_history[-10:]:  # Keep last 10 messages for context
                conversation_context.append(f"User: {hist_msg['user']}")
                conversation_context.append(f"Assistant: {hist_msg['assistant']}")
            
            # Add current message
            conversation_context.append(f"User: {message}")
            
            full_prompt = "\n".join(conversation_context)
            
            # Generate response using the client
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model='gemini-2.5-flash',
                contents=full_prompt
            )
            
            # Stop typing indicator
            yield {
                "type": "typing_end", 
                "message_id": message_id,
                "timestamp": asyncio.get_event_loop().time()
            }
            
            # Stream the response content
            full_response = response.text
            
            # Add to chat history
            self.chat_history.append({
                "user": message,
                "assistant": full_response
            })
            
            # Simulate streaming by sending chunks
            chunk_size = 50  # Characters per chunk
            for i in range(0, len(full_response), chunk_size):
                chunk = full_response[i:i + chunk_size]
                
                yield {
                    "type": "content_chunk",
                    "content": chunk,
                    "message_id": message_id,
                    "is_final": i + chunk_size >= len(full_response),
                    "timestamp": asyncio.get_event_loop().time()
                }
                
                # Small delay to simulate real streaming
                await asyncio.sleep(0.03)
            
            # Send completion signal
            yield {
                "type": "message_complete",
                "message_id": message_id,
                "full_content": full_response,
                "timestamp": asyncio.get_event_loop().time()
            }
            
            logger.info(f"Message processing complete for ID: {message_id}")
            
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            yield {
                "type": "error",
                "error": str(e),
                "message_id": message_id,
                "timestamp": asyncio.get_event_loop().time()
            }
    
    async def send_message_simple(self, message: str) -> str:
        """
        Send a message and get the complete response (non-streaming)
        
        Args:
            message: User's message
            
        Returns:
            Complete AI response
        """
        try:
            # Prepare conversation context
            conversation_context = [self.system_instruction]
            
            # Add chat history for context
            for hist_msg in self.chat_history[-10:]:  # Keep last 10 messages for context
                conversation_context.append(f"User: {hist_msg['user']}")
                conversation_context.append(f"Assistant: {hist_msg['assistant']}")
            
            # Add current message
            conversation_context.append(f"User: {message}")
            
            full_prompt = "\n".join(conversation_context)
            
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model='gemini-2.5-flash',
                contents=full_prompt
            )
            
            # Add to chat history
            self.chat_history.append({
                "user": message,
                "assistant": response.text
            })
            
            return response.text
        except Exception as e:
            logger.error(f"Error in simple message: {str(e)}")
            return f"Sorry, I encountered an error: {str(e)}"
    
    def reset_conversation(self):
        """Reset the chat session to start fresh"""
        self.chat_history = []
        logger.info("Chat session reset")

# Global chat agent instance
chat_agent: Optional[ChatAgent] = None

def get_chat_agent() -> ChatAgent:
    """Get or create the global chat agent instance"""
    global chat_agent
    if chat_agent is None:
        chat_agent = ChatAgent()
    return chat_agent

async def initialize_chat_agent() -> bool:
    """Initialize the chat agent and return success status"""
    try:
        get_chat_agent()
        return True
    except Exception as e:
        logger.error(f"Failed to initialize chat agent: {str(e)}")
        return False
