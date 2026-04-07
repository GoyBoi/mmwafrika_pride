'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Currency } from '@/lib/utils/formatPrice'

const CART_SCHEMA_VERSION = 3

export type { Currency }

export type CartItem = {
  productId: string; slug: string; name: string;
  price: { ZAR: number; USD: number; EUR: number };
  currency: Currency;
  size?: string; quantity: number; image: string;
}

export type CheckoutItem = {
  productId: string
  name: string
  image: string
  quantity: number
  unitPrice: number    // LOCKED price at checkout
  totalPrice: number   // quantity * unitPrice
}

export type CheckoutSession = {
  currency: Currency
  items: CheckoutItem[]
  subtotal: number
  createdAt: number
}

type CartState = {
  items: CartItem[]
  currency: Currency
  isHydrated: boolean
  checkoutSession: CheckoutSession | null
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size?: string) => void
  updateQuantity: (productId: string, size: string | undefined, quantity: number) => void
  clearCart: () => void
  setCurrency: (c: Currency) => void
  beginCheckout: () => void
  clearCheckout: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(persist(
  (set, get) => ({
    items: [],
    currency: 'ZAR',
    isHydrated: false,
    checkoutSession: null,

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

    beginCheckout: () => {
      const { items, currency } = get()
      if (items.length === 0) return

      const checkoutItems: CheckoutItem[] = items.map((item) => {
        const unitPrice = item.price?.[currency] ?? item.price.ZAR
        return {
          productId: item.productId,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          unitPrice,
          totalPrice: unitPrice * item.quantity,
        }
      })

      set({
        checkoutSession: {
          currency,
          items: checkoutItems,
          subtotal: checkoutItems.reduce((sum, item) => sum + item.totalPrice, 0),
          createdAt: Date.now(),
        },
      })
    },

    clearCheckout: () => set({ checkoutSession: null }),

    getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

    getTotalPrice: () => {
      const { items, currency } = get()
      return items.reduce((acc, item) => acc + (item.price?.[currency] ?? item.price.ZAR) * item.quantity, 0)
    },
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
