import ProductCard from './ProductCard'
import type { Product } from '@/lib/types'

interface ProductGridProps {
  products: Product[]
  columns?: 1 | 2 | 4
  priority?: boolean
}

export default function ProductGrid({ products, columns = 4, priority = false }: ProductGridProps) {
  const gridCols = columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'

  return (
    <div className={`grid ${gridCols} gap-12`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={priority && index < 4} />
      ))}
    </div>
  )
}
