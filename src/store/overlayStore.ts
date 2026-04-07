'use client'

import { create } from 'zustand'

type OverlayType = 'mobileMenu' | 'cartDrawer'

interface OverlayStore {
  activeOverlay: OverlayType | null
  scrollY: number
  openOverlay: (overlay: OverlayType) => void
  closeOverlay: () => void
  isAnyOpen: () => boolean
}

export const useOverlayStore = create<OverlayStore>((set, get) => ({
  activeOverlay: null,
  scrollY: 0,

  openOverlay: (overlay) => {
    if (get().activeOverlay === overlay) return
    const currentScrollY = window.scrollY
    set({ activeOverlay: overlay, scrollY: currentScrollY })
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = 'var(--scrollbar-width, 0px)'
  },

  closeOverlay: () => {
    const { scrollY } = get()
    set({ activeOverlay: null })
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
    window.scrollTo({ top: scrollY, behavior: 'instant' })
  },

  isAnyOpen: () => get().activeOverlay !== null,
}))
