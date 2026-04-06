'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  productId: string; slug: string; name: string;
  priceZAR: number; priceUSD: number; currency: 'ZAR' | 'USD';
  size?: string; quantity: number; image: string;
}

type CartState = {
  items: CartItem[]; isCartOpen: boolean; currency: 'ZAR' | 'USD'
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size?: string) => void
  updateQuantity: (productId: string, size: string | undefined, quantity: number) => void
  clearCart: () => void; setIsCartOpen: (open: boolean) => void; toggleCart: () => void
  setCurrency: (c: 'ZAR' | 'USD') => void
  getTotalItems: () => number; getTotalPriceZAR: () => number; getTotalPriceUSD: () => number
  getActiveCurrency: () => 'ZAR' | 'USD'
}

export const useCartStore = create<CartState>()(persist(
  (set, get) => ({
    items: [], isCartOpen: false, currency: 'ZAR',
    addItem: (item) => {
      const items = get().items
      const existing = items.find((i) => i.productId === item.productId && i.size === item.size)
      if (existing) { set({ items: items.map((i) => i.productId === item.productId && i.size === item.size ? { ...i, quantity: i.quantity + item.quantity } : i) }) }
      else { set({ items: [...items, item] }) }
    },
    removeItem: (productId, size) => { set({ items: get().items.filter((i) => !(i.productId === productId && i.size === size)) }) },
    updateQuantity: (productId, size, quantity) => {
      if (quantity <= 0) { get().removeItem(productId, size); return }
      set({ items: get().items.map((i) => i.productId === productId && i.size === size ? { ...i, quantity } : i) })
    },
    clearCart: () => set({ items: [] }),
    setIsCartOpen: (open) => set({ isCartOpen: open }),
    toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
    getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    getTotalPriceZAR: () => get().items.reduce((acc, item) => acc + item.priceZAR * item.quantity, 0),
    getTotalPriceUSD: () => get().items.reduce((acc, item) => acc + item.priceUSD * item.quantity, 0),
    setCurrency: (c) => set({ currency: c }),
    getActiveCurrency: () => get().currency,
  }),
  { name: 'mmwafrika-cart', partialize: (state) => ({ items: state.items }) }
))
