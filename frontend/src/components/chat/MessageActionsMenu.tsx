import React from 'react'
import { Dropdown } from '../menu/Dropdown'
import { DropdownItemData } from '../menu/DropdownItem'

export interface MessageAction {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  onClick: () => void
}

interface MessageActionsMenuProps {
  actions: MessageAction[]
  onClose: () => void
}

export const MessageActionsMenu: React.FC<MessageActionsMenuProps> = ({ 
  actions, 
  onClose 
}) => {
  const menuItems: DropdownItemData[] = actions.map(action => ({
    id: action.id,
    label: action.label,
    icon: action.icon,
    onClick: action.onClick
  }))

  return (
    <Dropdown 
      items={menuItems} 
      onClose={onClose} 
      enableSmartPositioning={true}
    />
  )
}
