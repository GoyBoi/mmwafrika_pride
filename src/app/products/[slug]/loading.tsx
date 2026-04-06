export default function Loading() {
  return (
    <main className="pt-24">
      <nav className="max-w-7xl mx-auto px-6 md:px-8 py-6" aria-hidden="true">
        <div className="flex items-center gap-2">
          <div className="h-3 w-12 bg-surface-container rounded animate-pulse" />
          <div className="h-3 w-3 bg-surface-container rounded animate-pulse" />
          <div className="h-3 w-16 bg-surface-container rounded animate-pulse" />
          <div className="h-3 w-3 bg-surface-container rounded animate-pulse" />
          <div className="h-3 w-32 bg-surface-container rounded animate-pulse" />
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          <section className="lg:sticky lg:top-24 space-y-6 self-start">
            <div className="aspect-[4/5] bg-surface-container-low rounded-xl animate-pulse" />
            <div className="aspect-[4/3] bg-surface-container-low rounded-xl animate-pulse" />
          </section>
          <section className="flex flex-col space-y-10">
            <div className="h-12 md:h-16 w-4/5 bg-surface-container rounded animate-pulse" />
            <div className="h-9 w-48 bg-surface-container rounded animate-pulse" />
            <div className="space-y-3 max-w-lg">
              <div className="h-5 w-full bg-surface-container rounded animate-pulse" />
              <div className="h-5 w-5/6 bg-surface-container rounded animate-pulse" />
              <div className="h-5 w-3/4 bg-surface-container rounded animate-pulse" />
            </div>
            <div className="border-b border-dashed border-border" />
            <div className="space-y-8">
              <div className="h-9 w-56 bg-surface-container rounded animate-pulse" />
              <div className="flex gap-3"><div className="w-14 h-14 bg-surface-container rounded-md animate-pulse" /><div className="w-14 h-14 bg-surface-container rounded-md animate-pulse" /><div className="w-14 h-14 bg-surface-container rounded-md animate-pulse" /><div className="w-14 h-14 bg-surface-container rounded-md animate-pulse" /></div>
              <div className="h-14 w-full bg-surface-container rounded-md animate-pulse" />
            </div>
            <div className="border-b border-dashed border-border" />
            <div className="space-y-0">
              <div className="h-10 w-36 bg-surface-container rounded animate-pulse mb-6" />
              <div className="h-10 w-48 bg-surface-container rounded animate-pulse mb-6" />
              <div className="h-10 w-52 bg-surface-container rounded animate-pulse" />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
