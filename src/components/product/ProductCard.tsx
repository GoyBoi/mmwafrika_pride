import Link from 'next/link'
import Image from 'next/image'
import type { ProductCardProps } from '@/lib/types'
import { formatPrice, formatPriceUSD } from '@/lib/utils/formatPrice'

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { slug, name, price, images, badge, isPetSafe, lifestyleImage } = product
  const mainImage = images[0]
  const badgeLabel = badge === 'new' ? 'New' : badge === 'handmade' ? 'Handmade' : badge === 'limited' ? 'Limited' : null

  return (
    <div className="product-card group relative flex flex-col">
      <div className="relative aspect-[4/5] bg-surface-container-lowest rounded-xl overflow-hidden mb-6 crochet-shadow transition-all duration-500 group-hover:-translate-y-1">
        <Image src={mainImage?.src || '/images/placeholders/product/default.svg'} alt={mainImage?.alt || name} fill priority={priority} className="object-cover transition-transform duration-500 group-hover:scale-110" />
        {lifestyleImage && (<Image src={lifestyleImage} alt={`Close-up detail of ${name}`} fill className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />)}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        {badgeLabel && (<span className={`absolute top-4 left-4 z-10 ${badge === 'new' ? 'badge-new' : badge === 'handmade' ? 'badge-handmade' : 'badge-limited'} px-3 py-1 font-label text-[10px] uppercase tracking-tighter rounded-sm`}>{badgeLabel}</span>)}
        {isPetSafe && (<span className="absolute top-4 right-4 z-10 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-medium">Pet-Safe Material</span>)}
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
          <p className="text-price font-semibold text-primary">{formatPrice(price.ZAR)}</p>
          <p className="text-body-sm text-secondary">{formatPriceUSD(price.USD)}</p>
        </div>
      </div>
    </div>
  )
}
