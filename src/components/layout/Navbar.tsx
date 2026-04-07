'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { NAV_LINKS } from '@/lib/constants'
import CurrencyToggle from '@/components/ui/CurrencyToggle'
import ThemeToggle from '@/components/ui/ThemeToggle'
import MobileMenu from '@/components/layout/MobileMenu'
import { useCartStore } from '@/store/cartStore'
import { useOverlayStore } from '@/store/overlayStore'

export default function Navbar() {
  const pathname = usePathname()
  const totalItems = useCartStore((state) => state.getTotalItems())
  const activeOverlay = useOverlayStore((s) => s.activeOverlay)
  const openOverlay = useOverlayStore((s) => s.openOverlay)
  const closeOverlay = useOverlayStore((s) => s.closeOverlay)
  const isMobileMenuOpen = activeOverlay === 'mobileMenu'
  const [mounted, setMounted] = useState(false)

  useEffect(() => { closeOverlay() }, [pathname, closeOverlay])
  useEffect(() => { setMounted(true) }, [])

  // ── Cart click handler ──
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
      <header className="fixed top-0 w-full z-navbar bg-bg/80 backdrop-blur-xl border-b border-dashed border-border crochet-shadow transition-colors duration-300">
        <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto h-20">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent flex items-center justify-center rounded-lg overflow-hidden">
                <svg className="w-6 h-6 text-accent-fg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" /><path d="M12 8V2" /><path d="M12 22v-6" /><path d="M8 12H2" /><path d="M22 12h-6" /></svg>
              </div>
              <h1 className="font-vintage text-xs sm:text-sm lg:text-h2 italic text-primary tracking-tight whitespace-nowrap transition-colors duration-300"><span className="font-sans font-semibold tracking-wide not-italic">MmwAfrika</span>{' '}Pride Couture</h1>
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href)
              return (
                <Link key={link.href} href={link.href} className="relative px-1 py-2 group">
                  <span className={`text-label transition-colors duration-300 ${active ? 'text-primary' : 'text-secondary'}`}>{link.label}</span>
                  <span className={`absolute left-0 bottom-0 h-[2px] w-full bg-accent/50 transition-all duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                </Link>
              )
            })}
          </div>
          <div className="hidden sm:flex lg:hidden items-center gap-6">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href)
              const getIcon = (label: string) => {
                switch (label) {
                  case 'Home':
                    return <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></>
                  case 'Shop':
                    return <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></>
                  case 'Custom Orders':
                    return <><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></>
                  case 'Pets':
                    return <><path d="M12 14c-2 2-5 2.5-6 1s.5-4.5 2-6 4-2 5.5-.5 1.5 4-.5 5.5z" /><circle cx="8" cy="7" r="1" /><circle cx="16" cy="7" r="1" /><circle cx="6" cy="11" r="1" /><circle cx="18" cy="11" r="1" /></>
                  case 'About':
                    return <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="8" /><line x1="12" y1="12" x2="12" y2="16" /></>
                  case 'Contact':
                    return <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,12 2,6" /></>
                  default:
                    return <><circle cx="12" cy="12" r="10" /></>
                }
              }
              return (
                <Link key={link.href} href={link.href} aria-label={link.label}
                  className={`p-2 rounded-lg transition-colors duration-200 ${active ? 'text-accent bg-accent/10' : 'text-secondary hover:text-primary hover:bg-surface-container'}`}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{getIcon(link.label)}</svg>
                </Link>
              )
            })}
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden sm:block"><CurrencyToggle /></span>
            <span className="hidden sm:block"><ThemeToggle /></span>
            <button onClick={handleCartClick} aria-label="View Shopping Bag" className="relative group scale-95 active:opacity-80 transition-transform">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              {mounted && totalItems > 0 && (<span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-label min-w-[16px] h-4 flex items-center justify-center rounded-full font-bold">{totalItems}</span>)}
            </button>
            <button aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"} className="sm:hidden scale-95 active:opacity-80 transition-transform" onClick={() => isMobileMenuOpen ? closeOverlay() : openOverlay('mobileMenu')}>
              {isMobileMenuOpen ? (
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              ) : (
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              )}
            </button>
          </div>
        </nav>
      </header>
      <MobileMenu />
    </>
  )
}
