'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ProductCardProps } from '@/lib/types'
import { formatPrice } from '@/lib/utils/formatPrice'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

interface ProductCardExtendedProps extends ProductCardProps {
  isWishlistView?: boolean
}

export default function ProductCard({ product, priority = false, isWishlistView = false }: ProductCardExtendedProps) {
  const { id, slug, name, price, images, badge, isPetSafe, lifestyleImage } = product
  const currency = useCartStore((s) => s.currency)
  const toggleItem = useWishlistStore((s) => s.toggleItem)
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(id))
  const addItem = useCartStore((s) => s.addItem)
  const mainImage = images[0]
  const [justSaved, setJustSaved] = useState(false)
  const badgeLabel = badge === 'new' ? 'New' : badge === 'handmade' ? 'Handmade' : badge === 'limited' ? 'Limited' : null

  const handleToggle = () => {
    const wasInList = isInWishlist
    toggleItem(id)
    if (!wasInList) {
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 1200)
    }
  }

  return (
    <div className="product-card group relative flex flex-col">
      <div className="relative aspect-[4/5] bg-surface-container-lowest rounded-xl overflow-hidden mb-6 crochet-shadow transition-all duration-500 group-hover:-translate-y-1">
        <Image src={mainImage?.src || '/images/placeholders/product/default.svg'} alt={mainImage?.alt || name} fill priority={priority} className="object-cover transition-transform duration-500 group-hover:scale-110" />
        {lifestyleImage && (<Image src={lifestyleImage} alt={`Close-up detail of ${name}`} fill className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />)}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        {badgeLabel && (<span className={`absolute top-4 left-4 z-10 ${badge === 'new' ? 'badge-new' : badge === 'handmade' ? 'badge-handmade' : 'badge-limited'} px-3 py-1 font-label text-[10px] uppercase tracking-tighter rounded-sm`}>{badgeLabel}</span>)}
        {isPetSafe && (<span className="absolute top-4 right-4 z-10 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-medium">Pet-Safe Material</span>)}
        <button
          onClick={handleToggle}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm hover:bg-surface-container-lowest hover:scale-110 transition-all duration-200"
        >
          <svg className={`w-5 h-5 transition-all duration-300 ${isInWishlist ? 'text-accent fill-current scale-110' : 'text-on-surface-variant/60 scale-90'}`} viewBox="0 0 24 24" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {justSaved && (
          <span className="absolute top-10 right-3 z-20 text-[10px] font-label uppercase tracking-widest text-accent opacity-70 animate-pulse">Saved</span>
        )}
        <div className="quick-view z-10">
          <Link href={`/products/${slug}`} className="w-full bg-card/90 backdrop-blur-md text-primary py-3 text-label uppercase hover:bg-accent hover:text-accent-fg focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-300 block text-center">Quick View</Link>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-sans text-body-md">{name}</h3>
          {isPetSafe && (<svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="4" cy="8" r="2" /><path d="M12 14c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z" /></svg>)}
        </div>
        <div className="flex gap-3 items-baseline">
          <p className="text-price font-semibold text-primary">{formatPrice(price?.[currency] ?? price.ZAR, currency)}</p>
        </div>
      </div>
      {isWishlistView && (
        <div className="mt-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => {
              addItem({ productId: id, slug, name, price: { ZAR: price.ZAR, USD: price.USD, EUR: price.EUR }, currency: useCartStore.getState().currency, size: product.sizes?.[0], quantity: 1, image: mainImage?.src || '/images/placeholders/product/default.svg' })
              toggleItem(id)
            }}
            className="text-sm font-label uppercase tracking-widest text-accent hover:text-primary transition-colors"
          >
            Add to Cart
          </button>
          <button
            onClick={handleToggle}
            className="text-sm font-label uppercase tracking-widest text-on-surface-variant/60 hover:text-error transition-colors"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
