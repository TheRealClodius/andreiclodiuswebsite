import { create } from 'zustand'
import { HEADER_HEIGHT } from '../constants/layout'

export interface WindowPosition {
  x: number
  y: number
  width: number
  height: number
}

export interface WindowState {
  id: string
  appType: string
  title: string
  position: WindowPosition
  previousPosition?: WindowPosition // Store position before maximizing
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  data?: any // App-specific data
}

interface WindowStore {
  windows: WindowState[]
  nextZIndex: number
  
  // Window management
  openWindow: (appType: string, title: string, initialData?: any) => string
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  updateWindowPosition: (id: string, position: Partial<WindowPosition>) => void
  toggleMinimize: (id: string) => void
  toggleMaximize: (id: string) => void
  
  // Inter-window communication
  updateWindowData: (id: string, data: any) => void
  broadcastMessage: (message: any, fromWindowId?: string) => void
  
  // Utilities
  getWindow: (id: string) => WindowState | undefined
  getWindowsByType: (appType: string) => WindowState[]
}

const DEFAULT_WINDOW_SIZE = { width: 600, height: 400 }
const DEFAULT_WINDOW_OFFSET = 50

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  nextZIndex: 1000,

  openWindow: (appType: string, title: string, initialData?: any) => {
    const id = `${appType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const existingWindows = get().windows.filter(w => !w.isMinimized)
    
    // Calculate position with offset for multiple windows
    const offset = existingWindows.length * DEFAULT_WINDOW_OFFSET
    const position: WindowPosition = {
      x: 100 + offset,
      y: Math.max(HEADER_HEIGHT + 20, 100 + offset), // Always below header with 20px margin
      ...DEFAULT_WINDOW_SIZE
    }

    const newWindow: WindowState = {
      id,
      appType,
      title,
      position,
      isMinimized: false,
      isMaximized: false,
      zIndex: get().nextZIndex,
      data: initialData
    }

    set(state => ({
      windows: [...state.windows, newWindow],
      nextZIndex: state.nextZIndex + 1
    }))

    return id
  },

  closeWindow: (id: string) => {
    set(state => ({
      windows: state.windows.filter(w => w.id !== id)
    }))
  },

  focusWindow: (id: string) => {
    set(state => {
      const window = state.windows.find(w => w.id === id)
      if (!window) return state

      return {
        windows: state.windows.map(w => 
          w.id === id 
            ? { ...w, zIndex: state.nextZIndex, isMinimized: false }
            : w
        ),
        nextZIndex: state.nextZIndex + 1
      }
    })
  },

  updateWindowPosition: (id: string, position: Partial<WindowPosition>) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id
          ? { ...w, position: { ...w.position, ...position } }
          : w
      )
    }))
  },

  toggleMinimize: (id: string) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id
          ? { ...w, isMinimized: !w.isMinimized }
          : w
      )
    }))
  },

  toggleMaximize: (id: string) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id
          ? { 
              ...w, 
              isMaximized: !w.isMaximized,
              // Save current position before maximizing, restore saved position when unmaximizing
              previousPosition: w.isMaximized ? w.previousPosition : w.position,
              position: w.isMaximized 
                ? (w.previousPosition || w.position) // Restore saved position or fallback to current
                : { x: 0, y: HEADER_HEIGHT, width: globalThis.innerWidth, height: globalThis.innerHeight - HEADER_HEIGHT }
            }
          : w
      )
    }))
  },

  updateWindowData: (id: string, data: any) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === id
          ? { ...w, data: { ...w.data, ...data } }
          : w
      )
    }))
  },

  broadcastMessage: (_message: any, _fromWindowId?: string) => {
    // For now, just no-op. Later this can trigger events to other windows
  },

  getWindow: (id: string) => {
    return get().windows.find(w => w.id === id)
  },

  getWindowsByType: (appType: string) => {
    return get().windows.filter(w => w.appType === appType)
  }
}))