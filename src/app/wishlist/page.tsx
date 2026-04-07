'use client'

import Link from 'next/link'
import { useWishlistStore } from '@/store/wishlistStore'
import { getAllProducts } from '@/lib/api/products'
import ProductCard from '@/components/product/ProductCard'

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.items)
  const allProducts = getAllProducts()
  const products = allProducts.filter((p) => ids.includes(p.id))

  if (products.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <svg className="w-20 h-20 text-on-surface-variant/20 mb-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <h2 className="font-vintage text-h2 italic text-primary mb-3">Nothing saved yet</h2>
        <p className="text-body-md text-on-surface-variant text-center max-w-sm mb-10">Pieces you love will live here.</p>
        <Link href="/collections" className="btn-primary">Explore the Collection</Link>
      </main>
    )
  }

  return (
    <main className="pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      <nav className="mb-12" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary font-label">
          <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
          <li><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg></li>
          <li className="text-primary font-medium" aria-current="page">Wishlist</li>
        </ol>
      </nav>
      <div className="flex justify-between items-baseline mb-12">
        <h1 className="font-vintage text-h1 italic text-primary">Your Wishlist</h1>
        <span className="text-label text-on-surface-variant">{products.length} {products.length === 1 ? 'piece' : 'pieces'}</span>
      </div>
      <p className="text-body-sm text-on-surface-variant/50 mb-10">Ready to make it yours? Add pieces to your cart when you're ready.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} isWishlistView />
        ))}
      </div>
      <p className="mt-16 text-center text-xs text-on-surface-variant/40">Saved for later → move to cart when ready</p>
    </main>
  )
}
