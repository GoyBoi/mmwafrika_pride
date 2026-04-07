import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProductBySlug } from '@/lib/api/products'
import BackButton from '@/components/ui/BackButton'
import ProductControls from '@/components/product/ProductControls'
import { formatPrice, formatPriceUSD } from '@/lib/utils/formatPrice'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

function formatCategoryLabel(raw: string): string {
  return raw.split(/[-_]+/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params
  const product = await getProductBySlug(params.slug)

  if (!product) notFound()

  const categoryLabel = formatCategoryLabel(product.category)
  const categoryPath = product.category === 'pets' ? '/collections/pets' : `/collections/${product.category}`

  return (
    <main className="pt-24">
      <BackButton />
      <nav className="max-w-7xl mx-auto px-6 md:px-8 py-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-secondary font-label">
          <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
          <li><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg></li>
          <li><Link href={categoryPath} className="hover:text-accent transition-colors">{categoryLabel}</Link></li>
          <li><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg></li>
          <li className="text-primary font-medium" aria-current="page">{product.name}</li>
        </ol>
      </nav>
      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          <section className="lg:sticky lg:top-24 space-y-6 self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-container-low crochet-shadow">
              <Image src={product.images[0]?.src || '/images/placeholders/product/default.svg'} alt={product.images[0]?.alt || product.name} fill priority className="object-cover transition-transform duration-700 hover:scale-[1.02]" />
              {product.badge && (<span className={`absolute top-6 left-6 ${product.badge === 'new' ? 'badge-new' : product.badge === 'handmade' ? 'badge-handmade' : 'badge-limited'} px-4 py-1.5 font-label text-[10px] uppercase tracking-tighter rounded-sm`}>{product.badge === 'new' ? 'New' : product.badge === 'handmade' ? 'Handmade' : 'Limited'}</span>)}
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-container-low">
              <Image src={product.lifestyleImage || '/images/placeholders/hero/default.svg'} alt={`Close-up detail of ${product.name}`} fill className="object-cover transition-transform duration-700 hover:scale-[1.02]" />
              <div className="absolute bottom-4 left-4 px-3 py-1.5 glass rounded-full"><span className="label-sm text-primary/80">Stitch Detail</span></div>
            </div>
          </section>
          <section className="flex flex-col space-y-10">
            <div>
              <h1 className="font-sans text-h1 font-semibold text-primary tracking-tight">{product.name}</h1>
              <p className="font-bhineka text-h2 md:text-h1 text-secondary/60 mt-2 italic">Crafted with intention</p>
            </div>
            <div className="flex items-baseline gap-6">
              <span className="text-price text-accent">{formatPrice(product.price.ZAR)}</span>
              <span className="text-body-md text-secondary">{formatPriceUSD(product.price.USD)}</span>
            </div>
            <p className="text-body-md text-on-surface-variant max-w-lg">{product.description}</p>
            <div className="border-stitch" />
            <ProductControls product={product} />
            <div className="border-stitch" />
            <div className="space-y-0">
              <details className="group border-b border-border/30" open>
                <summary className="flex justify-between items-center cursor-pointer list-none py-6"><span className="font-vintage text-h2 text-primary">The Stitch</span><svg className="w-6 h-6 text-secondary transition-transform duration-300 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg></summary>
                <div className="pb-6 text-body-md text-secondary">Each piece is individually hand-crocheted using traditional techniques passed down through generations of South African artisans. The stitch pattern creates a distinctive texture that catches light beautifully and develops a soft drape with wear.</div>
              </details>
              <details className="group border-b border-border/30">
                <summary className="flex justify-between items-center cursor-pointer list-none py-6"><span className="font-vintage text-h2 text-primary">Materials &amp; Care</span><svg className="w-6 h-6 text-secondary transition-transform duration-300 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg></summary>
                <div className="pb-6 text-body-md text-secondary space-y-3"><p>Premium organic cotton blend, ethically sourced and hand-dyed in small batches.</p><p>Hand wash in cold water with a mild pH-neutral detergent. Do not wring. Lay flat to dry in shade to maintain natural fiber integrity and colour vibrancy.</p></div>
              </details>
              <details className="group border-b border-border/30">
                <summary className="flex justify-between items-center cursor-pointer list-none py-6"><span className="font-vintage text-h2 text-primary">Shipping &amp; Returns</span><svg className="w-6 h-6 text-secondary transition-transform duration-300 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg></summary>
                <div className="pb-6 text-body-md text-secondary space-y-3"><p>Complimentary shipping within South Africa (3–5 working days). International delivery available via DHL (7–14 working days).</p><p>Returns accepted within 30 days of delivery. Items must be unworn with original tags attached.</p></div>
              </details>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
