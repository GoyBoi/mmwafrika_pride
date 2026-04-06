import type { Product } from '@/lib/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? null

const allProducts: Product[] = [
  {
    id: 'h1', slug: 'umuntu-cardigan', name: 'The Umuntu Cardigan',
    description: 'An editorial silhouette in hand-crocheted cotton. Inspired by the geometric rhythms of Southern African beadwork, each stitch is placed over 45 hours by artisans in the Karoo.',
    price: { ZAR: 3450, USD: 186.30 },
    images: [{ src: '/images/placeholders/product/default.svg', alt: 'The Umuntu Cardigan — front view', width: 800, height: 1000 }],
    category: 'clothing', badge: 'new', sizes: ['S', 'M', 'L', 'XL'], createdAt: '2024-03-01', environment: 'lifestyle', lifestyleImage: '/images/placeholders/hero/default.svg',
  },
  {
    id: 'h2', slug: 'cashmere-blend-beanie', name: 'Cashmere-Blend Beanie',
    description: 'A ribbed beanie in a soft merino-cashmere blend. Worked in the round with a folded brim that sits low on the brow. A quiet luxury for cold Highveld mornings.',
    price: { ZAR: 680, USD: 36.72 },
    images: [{ src: '/images/placeholders/product/default.svg', alt: 'Cashmere-Blend Beanie', width: 800, height: 1000 }],
    category: 'clothing', badge: 'handmade', sizes: ['S', 'M', 'L'], createdAt: '2024-02-15', environment: 'lifestyle', lifestyleImage: '/images/placeholders/bento/default.svg',
  },
  {
    id: 'p1', slug: 'pet-chunky-collar', name: 'Chunky Collar',
    description: 'A chunky crochet collar in organic cotton. Gentle on fur, tough on walks. Hand-finished with a solid brass D-ring and snap buckle.',
    price: { ZAR: 320, USD: 17.28 },
    images: [{ src: '/images/placeholders/product/default.svg', alt: 'Chunky Collar — Pet Boutique', width: 800, height: 1000 }],
    category: 'pets', badge: 'new', isPetSafe: true, createdAt: '2024-04-01', environment: 'pet', lifestyleImage: '/images/placeholders/product/default.svg',
  },
  {
    id: 'p2', slug: 'pet-fynbos-plushie', name: 'Fynbos Plushie',
    description: 'A hand-sculpted plush inspired by the Cape Floristic Region. Soft-fill core with embroidered botanical detail. Pet-safe yarn throughout — gentle on teeth and gums.',
    price: { ZAR: 450, USD: 24.30 },
    images: [{ src: '/images/placeholders/product/default.svg', alt: 'Fynbos Plushie — Pet Boutique', width: 800, height: 1000 }],
    category: 'pets', badge: 'limited', isPetSafe: true, createdAt: '2024-04-10', environment: 'pet', lifestyleImage: '/images/placeholders/product/default.svg',
  },
]

export async function getProductsByCategory(category: string, delayMs: number = 800): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, delayMs))
  const normalised = category.toLowerCase().replace(/[-_]+/g, '')
  if (normalised === 'all' || normalised === '') return allProducts
  return allProducts.filter((p) => p.category === normalised)
}

export async function getProductBySlug(slug: string, delayMs: number = 800): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, delayMs))
  return allProducts.find((p) => p.slug === slug) ?? null
}

export async function getAllProducts(delayMs: number = 500): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, delayMs))
  return [...allProducts]
}
