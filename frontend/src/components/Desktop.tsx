import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { AnimatePresence } from 'framer-motion'
import { HiPlus } from 'react-icons/hi'
import { TemporalLogo3D } from './icons/TemporalLogo3D'
import { HeaderButton } from '../design-system'

import { useWindowStore, type AppSizeConfig } from '../stores/windowStore'
import { Window } from './Window'
import { getAppComponent, APP_REGISTRY } from '../apps/appRegistry'
import { HEADER_HEIGHT } from '../constants/layout'
import { MenuItem, DropdownItemData, Dropdown } from './menu'
import { useSystemTheme } from '../hooks/useSystemTheme'
import { DEFAULT_OS_THEME, DARK_OS_THEME } from '../os/theme'
import { useTheme } from '../design-system'

const VideoBackground = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -2;
  pointer-events: none;
`

interface VideoOverlayProps {
  $blur?: number;
  $opacity?: number;
  $backgroundColor?: string;
}

const VideoOverlay = styled.div<VideoOverlayProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  backdrop-filter: blur(${props => props.$blur || 0}px);
  background-color: ${props => props.$backgroundColor || 'rgba(0, 0, 0, 0)'};
  opacity: ${props => props.$opacity !== undefined ? props.$opacity : 1};
  transition: all 0.3s ease;
`

const DesktopContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`

const Header = styled.header<{ $backgroundColor: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${HEADER_HEIGHT}px;
  background: ${props => props.theme.windowColors.headerBackground};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${props => props.theme.windowColors.headerBorder};
  display: flex;
  align-items: center;
  padding: 0 ${props => props.theme.spacing[1]};
  z-index: 10000;
  transition: background 200ms ease-out;
  /* Use transform3d to trigger GPU acceleration */
  transform: translate3d(0, 0, 0);
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0px;
`

const TemporalLogoContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

// Remove old TemporalLogoButton - now using design system HeaderButton

const MenuBar = styled.div`
  display: flex;
  gap: 0;
  align-items: center;
`

const WindowArea = styled.div`
  position: absolute;
  top: ${HEADER_HEIGHT}px;
  left: 0;
  right: 0;
  bottom: 0;
`



export const Desktop: React.FC = () => {
  const { windows, openWindow } = useWindowStore()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [showTemporalDropdown, setShowTemporalDropdown] = useState(false)
  const systemIsDark = useSystemTheme()
  const { themeMode, setThemeMode, getAvailableThemes } = useTheme()

  // Track only the maximized window's essential info to avoid recalculation during drags
  const maximizedWindowInfo = useMemo(() => {
    const maxWindow = windows.find(w => w.isMaximized && !w.isMinimized)
    return maxWindow ? { id: maxWindow.id, appType: maxWindow.appType } : null
  }, [
    // Only depend on maximization states, not window positions
    windows.filter(w => w.isMaximized || w.isMinimized).map(w => `${w.id}:${w.isMaximized}:${w.isMinimized}:${w.appType}`).join()
  ])
  
  // Helper function to determine if a color is light or dark - moved outside to avoid recreation
  const isLightColor = useMemo(() => (color: string): boolean => {
    // Extract RGB values from rgba string
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (rgbaMatch) {
      const [, r, g, b] = rgbaMatch.map(Number)
      // Calculate luminance using standard formula
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      return luminance > 0.5
    }
    return false
  }, [])
  
  // Memoize header colors - only recalculate when maximized window or system theme changes
  const { headerBackgroundColor, headerTextColor } = useMemo(() => {
    if (!maximizedWindowInfo) {
      // Default header background when no window is maximized
      return {
        headerBackgroundColor: 'rgba(44, 44, 44, 0.12)',
        headerTextColor: 'white'
      }
    }

    const appConfig = APP_REGISTRY[maximizedWindowInfo.appType]
    // Determine if the maximized window is dark themed
    const isDark = appConfig?.forceTheme ? appConfig.isDark : systemIsDark
    
    // Use the same background as the window, but with some transparency for the header
    const windowTheme = isDark ? DARK_OS_THEME : DEFAULT_OS_THEME
    
    // Extract the background color and adjust opacity for immersive effect
    const backgroundColor = windowTheme.background
    const isHeaderLight = isLightColor(backgroundColor)
    
    return {
      headerBackgroundColor: backgroundColor,
      headerTextColor: isHeaderLight ? '#333' : 'white'
    }
  }, [maximizedWindowInfo, systemIsDark, isLightColor])



  const handleOpenApp = (appType: string, noteId?: string) => {
    console.log('handleOpenApp called with:', appType, noteId)
    const appConfig = APP_REGISTRY[appType]
    if (appConfig) {
      console.log('Opening window for app:', appType)
      const sizeConfig: AppSizeConfig = {
        defaultSize: appConfig.defaultSize,
        minSize: appConfig.minSize,
        maxSize: appConfig.maxSize
      }
      openWindow(appType, noteId ? `Note: ${noteId}` : appConfig.defaultTitle, { noteId }, sizeConfig)
    } else {
      console.log('No app config found for:', appType)
    }
    setOpenMenu(null)
  }

  const handleMenuToggle = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName)
    setShowTemporalDropdown(false)
  }

  const handleMenuHover = (menuName: string) => {
    if (openMenu !== null || showTemporalDropdown) {
      setOpenMenu(menuName)
      setShowTemporalDropdown(false)
    }
  }

  const handleMenuClose = () => {
    setOpenMenu(null)
    setShowTemporalDropdown(false)
  }

  const handleTemporalLogoClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('Temporal Logo clicked!')
    
    // Original temporal logo functionality
    const hour = new Date().getHours()
    const timeState = hour >= 6 && hour < 10 ? 'Morning Focus' :
                     hour >= 10 && hour < 16 ? 'Peak Productivity' :
                     hour >= 16 && hour < 20 ? 'Creative Flow' : 'Night Mode'
    
    console.log(`Current state: ${timeState} (${hour}:00)`)
    // TODO: Maybe trigger a shape transition or show time widget
    
    // Also show/hide the dropdown
    setShowTemporalDropdown(!showTemporalDropdown)
    setOpenMenu(null) // Close any open menus
  }

  const handleTemporalLogoHover = () => {
    setShowTemporalDropdown(true)
    setOpenMenu(null)
  }

  const visibleWindows = windows.filter(w => !w.isMinimized)

  // Dynamic overlay values based on window state
  const hasOpenWindows = visibleWindows.length > 0
  const overlayBlur = hasOpenWindows ? 100 : 10
  const overlayOpacity = hasOpenWindows ? 0.9 : 0.2
  
  // Theme-aware overlay background color
  const overlayBackgroundColor = systemIsDark 
    ? 'rgba(11, 11, 11, 0.3)'   // Darker overlay for dark theme
    : 'rgba(255, 255, 255, 0.25)' // Lighter overlay for light theme

  // Get real saved notes from storage
  const [savedNotes, setSavedNotes] = useState<Array<{ id: string; title: string; lastModified: Date }>>([])
  
  // Refresh saved notes when Apps menu opens
  useEffect(() => {
    if (openMenu === 'apps') {
      const notes = JSON.parse(localStorage.getItem('dark-notes-storage') || '{}')
      const notesList = Object.keys(notes).map(id => ({
        id,
        title: notes[id].title || 'Untitled Note',
        lastModified: new Date(notes[id].lastModified)
      })).sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
      
      setSavedNotes(notesList)
    }
  }, [openMenu])

  // Get available themes for dropdown
  const availableThemes = getAvailableThemes()
  
  // Theme display names mapping
  const themeDisplayNames: Record<string, string> = {
    'system': 'System',
    'light': 'Light',
    'dark': 'Dark',
    'pink-light': 'Pink Light',
    'pink-dark': 'Pink Dark',
    'classic': 'Classic',
    'high-contrast': 'High Contrast'
  }

  // Create temporal logo dropdown items with theme selection
  const temporalDropdownItems: DropdownItemData[] = [
    {
      id: 'clodius-os-version',
      label: 'Clodius OS 0.1.0',
      onClick: () => {
        console.log('Clodius OS version clicked')
        // Could show more info or changelog
      }
    },
    {
      id: 'theme-divider',
      label: '─────────────',
      onClick: () => {} // Divider, no action
    },
    {
      id: 'theme-section',
      label: 'Themes',
      submenu: [
        // Built-in themes
        ...availableThemes.builtin.map(themeName => ({
          id: `theme-${themeName}`,
          label: `${themeDisplayNames[themeName] || themeName}${themeMode === themeName ? ' ✓' : ''}`,
          onClick: () => {
            setThemeMode(themeName)
            setShowTemporalDropdown(false)
            console.log(`Switched to ${themeName} theme`)
          }
        })),
        // Custom themes
        ...availableThemes.custom.map(themeName => ({
          id: `theme-${themeName}`,
          label: `${themeDisplayNames[themeName] || themeName}${themeMode === themeName ? ' ✓' : ''}`,
          onClick: () => {
            setThemeMode(themeName)
            setShowTemporalDropdown(false)
            console.log(`Switched to ${themeName} theme`)
          }
        }))
      ]
    }
  ]

  // Create menu data structure
  const menuItems = [
    {
      id: 'apps',
      label: 'Apps',
      items: [
        {
          id: 'dark-notes',
          label: 'Dark Notes',
          submenu: [
            {
              id: 'new-note',
              label: 'New Note',
              icon: HiPlus,
              onClick: () => handleOpenApp('notes')
            },
            ...savedNotes.map(note => ({
              id: note.id,
              label: note.title,
              onClick: () => handleOpenApp('notes', note.id)
            }))
          ]
        }
      ] as DropdownItemData[]
    },
    {
      id: 'works',
      label: 'Works',
      items: [
        {
          id: 'coming-soon-works',
          label: 'Coming Soon...',
          onClick: () => {}
        }
      ] as DropdownItemData[]
    },
    {
      id: 'chat',
      label: 'Clodius Chat',
      items: [
        {
          id: 'open-chat',
          label: 'Chat with Andrei',
          onClick: () => handleOpenApp('chat')
        },
        {
          id: 'open-multi-chat',
          label: 'Chat with Andrei\'s friends',
          onClick: () => handleOpenApp('groupchat')
        }
      ] as DropdownItemData[]
    }
  ]

  return (
    <DesktopContainer onClick={handleMenuClose}>
      <VideoBackground 
        src="/underwater.mov"
        autoPlay
        loop
        muted
        playsInline
      />
      <VideoOverlay 
        $blur={overlayBlur}
        $opacity={overlayOpacity}
        $backgroundColor={overlayBackgroundColor}
      />
      <Header $backgroundColor={headerBackgroundColor}>
        <LeftSection>
          <TemporalLogoContainer 
            onMouseEnter={() => {
              // Trigger hover behavior when there are open siblings (like MenuItem does)
              if (openMenu !== null) {
                handleTemporalLogoHover()
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <HeaderButton 
              isOpen={showTemporalDropdown}
              onClick={handleTemporalLogoClick}
              asMotion
            >
              <TemporalLogo3D size={28} />
            </HeaderButton>
            
            <AnimatePresence>
              {showTemporalDropdown && (
                <Dropdown 
                  items={temporalDropdownItems}
                  onClose={handleMenuClose}
                />
              )}
            </AnimatePresence>
          </TemporalLogoContainer>
          
          <MenuBar>
            {menuItems.map(menu => (
              <MenuItem
                key={menu.id}
                label={menu.label}
                items={menu.items}
                isOpen={openMenu === menu.id}
                onToggle={() => handleMenuToggle(menu.id)}
                onClose={handleMenuClose}
                onHover={() => handleMenuHover(menu.id)}
                hasOpenSibling={(openMenu !== null && openMenu !== menu.id) || showTemporalDropdown}
                textColor={headerTextColor}
              />
            ))}
          </MenuBar>
        </LeftSection>
      </Header>

      <WindowArea>
        <AnimatePresence>
          {visibleWindows.map(window => {
            // Find the highest zIndex among all visible windows
            const maxZIndex = Math.max(...visibleWindows.map(w => w.zIndex))
            const isActiveWindow = window.zIndex === maxZIndex
            
            return (
              <Window key={window.id} window={window} isActive={isActiveWindow}>
                {getAppComponent(window.appType, window.id)}
              </Window>
            )
          })}
        </AnimatePresence>
      </WindowArea>
    </DesktopContainer>
  )
}
