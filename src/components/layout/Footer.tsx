import Link from 'next/link'
import { BRAND_NAME, FOOTER_LINKS, SOCIAL, CONTACT } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-surface-container pt-24 pb-12 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-1">
            <h2 className="font-serif text-2xl font-bold italic mb-6">{BRAND_NAME}</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">Modern heirloom textiles sustainably handcrafted in South Africa. Weaving the past into the present.</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              {FOOTER_LINKS.shop.map((link) => (<li key={link.href}><Link href={link.href} className="hover:text-primary transition-colors">{link.label}</Link></li>))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><a href={`https://wa.me/${CONTACT.phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">WhatsApp: {CONTACT.phone}</a></li>
              <li><a href={`mailto:${CONTACT.email}`} className="hover:text-primary transition-colors">Email</a></li>
              {FOOTER_LINKS.support.slice(2).map((link) => (<li key={link.href}><Link href={link.href} className="hover:text-primary transition-colors">{link.label}</Link></li>))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Follow</h4>
            <div className="flex gap-4">
              <a href={SOCIAL.instagram} className="w-10 h-10 border border-dashed border-border rounded-full flex items-center justify-center hover:bg-surface-container-highest transition-all" aria-label="Follow us on Instagram">
                <svg className="w-5 h-5 text-on-surface-variant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href={SOCIAL.tiktok} className="w-10 h-10 border border-dashed border-border rounded-full flex items-center justify-center hover:bg-surface-container-highest transition-all" aria-label="Follow us on TikTok">
                <svg className="w-5 h-5 text-on-surface-variant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" /></svg>
              </a>
              <a href={SOCIAL.facebook} className="w-10 h-10 border border-dashed border-border rounded-full flex items-center justify-center hover:bg-surface-container-highest transition-all" aria-label="Follow us on Facebook">
                <svg className="w-5 h-5 text-on-surface-variant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-dashed border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-secondary font-medium transition-colors duration-300">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
