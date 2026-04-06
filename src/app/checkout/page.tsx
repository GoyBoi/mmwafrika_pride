import { Metadata } from 'next'
import CheckoutClient from './CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout | MmwAfrika Pride Couture',
  description: 'Complete your order of handcrafted crochet couture.',
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
