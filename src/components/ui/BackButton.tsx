'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <div className="sticky top-20 z-40 px-4 pt-4 pb-2 pointer-events-none">
      <div className="pointer-events-auto inline-block">
        <button onClick={() => router.back()} className="text-sm font-medium text-secondary hover:text-accent underline underline-offset-4 transition-colors duration-300">
          ← Back
        </button>
      </div>
    </div>
  )
}
