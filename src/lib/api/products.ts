import type { Product } from '@/lib/types'

/* ── Product Registry: single source of truth ──────────────────────────
 * All products live here. To add a product, add an entry to `allProducts`.
 * Ready for backend swap — just replace this array with an API call.
 * ─────────────────────────────────────────────────────────────────────── */

const allProducts: Product[] = [
  {
    id: 'h1', slug: 'umuntu-cardigan', name: 'The Umuntu Cardigan',
    description: 'An editorial silhouette in hand-crocheted cotton. Inspired by the geometric rhythms of Southern African beadwork, each stitch is placed over 45 hours by artisans in the Karoo.',
    price: { ZAR: 3450, USD: 186, EUR: 172 },
    images: [{ src: '/images/placeholders/product/default.svg', alt: 'The Umuntu Cardigan — front view', width: 800, height: 1000 }],
    category: 'clothing', badge: 'new', sizes: ['S', 'M', 'L', 'XL'],
    createdAt: '2024-03-01', environment: 'lifestyle',
    lifestyleImage: '/images/placeholders/hero/default.svg',
    isActive: true,
  },
  {
    id: 'h2', slug: 'cashmere-blend-beanie', name: 'Cashmere-Blend Beanie',
    description: 'A ribbed beanie in a soft merino-cashmere blend. Worked in the round with a folded brim that sits low on the brow. A quiet luxury for cold Highveld mornings.',
    price: { ZAR: 680, USD: 37, EUR: 34 },
    images: [{ src: '/images/placeholders/product/default.svg', alt: 'Cashmere-Blend Beanie', width: 800, height: 1000 }],
    category: 'clothing', badge: 'handmade', sizes: ['S', 'M', 'L'],
    createdAt: '2024-02-15', environment: 'lifestyle',
    lifestyleImage: '/images/placeholders/bento/default.svg',
    isActive: true,
  },
  {
    id: 'p1', slug: 'pet-chunky-collar', name: 'Chunky Collar',
    description: 'A chunky crochet collar in organic cotton. Gentle on fur, tough on walks. Hand-finished with a solid brass D-ring and snap buckle.',
    price: { ZAR: 320, USD: 17, EUR: 16 },
    images: [{ src: '/images/placeholders/product/default.svg', alt: 'Chunky Collar — Pet Boutique', width: 800, height: 1000 }],
    category: 'pets', badge: 'new', isPetSafe: true,
    createdAt: '2024-04-01', environment: 'pet',
    lifestyleImage: '/images/placeholders/product/default.svg',
    isActive: true,
  },
  {
    id: 'p2', slug: 'pet-fynbos-plushie', name: 'Fynbos Plushie',
    description: 'A hand-sculpted plush inspired by the Cape Floristic Region. Soft-fill core with embroidered botanical detail. Pet-safe yarn throughout — gentle on teeth and gums.',
    price: { ZAR: 450, USD: 24, EUR: 22 },
    images: [{ src: '/images/placeholders/product/default.svg', alt: 'Fynbos Plushie — Pet Boutique', width: 800, height: 1000 }],
    category: 'pets', badge: 'limited', isPetSafe: true,
    createdAt: '2024-04-10', environment: 'pet',
    lifestyleImage: '/images/placeholders/product/default.svg',
    isActive: true,
  },
]

/* ── Selectors ───────────────────────────────────────────────────────── */

export const getAllProducts = (): Product[] => allProducts

export const getActiveProducts = (): Product[] => allProducts.filter((p) => p.isActive)

export const getProductsByCategory = async (category: string, delayMs: number = 400): Promise<Product[]> => {
  await new Promise((resolve) => setTimeout(resolve, delayMs))
  const normalised = category.toLowerCase().replace(/[-_]+/g, '')
  if (normalised === 'all' || normalised === '') return getActiveProducts()
  return allProducts.filter((p) => p.isActive && p.category === normalised)
}

export const getProductBySlug = async (slug: string, delayMs: number = 400): Promise<Product | null> => {
  await new Promise((resolve) => setTimeout(resolve, delayMs))
  return allProducts.find((p) => p.slug === slug && p.isActive) ?? null
}
