import Link from 'next/link'
import Image from 'next/image'
import { TRUST_BADGES } from '@/lib/constants'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-24 md:pb-32 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div className="flex flex-col items-center text-center space-y-10 z-10">
          <div className="space-y-8">
            <div className="flex items-end justify-center gap-5 flex-wrap">
              <div className="relative inline-flex flex-col items-center group">
                <span className="font-bhineka font-semibold text-display-xl leading-[0.9] tracking-tight" aria-label="MmwAfrika">
                  <span className="text-accent">Mmw</span><span className="text-primary transition-colors duration-300">Afrika</span>
                </span>
                {/* Decorative Stripes Container */}
                <div className="w-full mt-2 flex flex-col gap-[2px]" aria-hidden="true">
                  <div className="h-[3px] w-full bg-[#D4AF37]" /> {/* Gold */}
                  <div className="h-[3px] w-full bg-[#BE3A34]" /> {/* Red */}
                  <div className="h-[3px] w-full bg-[#367C3F]" /> {/* Green */}
                  <div className="h-[1px] w-full border-b border-dashed border-[#BE3A34] mt-[1px]" /> {/* Decorative dash */}
                </div>
              </div>
              <span className="font-vintage italic text-h1 text-primary">Pride Couture</span>
            </div>
            <h1 className="font-sans text-h3 leading-[1.25] text-primary">Unique <span className="font-semibold">Crochet Couture</span>,<br />Plushies &amp; Blankets</h1>
            <p className="font-vintage text-h3 italic text-accent">Handmade with Love</p>
            <p className="font-vintage text-h3 text-on-surface-variant font-light">Custom Orders are Welcome</p>
            <p className="font-bhineka text-body-md text-on-surface-variant">crafted with care</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/collections" className="btn-primary">Shop the Collection</Link>
            <Link href="/custom-orders" className="btn-secondary">Custom Orders</Link>
          </div>
          <div className="pt-8 border-t border-border/20 flex items-center gap-4">
            <span className="text-label text-primary">Artisanal Excellence</span>
            <div className="h-[1px] w-12 bg-border" />
            <span className="text-label text-accent">Est. 2024</span>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-4 bg-surface-container-low rounded-xl -rotate-2 group-hover:rotate-0 transition-transform duration-700 -z-10" />
          <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-xl crochet-shadow">
            <Image src="/images/placeholders/hero/default.svg" alt="Artisanal Crochet Detail" fill priority className="object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000" />
            <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-lg flex justify-between items-center">
              <span className="font-vintage text-h3 italic">The Heritage Collection</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
            </div>
          </div>
          <div className="hidden lg:block absolute -bottom-12 -left-20 w-48 h-64 overflow-hidden rounded-lg crochet-shadow border-4 border-card transition-colors duration-300">
            <Image src="/images/placeholders/product/default.svg" alt="Crochet Plushie" fill className="object-cover" />
          </div>
        </div>
      </div>
      <div className="mt-24 bg-surface-container py-12 -mx-8 px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 md:justify-between items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {TRUST_BADGES.map((badge) => (<span key={badge} className="font-vintage text-h2">{badge}</span>))}
        </div>
      </div>
    </section>
  )
}
