export default function Loading() {
  return (
    <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
      <header className="mb-20 space-y-4">
        <div className="h-16 md:h-24 w-3/4 bg-surface-container rounded-lg animate-pulse" />
        <div className="h-6 w-1/2 bg-surface-container rounded-lg animate-pulse" />
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-4">
            <div className="aspect-[4/5] bg-surface-container rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-3/4 bg-surface-container rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-surface-container rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
