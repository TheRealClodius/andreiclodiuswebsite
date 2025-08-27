import React from 'react'
import { IoDocumentText } from 'react-icons/io5'
import { NotesApp } from './NotesApp'

export interface AppConfig {
  id: string
  name: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  component: React.ComponentType<{ windowId: string }>
  defaultTitle: string
  defaultSize?: { width: number; height: number }
  isDark?: boolean
}

export const APP_REGISTRY: Record<string, AppConfig> = {
  notes: {
    id: 'notes',
    name: 'Dark Notes',
    icon: IoDocumentText,
    component: NotesApp,
    defaultTitle: 'Dark Notes',
    defaultSize: { width: 500, height: 600 },
    isDark: true
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
