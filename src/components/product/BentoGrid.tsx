import Link from 'next/link'
import Image from 'next/image'

export default function BentoGrid() {
  return (
    <section className="py-24 px-6 bg-surface-container transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h3 className="font-headline text-4xl mb-4">Curated Placements</h3>
            <p className="text-secondary">Intentionally crafted for the modern sanctuary.</p>
          </div>
          <Link href="/collections" className="text-primary font-bold underline underline-offset-8 decoration-accent/40 hover:decoration-accent transition-all">View All Products</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <Link href="/products/umuntu-cardigan" className="md:col-span-8 group relative overflow-hidden rounded-lg bg-surface-container-lowest h-[500px] cursor-pointer" aria-label="View The Umuntu Cardigan">
            <Image src="/images/placeholders/bento/default.svg" alt="The Umuntu Cardigan" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            <div className="absolute bottom-8 left-8 text-bg">
              <span className="text-[10px] uppercase tracking-widest bg-bg/20 backdrop-blur px-3 py-1 rounded-full mb-3 inline-block">Best Seller</span>
              <h4 className="font-headline text-3xl">The Umuntu Cardigan</h4>
            </div>
          </Link>
          <div className="md:col-span-4 space-y-8">
            <div className="bg-surface-container-highest p-8 rounded-lg border-stitch transition-colors duration-300">
              <h5 className="font-headline text-xl mb-4">Community Stitch</h5>
              <p className="text-sm leading-relaxed mb-6">Join our monthly weaving circle in Cape Town. Sharing patterns and ancestry.</p>
              <svg className="w-10 h-10 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
            </div>
            <Link href="/products/pet-fynbos-plushie" className="relative h-[250px] overflow-hidden rounded-lg cursor-pointer block" aria-label="View Protea Plushie">
              <Image src="/images/placeholders/product/default.svg" alt="Protea Plushie" fill className="object-cover" />
              <div className="absolute inset-0 bg-accent/10" />
              <div className="absolute top-4 left-4 p-4 bg-card/80 backdrop-blur-md rounded-lg"><p className="font-headline text-lg">Protea Plushie</p></div>
            </Link>
          </div>
          <div className="md:col-span-8 bg-surface p-12 flex flex-col justify-center rounded-lg transition-colors duration-300">
            <blockquote className="font-headline text-3xl italic leading-tight text-accent mb-8">&quot;We don&apos;t just make clothing; we weave the warmth of South African sunshine into every single loop.&quot;</blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-border" />
              <div>
                <p className="font-bold text-sm text-primary">Zanele Mabuza</p>
                <p className="text-xs text-secondary">Master Weaver &amp; Founder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
