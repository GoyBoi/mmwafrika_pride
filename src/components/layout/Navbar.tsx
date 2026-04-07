'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import CurrencyToggle from '@/components/ui/CurrencyToggle'
import ThemeToggle from '@/components/ui/ThemeToggle'
import MobileMenu from '@/components/layout/MobileMenu'
import { useCartStore } from '@/store/cartStore'
import { useOverlayStore } from '@/store/overlayStore'
import { useWishlistStore } from '@/store/wishlistStore'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/collections' },
  { label: 'Custom Orders', href: '/custom-orders' },
  { label: 'Pets', href: '/pets' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const totalItems = useCartStore((state) => state.getTotalItems())
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const activeOverlay = useOverlayStore((s) => s.activeOverlay)
  const openOverlay = useOverlayStore((s) => s.openOverlay)
  const closeOverlay = useOverlayStore((s) => s.closeOverlay)
  const isMobileMenuOpen = activeOverlay === 'mobileMenu'
  const [mounted, setMounted] = useState(false)

  useEffect(() => { closeOverlay() }, [pathname, closeOverlay])
  useEffect(() => { setMounted(true) }, [])

  const handleCartClick = () => {
    if (activeOverlay === 'cartDrawer') {
      closeOverlay()
    } else {
      openOverlay('cartDrawer')
    }
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-navbar h-20 border-b border-dashed border-border bg-bg/80 backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto flex h-full items-center justify-between px-6 max-w-7xl">

          {/* ── LEFT — LOGO ──────────────────────────────── */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent overflow-hidden">
                <svg className="h-6 w-6 text-accent-fg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" />
                  <path d="M12 8V2" />
                  <path d="M12 22v-6" />
                  <path d="M8 12H2" />
                  <path d="M22 12h-6" />
                </svg>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-sans text-sm font-semibold tracking-wide text-primary transition-colors duration-300">MmwAfrika</span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant transition-colors duration-300">Pride Couture</span>
              </div>
            </Link>
          </div>

          {/* ── CENTER — NAV LINKS (desktop) ─────────────── */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative whitespace-nowrap text-sm transition-colors duration-300 group"
                >
                  <span className={`${active ? 'text-primary' : 'text-secondary group-hover:text-primary'}`}>
                    {link.label}
                  </span>
                  <span className={`absolute left-0 -bottom-1 h-px w-full bg-accent/60 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                </Link>
              )
            })}
          </nav>

          {/* ── RIGHT — UTILITIES ────────────────────────── */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {/* Wishlist */}
            <Link href="/wishlist" aria-label="View wishlist" className="relative text-primary hover:opacity-70 transition-opacity">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-fg">{wishlistCount}</span>
              )}
            </Link>

            {/* Cart */}
            <button onClick={handleCartClick} aria-label="View Shopping Bag" className="relative text-primary hover:opacity-70 transition-opacity">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-on-secondary">{totalItems}</span>
              )}
            </button>

            {/* Currency + Theme */}
            <span className="hidden sm:block"><CurrencyToggle /></span>
            <span className="hidden sm:block"><ThemeToggle /></span>

            {/* Mobile hamburger */}
            <button
              aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              className="sm:hidden text-primary"
              onClick={() => isMobileMenuOpen ? closeOverlay() : openOverlay('mobileMenu')}
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu />
    </>
  )
}
