import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { AnimatePresence } from 'framer-motion'
import { HiPlus } from 'react-icons/hi'
import { CustomLogo } from './icons/CustomLogo'

import { useWindowStore } from '../stores/windowStore'
import { Window } from './Window'
import { getAppComponent, APP_REGISTRY } from '../apps/appRegistry'
import { HEADER_HEIGHT } from '../constants/layout'
import { MenuItem, DropdownItemData } from './menu'

const DesktopContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  position: relative;
  overflow: hidden;
`

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${HEADER_HEIGHT}px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 10000;
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const LogoIcon = styled.div`
  color: white;
  display: flex;
  align-items: center;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
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

  const handleOpenApp = (appType: string, noteId?: string) => {
    console.log('handleOpenApp called with:', appType, noteId)
    const appConfig = APP_REGISTRY[appType]
    if (appConfig) {
      console.log('Opening window for app:', appType)
      openWindow(appType, noteId ? `Note: ${noteId}` : appConfig.defaultTitle, { noteId })
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
      label: 'Andrei Chat',
      items: [
        {
          id: 'coming-soon-chat',
          label: 'Coming Soon...',
          onClick: () => {}
        }
      ] as DropdownItemData[]
    }
  ]

  return (
    <DesktopContainer onClick={handleMenuClose}>
      <Header>
        <LeftSection>
          <LogoIcon>
            <CustomLogo size={20} />
          </LogoIcon>
          
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
              />
            ))}
          </MenuBar>
        </LeftSection>
      </Header>

      <WindowArea>
        <AnimatePresence>
          {visibleWindows.map(window => {
            const appConfig = APP_REGISTRY[window.appType]
            return (
              <Window key={window.id} window={window} isDark={appConfig?.isDark}>
                {getAppComponent(window.appType, window.id)}
              </Window>
            )
          })}
        </AnimatePresence>
      </WindowArea>
    </DesktopContainer>
  )
}
