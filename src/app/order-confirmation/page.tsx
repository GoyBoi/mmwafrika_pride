'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useOrderStore } from '@/store/orderStore'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function OrderConfirmationPage() {
  const order = useOrderStore((s) => s.lastOrder)
  const router = useRouter()

  // Guard: redirect if no order exists
  useEffect(() => {
    if (!order) {
      router.push('/collections')
    }
  }, [order, router])

  if (!order) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        <p className="text-body-md text-on-surface-variant mt-6">Loading order…</p>
      </main>
    )
  }

  return (
    <main className="pt-32 pb-24 px-6 md:px-8 max-w-2xl mx-auto">
      <nav className="mb-12" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary font-label">
          <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
          <li><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg></li>
          <li className="text-primary font-medium" aria-current="page">Order Confirmed</li>
        </ol>
      </nav>

      <div className="text-center mb-12">
        <svg className="w-16 h-16 mx-auto text-success mb-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
        <h1 className="font-vintage text-h1 italic text-primary mb-4">Order Confirmed</h1>
        <p className="text-body-md text-on-surface-variant max-w-md mx-auto">Thank you. Your piece is now being prepared with care.</p>
      </div>

      <div className="border-stitch rounded-xl p-8 bg-surface-container-lowest">
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="font-vintage text-h2 italic text-primary">Your Order</h2>
          <span className="text-label text-on-surface-variant/60">{order.id}</span>
        </div>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between items-center">
              <div>
                <p className="font-sans text-body-md text-primary">{item.name}</p>
                <p className="text-label text-on-surface-variant">Qty: {item.quantity}</p>
              </div>
              <span className="text-price font-semibold">{formatPrice(item.totalPrice, order.currency)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-border mt-8 pt-6">
          <div className="flex justify-between items-baseline">
            <span className="font-vintage text-h3 text-primary">Total</span>
            <span className="text-price font-bold text-accent">{formatPrice(order.subtotal, order.currency)}</span>
          </div>
          <p className="text-xs text-on-surface-variant/40 mt-2 text-right">Paid in {order.currency}</p>
        </div>
      </div>

      <div className="mt-12 text-center space-y-6">
        <p className="text-body-sm text-on-surface-variant/60">We'll be in touch with shipping details once your order is ready.</p>
        <Link href="/collections" className="btn-primary inline-block">Continue Shopping</Link>
      </div>
    </main>
  )
}
