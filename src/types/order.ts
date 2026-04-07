import type { Currency } from '@/lib/utils/formatPrice'

export type OrderItem = {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export type Order = {
  id: string
  items: OrderItem[]
  currency: Currency
  subtotal: number
  status: 'confirmed'
  createdAt: number
}
