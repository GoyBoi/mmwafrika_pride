'use client'

import Link from 'next/link'
import { NAV_LINKS, BRAND_NAME } from '@/lib/constants'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <>
      {/* Backdrop — tap-to-close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`fixed inset-y-0 right-0 z-[100] w-full max-w-sm bg-surface-container-lowest shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-screen p-10 justify-between">
        <div className="space-y-12">
          <div className="flex justify-between items-center mb-12">
            <div className="flex flex-col">
              <span className="font-serif text-3xl font-black tracking-tighter text-primary transition-colors duration-300">{BRAND_NAME}</span>
              <span className="font-body text-sm text-secondary">Modern Heirloom Crochet</span>
            </div>
            <button onClick={onClose} aria-label="Close mobile menu" className="p-2">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <nav className="flex flex-col space-y-2 divide-y divide-dashed divide-border">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={onClose} className="flex items-center gap-4 py-6 transition-colors hover:bg-surface-container group text-secondary">
                <span className="font-serif text-2xl">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-y-8">
          <Link href="/collections" onClick={onClose} className="w-full bg-accent text-accent-fg py-4 rounded-md font-bold text-sm uppercase tracking-widest crochet-shadow transition-transform active:scale-95 block text-center">Shop the Collection</Link>
        </div>
      </div>
    </aside>
    </>
  )
}
