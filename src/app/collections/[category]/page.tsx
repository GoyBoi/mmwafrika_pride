import ProductGrid from '@/components/product/ProductGrid'
import BackButton from '@/components/ui/BackButton'
import { getProductsByCategory } from '@/lib/api/products'

function formatCategoryLabel(raw: string): string {
  return raw.split(/[-_]+/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

interface CollectionPageProps {
  params: Promise<{ category: string }>
}

export default async function CollectionPage(props: CollectionPageProps) {
  const params = await props.params
  const category = params?.category ?? 'clothing'
  const categoryLabel = formatCategoryLabel(category)
  const products = await getProductsByCategory(category)

  return (
    <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
      <div className="mb-4"><BackButton /></div>
      <header className="mb-20 space-y-4">
        <h1 className="font-headline text-5xl md:text-7xl italic leading-tight max-w-3xl transition-colors duration-300">Items for{' '}<span className="text-accent">{categoryLabel}</span></h1>
        <p className="text-secondary max-w-xl text-lg leading-relaxed transition-colors duration-300">A collection of hand-woven accessories for our companions, crafted with the same heritage techniques used for generations in South Africa.</p>
      </header>
      <ProductGrid products={products} columns={4} priority />
    </main>
  )
}
