import { useEffect } from 'react'
import { Desktop } from './components/Desktop'
import { ThemeProvider, registerTheme } from './design-system'
import { pinkLightTheme, pinkDarkTheme } from './design-system/theme/pinkTheme'

function App() {
  // Register our pink themes on app start
  useEffect(() => {
    registerTheme(pinkLightTheme)
    registerTheme(pinkDarkTheme)
  }, [])

  return (
    <ThemeProvider defaultMode="system">
      <Desktop />
    </ThemeProvider>
  )
}

export default App
