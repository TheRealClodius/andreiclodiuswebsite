# AndreiChatApp - Modular Architecture

## Overview

The AndreiChatApp has been refactored from a single 899-line component into a modular, maintainable architecture. This document explains the new structure and how to use it.

## Original vs Modular Structure

### Before (899 lines, single file)
```
AndreiChatApp.tsx
├── All WebSocket logic
├── All message management 
├── All file upload logic
├── All styled components
├── All utility functions
└── All UI rendering
```

### After (Modular)
```
src/
├── hooks/                    # Custom React hooks
│   ├── useWebSocket.ts       # WebSocket connection management
│   ├── useChatMessages.ts    # Message state and handlers
│   ├── useFileUpload.ts      # File selection and management
│   ├── useChat.ts            # Main chat hook (combines all)
│   └── index.ts              # Hook exports
├── components/chat/          # Reusable chat components
│   ├── MessageBubble.tsx     # Individual message display
│   ├── AttachmentPreview.tsx # File attachment display
│   ├── FileUpload.tsx        # File selection UI
│   ├── ChatInput.tsx         # Input area with send button
│   ├── MessageList.tsx       # Messages container
│   └── index.ts              # Component exports
├── styles/chat/              # Styled components
│   ├── animations.ts         # Keyframes and motion variants
│   ├── layout.ts             # Layout containers
│   ├── message.ts            # Message styling
│   ├── attachments.ts        # Attachment styling
│   ├── input.ts              # Input area styling
│   ├── fileUpload.ts         # File upload styling
│   └── index.ts              # Style exports
├── utils/                    # Utility functions
│   └── chatUtils.ts          # Formatting, validation, helpers
└── apps/
    ├── AndreiChatApp.tsx     # Original (keep for reference)
    └── AndreiChatAppModular.tsx # New modular version (87 lines)
```

## Key Components

### Custom Hooks

#### `useWebSocket(options)`
Manages WebSocket connection lifecycle:
- Auto-connection and reconnection
- Connection status tracking
- Message sending/receiving
- Cleanup on unmount

```typescript
const { connectionStatus, sendMessage, isConnected } = useWebSocket({
  url: 'ws://localhost:8000/ws',
  onMessage: handleMessage
})
```

#### `useChatMessages()`
Handles all message-related state:
- Message array management
- AI typing indicators
- Streaming message updates
- Error handling

```typescript
const { messages, isAiTyping, addUserMessage, handleChatResponse } = useChatMessages()
```

#### `useFileUpload()`
Manages file selection and attachments:
- File array management
- File preview generation
- Memory leak prevention (URL cleanup)

```typescript
const { selectedFiles, handleFileSelect, removeFile, clearFiles } = useFileUpload()
```

#### `useChat(options)` - Main Hook
Combines all functionality into a single interface:
- Integrates WebSocket, messages, and files
- Handles message sending workflow
- Manages UI state (focus, etc.)

```typescript
const chat = useChat({
  websocketUrl: 'ws://localhost:8000/ws',
  onMessagesUpdate: (messages) => saveToStore(messages)
})
```

### Components

#### `<MessageList />` 
Displays all messages with auto-scroll:
- Empty state handling
- Connection status display
- Animated message entrance

#### `<ChatInput />`
Complete input area with:
- Auto-resizing textarea
- File attachment UI
- Send button with validation

#### `<MessageBubble />`
Individual message display:
- Human vs AI styling
- Timestamp formatting
- Attachment rendering

#### `<FileUpload />`
File selection interface:
- Drag-and-drop support
- File preview thumbnails
- Remove file functionality

## Benefits of Modular Architecture

### 1. **Maintainability**
- Single responsibility per module
- Easy to locate and fix bugs
- Clear separation of concerns

### 2. **Reusability**
- Hooks can be used in other chat components
- Styled components can be shared
- Utilities work across the app

### 3. **Testability**
- Each hook can be unit tested
- Components can be tested in isolation
- Mocking is simpler with clear interfaces

### 4. **Performance**
- Better code splitting opportunities
- Easier to optimize individual pieces
- Reduced bundle size through tree shaking

### 5. **Developer Experience**
- Clearer code organization
- IntelliSense works better
- Easier onboarding for new developers

## Usage Examples

### Basic Chat Implementation
```typescript
import { useChat } from '../hooks'
import { MessageList, ChatInput } from '../components/chat'

const MyChat = () => {
  const [input, setInput] = useState('')
  
  const chat = useChat({
    websocketUrl: 'ws://localhost:8000/ws'
  })

  const handleSend = () => {
    chat.handleSendMessage(input)
    setInput('')
  }

  return (
    <div>
      <MessageList 
        messages={chat.messages}
        isAiTyping={chat.isAiTyping}
        connectionStatus={chat.connectionStatus}
      />
      <ChatInput
        inputValue={input}
        onInputChange={(e) => setInput(e.target.value)}
        onSendMessage={handleSend}
        // ... other props
      />
    </div>
  )
}
```

### Custom WebSocket Hook Usage
```typescript
const { connectionStatus, sendMessage } = useWebSocket({
  url: 'ws://localhost:8000/ws',
  onMessage: (data) => console.log('Received:', data),
  reconnectDelay: 5000
})
```

### Standalone File Upload
```typescript
const { selectedFiles, handleFileSelect, removeFile } = useFileUpload()

return (
  <FileUpload
    selectedFiles={selectedFiles}
    onFileSelect={handleFileSelect}
    onRemoveFile={removeFile}
  />
)
```

## Migration Guide

To switch from the original to modular version:

1. Replace the import in `appRegistry.tsx`:
```typescript
// Before
import { AndreiChatApp } from './AndreiChatApp'

// After  
import { AndreiChatApp } from './AndreiChatAppModular'
```

2. The API remains the same - no breaking changes to parent components.

## Future Enhancements

The modular structure enables easy additions:

- **Message Types**: Add support for rich media, code blocks, etc.
- **Themes**: Easy styling customization
- **Plugins**: File type handlers, message processors
- **Testing**: Comprehensive test suite
- **Performance**: Virtual scrolling, message pagination
- **Accessibility**: ARIA labels, keyboard navigation

## File Size Comparison

- **Original**: 899 lines, single file
- **Modular Main**: 87 lines (92% reduction)
- **Total Modular**: ~500 lines across multiple focused files
- **Better Organization**: Each file has clear purpose and responsibility

The modular approach trades a small increase in total lines for massive improvements in maintainability, reusability, and developer experience.
