import { EXCHANGE_RATE_ZAR_TO_USD } from './constants'

export { formatPrice, type Currency } from '@/lib/utils/formatPrice'

export function convertZarToUsd(zarAmount: number): number { return Number((zarAmount * EXCHANGE_RATE_ZAR_TO_USD).toFixed(2)) }
export function convertUsdToZar(usdAmount: number): number { return Number((usdAmount / EXCHANGE_RATE_ZAR_TO_USD).toFixed(2)) }

export function getProductImagePath(slug: string, index: number = 1, name: string = 'main'): string {
  return `/images/products/${slug}/${String(index).padStart(2, '0')}-${name}.webp`
}

export function getCommunityImagePath(filename: string): string { return `/images/community/${filename}` }
export function getPlaceholderPath(type: 'product' | 'hero' | 'bento'): string { return `/images/placeholders/${type}/default.svg` }
export function truncateText(text: string, maxLength: number): string { return text.length <= maxLength ? text : text.slice(0, maxLength).trim() + '...' }
export function generateSlug(text: string): string { return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
export function getWhatsAppUrl(phoneNumber: string, message?: string): string {
  const url = `https://wa.me/${phoneNumber}`
  if (message) return `${url}?text=${encodeURIComponent(message)}`
  return url
}
export function isMobile(userAgent: string): boolean { return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) }
export function clamp(value: number, min: number, max: number): number { return Math.min(Math.max(value, min), max) }
export function delay(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)) }
