# 🎨 Design System

A comprehensive design system for the OS providing consistent theming, animations, and component patterns.

## 🚀 Quick Start

```typescript
import { ThemeProvider, motion, lightTheme } from '../design-system'

// Wrap your app with the theme provider
<ThemeProvider defaultMode="system">
  <YourApp />
</ThemeProvider>

// Use tokens in styled components
const Button = styled.button`
  background: ${props => props.theme.palette.interactive.button.primary.background};
  padding: ${props => props.theme.semanticSpacing.component.buttonPadding.md};
  border-radius: ${props => props.theme.semanticRadii.button.base};
  font-size: ${props => props.theme.semanticTypography.button.base.fontSize};
`

// Use motion presets
<motion.div {...motion.presets.fadeIn}>
  Animated content
</motion.div>
```

## 📚 Token System

### 🎬 Motion Tokens
- **Durations**: `fast`, `normal`, `slow` timing values
- **Springs**: `gentle`, `bouncy`, `snappy` configurations  
- **Easing**: `linear`, `ease`, `easeIn`, `easeOut`, etc.
- **Presets**: Ready-to-use animation patterns

```typescript
import { motion } from '../design-system'

// Individual tokens
motion.duration.fast      // 150ms
motion.spring.bouncy     // { stiffness: 500, damping: 30 }
motion.easing.easeOut    // [0, 0, 0.2, 1]

// Complete presets
motion.presets.messageEntrance
motion.presets.windowOpen
motion.presets.fadeIn
```

### 🎨 Color Tokens
- **Base Colors**: Full color palette with consistent naming
- **Theme Colors**: Light/dark mode semantic tokens
- **Window Colors**: OS-specific chrome colors

```typescript
import { colors, lightTheme, darkTheme } from '../design-system'

// Base palette
colors.blue[600]        // #2563eb
colors.gray[100]        // #f5f5f5

// Semantic tokens (auto-switches with theme)
theme.palette.background.primary
theme.palette.text.secondary
theme.palette.interactive.button.primary.background
```

### 📏 Spacing Tokens
- **Base Scale**: 4px base unit (0-96)
- **Semantic Spacing**: UI pattern spacing
- **Spacing Patterns**: Common combinations

```typescript
import { spacing, semanticSpacing } from '../design-system'

// Base scale
spacing[4]              // 1rem (16px)
spacing[8]              // 2rem (32px)

// Semantic patterns
semanticSpacing.component.buttonPadding.md
semanticSpacing.chat.messagePadding
semanticSpacing.window.headerHeight
```

### 🔤 Typography Tokens
- **Font Properties**: families, sizes, weights, line heights
- **Semantic Typography**: UI-specific text styling

```typescript
import { fontSize, semanticTypography } from '../design-system'

// Base typography
fontSize.lg             // 1.125rem (18px)
fontWeight.semibold     // 600

// Semantic patterns
semanticTypography.heading.h2
semanticTypography.body.base
semanticTypography.chat.message
```

### ⭕ Border Radius Tokens
- **Base Radii**: Standard radius scale
- **Semantic Radii**: Component-specific radius
- **Radius Patterns**: Common combinations

```typescript
import { radii, semanticRadii } from '../design-system'

// Base scale
radii.md                // 0.5rem (8px)
radii.lg                // 0.75rem (12px)

// Semantic patterns
semanticRadii.button.base
semanticRadii.chat.bubble.user
semanticRadii.window.base
```

## 🎭 Theme System

### ThemeProvider
Provides runtime theme switching and token access:

```typescript
import { ThemeProvider, useTheme } from '../design-system'

// Provider with theme modes
<ThemeProvider defaultMode="system"> // 'light' | 'dark' | 'system'
  <App />
</ThemeProvider>

// Access theme in components
const { themeMode, setThemeMode, theme } = useTheme()
```

### Theme Hooks
Convenient hooks for specific theme data:

```typescript
import { useThemeMode, usePalette, useWindowColors } from '../design-system'

const mode = useThemeMode()           // 'light' | 'dark'
const palette = usePalette()          // Current theme colors
const windowColors = useWindowColors() // OS window colors
```

## 🏗️ Architecture

```
design-system/
├── tokens/               # Design tokens
│   ├── motion.ts        # Animation system
│   ├── colors.ts        # Color palette & themes  
│   ├── spacing.ts       # Spacing scale & patterns
│   ├── typography.ts    # Font system
│   ├── radii.ts         # Border radius system
│   └── index.ts         # Token exports
├── theme/               # Theme system
│   ├── ThemeProvider.tsx # Theme provider & hooks
│   └── index.ts         # Theme exports
├── components/          # Component primitives (future)
└── index.ts            # Main export
```

## ✨ Benefits

- **🎯 Consistency**: Single source of truth for all design decisions
- **🔧 Type Safety**: Full TypeScript support with IntelliSense
- **🌙 Theme Support**: Built-in light/dark mode with system detection
- **⚡ Performance**: Centralized tokens reduce CSS duplication
- **🚀 Developer Experience**: Intuitive APIs and comprehensive token system
- **📱 Responsive**: Semantic tokens adapt to different contexts

## 🎨 Usage Examples

### Styled Components with Tokens
```typescript
import styled from 'styled-components'

const ChatBubble = styled.div`
  background: ${props => props.theme.palette.chat.bubble.assistant.background};
  color: ${props => props.theme.palette.chat.bubble.assistant.text};
  padding: ${props => props.theme.semanticSpacing.chat.messagePadding};
  border-radius: ${props => props.theme.semanticRadii.chat.bubble.assistant};
  font-size: ${props => props.theme.semanticTypography.chat.message.fontSize};
`
```

### Motion with Tokens
```typescript
import { motion } from 'framer-motion'
import { motion as motionTokens } from '../design-system'

<motion.div {...motionTokens.presets.messageEntrance}>
  <ChatMessage />
</motion.div>
```

### Theme Switching
```typescript
import { useTheme } from '../design-system'

const ThemeSwitcher = () => {
  const { themeMode, setThemeMode } = useTheme()
  
  return (
    <button onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}>
      Switch to {themeMode === 'dark' ? 'light' : 'dark'} mode
    </button>
  )
}
```
