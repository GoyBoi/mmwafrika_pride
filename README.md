# Mwafrika Pride Couture

> Handmade crochet couture, plushies, and blankets crafted with care in South Africa.

A production-grade Next.js + TailwindCSS e-commerce platform for Mwafrika Pride Couture.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Package Manager**: npm
- **Font Loading**: next/font (Noto Serif, Inter)
- **Image Optimization**: next/image (WebP/AVIF)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                      # Next.js App Router
├── components/               # Reusable React components
│   ├── layout/               # Navbar, Footer, MobileMenu
│   ├── product/              # HeroSection, BentoGrid, ProductCard, ProductGrid
│   ├── cart/                 # CartDrawer
│   ├── checkout/             # CheckoutForm, OrderSummary
│   ├── admin/                # AdminCommunityModeration
│   └── ui/                   # BackButton, CurrencyToggle, ThemeToggle, WhatsAppFAB, NewsletterSection
├── lib/                      # Utilities, types, constants, API
├── store/                    # Zustand cart store
├── hooks/                    # useTheme
└── styles/                   # globals.css (Tailwind v4 @theme)
```

## Design System

### Typography
All font sizes are defined in the `@theme` block of `globals.css`:

| Token | Size | Usage |
|-------|------|-------|
| `text-display-xl` | clamp(3.5rem, 6vw, 4.5rem) | Hero headlines |
| `text-display-lg` | clamp(2.5rem, 5vw, 3.5rem) | Accent phrases |
| `text-h1` | clamp(2.25rem, 4vw, 3rem) | Page titles |
| `text-h2` | clamp(1.75rem, 3vw, 2.25rem) | Section headers |
| `text-h3` | clamp(1.5rem, 2.5vw, 1.75rem) | Sub-sections |
| `text-body-md` | 1rem | Standard body |
| `text-body-sm` | 0.875rem | Secondary text |
| `text-label` | 0.75rem | Uppercase labels |
| `text-price` | 1.25rem | Pricing |

### 3-Tier Font System

| Font | Role | Usage |
|------|------|-------|
| **Inter / Noto Serif** | Default — 95% of UI | Product names, body, buttons, inputs, nav |
| **Bhineka** | Emotional accent | Short phrases only (max 6 words) |
| **Vintage** | Editorial accent | Section headers and decorative titles |

## License

MIT © Mwafrika Pride Couture
