'use client'

import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) { setErrorMessage('Please enter a valid email address.'); setStatus('error'); return }
    setStatus('loading'); setErrorMessage('')
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      setStatus('success'); setEmail('')
    } catch { setStatus('error'); setErrorMessage('Something went wrong. Please try again.') }
  }

  return (
    <section className="py-24 container mx-auto px-6">
      <div className="max-w-4xl mx-auto bg-card text-primary p-12 md:p-20 rounded-xl relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[100px]" />
        <div className="relative z-10 text-center">
          <h3 className="font-headline text-4xl md:text-5xl mb-6">Join the Circle</h3>
          <p className="text-secondary mb-10 max-w-md mx-auto">Get early access to limited edition drops and stories from our workshop.</p>
          {status === 'success' ? (
            <p className="font-vintage text-h3 italic text-primary">You&apos;re on the list ✦</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" disabled={status === 'loading'} aria-label="Email address for newsletter" className="flex-1 bg-transparent border-b border-secondary/30 py-3 focus:outline-none focus:border-accent transition-colors duration-300 placeholder:text-secondary disabled:opacity-50" />
              <button type="submit" disabled={status === 'loading'} className="bg-accent text-accent-fg px-8 py-3 rounded-md font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity disabled:opacity-50">{status === 'loading' ? 'Subscribing...' : 'Subscribe'}</button>
              {status === 'error' && (<p className="text-error text-body-sm mt-2">{errorMessage}</p>)}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
