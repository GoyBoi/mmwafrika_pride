import BackButton from '@/components/ui/BackButton'

export default function CollectionsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-32">
      <BackButton />
      <h1 className="font-vintage text-h1 italic text-primary mb-4">Shop the Collection</h1>
      <p className="text-body-md text-secondary text-center max-w-md mb-10">Browse all handmade crochet pieces — clothing, plushies, and more.</p>
      <p className="text-body-sm text-secondary/50 text-center">Coming soon.</p>
    </main>
  )
}
