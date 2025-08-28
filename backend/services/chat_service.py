"""
AI Chat service using Google Gemini.
"""

import asyncio
import logging
import base64
from typing import Dict, Any, AsyncGenerator, List, Optional
from google import genai
from google.genai import types
from config.settings import get_settings
from models.websocket import (
    ChatResponseChunk, 
    ChatComplete,
    ErrorMessage,
    MessageAttachment
)

logger = logging.getLogger(__name__)
settings = get_settings()


class ChatService:
    """
    AI Chat Service powered by Google's Gemini model.
    Handles conversation management and AI response generation.
    """
    
    def __init__(self, api_key: str = None):
        """
        Initialize the chat service.
        
        Args:
            api_key: Gemini API key (optional, will use settings if not provided)
        """
        self.api_key = api_key or settings.gemini_api_key
        if not self.api_key:
            raise ValueError("Gemini API key not found in configuration")
        
        # Initialize the Gen AI client
        self.client = genai.Client(api_key=self.api_key)
        
        # System instruction for the AI persona with tool awareness
        self.system_instruction = """You are Andrei's AI clone, an intelligent and helpful assistant representing Andrei Clodius. 
        You are knowledgeable, friendly, and conversational. Respond as if you are Andrei himself, sharing insights 
        about technology, development, and life. Keep responses engaging but concise unless asked for detailed explanations.
        
        IMPORTANT: You have access to an image generation tool! When users:
        - Ask you to generate, create, draw, or make images
        - Want to modify existing images ("make it bigger", "change colors", "add more cats")
        - Request edits to previous generations ("less of this", "more of that")
        
        Use the generate_image tool with appropriate parameters. The tool understands context and can modify previous images.
        
        Key traits:
        - Passionate about technology and software development
        - Friendly and approachable
        - Knowledgeable about modern web technologies, AI, and software engineering
        - Enjoys helping others learn and grow
        - Has a thoughtful, analytical approach to problems
        - Uses tools intelligently based on user intent
        """
        
        # Define the image generation tool using Gemini types
        self.image_generation_tool = types.Tool(
            function_declarations=[
                types.FunctionDeclaration(
                    name="generate_image",
                    description="Generate or modify images using AI. Can create new images or edit existing ones based on context.",
                    parameters=types.Schema(
                        type=types.Type.OBJECT,
                        properties={
                            "prompt": types.Schema(
                                type=types.Type.STRING,
                                description="Detailed description of the image to generate or how to modify it"
                            ),
                            "use_previous_image": types.Schema(
                                type=types.Type.BOOLEAN,
                                description="Whether to use the previously generated image as a reference for modification"
                            ),
                            "modification_type": types.Schema(
                                type=types.Type.STRING,
                                description="Type of image generation request",
                                enum=["new_generation", "edit_previous", "style_change", "content_change"]
                            )
                        },
                        required=["prompt", "modification_type"]
                    )
                )
            ]
        )
        
        # Chat history storage - in production, this would be persisted
        self.chat_history: List[Dict[str, str]] = []
        
        # Context tracking for smart image generation
        self.last_generated_image: Optional[str] = None  # Store last generated image as base64
        self.last_generation_prompt: Optional[str] = None  # Store the prompt that created it
        self.last_message_was_generation: bool = False  # Track if last response included image generation
        
        logger.info("ChatService initialized successfully")
    
    async def _generate_response_with_tools(self, message: str, attachments: List[MessageAttachment]) -> str:
        """
        Generate AI response with function calling capability.
        
        Args:
            message: User's message
            attachments: File attachments
            
        Returns:
            AI response text
        """
        # Build conversation content
        contents = []
        
        # Add conversation history for context
        for entry in self.chat_history[-5:]:  # Last 5 exchanges for context
            if entry.get("user"):
                contents.append(f"Human: {entry['user']}")
            if entry.get("assistant"):
                contents.append(f"Assistant: {entry['assistant']}")
        
        # Add current user message
        current_content = [f"User: {message}"]
        
        # Add image attachments if present
        if attachments:
            for attachment in attachments:
                if attachment.mime_type.startswith('image/'):
                    try:
                        # Decode base64 image data
                        image_bytes = base64.b64decode(attachment.data)
                        
                        # Create image part using Gemini types
                        image_part = types.Part.from_bytes(
                            data=image_bytes,
                            mime_type=attachment.mime_type,
                        )
                        current_content.append(image_part)
                        
                        logger.info(f"Added image attachment: {attachment.name} ({attachment.mime_type})")
                    except Exception as e:
                        logger.error(f"Error processing image attachment {attachment.name}: {str(e)}")
        
        # Add current content to conversation
        if current_content:
            contents.extend(current_content)
        
        logger.info(f"Sending to Gemini with tools enabled")
        
        # Generate response using function calling
        response = await asyncio.to_thread(
            self.client.models.generate_content,
            model=settings.gemini_model,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=self.system_instruction,
                tools=[self.image_generation_tool],  # Enable image generation tool
                temperature=0.7,
                max_output_tokens=2048
            )
        )
        
        # Handle function calls
        if hasattr(response, 'candidates') and response.candidates:
            candidate = response.candidates[0]
            
            # Check for function calls
            if hasattr(candidate.content, 'parts'):
                for part in candidate.content.parts:
                    if hasattr(part, 'function_call') and part.function_call:
                        # Return function call info for streaming handler
                        if part.function_call.name == "generate_image":
                            return {
                                "type": "function_call",
                                "function": "generate_image", 
                                "args": part.function_call.args
                            }
            
            # Return text response if no function calls
            if hasattr(candidate.content, 'parts'):
                text_parts = [part.text for part in candidate.content.parts if hasattr(part, 'text')]
                if text_parts:
                    return ' '.join(text_parts)
        
        return "I'm sorry, I couldn't process your request."
    
    async def _handle_image_generation_tool(self, args, message_id: str) -> AsyncGenerator[Dict[str, Any], None]:
        """Handle the image generation tool call and stream responses."""
        logger.info(f"Handling image generation tool with args: {args}")
        
        prompt = args.get("prompt", "")
        use_previous = args.get("use_previous_image", False)
        modification_type = args.get("modification_type", "new_generation")
        
        # Send image generation loading state
        yield {
            "type": "image_generating",
            "message_id": message_id,
            "timestamp": asyncio.get_event_loop().time()
        }
        
        # Prepare reference images
        reference_images = []
        
        if use_previous and self.last_generated_image:
            logger.info("Using previous generated image as reference via tool")
            previous_image_attachment = MessageAttachment(
                name="previous-generated-image.png",
                mime_type="image/png", 
                data=self.last_generated_image,
                size=0
            )
            reference_images = [previous_image_attachment]
        
        # Generate image
        generated_image, text_response = await self.generate_image(prompt, reference_images)
        
        if generated_image:
            # Store generated image for future context
            self.last_generated_image = generated_image
            self.last_generation_prompt = prompt
            self.last_message_was_generation = True
            
            # Send image response
            yield {
                "type": "image_generated",
                "image_data": generated_image,
                "mime_type": "image/png",
                "message_id": message_id,
                "timestamp": asyncio.get_event_loop().time()
            }
            
            logger.info("Image generated successfully via tool call")
            
            # If there's also a text response, stream it
            if text_response:
                async for chunk in self._stream_response(text_response, message_id):
                    yield chunk
        else:
            # No image generated, but check if we have a text response to stream
            if text_response:
                logger.info("Image generation failed, but streaming text response from model")
                async for chunk in self._stream_response(text_response, message_id):
                    yield chunk
            else:
                # Send generic error response
                yield {
                    "type": "image_generation_failed",
                    "error": "Image generation failed with no response",
                    "message_id": message_id,
                    "timestamp": asyncio.get_event_loop().time()
                }
                logger.error("Image generation failed via tool call with no response")
    
    async def send_message_stream(self, message: str, message_id: str, attachments: List[MessageAttachment] = None) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Process a message and stream the AI response.
        
        Args:
            message: User's message
            message_id: Unique identifier for this message
            
        Yields:
            Dict containing response chunks with type and content
        """
        try:
            logger.info(f"Processing streaming message with function calling: {message[:100]}...")
            
            # Generate AI response with function calling capability
            ai_response = await self._generate_response_with_tools(message, attachments or [])
            
            # Check if AI decided to use image generation tool
            if isinstance(ai_response, dict) and ai_response.get("type") == "function_call":
                if ai_response.get("function") == "generate_image":
                    # Handle image generation via tool
                    async for chunk in self._handle_image_generation_tool(ai_response["args"], message_id):
                        yield chunk
                    
                    # Send completion signal
                    completion = ChatComplete(
                        message_id=message_id,
                        full_content="Image generated successfully",
                        timestamp=asyncio.get_event_loop().time()
                    )
                    yield completion.dict()
                    
                    # Add to chat history
                    self._add_to_history(message, "Generated an image based on your request.")
                    return
            
            # Handle text response
            if isinstance(ai_response, str):
                # Reset generation context for non-image messages
                self.last_message_was_generation = False
                
                # Stream the text response in chunks
                async for chunk in self._stream_response(ai_response, message_id):
                    yield chunk
                    
                # Send completion signal
                completion = ChatComplete(
                    message_id=message_id,
                    full_content=ai_response,
                    timestamp=asyncio.get_event_loop().time()
                )
                yield completion.dict()
                
                # Add to chat history
                self._add_to_history(message, ai_response)
                return
                
            # Fallback for unexpected response format
            logger.warning(f"Unexpected AI response format: {type(ai_response)}")
            fallback_response = "I apologize, but I encountered an issue processing your request."
            
            async for chunk in self._stream_response(fallback_response, message_id):
                yield chunk
                
            completion = ChatComplete(
                message_id=message_id,
                full_content=fallback_response,
                timestamp=asyncio.get_event_loop().time()
            )
            yield completion.dict()
            
        except Exception as e:
            logger.error(f"Error processing streaming message: {str(e)}")
            yield {
                "type": "error",
                "error": f"An error occurred: {str(e)}",
                "message_id": message_id,
                "timestamp": asyncio.get_event_loop().time()
            }
            
            logger.info(f"Message processing complete for ID: {message_id}")
    

    async def send_message_simple(self, message: str) -> str:
        """
        Send a message and get the complete response (non-streaming).
        
        Args:
            message: User's message
            
        Returns:
            Complete AI response string
        """
        try:
            response = await self._generate_response(message)
            self._add_to_history(message, response)
            return response
        except Exception as e:
            logger.error(f"Error in simple message: {str(e)}")
            return f"Sorry, I encountered an error: {str(e)}"
    
    async def _generate_response(self, message: str, attachments: List[MessageAttachment] = None) -> str:
        """
        Generate AI response using Gemini.
        
        Args:
            message: User's message
            
        Returns:
            AI response string
        """
        # Prepare conversation context for multimodal input
        contents = []
        
        # Add system instruction as first content
        contents.append(self.system_instruction)
        
        # Add recent chat history for context
        recent_history = self.chat_history[-settings.chat_history_limit:]
        for hist_msg in recent_history:
            contents.append(f"User: {hist_msg['user']}")
            contents.append(f"Assistant: {hist_msg['assistant']}")
        
        # Build current message content (multimodal)
        current_content = []
        
        # Add text content
        if message.strip():
            current_content.append(f"User: {message}")
        
        # Add image attachments if present
        if attachments:
            for attachment in attachments:
                # Only process image attachments for now
                if attachment.mime_type.startswith('image/'):
                    try:
                        # Decode base64 image data
                        image_bytes = base64.b64decode(attachment.data)
                        
                        # Create image part using Gemini types
                        image_part = types.Part.from_bytes(
                            data=image_bytes,
                            mime_type=attachment.mime_type,
                        )
                        current_content.append(image_part)
                        
                        logger.info(f"Added image attachment: {attachment.name} ({attachment.mime_type})")
                    except Exception as e:
                        logger.error(f"Error processing image attachment {attachment.name}: {str(e)}")
        
        # Add current content to conversation
        if current_content:
            if len(current_content) == 1 and isinstance(current_content[0], str):
                # Text only
                contents.append(current_content[0])
            else:
                # Multimodal content - add each part
                contents.extend(current_content)
        
        # Count images by checking for types.Part objects with mime_type
        image_count = sum(1 for content in contents if hasattr(content, 'mime_type') and content.mime_type.startswith('image/'))
        
        logger.info(f"Sending {len(contents)} content parts to Gemini (including {image_count} images)")
        logger.info(f"Content types: {[type(content).__name__ for content in contents]}")
        
        # Generate response using the client
        response = await asyncio.to_thread(
            self.client.models.generate_content,
            model=settings.gemini_model,
            contents=contents
        )
        
        return response.text
    
    async def generate_image(self, prompt: str, reference_images: List[MessageAttachment] = None) -> tuple[Optional[str], Optional[str]]:
        """
        Generate an image using Gemini's image generation model.
        
        Args:
            prompt: Text description for image generation
            reference_images: Optional reference images for context
            
        Returns:
            Tuple of (Base64 encoded image data, text response) - either can be None
        """
        try:
            logger.info(f"Generating image with model: {settings.gemini_image_model}")
            logger.info(f"Prompt: {prompt[:100]}...")
            if reference_images:
                logger.info(f"Reference images: {len(reference_images)}")
            
            # Build contents for multimodal generation
            contents = []
            
            # Add reference images first if provided
            if reference_images:
                for img in reference_images:
                    if img.mime_type.startswith('image/'):
                        try:
                            image_bytes = base64.b64decode(img.data)
                            image_part = types.Part.from_bytes(
                                data=image_bytes,
                                mime_type=img.mime_type,
                            )
                            contents.append(image_part)
                            logger.info(f"Added reference image: {img.name}")
                        except Exception as e:
                            logger.error(f"Error processing reference image {img.name}: {str(e)}")
            
            # Add text prompt
            contents.append(prompt)
            
            # Use image generation model
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model=settings.gemini_image_model,
                contents=contents
            )
            
            logger.info(f"Image generation response received: {type(response)}")
            
            # Check if response contains image data
            if response.candidates and len(response.candidates) > 0:
                candidate = response.candidates[0]
                logger.info(f"Candidate found with {len(candidate.content.parts)} parts")
                
                image_data = None
                text_response = None
                
                # Look for image parts and text parts in the response
                for i, part in enumerate(candidate.content.parts):
                    logger.info(f"Part {i}: {type(part)} - has inline_data: {hasattr(part, 'inline_data')}")
                    if hasattr(part, 'inline_data') and part.inline_data:
                        logger.info("Found inline image data!")
                        # Store base64 encoded image data
                        image_data = base64.b64encode(part.inline_data.data).decode('utf-8')
                    elif hasattr(part, 'file_data') and part.file_data:
                        # Handle file data if available
                        logger.warning("File data response not yet implemented")
                    elif hasattr(part, 'text') and part.text:
                        logger.info(f"Text part: {part.text[:100]}...")
                        text_response = part.text
                
                # Return both image and text (either can be None)
                if image_data:
                    return (image_data, text_response)
                elif text_response:
                    logger.warning("No image data found, but text response available")
                    return (None, text_response)
            
            logger.warning("No image data found in generation response")
            if response.candidates:
                logger.warning(f"Response text: {response.text}")
            
            return (None, response.text if response.candidates else None)
            
        except Exception as e:
            logger.error(f"Error generating image: {str(e)}", exc_info=True)
            return (None, f"Error generating image: {str(e)}")
    

    async def _stream_response(self, full_response: str, message_id: str) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Stream response content in chunks.
        
        Args:
            full_response: Complete AI response
            message_id: Message identifier
            
        Yields:
            Response chunk dictionaries
        """
        chunk_size = settings.response_chunk_size
        
        for i in range(0, len(full_response), chunk_size):
            chunk_content = full_response[i:i + chunk_size]
            is_final = i + chunk_size >= len(full_response)
            
            chunk = ChatResponseChunk(
                content=chunk_content,
                message_id=message_id,
                is_final=is_final,
                timestamp=asyncio.get_event_loop().time()
            )
            
            yield chunk.dict()
            
            # Small delay to simulate real streaming
            if not is_final:
                await asyncio.sleep(settings.stream_delay)
    
    def _add_to_history(self, user_message: str, ai_response: str) -> None:
        """
        Add message pair to chat history.
        
        Args:
            user_message: User's message
            ai_response: AI's response
        """
        self.chat_history.append({
            "user": user_message,
            "assistant": ai_response
        })
        
        # Keep history within reasonable limits
        if len(self.chat_history) > settings.chat_history_limit * 2:
            # Remove oldest entries, keeping twice the context limit
            self.chat_history = self.chat_history[-settings.chat_history_limit:]
    
    def reset_conversation(self) -> None:
        """Reset the chat session to start fresh."""
        self.chat_history = []
        logger.info("Chat session reset")
    
    def get_conversation_length(self) -> int:
        """Get the number of message pairs in the conversation."""
        return len(self.chat_history)
    
    def get_last_messages(self, count: int = 5) -> List[Dict[str, str]]:
        """
        Get the last N message pairs from the conversation.
        
        Args:
            count: Number of message pairs to return
            
        Returns:
            List of message dictionaries
        """
        return self.chat_history[-count:] if self.chat_history else []
