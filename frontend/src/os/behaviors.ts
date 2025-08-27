import { HEADER_HEIGHT } from '../constants/layout'
import { OS_CONSTANTS } from './theme'

// OS-level window drag behavior
export const createDragHandler = (
  windowId: string,
  position: { x: number; y: number; width: number; height: number },
  isMaximized: boolean,
  onDrag: (id: string, pos: { x: number; y: number }) => void,
  onFocus: (id: string) => void,
  onComplete?: () => void
) => {
  return (event: React.MouseEvent) => {
    if (isMaximized) return
    
    // Don't drag if clicking on buttons
    if ((event.target as HTMLElement).tagName === 'BUTTON') return
    
    event.preventDefault()
    
    // OS-level cursor management
    const originalCursor = document.body.style.cursor
    document.body.style.cursor = 'grabbing'
    
    const startX = event.clientX
    const startY = event.clientY
    const startWindowX = position.x
    const startWindowY = position.y
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY
      
      const newX = startWindowX + deltaX
      const newY = Math.max(HEADER_HEIGHT, startWindowY + deltaY) // OS-level header constraint
      
      onDrag(windowId, { x: newX, y: newY })
    }
    
    const handleMouseUp = () => {
      document.body.style.cursor = originalCursor // Reset OS cursor
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      onComplete?.() // Call completion callback if provided
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    onFocus(windowId)
  }
}

// OS-level window resize behavior
export const createResizeHandler = (
  windowId: string,
  position: { x: number; y: number; width: number; height: number },
  isMaximized: boolean,
  onResize: (id: string, pos: { x: number; y: number; width: number; height: number }) => void,
  onComplete?: () => void
) => {
  return (direction: string) => (event: React.MouseEvent) => {
    if (isMaximized) return
    
    event.preventDefault()
    event.stopPropagation()
    
    // OS-level cursor management for resize
    const getCursorForDirection = (dir: string) => {
      switch (dir) {
        case 'n': 
        case 's': return 'ns-resize'
        case 'e': 
        case 'w': return 'ew-resize'
        case 'ne': 
        case 'sw': return 'nesw-resize'
        case 'nw': 
        case 'se': return 'nwse-resize'
        default: return 'default'
      }
    }
    
    const originalCursor = document.body.style.cursor
    document.body.style.cursor = getCursorForDirection(direction)
    
    const startX = event.clientX
    const startY = event.clientY
    const startWidth = position.width
    const startHeight = position.height
    const startWindowX = position.x
    const startWindowY = position.y

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      
      let newWidth = startWidth
      let newHeight = startHeight
      let newX = startWindowX
      let newY = startWindowY

      // OS-level resize constraints
      const MIN_WIDTH = 300
      const MIN_HEIGHT = 200

      // Handle horizontal resizing
      if (direction.includes('e')) {
        newWidth = Math.max(MIN_WIDTH, startWidth + deltaX)
      } else if (direction.includes('w')) {
        newWidth = Math.max(MIN_WIDTH, startWidth - deltaX)
        newX = startWindowX + deltaX
        if (newWidth === MIN_WIDTH) {
          newX = startWindowX + startWidth - MIN_WIDTH
        }
      }

      // Handle vertical resizing
      if (direction.includes('s')) {
        newHeight = Math.max(MIN_HEIGHT, startHeight + deltaY)
      } else if (direction.includes('n')) {
        newHeight = Math.max(MIN_HEIGHT, startHeight - deltaY)
        newY = Math.max(HEADER_HEIGHT, startWindowY + deltaY)
        if (newHeight === MIN_HEIGHT || newY === HEADER_HEIGHT) {
          newY = Math.max(HEADER_HEIGHT, startWindowY + startHeight - MIN_HEIGHT)
        }
      }
      
      onResize(windowId, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      })
    }

    const handleMouseUp = () => {
      document.body.style.cursor = originalCursor
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      onComplete?.() // Call completion callback if provided
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
}

// OS-level resize handle positioning
export const getResizeHandleStyle = (direction: string) => {
  const { EDGE_WIDTH, CORNER_SIZE } = OS_CONSTANTS.RESIZE_HANDLE
  const edgeOffset = EDGE_WIDTH / 2
  const cornerOffset = CORNER_SIZE / 2

  switch (direction) {
    case 'n': return `top: -${edgeOffset}px; left: 8px; right: 8px; height: ${EDGE_WIDTH}px; cursor: ns-resize;`
    case 's': return `bottom: -${edgeOffset}px; left: 8px; right: 8px; height: ${EDGE_WIDTH}px; cursor: ns-resize;`
    case 'e': return `right: -${edgeOffset}px; top: 8px; bottom: 8px; width: ${EDGE_WIDTH}px; cursor: ew-resize;`
    case 'w': return `left: -${edgeOffset}px; top: 8px; bottom: 8px; width: ${EDGE_WIDTH}px; cursor: ew-resize;`
    case 'ne': return `top: -${cornerOffset}px; right: -${cornerOffset}px; width: ${CORNER_SIZE}px; height: ${CORNER_SIZE}px; cursor: nesw-resize;`
    case 'nw': return `top: -${cornerOffset}px; left: -${cornerOffset}px; width: ${CORNER_SIZE}px; height: ${CORNER_SIZE}px; cursor: nwse-resize;`
    case 'se': return `bottom: -${cornerOffset}px; right: -${cornerOffset}px; width: ${CORNER_SIZE}px; height: ${CORNER_SIZE}px; cursor: nwse-resize;`
    case 'sw': return `bottom: -${cornerOffset}px; left: -${cornerOffset}px; width: ${CORNER_SIZE}px; height: ${CORNER_SIZE}px; cursor: nesw-resize;`
    default: return ''
  }
}

// OS-level resize handle directions
export const RESIZE_DIRECTIONS = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const
