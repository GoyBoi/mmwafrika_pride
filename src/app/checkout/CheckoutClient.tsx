'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import OrderSummary from '@/components/checkout/OrderSummary'
import CheckoutForm from '@/components/checkout/CheckoutForm'

export default function CheckoutClient() {
  const items = useCartStore((s) => s.items)
  const totalZAR = useCartStore((s) => s.getTotalPriceZAR())
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const [snapshot] = useState(items)
  const snapshotTotalZAR = snapshot.reduce((acc, item) => acc + item.priceZAR * item.quantity, 0)

  if (!mounted) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        <p className="text-body-md text-on-surface-variant mt-6">Loading checkout…</p>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <svg className="w-20 h-20 text-on-surface-variant/30 mb-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
        <h2 className="font-vintage text-h2 italic text-primary mb-4">Your bag is waiting</h2>
        <p className="text-body-md text-on-surface-variant text-center max-w-sm mb-10">Discover pieces crafted with intention.</p>
        <Link href="/collections" className="btn-primary">Browse the Collection</Link>
      </main>
    )
  }

  return (
    <main className="pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      <nav className="mb-12" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary font-label">
          <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
          <li><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg></li>
          <li><Link href="/collections" className="hover:text-accent transition-colors">Collections</Link></li>
          <li><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg></li>
          <li className="text-primary font-medium" aria-current="page">Checkout</li>
        </ol>
      </nav>
      <h1 className="font-vintage text-h1 italic text-primary mb-12">Complete Your Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-20">
        <CheckoutForm />
        <OrderSummary items={snapshot} totalZAR={snapshotTotalZAR} />
      </div>
    </main>
  )
}
