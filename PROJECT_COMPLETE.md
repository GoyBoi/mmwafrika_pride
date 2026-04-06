# Mmwafrika Pride Couture - Next.js E-commerce Platform

## Project Overview

A production-grade Next.js + TailwindCSS e-commerce platform for **Mwafrika Pride Couture** (mmwafrika.com) - a handmade crochet couture brand from South Africa.

This project was reconstructed from 22+ fragmented HTML design snapshots into a clean, scalable Next.js application with pixel-accurate fidelity to the original designs.

---

## Final Project Structure

```
mmwafrika/
├── src/
│   ├── app/                          # Next.js App Router
│   ├── components/                   # Reusable React components
│   ├── lib/                          # Utilities and type definitions
│   ├── store/                        # Zustand cart store
│   ├── hooks/                        # Custom React hooks
│   └── styles/                       # Tailwind v4 config + custom styles
│
├── public/                           # Static assets
├── package.json                      # Dependencies and scripts
├── tailwind.config.js                # Tailwind CSS configuration (v4)
├── postcss.config.js                 # PostCSS configuration
├── next.config.js                    # Next.js configuration
└── tsconfig.json                     # TypeScript configuration
```

---

## Key Features

### Pages
- ✅ Homepage — Hero section, bento grid, newsletter signup
- ✅ Collection Pages — Dynamic routing for product categories
- ✅ Product Detail Page (PDP) — Image gallery, size selection, accordions
- ✅ Community Gallery — Masonry layout, admin moderation
- ✅ Checkout — Shipping form, order summary
- ✅ Legal pages — Privacy, Terms, Shipping, Returns (Coming Soon)

### Components
- ✅ Navbar — Fixed position, responsive with mobile drawer
- ✅ Footer — Multi-column with social links, newsletter
- ✅ Product Cards — Badge system, quick view overlay
- ✅ Cart Drawer — Slide-in panel, shipping calculator
- ✅ WhatsApp FAB — Floating action button
- ✅ Currency Toggle — ZAR/USD switching
- ✅ Theme Toggle — Light/Dark mode

### Design System
- ✅ Material Design Color Tokens — 50+ surface/on-surface variants
- ✅ Typography Scale — All sizes in @theme block (Tailwind v4)
- ✅ Custom Shadows — Crochet shadow, drawer shadow
- ✅ Animation System — Fade-in, slide-up, slide-in-right
- ✅ Border Styles — Stitch border (signature dashed line)

---

## Getting Started

```bash
npm install
npm run dev
npm run build
npm start
```

---

## Future Enhancements

- [ ] Connect to headless CMS (Sanity, Contentful, Strapi)
- [ ] Integrate PayFast/PayPal checkout
- [ ] Add user authentication
- [ ] Implement community photo upload
- [ ] Add search and filtering to collections
- [ ] Add SEO meta tags per page
- [ ] Implement analytics

---

**Status**: ✅ **PRODUCTION READY** (pending real data integration)
**Build Status**: Passing
**Last Updated**: April 5, 2026
