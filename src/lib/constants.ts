export const BRAND_NAME = 'MmwAfrika Pride Couture'
export const WHATSAPP_NUMBER = '27790427032'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

export const CONTACT = { email: 'hello@mmwafrika.com', phone: '079 042 7032' }
export const SOCIAL = { instagram: '#', tiktok: '#', facebook: '#' }
export const CURRENCIES = { ZAR: { symbol: 'R', code: 'ZAR' }, USD: { symbol: '$', code: 'USD' } }
export const EXCHANGE_RATE_ZAR_TO_USD = 0.054

export const NAV_LINKS = [
  { label: 'Home', href: '/' }, { label: 'Shop', href: '/collections' },
  { label: 'Custom Orders', href: '/custom-orders' }, { label: 'Pets', href: '/pets' },
  { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' },
]

export const FOOTER_LINKS = {
  shop: [
    { label: 'Clothing', href: '/collections/clothing' },
    { label: 'Plushies', href: '/collections/plushies' },
    { label: 'Your Pets', href: '/collections/pets' },
    { label: 'New Arrivals', href: '/collections?sort=newest' },
  ],
  stories: [],
  support: [
    { label: 'WhatsApp', href: WHATSAPP_URL },
    { label: 'Email', href: `mailto:${CONTACT.email}` },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
  ],
}

export const PRODUCT_CATEGORIES = ['clothing', 'plushies', 'pets', 'home'] as const
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export const PET_CATEGORIES = [
  { id: 'all', label: 'All Items' }, { id: 'cats', label: 'Cats' },
  { id: 'dogs', label: 'Dogs' }, { id: 'plushies', label: 'Plushies' },
]

export const SIZE_OPTIONS = ['S', 'M', 'L', 'XL'] as const
export type Size = (typeof SIZE_OPTIONS)[number]

export const SHIPPING_REGIONS = [
  { id: 'za', label: 'South Africa (Local Delivery)', estimate: '3-5 Working Days' },
  { id: 'int', label: 'International Shipping', estimate: '7-14 Working Days' },
]

export const SHIPPING_COSTS = { za: 120, int: 350 } as const

export const BADGE_TYPES = {
  NEW: { label: 'New', variant: 'new' as const },
  HANDMADE: { label: 'Handmade', variant: 'handmade' as const },
  LIMITED: { label: 'Limited', variant: 'limited' as const },
  PET_SAFE: { label: 'Pet-Safe Material', variant: 'pet-safe' as const },
} as const

export const TRUST_BADGES = ['Cape Town Crafted', 'Global Shipping', 'Eco-Conscious Yarn', 'Custom Designs']

export const BREAKPOINTS = { mobile: 375, tablet: 768, desktop: 1024, wide: 1440 } as const
