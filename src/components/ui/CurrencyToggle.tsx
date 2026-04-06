'use client'

import { useCartStore } from '@/store/cartStore'

export default function CurrencyToggle() {
  const currency = useCartStore((s) => s.currency)
  const setCurrency = useCartStore((s) => s.setCurrency)

  const toggleCurrency = () => { setCurrency(currency === 'ZAR' ? 'USD' : 'ZAR') }

  return (
    <button aria-label={`Switch currency to ${currency === 'ZAR' ? 'USD' : 'ZAR'}`} onClick={toggleCurrency} className="flex items-center bg-surface-container p-1 rounded-full border-stitch transition-colors duration-300">
      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${currency === 'ZAR' ? 'bg-card shadow-sm text-primary' : 'text-secondary'}`}>ZAR</span>
      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${currency === 'USD' ? 'bg-card shadow-sm text-primary' : 'text-secondary'}`}>USD</span>
    </button>
  )
}
