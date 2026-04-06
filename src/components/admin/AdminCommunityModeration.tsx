'use client'

import { useState } from 'react'
import Image from 'next/image'

interface CommunityPhoto { id: string; src: string; alt: string; caption: string; location: string }

const mockPhotos: CommunityPhoto[] = [
  { id: '1', src: '/images/placeholders/product/default.svg', alt: 'Person holding custom crochet bag', caption: 'Onalenna with her Custom Bag', location: 'Pretoria, SA' },
  { id: '2', src: '/images/placeholders/product/default.svg', alt: 'Interior home with crochet throw', caption: 'Living in Layers', location: 'Cape Town, SA' },
  { id: '3', src: '/images/placeholders/product/default.svg', alt: 'Child with crochet toy', caption: 'First Friends', location: 'Johannesburg, SA' },
  { id: '4', src: '/images/placeholders/product/default.svg', alt: 'Crochet detail on outfit', caption: 'Texture & Light', location: 'Durban, SA' },
  { id: '5', src: '/images/placeholders/product/default.svg', alt: 'Smiling artisan community', caption: 'The Hands Behind the Pride', location: 'Artisan Collective' },
  { id: '6', src: '/images/placeholders/product/default.svg', alt: 'Dog with crochet collar', caption: 'Even for the Little Ones', location: 'Pet Series' },
]

export default function AdminCommunityModeration() {
  const [photos] = useState<CommunityPhoto[]>(mockPhotos)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-headline text-2xl italic mb-2">Community Photo Moderation</h2>
        <p className="text-sm text-on-surface-variant">Approve or reject submitted photos before they appear in the public gallery.</p>
      </div>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
        {photos.map((photo) => (
          <div key={photo.id} className="break-inside-avoid mb-8 group relative">
            <div className="bg-surface-container-lowest rounded-lg p-3 transition-colors duration-300">
              <Image src={photo.src} alt={photo.alt} width={600} height={450} className="rounded-lg mb-4" />
              <div className="px-2 pb-2">
                <p className="font-headline italic text-lg text-primary">{photo.caption}</p>
                <p className="text-xs font-label uppercase tracking-tighter text-on-surface-variant mt-1">{photo.location}</p>
              </div>
            </div>
            <div className="absolute top-6 right-6 flex flex-col gap-2">
              <button className="p-2 bg-surface-container-lowest/90 backdrop-blur rounded-full text-success hover:bg-success-container transition-colors shadow-sm" aria-label={`Approve photo: ${photo.caption}`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
              </button>
              <button className="p-2 bg-surface-container-lowest/90 backdrop-blur rounded-full text-error hover:bg-error-container transition-colors shadow-sm" aria-label={`Reject photo: ${photo.caption}`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
