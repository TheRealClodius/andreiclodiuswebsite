# 🎨 Extensible Theme System Usage Guide

## 🚀 **System is Ready for Custom Themes!**

Your theme system now supports unlimited custom themes beyond just light/dark modes. Here's how to create and use custom themes like "Classic".

## 📋 **What's Built & Ready:**

### ✅ **Flexible Theme Architecture**
- **Theme Registry** - Register unlimited custom themes
- **Deep Override System** - Override any token at any nesting level
- **Type Safety** - Full IntelliSense while allowing custom values
- **Runtime Switching** - Change themes instantly
- **Base Theme Extension** - Custom themes extend light or dark base

### ✅ **Example Custom Themes Included**
- **Classic Theme** - Warm browns, rounded corners
- **High Contrast Theme** - Accessibility-focused black/yellow

---

## 🎯 **How to Use Custom Themes**

### **1. Register a Custom Theme**

```typescript
import { registerTheme, ThemeProvider } from '../design-system'

// Register the classic theme
registerTheme({
  name: 'classic',
  displayName: 'Classic',
  baseTheme: 'light', // Extends light theme
  overrides: {
    // Override any colors
    palette: {
      background: {
        primary: '#fefcf7',    // Warm white
      },
      text: {
        primary: '#3a2f2a',    // Warm brown
      },
      interactive: {
        button: {
          primary: {
            background: '#8b4513', // Saddle brown
            text: '#fefcf7',
          },
        },
      },
    },
    
    // Override border radius for rounder look
    semanticRadii: {
      button: {
        base: '12px',          // More rounded buttons
      },
      chat: {
        bubble: {
          base: '24px',        // Rounder chat bubbles
        },
      },
    },
  },
})
```

### **2. Use Theme Provider**

```typescript
// App.tsx
import { ThemeProvider } from '../design-system'

export const App = () => {
  return (
    <ThemeProvider defaultMode="classic"> {/* or 'light', 'dark', 'system' */}
      <YourOSComponents />
    </ThemeProvider>
  )
}
```

### **3. Switch Themes at Runtime**

```typescript
import { useTheme, getAvailableThemes } from '../design-system'

const ThemeSwitcher = () => {
  const { themeMode, setThemeMode } = useTheme()
  const availableThemes = getAvailableThemes()
  
  return (
    <select 
      value={themeMode} 
      onChange={(e) => setThemeMode(e.target.value)}
    >
      {/* Built-in themes */}
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
      
      {/* Custom themes */}
      {availableThemes.custom.map(theme => (
        <option key={theme} value={theme}>
          {theme}
        </option>
      ))}
    </select>
  )
}
```

### **4. Use Theme Tokens in Components**

```typescript
import styled from 'styled-components'

// Styled components automatically get the active theme
const CustomButton = styled.button`
  background: ${props => props.theme.palette.interactive.button.primary.background};
  color: ${props => props.theme.palette.interactive.button.primary.text};
  border-radius: ${props => props.theme.semanticRadii.button.base};
  padding: ${props => props.theme.semanticSpacing.component.buttonPadding.md};
  
  /* This will automatically use Classic theme colors when active! */
`

// Or use hooks
const ChatBubble = () => {
  const { theme } = useTheme()
  
  return (
    <div style={{
      background: theme.palette.chat.bubble.assistant.background,
      borderRadius: theme.semanticRadii.chat.bubble.assistant,
      // Automatically uses Classic theme styling when active!
    }}>
      Message content
    </div>
  )
}
```

---

## 🎨 **Creating Your "Classic" Theme**

The included Classic theme demonstrates the full power:

### **Color Overrides:**
```typescript
palette: {
  background: {
    primary: '#fefcf7',      // Warm white backgrounds
  },
  text: {
    primary: '#3a2f2a',      // Warm brown text
  },
  interactive: {
    button: {
      primary: {
        background: '#8b4513',  // Saddle brown buttons
        text: '#fefcf7',       // Warm white text
      },
    },
  },
  // Overrides chat colors, borders, everything!
}
```

### **Border Radius Overrides:**
```typescript
semanticRadii: {
  button: {
    base: '12px',            // Rounder buttons
  },
  chat: {
    bubble: {
      base: '24px',          // Rounder chat bubbles
      user: '24px 24px 8px 24px',
    },
  },
  window: {
    base: '16px',            // Rounder windows
  },
}
```

---

## ⚡ **System Benefits**

### **🔧 Complete Flexibility**
- **Override anything** - Colors, spacing, typography, radii, motion
- **Partial overrides** - Change only what you want, inherit the rest
- **Deep nesting** - Override `palette.interactive.button.primary.background`
- **Type safety** - Full IntelliSense for all token paths

### **🚀 Runtime Power**
- **Instant switching** - Change themes without page reload
- **Theme persistence** - Store user preference
- **System detection** - Auto-detect OS light/dark preference
- **Fallback handling** - Graceful degradation for unknown themes

### **🎯 Developer Experience**
```typescript
// All of these work automatically:
setThemeMode('classic')       // Switch to Classic theme
setThemeMode('light')         // Switch to light
setThemeMode('system')        // Follow OS preference
setThemeMode('high-contrast') // Accessibility theme

// Theme tokens update automatically everywhere!
```

---

## 🏁 **Ready for Production**

Your theme system now supports:
- ✅ **Unlimited custom themes** (Classic, Neon, Corporate, etc.)
- ✅ **Any token overrides** (colors, radii, spacing, typography)
- ✅ **Runtime theme switching** with hooks
- ✅ **Type-safe development** with full IntelliSense
- ✅ **Graceful fallbacks** for unknown themes
- ✅ **Production-ready performance** with efficient re-renders

**You can now build any visual theme you want!** 🎨
