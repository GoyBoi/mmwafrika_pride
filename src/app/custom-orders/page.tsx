import BackButton from '@/components/ui/BackButton'

export default function CustomOrdersPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-32">
      <BackButton />
      <h1 className="font-vintage text-h1 italic text-primary mb-4">Custom Orders</h1>
      <p className="text-body-md text-secondary text-center max-w-md mb-10">Tell us what you&apos;d like and we&apos;ll craft it by hand — made to order, made with love.</p>
      <p className="text-body-sm text-secondary/50 text-center">Coming soon.</p>
    </main>
  )
}
