'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { useOverlayStore } from '@/store/overlayStore'
import { SHIPPING_REGIONS, SHIPPING_COSTS } from '@/lib/constants'
import { formatPrice, formatPriceUSD } from '@/lib/utils/formatPrice'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useOverlayBehavior } from '@/hooks/useOverlayBehavior'

export default function CartDrawer() {
  const items = useCartStore((state) => state.items)
  const isHydrated = useCartStore((state) => state.isHydrated)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const currency = useCartStore((state) => state.currency)
  const activeOverlay = useOverlayStore((s) => s.activeOverlay)
  const closeOverlay = useOverlayStore((s) => s.closeOverlay)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [shippingRegion, setShippingRegion] = useState('za')
  const panelRef = useRef<HTMLElement>(null)

  const isOpen = activeOverlay === 'cartDrawer'

  const subtotal = items.reduce((sum, item) => sum + (currency === 'ZAR' ? item.priceZAR : item.priceUSD) * item.quantity, 0)
  const shipping = items.length > 0 ? SHIPPING_COSTS[shippingRegion as keyof typeof SHIPPING_COSTS] ?? 0 : 0
  const total = subtotal + shipping

  useEffect(() => { setMounted(true) }, [])

  useOverlayBehavior(isOpen, closeOverlay, panelRef)

  function handleClose() {
    closeOverlay()
  }

  function handleCheckout() {
    closeOverlay()
    router.push('/checkout')
  }

  if (!mounted || !isHydrated) return null

  return createPortal(
    <>
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-overlay-backdrop transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        className={`cart-drawer fixed inset-y-0 right-0 z-overlay w-full max-w-[450px] bg-surface-container-lowest shadow-drawer flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="px-8 pt-12 pb-6 flex justify-between items-end flex-shrink-0">
          <div>
            <span className="text-label text-on-surface-variant mb-1 block">Your Selection</span>
            <h2 className="font-vintage text-h2 font-light">The Cart</h2>
          </div>
          <button onClick={handleClose} className="p-2 -mr-2 hover:opacity-50 transition-opacity" aria-label="Close cart">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-8 py-4 space-y-10">
          <div className="space-y-8">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-6 group">
                <div className="w-24 h-32 bg-surface-container rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex flex-col justify-between py-1 flex-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-sans text-body-md leading-tight">{item.name}</h3>
                      <button onClick={() => removeItem(item.productId, item.size)} className="text-on-surface-variant hover:text-error transition-colors" aria-label={`Remove ${item.name} from cart`}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      </button>
                    </div>
                    {item.size && (<p className="text-label text-on-surface-variant mt-1">Size: {item.size}</p>)}
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4 bg-surface-container-low px-3 py-1 rounded-full">
                      <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="text-sm font-bold hover:text-secondary" aria-label="Decrease quantity">−</button>
                      <span className="text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="text-sm font-bold hover:text-secondary" aria-label="Increase quantity">+</button>
                    </div>
                    <span className="text-price">{currency === 'ZAR' ? formatPrice(item.priceZAR) : formatPriceUSD(item.priceUSD)}</span>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-20">
                <svg className="w-16 h-16 mx-auto text-on-surface-variant/30 mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                <p className="text-h3 font-medium text-primary">Your bag is waiting</p>
                <p className="text-body-md text-on-surface-variant mt-2">Discover pieces crafted with intention.</p>
                <Link href="/collections" onClick={handleClose} className="inline-block mt-6 text-accent hover:text-primary transition-colors text-body-md font-medium">Browse the Collection →</Link>
              </div>
            )}
          </div>
          {items.length > 0 && (
            <div className="pt-8 border-stitch border-t border-0">
              <label htmlFor="shipping" className="text-label text-on-surface-variant block mb-4">Calculate Shipping</label>
              <div className="relative group">
                <select id="shipping" value={shippingRegion} onChange={(e) => setShippingRegion(e.target.value)} className="w-full bg-transparent border-0 border-b border-outline-variant py-3 pr-8 focus:ring-0 focus:border-primary font-body text-sm appearance-none cursor-pointer">
                  {SHIPPING_REGIONS.map((region) => (<option key={region.id} value={region.id}>{region.label}</option>))}
                </select>
                <svg className="absolute right-0 top-3 pointer-events-none text-on-surface-variant w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="6 9 12 15 18 9" /></svg>
              </div>
              <div className="mt-4 flex justify-between items-center text-label text-on-surface-variant"><span>Estimated Transit</span><span>{SHIPPING_REGIONS.find((r) => r.id === shippingRegion)?.estimate}</span></div>
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="p-8 bg-surface-container border-t border-dashed border-border transition-colors duration-300 flex-shrink-0">
            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-body-sm"><span className="text-on-surface-variant">Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-body-sm"><span className="text-on-surface-variant">Shipping</span><span className="font-semibold text-secondary">{formatPrice(shipping)}</span></div>
              <div className="flex justify-between items-baseline pt-4 border-t border-outline-variant/30"><span className="font-vintage text-h3">Total</span><span className="text-price font-bold">{formatPrice(total)}</span></div>
            </div>
            <button onClick={handleCheckout} className="w-full h-14 bg-secondary hover:opacity-90 active:scale-[0.98] transition-all duration-300 rounded-md flex items-center justify-center gap-3 text-label uppercase text-sm"><span>Secure Checkout</span><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></button>
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2"><svg className="w-4 h-4 text-secondary" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg><p className="text-label text-on-surface-variant">Secure Checkout via PayFast (SA) &amp; PayPal (Intl).</p></div>
            </div>
          </div>
        )}
      </aside>
    </>,
    document.body
  )
}
