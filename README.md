# Andrei Clodius Website

An operating system-like personal website with draggable, resizable windows and interactive applications.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- pip

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### Manual Setup

If you prefer to run services separately:

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

## 🏗️ Project Structure

```
├── frontend/           # React + TypeScript frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── apps/       # Window applications
│   │   └── stores/     # State management
├── backend/            # FastAPI backend
└── README.md
```

## ✨ Features

### Phase 1 (Current)
- ✅ Draggable, resizable windows
- ✅ Window position persistence
- ✅ Simple notes application
- ✅ Inter-window communication foundation
- ✅ OS-like interface with taskbar
- ✅ Smooth 120fps animations

### Future Phases
- File storage system
- Real-time collaboration
- More applications (terminal, games, etc.)
- User authentication
- Mobile responsiveness

## 🛠️ Technology Stack

**Frontend:**
- React 18 + TypeScript
- Styled-components for styling
- Framer Motion for animations
- Zustand for state management
- Vite for build tooling

**Backend:**
- FastAPI (Python)
- WebSockets for real-time features
- SQLAlchemy (future database integration)

## 🎯 Usage

1. **Open the website** at http://localhost:3000
2. **Click "Notes"** in the header to open a notes window
3. **Drag windows** by their title bar
4. **Resize windows** using the bottom-right corner handle
5. **Use window controls** (close, minimize, maximize) in the top-left
6. **Switch between windows** using the taskbar at the bottom

## 🔄 Development

The project uses hot-reload for both frontend and backend development. Any changes you make will be automatically reflected in the browser.

**Frontend changes:** Automatically reloaded via Vite
**Backend changes:** Automatically reloaded via uvicorn --reload

## 📝 Notes

- Window positions and content are automatically saved to localStorage
- The design is optimized for desktop but mobile support is planned
- Inter-window communication is set up for future advanced features
