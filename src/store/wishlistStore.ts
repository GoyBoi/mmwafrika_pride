'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type WishlistState = {
  items: string[]
  toggleItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (productId) => {
        const items = get().items
        if (items.includes(productId)) {
          set({ items: items.filter((id) => id !== productId) })
        } else {
          set({ items: [...items, productId] })
        }
      },

      isInWishlist: (productId) => {
        return get().items.includes(productId)
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'mmwafrika-wishlist',
    }
  )
)
