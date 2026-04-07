'use client'

import { useEffect, useState } from 'react'
import { useOverlayStore } from '@/store/overlayStore'
import { useCartStore } from '@/store/cartStore'

/**
 * Development-only UI panel that surfaces all relevant UI state
 * at a glance. Only renders in development mode.
 */
export default function OverlayDebugPanel() {
  const [isDev, setIsDev] = useState(false)
  const activeOverlay = useOverlayStore((s) => s.activeOverlay)
  const isAnyOpen = useOverlayStore((s) => s.isAnyOpen())
  const cartItems = useCartStore((s) => s.items.length)
  const isHydrated = useCartStore((s) => s.isHydrated)
  const theme = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') ? 'dark' : 'light' : 'ssr'
  const bodyOverflow = typeof document !== 'undefined' ? document.body.style.overflow || '(default)' : ''

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development')
  }, [])

  if (!isDev) return null

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black/90 text-green-400 text-xs font-mono rounded-lg p-3 min-w-[200px] select-none pointer-events-none opacity-80">
      <div className="font-bold text-yellow-400 mb-1 uppercase tracking-wider text-[10px]">⚡ UI State</div>
      <div className="space-y-0.5">
        <div><span className="text-gray-500">overlay:</span> {activeOverlay ?? 'null'}</div>
        <div><span className="text-gray-500">anyOpen:</span> {isAnyOpen ? '🔒 yes' : 'no'}</div>
        <div><span className="text-gray-500">cartItems:</span> {cartItems}</div>
        <div><span className="text-gray-500">hydrated:</span> {isHydrated ? '✅' : '⏳'}</div>
        <div><span className="text-gray-500">theme:</span> {theme}</div>
        <div><span className="text-gray-500">body.overflow:</span> {bodyOverflow || '(empty)'} </div>
      </div>
    </div>
  )
}
