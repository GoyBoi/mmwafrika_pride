import BackButton from '@/components/ui/BackButton'
import Image from 'next/image'

interface CommunityPhoto {
  id: string
  src: string
  alt: string
  caption: string
  location: string
}

const mockPhotos: CommunityPhoto[] = [
  { id: '1', src: '/images/placeholders/product/default.svg', alt: 'Person holding custom crochet bag', caption: 'Onalenna with her Custom Bag', location: 'Pretoria, SA' },
  { id: '2', src: '/images/placeholders/product/default.svg', alt: 'Interior home with crochet throw', caption: 'Living in Layers', location: 'Cape Town, SA' },
  { id: '3', src: '/images/placeholders/product/default.svg', alt: 'Child with crochet toy', caption: 'First Friends', location: 'Johannesburg, SA' },
  { id: '4', src: '/images/placeholders/product/default.svg', alt: 'Crochet detail on outfit', caption: 'Texture & Light', location: 'Durban, SA' },
  { id: '5', src: '/images/placeholders/product/default.svg', alt: 'Smiling artisan community', caption: 'The Hands Behind the Pride', location: 'Artisan Collective' },
  { id: '6', src: '/images/placeholders/product/default.svg', alt: 'Dog with crochet collar', caption: 'Even for the Little Ones', location: 'Pet Series' },
]

export default function CommunityPage() {
  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <BackButton />
      <section className="mb-20 text-center flex flex-col items-center">
        <h1 className="font-headline text-5xl md:text-7xl italic mb-6 text-primary">Community Pride</h1>
        <p className="max-w-2xl text-on-surface-variant text-lg font-light leading-relaxed mb-10">A living tapestry of woven stories. Share how your MmwAfrika heirlooms have found their place in your home and heart.</p>
        <button className="bg-primary text-bg px-8 py-4 rounded-md font-medium tracking-wide crochet-shadow hover:opacity-90 transition-all flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
          Share Your Pride
        </button>
      </section>
      <section className="columns-1 md:columns-2 lg:columns-3 gap-8">
        {mockPhotos.map((photo) => (
          <div key={photo.id} className="break-inside-avoid mb-8 group relative">
            <div className="bg-surface-container-lowest rounded-lg p-3 transition-all hover:crochet-shadow">
              <Image src={photo.src} alt={photo.alt} width={600} height={450} className="rounded-lg mb-4" />
              <div className="px-2 pb-2">
                <p className="font-headline italic text-lg text-primary">{photo.caption}</p>
                <p className="text-xs font-label uppercase tracking-tighter text-on-surface-variant mt-1">{photo.location}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className="mt-32 pt-20 border-t border-dashed border-outline-variant/30 text-center">
        <h2 className="font-headline text-3xl italic mb-6">Want to be featured?</h2>
        <p className="text-on-surface-variant mb-10 max-w-lg mx-auto">Tag us on Instagram @MmwAfrikaPride or upload your photo directly here to join our global family.</p>
        <button className="border-2 border-accent text-accent px-10 py-4 font-semibold uppercase tracking-widest text-xs hover:bg-accent hover:text-accent-fg transition-all duration-300">View Gallery Guidelines</button>
      </section>
    </main>
  )
}
