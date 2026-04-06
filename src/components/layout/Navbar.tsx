'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { NAV_LINKS } from '@/lib/constants'
import CurrencyToggle from '@/components/ui/CurrencyToggle'
import ThemeToggle from '@/components/ui/ThemeToggle'
import MobileMenu from '@/components/layout/MobileMenu'
import { useCartStore } from '@/store/cartStore'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const totalItems = useCartStore((state) => state.getTotalItems())
  const toggleCart = useCartStore((state) => state.toggleCart)

  useEffect(() => { setIsMobileMenuOpen(false) }, [pathname])
  useEffect(() => { setMounted(true) }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-bg/80 backdrop-blur-xl border-b border-dashed border-border crochet-shadow transition-colors duration-300">
        <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto h-20">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent flex items-center justify-center rounded-lg overflow-hidden">
                <svg className="w-6 h-6 text-accent-fg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" /><path d="M12 8V2" /><path d="M12 22v-6" /><path d="M8 12H2" /><path d="M22 12h-6" /></svg>
              </div>
              <h1 className="font-vintage text-h2 italic text-primary tracking-tight transition-colors duration-300"><span className="font-sans font-semibold tracking-wide not-italic">MmwAfrika</span>{' '}Pride Couture</h1>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-10">
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
          <div className="flex items-center gap-6">
            <CurrencyToggle />
            <ThemeToggle />
            <button onClick={toggleCart} aria-label="View Shopping Bag" className="relative group scale-95 active:opacity-80 transition-transform">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              {mounted && totalItems > 0 && (<span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-label min-w-[16px] h-4 flex items-center justify-center rounded-full font-bold">{totalItems}</span>)}
            </button>
            <button aria-label="Open mobile menu" className="md:hidden scale-95 active:opacity-80 transition-transform" onClick={() => setIsMobileMenuOpen(true)}>
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
          </div>
        </nav>
      </header>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}
