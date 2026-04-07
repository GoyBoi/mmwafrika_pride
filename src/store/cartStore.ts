'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const CART_SCHEMA_VERSION = 1

export type CartItem = {
  productId: string; slug: string; name: string;
  priceZAR: number; priceUSD: number; currency: 'ZAR' | 'USD';
  size?: string; quantity: number; image: string;
}

type CartState = {
  items: CartItem[]
  currency: 'ZAR' | 'USD'
  isHydrated: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size?: string) => void
  updateQuantity: (productId: string, size: string | undefined, quantity: number) => void
  clearCart: () => void
  setCurrency: (c: 'ZAR' | 'USD') => void
  getTotalItems: () => number
  getTotalPriceZAR: () => number
}

export const useCartStore = create<CartState>()(persist(
  (set, get) => ({
    items: [],
    currency: 'ZAR',
    isHydrated: false,

    addItem: (item) => {
      const items = get().items
      const existing = items.find((i) => i.productId === item.productId && i.size === item.size)
      if (existing) {
        set({ items: items.map((i) => i.productId === item.productId && i.size === item.size ? { ...i, quantity: i.quantity + item.quantity } : i) })
      } else {
        set({ items: [...items, item] })
      }
    },

    removeItem: (productId, size) => {
      set({ items: get().items.filter((i) => !(i.productId === productId && i.size === size)) })
    },

    updateQuantity: (productId, size, quantity) => {
      if (quantity <= 0) { get().removeItem(productId, size); return }
      set({ items: get().items.map((i) => i.productId === productId && i.size === size ? { ...i, quantity } : i) })
    },

    clearCart: () => set({ items: [] }),

    setCurrency: (c) => set({ currency: c }),

    getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

    getTotalPriceZAR: () => get().items.reduce((acc, item) => acc + item.priceZAR * item.quantity, 0),
  }),
  {
    name: 'mmwafrika-cart',

    version: CART_SCHEMA_VERSION,

    partialize: (state) => ({ items: state.items, currency: state.currency }),

    migrate: (persistedState, version) => {
      if (!persistedState) return { items: [], currency: 'ZAR' }

      if (version !== CART_SCHEMA_VERSION) {
        console.log('[CART RESET] Schema version mismatch (%d → %d) → clearing cart', version, CART_SCHEMA_VERSION)
        return { items: [], currency: 'ZAR' }
      }

      return persistedState
    },

    onRehydrateStorage: () => (state) => {
      state.isHydrated = true
    },
  }
))
