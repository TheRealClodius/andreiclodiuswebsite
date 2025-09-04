// Core OS types for the website operating system

export interface OSWindowTheme {
  background: string
  border: string
  headerBackground: string
  headerBorder: string
  titleColor: string
  shadow: string
}

export interface OSWindowState {
  id: string
  title: string
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  isMaximized: boolean
  isMinimized: boolean
  zIndex: number
  // Apps can override specific theme properties
  themeOverrides?: Partial<OSWindowTheme>
}

export interface OSWindowCallbacks {
  onDrag: (windowId: string, position: { x: number; y: number }) => void
  onResize: (windowId: string, position: { x: number; y: number; width: number; height: number }) => void
  onClose: (windowId: string) => void
  onMaximize: (windowId: string) => void
  onFocus: (windowId: string) => void
}
