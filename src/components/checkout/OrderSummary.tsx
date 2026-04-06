'use client'

import Image from 'next/image'
import type { CartItem } from '@/store/cartStore'
import { SHIPPING_COSTS } from '@/lib/constants'
import { formatPrice } from '@/lib/utils/formatPrice'

interface OrderSummaryProps { items: CartItem[]; totalZAR: number; shippingRegion?: 'za' | 'int' }

export default function OrderSummary({ items, totalZAR, shippingRegion = 'za' }: OrderSummaryProps) {
  const shipping = SHIPPING_COSTS[shippingRegion]
  const grandTotal = totalZAR + shipping

  return (
    <div className="border-stitch rounded-xl p-8 h-fit md:sticky md:top-24 bg-surface-container-lowest transition-colors duration-300">
      <h2 className="font-vintage text-h2 italic text-primary mb-8">Your Order</h2>
      <div className="space-y-6">
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}`} className="flex gap-4">
            <div className="w-16 h-20 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col justify-between flex-1">
              <div>
                <p className="font-sans text-body-md text-primary">{item.name}</p>
                {item.size && (<p className="text-label text-on-surface-variant mt-0.5">Size: {item.size}</p>)}
                <p className="text-label text-on-surface-variant mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="text-price font-semibold text-primary">{formatPrice(item.priceZAR * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-dashed border-border my-6" />
      <div className="space-y-3">
        <div className="flex justify-between text-body-sm"><span className="text-on-surface-variant">Subtotal</span><span className="font-medium text-primary">{formatPrice(totalZAR)}</span></div>
        <div className="flex justify-between text-body-sm"><span className="text-on-surface-variant">Shipping ({shippingRegion === 'za' ? 'SA' : 'Intl'})</span><span className="font-medium text-primary">{formatPrice(shipping)}</span></div>
        <div className="flex justify-between items-baseline pt-4 border-t border-dashed border-border"><span className="font-vintage text-h3 text-primary">Total</span><span className="text-price font-bold text-accent">{formatPrice(grandTotal)}</span></div>
      </div>
      <div className="mt-8 flex items-center gap-3 text-on-surface-variant text-body-sm">
        <svg className="w-5 h-5 text-secondary flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        <span>Secure checkout via PayFast or PayPal.</span>
      </div>
    </div>
  )
}
