'use client'

import { useCartStore } from '@/store/cartStore'

const CURRENCIES: { code: 'ZAR' | 'USD' | 'EUR'; label: string }[] = [
  { code: 'ZAR', label: 'ZAR' },
  { code: 'USD', label: 'USD' },
  { code: 'EUR', label: 'EUR' },
]

export default function CurrencyToggle() {
  const currency = useCartStore((s) => s.currency)
  const setCurrency = useCartStore((s) => s.setCurrency)

  const cycleIndex = CURRENCIES.findIndex((c) => c.code === currency)
  const nextCurrency = CURRENCIES[(cycleIndex + 1) % CURRENCIES.length]

  const toggleCurrency = () => { setCurrency(nextCurrency.code) }

  return (
    <button aria-label={`Switch currency to ${nextCurrency.label}`} onClick={toggleCurrency} className="flex items-center bg-surface-container p-1 rounded-full border-stitch transition-colors duration-300">
      {CURRENCIES.map((c) => (
        <span key={c.code} className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${currency === c.code ? 'bg-card shadow-sm text-primary' : 'text-secondary'}`}>{c.label}</span>
      ))}
    </button>
  )
}
