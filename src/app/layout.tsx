import type { Metadata } from 'next'
import { Noto_Serif, Inter } from 'next/font/google'
import localFont from 'next/font/local'
import '@/styles/globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppFAB from '@/components/ui/WhatsAppFAB'
import EnvironmentProvider from '@/components/layout/EnvironmentProvider'
import CartDrawer from '@/components/cart/CartDrawer'

const bhineka = localFont({
  src: [{ path: '../fonts/Bhineka.woff2', weight: '400', style: 'normal' }],
  variable: '--font-bhineka',
  display: 'swap',
  preload: true,
})

const vintage = localFont({
  src: [{ path: '../fonts/Vintage.woff2', weight: '400', style: 'normal' }],
  variable: '--font-vintage',
  display: 'swap',
  preload: true,
})

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
  weight: ['400', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'MmwAfrika Pride Couture | Handmade Crochet South Africa',
    template: '%s | MmwAfrika Pride Couture',
  },
  description: 'Unique crochet couture, plushies, and blankets crafted with 100% care in South Africa. Shipping Worldwide.',
  keywords: ['crochet', 'handmade', 'South Africa', 'couture', 'plushies', 'blankets', 'sustainable fashion'],
  authors: [{ name: 'MmwAfrika Pride Couture' }],
  creator: 'MmwAfrika Pride Couture',
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://mmwafrika.com',
    title: 'MmwAfrika Pride Couture | Handmade Crochet South Africa',
    description: 'Unique crochet couture, plushies, and blankets crafted with 100% care in South Africa. Shipping Worldwide.',
    siteName: 'MmwAfrika Pride Couture',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MmwAfrika Pride Couture',
    description: 'Unique crochet couture, plushies, and blankets crafted with 100% care in South Africa.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${notoSerif.variable} ${inter.variable} ${bhineka.variable} ${vintage.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Synchronous theme detection — must block paint to prevent FOUC */}
        <script src="/theme-init.js" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-bg text-primary transition-colors duration-300">
        <EnvironmentProvider />
        <Navbar />
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
        <WhatsAppFAB />
        <CartDrawer />
      </body>
    </html>
  )
}
