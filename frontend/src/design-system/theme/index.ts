/**
 * Theme System Exports
 */

export {
  ThemeProvider,
  useTheme,
  useThemeMode,
  usePalette,
  useWindowColors,
  getCurrentSystemTheme,
  registerTheme,
  getAvailableThemes,
  type ThemeMode,
  type Theme,
  type CustomTheme,
  type ThemeOverrides,
} from './ThemeProvider'

export {
  classicTheme,
  highContrastTheme,
  customThemes,
  registerAllThemes,
} from './themes'

export { pinkLightTheme, pinkDarkTheme } from './pinkTheme'
