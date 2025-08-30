// Utility to generate consistent, theme-aware colors for user names

interface UserColorPalette {
  light: string[]
  dark: string[]
}

// Predefined color palette that works well in both themes
const USER_COLOR_PALETTE: UserColorPalette = {
  // Light theme - darker, more saturated colors for good contrast
  light: [
    '#dc2626', // Red
    '#ea580c', // Orange  
    '#d97706', // Amber
    '#65a30d', // Green
    '#059669', // Emerald
    '#0891b2', // Cyan
    '#2563eb', // Blue
    '#7c3aed', // Violet
    '#c026d3', // Magenta
    '#e11d48', // Rose
    '#7c2d12', // Brown
    '#374151', // Gray
  ],
  // Dark theme - lighter, more vibrant colors for good contrast
  dark: [
    '#f87171', // Red
    '#fb923c', // Orange
    '#fbbf24', // Amber  
    '#a3e635', // Green
    '#34d399', // Emerald
    '#22d3ee', // Cyan
    '#60a5fa', // Blue
    '#a78bfa', // Violet
    '#f472b6', // Magenta
    '#fb7185', // Rose
    '#d2b48c', // Brown
    '#9ca3af', // Gray
  ]
}

// Simple hash function to convert string to number
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// Get consistent color for a user based on their name/ID
export function getUserColor(userId: string): string {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const colors = isDark ? USER_COLOR_PALETTE.dark : USER_COLOR_PALETTE.light
  
  const hash = hashString(userId)
  const colorIndex = hash % colors.length
  
  return colors[colorIndex]
}

// Get user color with custom opacity
export function getUserColorWithOpacity(userId: string, opacity: number = 1): string {
  const baseColor = getUserColor(userId)
  
  // Convert hex to rgba
  const hex = baseColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)  
  const b = parseInt(hex.substr(4, 2), 16)
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
