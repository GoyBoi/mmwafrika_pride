export interface Product {
  id: string; slug: string; name: string; description: string;
  price: { ZAR: number; USD: number; EUR: number };
  images: ProductImage[];
  category: ProductCategory;
  subcategory?: string;
  sizes?: Size[];
  badge?: BadgeVariant;
  isPetSafe?: boolean;
  isActive?: boolean;
  createdAt: string;
  environment: 'lifestyle' | 'pet';
  lifestyleImage: string;
}

export interface ProductImage { src: string; alt: string; width: number; height: number }
export type { CartItem } from '@/store/cartStore'

export interface Collection { id: string; slug: string; name: string; description: string; heroImage?: string; products: Product[] }

export interface CommunityPhoto {
  id: string; src: string; alt: string; caption: string; location: string;
  contributor: string; status: 'pending' | 'approved' | 'rejected';
}

export type ProductCategory = 'clothing' | 'plushies' | 'pets' | 'home'
export type BadgeVariant = 'new' | 'handmade' | 'limited' | 'pet-safe'
export type Size = 'S' | 'M' | 'L' | 'XL'
export type { Currency } from '@/lib/utils/formatPrice'
export type ShippingRegion = 'za' | 'int'

export interface ProductCardProps { product: Product; priority?: boolean }
export interface CartDrawerProps { isOpen: boolean; onClose: () => void; items: CartItem[]; onUpdateQuantity: (itemId: string, quantity: number) => void; onRemoveItem: (itemId: string) => void }
export interface ImageGalleryProps { images: ProductImage[]; productName: string }
export interface AccordionItemProps { title: string; children: React.ReactNode; defaultOpen?: boolean }
export interface MasonryGalleryProps { photos: CommunityPhoto[] }

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
export type Nullable<T> = T | null
export type PromiseOrValue<T> = T | Promise<T>
