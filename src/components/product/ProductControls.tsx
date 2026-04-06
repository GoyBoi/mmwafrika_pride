'use client'

import { useState } from 'react'
import { SIZE_OPTIONS } from '@/lib/constants'
import type { Size } from '@/lib/types'
import { useCartStore } from '@/store/cartStore'

interface ProductControlsProps {
  product: { id: string; slug: string; name: string; price: { ZAR: number; USD: number }; images: { src: string; alt: string }[]; sizes?: Size[] }
}

export default function ProductControls({ product }: ProductControlsProps) {
  const availableSizes = product.sizes ?? SIZE_OPTIONS
  const [selectedSize, setSelectedSize] = useState<Size>(availableSizes[0])
  const addItem = useCartStore((state) => state.addItem)
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen)
  const currency = useCartStore((state) => state.currency)
  const setCurrency = useCartStore((state) => state.setCurrency)
  const [added, setAdded] = useState(false)

  const handleAddToBag = () => {
    addItem({ productId: product.id, slug: product.slug, name: product.name, priceZAR: product.price.ZAR, priceUSD: product.price.USD, currency: 'ZAR', size: selectedSize, quantity: 1, image: product.images[0]?.src || '/images/placeholders/product/default.svg' })
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
    setIsCartOpen(true)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <div className="flex items-center gap-6">
          <span className="text-price font-light transition-colors duration-300">{currency === 'ZAR' ? `ZAR ${product.price.ZAR.toLocaleString('en-ZA')}` : `$${product.price.USD.toFixed(2)}`}</span>
          <div className="flex items-center bg-surface-container p-1 rounded-full stitch-border transition-colors duration-300">
            <button onClick={() => setCurrency('ZAR')} className={`px-3 py-1 text-label rounded-full transition-all ${currency === 'ZAR' ? 'bg-card shadow-sm' : 'text-secondary'}`} aria-label="Show prices in ZAR">ZAR</button>
            <button onClick={() => setCurrency('USD')} className={`px-3 py-1 text-label rounded-full transition-all ${currency === 'USD' ? 'bg-card shadow-sm' : 'text-secondary'}`} aria-label="Show prices in USD">USD</button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-label text-primary transition-colors duration-300">Select Size</span>
        <div className="flex gap-3">
          {availableSizes.map((size) => (
            <button key={size} onClick={() => setSelectedSize(size)} className={`w-14 h-14 flex items-center justify-center rounded-md font-body text-sm transition-all ${selectedSize === size ? 'border-2 border-accent font-bold text-accent-fg' : 'border border-border hover:border-accent'}`} aria-label={`Select size ${size}`}>{size}</button>
          ))}
        </div>
      </div>
      <div>
        <button onClick={handleAddToBag} className={`w-full py-5 text-label font-bold uppercase rounded-md crochet-shadow transition-all duration-300 active:scale-[0.98] ${added ? 'bg-success text-bg opacity-90' : 'bg-accent text-accent-fg hover:opacity-90'}`}>{added ? 'Added ✓' : 'Add to Bag'}</button>
        <div className="mt-4 flex items-center justify-center gap-2 text-secondary text-xs transition-colors duration-300">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6z" /><path d="M11 10h2v6h-2zm0 8h2v2h-2z" /></svg>
          <span>Complimentary shipping within South Africa</span>
        </div>
      </div>
    </div>
  )
}
