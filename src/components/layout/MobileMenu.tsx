'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { NAV_LINKS, BRAND_NAME } from '@/lib/constants'
import CurrencyToggle from '@/components/ui/CurrencyToggle'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useOverlayStore } from '@/store/overlayStore'
import { useOverlayBehavior } from '@/hooks/useOverlayBehavior'

export default function MobileMenu() {
  const activeOverlay = useOverlayStore((s) => s.activeOverlay)
  const closeOverlay = useOverlayStore((s) => s.closeOverlay)
  const isOpen = activeOverlay === 'mobileMenu'
  const panelRef = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useOverlayBehavior(isOpen, closeOverlay, panelRef)

  if (!mounted) return null

  return createPortal(
    <>
      {/* Backdrop — tap-to-close */}
      <div
        className={`fixed inset-0 z-overlay-backdrop bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeOverlay}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-y-0 right-0 z-overlay w-full max-w-sm bg-surface-container-lowest shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header — pinned at top */}
          <div className="flex justify-between items-center p-6 pb-4">
            <div className="flex flex-col">
              <span className="font-serif text-3xl font-black tracking-tighter text-primary transition-colors duration-300">{BRAND_NAME}</span>
              <span className="font-body text-sm text-secondary">Modern Heirloom Crochet</span>
            </div>
            <button onClick={closeOverlay} aria-label="Close mobile menu" className="p-2">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>

          {/* Scroll container — nav links */}
          <nav className="flex-1 overflow-y-auto overscroll-contain px-6 py-4 space-y-2 divide-y divide-dashed divide-border">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeOverlay} className="flex items-center gap-4 py-6 transition-colors hover:bg-surface-container group text-secondary">
                <span className="font-serif text-2xl">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer section — pinned at bottom */}
          <div className="shrink-0 px-6 py-6 space-y-6 border-t border-dashed border-border">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-secondary">Currency</span>
              <CurrencyToggle />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-secondary">Theme</span>
              <ThemeToggle />
            </div>
            <Link href="/collections" onClick={closeOverlay} className="w-full bg-accent text-accent-fg py-4 rounded-md font-bold text-sm uppercase tracking-widest crochet-shadow transition-transform active:scale-95 block text-center">Shop the Collection</Link>
          </div>
        </div>
      </aside>
    </>,
    document.body
  )
}
