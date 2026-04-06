'use client'

import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react'
import { useCartStore } from '@/store/cartStore'

interface ShippingForm { name: string; email: string; phone: string; address: string; city: string; province: string; postal: string; notes: string }
interface FormErrors { [key: string]: string }
type SubmissionStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error'

const STORAGE_KEY = 'mmwafrika-checkout-form'
const INITIAL_FORM: ShippingForm = { name: '', email: '', phone: '', address: '', city: '', province: '', postal: '', notes: '' }

export default function CheckoutForm() {
  const [form, setForm] = useState<ShippingForm>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const feedbackRef = useRef<HTMLDivElement>(null)
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => { try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) { const parsed = JSON.parse(saved) as ShippingForm; const isPristine = Object.values(INITIAL_FORM).every((v) => v === ''); if (isPristine) setForm(parsed) } } catch {} }, [])
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)) } catch {} }, [form])
  useEffect(() => { if (status === 'success' || status === 'error') { if (feedbackRef.current) feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }) } }, [status])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = 'Full name is required'
    if (!form.email.trim() || !form.email.includes('@')) newErrors.email = 'Please enter a valid email address'
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!form.address.trim()) newErrors.address = 'Street address is required'
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!form.postal.trim()) newErrors.postal = 'Postal code is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) { setErrors((prev) => { const next = { ...prev }; delete next[name]; return next }) }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setStatus('validating')
    const isValid = validate()
    if (!isValid) { setStatus('idle'); return }
    try {
      setStatus('submitting')
      await new Promise((resolve) => setTimeout(resolve, 1200))
      clearCart()
      try { localStorage.removeItem(STORAGE_KEY) } catch {}
      setStatus('success')
    } catch { setErrorMessage('Something went wrong while processing your order. Please try again.'); setStatus('error') }
  }

  const isDisabled = status === 'submitting'

  if (status === 'success') {
    return (
      <div ref={feedbackRef} className="border-stitch rounded-xl p-12 text-center bg-surface-container-lowest transition-colors duration-300">
        <svg className="w-16 h-16 mx-auto text-success mb-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
        <h2 className="font-vintage text-h2 italic text-primary mb-4">Details Received</h2>
        <p className="text-body-md text-on-surface-variant max-w-sm mx-auto mb-2">Your shipping information has been saved and your cart has been cleared.</p>
        <p className="font-bhineka text-h2 text-secondary max-w-sm mx-auto">Your piece is being prepared with love</p>
      </div>
    )
  }

  const fields: { name: keyof ShippingForm; label: string; type?: string; optional?: boolean }[] = [
    { name: 'name', label: 'Full Name' }, { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'phone', label: 'Phone Number', type: 'tel' }, { name: 'address', label: 'Street Address' },
    { name: 'city', label: 'City' }, { name: 'province', label: 'Province', optional: true },
    { name: 'postal', label: 'Postal Code' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <h2 className="font-vintage text-h2 italic text-primary">Shipping Details</h2>
      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label htmlFor={field.name} className="text-label uppercase tracking-wide text-primary">{field.label}{field.optional && (<span className="text-on-surface-variant font-normal normal-case tracking-normal ml-1">(optional)</span>)}</label>
            <input id={field.name} name={field.name} type={field.type || 'text'} value={form[field.name]} onChange={handleChange} placeholder={field.label} autoComplete={field.name} disabled={isDisabled} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} className={`w-full bg-surface-container-low border rounded-md px-4 py-3 text-body-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed ${errors[field.name] ? 'border-error' : 'border-border focus:border-accent'} placeholder:text-on-surface-variant/40`} />
            {errors[field.name] && (<p id={`${field.name}-error`} className="text-body-sm text-error flex items-center gap-1" role="alert"><svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>{errors[field.name]}</p>)}
          </div>
        ))}
        <div className="space-y-2">
          <label htmlFor="notes" className="text-label uppercase tracking-wide text-primary">Order Notes<span className="text-on-surface-variant font-normal normal-case tracking-normal ml-1">(optional)</span></label>
          <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Special instructions for your order..." rows={3} disabled={isDisabled} className="w-full bg-surface-container-low border border-border rounded-md px-4 py-3 text-body-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-on-surface-variant/40 resize-none" />
        </div>
      </div>
      <button type="submit" disabled={isDisabled} className={`w-full py-5 text-label font-bold uppercase rounded-md crochet-shadow transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 bg-accent text-accent-fg hover:opacity-90`}>
        {status === 'submitting' ? 'Processing...' : status === 'validating' ? 'Checking details…' : 'Continue to Payment'}
      </button>
      <p className="text-center text-body-sm text-on-surface-variant">Payment integration coming in the next phase.</p>
      {status === 'error' && (
        <div ref={feedbackRef} className="border border-error/50 bg-error-container/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
            <div><p className="text-body-md font-medium text-error">{errorMessage}</p><button type="button" onClick={() => setStatus('idle')} className="text-body-sm text-on-error-container mt-2 underline hover:no-underline">Try again</button></div>
          </div>
        </div>
      )}
    </form>
  )
}
