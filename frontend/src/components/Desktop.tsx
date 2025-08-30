import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { AnimatePresence } from 'framer-motion'
import { HiPlus } from 'react-icons/hi'
import { TemporalLogo3D } from './icons/TemporalLogo3D'

import { useWindowStore, type AppSizeConfig } from '../stores/windowStore'
import { Window } from './Window'
import { getAppComponent, APP_REGISTRY } from '../apps/appRegistry'
import { HEADER_HEIGHT } from '../constants/layout'
import { MenuItem, DropdownItemData } from './menu'
import { useSystemTheme } from '../hooks/useSystemTheme'
import { DEFAULT_OS_THEME, DARK_OS_THEME } from '../os/theme'

const DesktopContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background:rgb(142, 142, 142);
  position: relative;
  overflow: hidden;
`

const Header = styled.header<{ $backgroundColor: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${HEADER_HEIGHT}px;
  background: ${props => props.$backgroundColor};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0);
  display: flex;
  align-items: center;
  padding: 0 16px;
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

const TemporalLogoButton = styled.button<{ $textColor: string }>`
  background: transparent;
  border: none;
  color: ${props => props.$textColor};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0px 12px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  /* Use transform3d to trigger GPU acceleration */
  transform: translate3d(0, 0, 0);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

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
  const systemIsDark = useSystemTheme()

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
  }

  const handleMenuHover = (menuName: string) => {
    if (openMenu !== null) {
      setOpenMenu(menuName)
    }
  }

  const handleMenuClose = () => {
    setOpenMenu(null)
  }

  const handleTemporalLogoClick = () => {
    const hour = new Date().getHours()
    const timeState = hour >= 6 && hour < 10 ? 'Morning Focus' :
                     hour >= 10 && hour < 16 ? 'Peak Productivity' :
                     hour >= 16 && hour < 20 ? 'Creative Flow' : 'Night Mode'
    
    console.log(`Temporal Logo clicked! Current state: ${timeState} (${hour}:00)`)
    // TODO: Maybe trigger a shape transition or show time widget
  }

  const visibleWindows = windows.filter(w => !w.isMinimized)

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
      <Header $backgroundColor={headerBackgroundColor}>
        <LeftSection>
          <TemporalLogoButton 
            $textColor={headerTextColor}
            onClick={handleTemporalLogoClick}
          >
                      <TemporalLogo3D
            size={28}
          />
          </TemporalLogoButton>
          
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
                hasOpenSibling={openMenu !== null && openMenu !== menu.id}
                textColor={headerTextColor}
              />
            ))}
          </MenuBar>
        </LeftSection>
      </Header>

      <WindowArea>
        <AnimatePresence>
          {visibleWindows.map(window => {
            const appConfig = APP_REGISTRY[window.appType]
            // Determine theme: force app theme or adapt to system theme
            const isDark = appConfig?.forceTheme ? appConfig.isDark : systemIsDark
            return (
              <Window key={window.id} window={window} isDark={isDark}>
                {getAppComponent(window.appType, window.id)}
              </Window>
            )
          })}
        </AnimatePresence>
      </WindowArea>
    </DesktopContainer>
  )
}
