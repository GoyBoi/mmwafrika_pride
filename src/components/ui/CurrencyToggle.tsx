'use client'

import { useCartStore } from '@/store/cartStore'

const CURRENCIES = [
  { code: 'ZAR', label: 'ZAR', symbol: 'R' },
  { code: 'USD', label: 'USD', symbol: '$' },
  { code: 'EUR', label: 'EUR', symbol: '€' },
] as const

export default function CurrencyToggle() {
  const currency = useCartStore((s) => s.currency)
  const setCurrency = useCartStore((s) => s.setCurrency)

  return (
    <div className="flex items-center bg-surface/50 p-1.5 rounded-full border border-border/10 backdrop-blur-md transition-colors duration-300">
      {CURRENCIES.map((c) => (
        <button
          key={c.code}
          onClick={() => setCurrency(c.code)}
          className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all duration-500 ease-in-out ${
            currency === c.code
              ? 'bg-card text-accent shadow-md scale-105'
              : 'text-secondary/60 hover:text-primary'
          }`}
          aria-label={`Show prices in ${c.label}`}
        >
          <span className={`text-[12px] font-serif ${currency === c.code ? 'text-accent' : 'text-secondary/40'}`}>
            {c.symbol}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {c.label}
          </span>
        </button>
      ))}
    </div>
  )
}
