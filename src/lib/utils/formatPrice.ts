export type Currency = 'ZAR' | 'USD' | 'EUR'

const CURRENCY_CONFIG: Record<Currency, { locale: string; minimumFractionDigits: number }> = {
  ZAR: { locale: 'en-ZA', minimumFractionDigits: 0 },
  USD: { locale: 'en-US', minimumFractionDigits: 2 },
  EUR: { locale: 'en-DE', minimumFractionDigits: 2 },
}

export function formatPrice(amount: number, currency: Currency = 'ZAR'): string {
  const { locale, minimumFractionDigits } = CURRENCY_CONFIG[currency]
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(amount)
}
