import { create } from 'zustand'

interface BackgroundState {
  chatBackgroundImage: string | null
  setChatBackgroundImage: (imageUrl: string | null) => void
}

export const useBackgroundStore = create<BackgroundState>((set) => ({
  chatBackgroundImage: null,
  setChatBackgroundImage: (imageUrl: string | null) => {
    console.log('🖼️ Setting chat background:', imageUrl ? 'image set' : 'image cleared')
    set({ chatBackgroundImage: imageUrl })
  }
}))
