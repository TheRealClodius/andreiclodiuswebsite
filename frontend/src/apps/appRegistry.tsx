import React from 'react'
import { IoDocumentText, IoChatbubbleEllipses, IoPeople } from 'react-icons/io5'
import { NotesApp } from './NotesApp'
import { AndreiChatApp } from './AndreiChatAppModular'
import { ChatWithFriendsApp } from './ChatWithFriendsApp'

export interface AppConfig {
  id: string
  name: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  component: React.ComponentType<{ windowId: string }>
  defaultTitle: string
  defaultSize?: { width: number; height: number }
  minSize?: { width: number; height: number }
  maxSize?: { width: number; height: number }
  isDark?: boolean
  forceTheme?: boolean // If true, always use isDark value; if false, adapt to system theme
}

export const APP_REGISTRY: Record<string, AppConfig> = {
  notes: {
    id: 'notes',
    name: 'Dark Notes',
    icon: IoDocumentText,
    component: NotesApp,
    defaultTitle: 'Dark Notes',
    defaultSize: { width: 500, height: 600 },
    isDark: true,
    forceTheme: true // Always dark for Notes
  },
  chat: {
    id: 'chat',
    name: 'Andrei Chat',
    icon: IoChatbubbleEllipses,
    component: AndreiChatApp,
    defaultTitle: 'Chat with Andrei',
    defaultSize: { width: 600, height: 700 },
    isDark: false, // Default value, will be overridden by system theme
    forceTheme: false // Adapt to system theme
  },
  groupchat: {
    id: 'groupchat',
    name: 'Chat with Friends',
    icon: IoPeople,
    component: ChatWithFriendsApp,
    defaultTitle: 'Chat with Friends',
    defaultSize: { width: 650, height: 750 },
    minSize: { width: 350, height: 500 },
    maxSize: { width: 850, height: 1000 },
    isDark: false, // Default value, will be overridden by system theme
    forceTheme: false // Adapt to system theme
  }
}

export const getAppComponent = (appType: string, windowId: string) => {
  const appConfig = APP_REGISTRY[appType]
  if (!appConfig) {
    return <div>Unknown app type: {appType}</div>
  }
  
  const AppComponent = appConfig.component
  return <AppComponent windowId={windowId} />
}
