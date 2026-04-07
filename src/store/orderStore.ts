'use client'

import { create } from 'zustand'
import type { Order } from '@/types/order'
import type { CheckoutSession } from '@/store/cartStore'

type OrderState = {
  lastOrder: Order | null
  createOrder: (session: CheckoutSession) => void
  clearOrder: () => void
}

export const useOrderStore = create<OrderState>((set) => ({
  lastOrder: null,

  createOrder: (session) => {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: session.items,
      currency: session.currency,
      subtotal: session.subtotal,
      status: 'confirmed',
      createdAt: Date.now(),
    }
    set({ lastOrder: order })
  },

  clearOrder: () => set({ lastOrder: null }),
}))
