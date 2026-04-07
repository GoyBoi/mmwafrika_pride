# SYSTEM FORENSIC AUDIT — MmwAfrika Pride Couture

**Audit Date:** 7 April 2026
**Codebase:** Next.js 16.2.2 + React 19.2.4 + Zustand 5.0.12 + Tailwind CSS 4.2.2
**Auditor Mode:** Forensic Analysis — Zero Assumptions — No Fixes
**Confidence:** High (all source files read and analyzed)

---

# 🔍 SECTION 1 — GLOBAL ARCHITECTURE MAP

## 1.1 Full Folder Structure

```
mmwafrika/
├── next.config.js                  # Image optimization config (avif/webp, remote patterns)
├── tailwind.config.js              # Theme tokens mapped to CSS custom properties
├── postcss.config.js               # Tailwind v4 + autoprefixer
├── tsconfig.json                   # Strict mode, path alias @/* → src/*
├── package.json                    # 4 deps: next, react, react-dom, zustand
├── .gitignore
├── public/
│   └── theme-init.js               # Sync IIFE: reads localStorage, applies .dark class (blocks paint)
├── src/
│   ├── app/                        # Next.js App Router (all page routes)
│   │   ├── layout.tsx              # Root layout (Server Component) — wraps EVERY page
│   │   ├── page.tsx                # Home page (Server) — HeroSection + BentoGrid + NewsletterSection
│   │   ├── not-found.tsx           # Custom 404 (Server)
│   │   ├── about/page.tsx          # Placeholder (Server)
│   │   ├── admin/page.tsx          # Admin gate via isAdmin flag (Server)
│   │   ├── checkout/
│   │   │   ├── page.tsx            # Server wrapper, metadata export
│   │   │   └── CheckoutClient.tsx  # Client component — actual checkout UI
│   │   ├── collections/
│   │   │   ├── page.tsx            # Placeholder (Server)
│   │   │   └── [category]/
│   │   │       ├── page.tsx        # Category listing (Server, fetches from mock API)
│   │   │       └── loading.tsx     # Skeleton (Server)
│   │   ├── community/page.tsx      # Masonry photo grid, mock data (Server)
│   │   ├── contact/page.tsx        # Placeholder (Server)
│   │   ├── custom-orders/page.tsx  # Placeholder (Server)
│   │   ├── pets/page.tsx           # Placeholder (Server)
│   │   ├── privacy/page.tsx        # Placeholder (Server)
│   │   ├── products/[slug]/
│   │   │   ├── page.tsx            # Product detail (Server, fetches from mock API)
│   │   │   └── loading.tsx         # Skeleton (Server)
│   │   ├── returns/page.tsx        # Placeholder (Server)
│   │   ├── shipping/page.tsx       # Placeholder (Server)
│   │   └── terms/page.tsx          # Placeholder (Server)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── EnvironmentProvider.tsx   # 'use client' — toggles env-pets body class
│   │   │   ├── Navbar.tsx               # 'use client' — fixed header, cart/menu triggers
│   │   │   ├── MobileMenu.tsx           # 'use client' — portal'd slide-out nav
│   │   │   └── Footer.tsx               # Server Component — static footer
│   │   ├── cart/
│   │   │   └── CartDrawer.tsx           # 'use client' — portal'd slide-out cart
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx         # 'use client' — shipping form with localStorage persistence
│   │   │   └── OrderSummary.tsx         # 'use client' — pure presentational order summary
│   │   ├── product/
│   │   │   ├── ProductGrid.tsx          # Server Component — grid layout for cards
│   │   │   ├── ProductCard.tsx          # Server Component — single product card
│   │   │   ├── HeroSection.tsx          # Server Component — homepage hero
│   │   │   ├── BentoGrid.tsx            # Server Component — homepage bento layout
│   │   │   └── ProductControls.tsx      # 'use client' — size select, add-to-cart, currency toggle
│   │   ├── admin/
│   │   │   └── AdminCommunityModeration.tsx  # 'use client' — mock moderation UI (stub)
│   │   ├── debug/
│   │   │   └── OverlayDebugPanel.tsx    # 'use client' — dev-only state inspector
│   │   └── ui/
│   │       ├── WhatsAppFAB.tsx          # 'use client' — floating action button
│   │       ├── ThemeToggle.tsx          # 'use client' — light/dark toggle
│   │       ├── CurrencyToggle.tsx       # 'use client' — ZAR/USD toggle
│   │       ├── BackButton.tsx           # 'use client' — router.back()
│   │       └── NewsletterSection.tsx    # 'use client' — email subscribe (mock)
│   ├── hooks/
│   │   └── useTheme.ts                  # 'use client' — theme state, localStorage sync, rAF batching
│   ├── lib/
│   │   ├── api/products.ts              # Mock product data (4 products) + async filter/fetch functions
│   │   ├── auth.ts                      # Temporary: export const isAdmin = false
│   │   ├── constants.ts                 # Brand info, nav, footer, currencies, shipping, badges, breakpoints
│   │   ├── types.ts                     # All TypeScript interfaces (Product, CartItem, etc.)
│   │   ├── utils.ts                     # Price formatting, currency conversion, path helpers, slugify, etc.
│   │   └── utils/formatPrice.ts         # Alternative price formatter (Intl.NumberFormat, integer-only ZAR)
│   ├── store/
│   │   ├── cartStore.ts                 # Zustand + persist middleware (localStorage key: mmwafrika-cart)
│   │   └── overlayStore.ts              # Zustand — activeOverlay, body scroll lock (ref-counted)
│   ├── styles/
│   │   └── globals.css                  # ALL CSS — @theme vars, .dark overrides, @layer base/components/utilities
│   └── fonts/
│       ├── Bhineka.woff2                # Local display font
│       └── Vintage.woff2                # Local display font
└── Custom fonts/                       # (external directory, not imported by build)
└── Custom SVGs/                        # (external directory, not imported by build)
└── Docs/                               # (external directory, not imported by build)
```

## 1.2 Architectural Layers

| Layer | Components | Responsibility |
|-------|-----------|----------------|
| **UI Layer** | ProductCard, ProductGrid, HeroSection, BentoGrid, Footer, NewsletterSection, OrderSummary, AdminCommunityModeration, BackButton | Rendering-only (mostly Server Components) or pure presentation |
| **State Layer** | cartStore, overlayStore, useTheme hook, CheckoutForm internal state | Zustand stores + React useState for ephemeral UI state |
| **Layout Layer** | layout.tsx, Navbar, MobileMenu, CartDrawer, EnvironmentProvider | Structural wrapping, fixed positioning, portal management |
| **Utility Layer** | utils.ts, formatPrice.ts, constants.ts, types.ts | Pure functions, constants, type definitions |

## 1.3 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         layout.tsx (Server)                      │
│  ┌─────────────┐  ┌──────────┐  ┌───────────┐  ┌────────────┐  │
│  │Environment  │→ │ Navbar   │  │  Footer   │  │ WhatsAppFAB│  │
│  │Provider     │  │(Client)  │  │ (Server)  │  │ (Client)   │  │
│  └─────────────┘  └────┬─────┘  └───────────┘  └────────────┘  │
│                        │                                        │
│  ┌─────────────────────┼──────────────────────────────────────┐ │
│  │  Zustand Stores    │←─── Both stores consumed here         │ │
│  │  ┌──────────────┐  │  ┌────────────────┐                   │ │
│  │  │  cartStore   │  │  │  overlayStore  │                   │ │
│  │  │ (persisted)  │  │  │  (ephemeral)   │                   │ │
│  │  └──────┬───────┘  │  └───────┬────────┘                   │ │
│  │         │           │          │                             │ │
│  │  ┌──────┴───────────┴──────────┴──────────────────────────┐│ │
│  │  │  CartDrawer (Client, Portal) ← reads BOTH stores       ││ │
│  │  │  MobileMenu (Client, Portal) ← reads overlayStore       ││ │
│  │  │  ProductControls (Client) ← reads cartStore+overlayStore││ │
│  │  │  CurrencyToggle (Client) ← reads cartStore              ││ │
│  │  │  WhatsAppFAB (Client) ← reads overlayStore              ││ │
│  │  │  Navbar (Client) ← reads BOTH stores                    ││ │
│  │  └────────────────────────────────────────────────────────┘│ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  children → page.tsx → [slug]/page.tsx → [category]/page.tsx│ │
│  │  (All Server Components; fetch from mock API in lib/api/)   │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 1.4 Server vs Client Boundary

| Boundary | Type | Details |
|----------|------|---------|
| `layout.tsx` | Server | Imports Client components (Navbar, CartDrawer, etc.) — valid boundary |
| All `page.tsx` files | Server | No `'use client'` directive |
| `ProductControls.tsx` | Client | Interactivity boundary (size select, add-to-cart) |
| `CartDrawer.tsx` | Client | Overlay, portal, user interaction |
| `MobileMenu.tsx` | Client | Overlay, portal, focus trap |
| `Navbar.tsx` | Client | Active route detection, overlay triggers |
| `CheckoutClient.tsx` | Client | Form state, cart snapshot |
| `CheckoutForm.tsx` | Client | Form validation, localStorage persistence |
| `OrderSummary.tsx` | Client | Pure presentational (could be Server) |
| `ThemeToggle.tsx` | Client | Theme consumption |
| `CurrencyToggle.tsx` | Client | Currency consumption |
| `WhatsAppFAB.tsx` | Client | Overlay-aware FAB |
| `EnvironmentProvider.tsx` | Client | Body class side-effect |
| `OverlayDebugPanel.tsx` | Client | Dev-only inspector |

## 1.5 Rendering: SSR vs CSR

| Component | SSR | CSR | Notes |
|-----------|-----|-----|-------|
| layout.tsx | ✓ | — | Server renders shell; children hydrate client components |
| page.tsx (all) | ✓ | — | Pure SSR |
| Navbar | — | ✓ | Hydrates with mounted state; cart badge shows after mount |
| Footer | ✓ | — | Fully static |
| CartDrawer | — | ✓ | Portal'd; renders null until `mounted && isOpen` |
| MobileMenu | — | ✓ | Portal'd; renders null until `mounted && isOpen` |
| ProductControls | — | ✓ | Interactive size/cart controls |
| ProductCard | ✓ | — | Static |
| ProductGrid | ✓ | — | Static |
| WhatsAppFAB | — | ✓ | Conditional `tabIndex` and `pointer-events-none` based on overlay state |
| ThemeToggle | — | ✓ | Skeleton until mounted |
| CurrencyToggle | — | ✓ | Reads from persisted store |
| CheckoutForm | — | ✓ | Restores form from localStorage on mount |
| OrderSummary | — | ✓ | Pure display (unnecessarily client) |

## 1.6 Entry Points

1. **Primary:** `src/app/layout.tsx` → root layout wrapping all routes
2. **Route entry points:** Every `page.tsx` under `src/app/`
3. **Client hydration entry points:** All `'use client'` components auto-hydrate when mounted

## 1.7 Wrapping Hierarchy

```
<html className={font-variables}>
  <head>
    <script src="/theme-init.js" />          ← Sync theme detection (blocks paint)
  </head>
  <body>
    <EnvironmentProvider />                  ← Side-effect: env-pets body class
    <Navbar />                               ← Fixed header (z-50)
    <main className="flex-grow pt-20">
      {children}                             ← Page content
    </main>
    <Footer />                               ← Static footer
    <WhatsAppFAB />                          ← Fixed FAB (z-20)
    <CartDrawer />                           ← Portal'd to body (z-60 panel, z-55 backdrop)
    <OverlayDebugPanel />                    ← Dev-only fixed panel (z-[9999])
  </body>
</html>
```

## 1.8 Globally Mounted Components

These components are **always rendered** in the root layout (regardless of route):

| Component | Type | Always Present? |
|-----------|------|----------------|
| `EnvironmentProvider` | Client | Yes (renders null, side-effect only) |
| `Navbar` | Client | Yes (fixed header on every page) |
| `Footer` | Server | Yes (static footer on every page) |
| `WhatsAppFAB` | Client | Yes (FAB always in DOM, conditionally disabled) |
| `CartDrawer` | Client | Yes (portal'd, but conditionally visible) |
| `OverlayDebugPanel` | Client | Yes (conditionally null in production) |
| `MobileMenu` (inside Navbar) | Client | Yes (portal'd, but conditionally visible) |

---

# 🔍 SECTION 2 — COMPONENT RELATIONSHIP GRAPH

## 2.1 Complete Component Tree

```
Root Layout (Server)
│
├── EnvironmentProvider (Client)
│   └── [renders null — body class side-effect]
│
├── Navbar (Client)
│   ├── CurrencyToggle (Client)
│   │   └── reads: cartStore.currency
│   ├── ThemeToggle (Client)
│   │   └── reads: useTheme()
│   ├── Cart Button (inline)
│   │   └── reads: cartStore.getTotalItems(), overlayStore
│   │   └── writes: overlayStore.openOverlay('cartDrawer') / closeOverlay()
│   ├── Mobile Menu Button (inline)
│   │   └── writes: overlayStore.openOverlay('mobileMenu') / closeOverlay()
│   └── MobileMenu (Client) [always rendered as sibling, portal'd]
│       ├── CurrencyToggle (Client)
│       ├── ThemeToggle (Client)
│       └── Portal → document.body
│           ├── Backdrop (click → closeOverlay)
│           └── <aside> panel (focus trap, Escape close)
│               └── NAV_LINKS.map(Link → closeOverlay on click)
│
├── main
│   └── {children}
│       │
│       ├── page.tsx (/)
│       │   ├── HeroSection (Server)
│       │   ├── BentoGrid (Server)
│       │   └── NewsletterSection (Client)
│       │
│       ├── /products/[slug]/page.tsx (Server)
│       │   ├── BackButton (Client)
│       │   ├── Breadcrumb nav
│       │   ├── Image gallery (sticky)
│       │   ├── ProductControls (Client)
│       │   │   ├── Size selector (local state)
│       │   │   ├── Currency toggle (cartStore)
│       │   │   └── Add to Bag button → cartStore.addItem + overlayStore.openOverlay
│       │   └── Accordion <details> sections
│       │
│       ├── /collections/[category]/page.tsx (Server)
│       │   ├── BackButton (Client)
│       │   └── ProductGrid (Server)
│       │       └── ProductCard × N (Server)
│       │
│       ├── /checkout/page.tsx → CheckoutClient (Client)
│       │   ├── CheckoutForm (Client)
│       │   │   └── localStorage form persistence
│       │   └── OrderSummary (Client)
│       │       └── Pure presentational
│       │
│       ├── /admin/page.tsx (Server)
│       │   └── AdminCommunityModeration (Client)
│       │       └── Mock data only; approve/reject buttons are stubs
│       │
│       └── [... other routes] — mostly placeholders
│
├── Footer (Server)
│   └── Static: brand info, FOOTER_LINKS, SOCIAL icons
│
├── WhatsAppFAB (Client)
│   └── reads: overlayStore.isAnyOpen() → disables when overlay open
│
├── CartDrawer (Client) [portal'd to document.body]
│   ├── Backdrop (click → closeOverlay)
│   └── <aside> panel
│       ├── reads: cartStore.items, cartStore.currency
│       ├── reads: overlayStore.activeOverlay
│       ├── removeItem → cartStore.removeItem
│       ├── updateQuantity → cartStore.updateQuantity
│       ├── Checkout button → router.push('/checkout')
│       └── Focus trap + Escape close
│
└── OverlayDebugPanel (Client)
    └── Dev-only: reads overlayStore, cartStore, DOM state
```

## 2.2 Component Relationship Table

| Component | Parent | Children | Reused? | Coupling | Global State? |
|-----------|--------|----------|---------|----------|---------------|
| EnvironmentProvider | layout.tsx | none | No | Loose | No (body class only) |
| Navbar | layout.tsx | CurrencyToggle, ThemeToggle, MobileMenu | No | **Tight** (reads both stores) | cartStore, overlayStore |
| MobileMenu | Navbar | CurrencyToggle, ThemeToggle, Portal content | No | **Tight** (reads overlayStore) | overlayStore |
| Footer | layout.tsx | none | No | Loose | No |
| WhatsAppFAB | layout.tsx | none | No | Medium (reads overlayStore) | overlayStore |
| CartDrawer | layout.tsx | Portal content | No | **Tight** (reads both stores) | cartStore, overlayStore |
| OverlayDebugPanel | layout.tsx | none | No | Medium (reads both stores) | cartStore, overlayStore |
| ProductControls | products/[slug]/page.tsx | none | Yes (any product page) | **Tight** (reads both stores) | cartStore, overlayStore |
| ProductGrid | collections/[category]/page.tsx | ProductCard × N | Yes | Loose | No |
| ProductCard | ProductGrid | none | Yes | Loose | No |
| HeroSection | page.tsx (/) | none | No | Loose | No |
| BentoGrid | page.tsx (/) | none | No | Loose | No |
| NewsletterSection | page.tsx (/) | none | No | Loose | No (local state only) |
| CheckoutClient | checkout/page.tsx | CheckoutForm, OrderSummary | No | Medium (reads cartStore) | cartStore |
| CheckoutForm | CheckoutClient | none | No | Medium (reads cartStore) | cartStore |
| OrderSummary | CheckoutClient | none | Yes (could be reused) | Loose | No (props only) |
| AdminCommunityModeration | admin/page.tsx | none | No | Loose | No (mock data) |
| BackButton | multiple pages | none | Yes | Loose | No (useRouter only) |
| CurrencyToggle | Navbar, MobileMenu, ProductControls | none | Yes (3 mount points) | Medium (reads cartStore) | cartStore |
| ThemeToggle | Navbar, MobileMenu | none | Yes (2 mount points) | Medium (reads useTheme) | useTheme hook |

## 2.3 Reuse Analysis

| Component | Mounted At | Instances |
|-----------|-----------|-----------|
| `CurrencyToggle` | Navbar (desktop), MobileMenu (mobile), ProductControls (product page) | **3 distinct mount points** |
| `ThemeToggle` | Navbar (desktop), MobileMenu (mobile) | **2 distinct mount points** |
| `BackButton` | products/[slug], collections/[category], contact, custom-orders, pets | **5 routes** |
| `ProductCard` | ProductGrid (dynamic N) | **Variable** |

---

# 🔍 SECTION 3 — STATE SYSTEM ANALYSIS

## 3.1 cartStore (`src/store/cartStore.ts`)

### State Shape
```typescript
{
  items: CartItem[],          // Cart line items
  currency: 'ZAR' | 'USD',    // Active display currency
}
```

### Actions
| Action | Input | Side Effect | Consumers |
|--------|-------|-------------|-----------|
| `addItem` | CartItem | Updates items array | ProductControls, CartDrawer |
| `removeItem` | productId, size? | Filters items | CartDrawer |
| `updateQuantity` | productId, size, quantity | Maps items; auto-removes if ≤0 | CartDrawer |
| `clearCart` | none | Empties items | CheckoutForm (on success) |
| `setCurrency` | 'ZAR' | 'USD' | Updates currency | CurrencyToggle, ProductControls |
| `getTotalItems` | — | Computes sum | Navbar (badge count) |
| `getTotalPriceZAR` | — | Computes ZAR total | CheckoutClient |
| `getTotalPriceUSD` | — | Computes USD total | — (defined but never consumed) |
| `getActiveCurrency` | — | Returns currency | — (defined but never consumed) |

### Persistence
- **Middleware:** `persist` from Zustand
- **Storage key:** `mmwafrika-cart`
- **Persisted fields:** `items` only (via `partialize`)
- **NOT persisted:** `currency` — resets to 'ZAR' on page reload

### Readers
| Component | Selector | Purpose |
|-----------|----------|---------|
| Navbar | `state.getTotalItems()` | Cart badge count |
| CartDrawer | `state.items` | Render line items |
| CartDrawer | `state.removeItem` | Remove handler |
| CartDrawer | `state.updateQuantity` | +/- handlers |
| CartDrawer | `state.currency` | Display currency |
| ProductControls | `state.addItem` | Add to cart |
| ProductControls | `state.currency` | Price display |
| ProductControls | `state.setCurrency` | Currency toggle |
| CurrencyToggle | `state.currency` | Active state display |
| CurrencyToggle | `state.setCurrency` | Toggle handler |
| CheckoutClient | `state.items` | Cart check + snapshot |
| CheckoutClient | `state.getTotalPriceZAR()` | Total calculation |
| CheckoutForm | `state.clearCart` | Clear on success |
| OverlayDebugPanel | `state.items.length` | Debug display |

### Writers
| Component | Action | Trigger |
|-----------|--------|---------|
| ProductControls | `addItem` | "Add to Bag" click |
| CartDrawer | `removeItem` | Trash icon click |
| CartDrawer | `updateQuantity` | +/- button click |
| CurrencyToggle | `setCurrency` | Toggle click |
| ProductControls | `setCurrency` | ZAR/USD button click |
| CheckoutForm | `clearCart` | Successful form submission |

### Issues Identified

1. **`getTotalPriceUSD` is defined but NEVER consumed** — dead code.
2. **`getActiveCurrency` is defined but NEVER consumed** — dead code. Components read `state.currency` directly instead.
3. **`currency` is NOT persisted** — user's currency preference resets on every page reload. Only `items` survive in localStorage.
4. **`addItem` always sets `currency: 'ZAR'`** on the CartItem regardless of active currency — the item's `currency` field is hardcoded. This is a data integrity issue: if user is viewing in USD and adds an item, the stored item still says `currency: 'ZAR'`.
5. **Race condition in `addItem`:** `setAdded(true)` → `setTimeout` → `openOverlay('cartDrawer')`. If the user navigates away before 1200ms, the `openOverlay` call still fires (stale timeout).

---

## 3.2 overlayStore (`src/store/overlayStore.ts`)

### State Shape
```typescript
{
  activeOverlay: 'mobileMenu' | 'cartDrawer' | null
}
```

### Actions
| Action | Input | Side Effect | Consumers |
|--------|-------|-------------|-----------|
| `openOverlay` | 'mobileMenu' | 'cartDrawer' | `lockBody()` → sets body overflow:hidden, position:fixed, width:100% |
| `closeOverlay` | none | `unlockBody()` → resets body styles | All overlay consumers |
| `isAnyOpen` | — | Returns boolean | WhatsAppFAB, OverlayDebugPanel |

### Scroll Lock Mechanism
- Uses `lockCount` (module-level variable, NOT in store state)
- `lockBody()`: increments lockCount; only locks when lockCount === 0
- `unlockBody()`: decrements lockCount; only unlocks when lockCount <= 0

### Readers
| Component | Selector | Purpose |
|-----------|----------|---------|
| Navbar | `s.activeOverlay` | Determine mobile menu open state |
| Navbar | `s.closeOverlay` | Auto-close on route change |
| Navbar | `s.openOverlay` | Cart/mobile menu open |
| CartDrawer | `s.activeOverlay` | Determine if open |
| CartDrawer | `s.closeOverlay` | Close handler |
| MobileMenu | `s.activeOverlay` | Determine if open |
| MobileMenu | `s.closeOverlay` | Close handler |
| ProductControls | `s.openOverlay` | Open cart after add |
| WhatsAppFAB | `s.isAnyOpen()` | Disable FAB when overlay open |
| OverlayDebugPanel | `s.activeOverlay` | Debug display |
| OverlayDebugPanel | `s.isAnyOpen()` | Debug display |

### Issues Identified

1. **`lockCount` is module-level state** — NOT part of Zustand store. This means:
   - It resets to 0 on module reload (HMR)
   - It cannot be serialized or debugged via DevTools
   - If HMR fires while overlay is open, lockCount resets but body remains locked → **permanent body lock**
   
2. **`lockBody()` sets `position: fixed` + `width: 100%`** — this causes the page to scroll back to top when locking. The scroll position is NOT saved or restored. **UX bug:** opening cart drawer from mid-page snaps user to top of page.

3. **`openOverlay` does NOT check if an overlay is already open** — if `mobileMenu` is open and `openOverlay('cartDrawer')` is called, it will:
   - Call `lockBody()` again (lockCount increments correctly)
   - Set `activeOverlay` to `'cartDrawer'`
   - But the `mobileMenu` portal is still rendered (it checks `activeOverlay === 'mobileMenu'` so it hides)
   - **However:** the MobileMenu's focus trap is still active in the DOM if cleanup didn't run. This creates a potential focus leak.

4. **`closeOverlay()` only closes ONE overlay** — if somehow two overlays are conceptually open (lockCount > 1), calling closeOverlay once only decrements lockCount. The next component that opens an overlay will re-lock the body.

5. **Excessive `console.log` statements** in overlayStore — production pollution.

6. **Single-overlay architecture** — the store only supports ONE active overlay at a time. If a future feature needs stacked overlays (e.g., confirmation dialog over cart), the architecture must be rewritten.

---

## 3.3 Theme State (`useTheme` hook)

### State Shape
```typescript
{
  theme: 'light' | 'dark',
  mounted: boolean,
  toggle: () => void,
}
```

### Mechanism
- `localStorage` key: `mmwafrika-theme`
- Sync IIFE in `theme-init.js` runs before paint to prevent FOUC
- `useTheme` re-reads from localStorage on mount
- Uses `requestAnimationFrame` to batch DOM updates
- `pendingTheme` ref prevents stale closures

### Readers
| Component | Usage |
|-----------|-------|
| ThemeToggle | Displays icon based on theme, calls toggle |
| layout.tsx (indirect) | theme-init.js script in head |

### Issues Identified

1. **Dual source of truth:** Theme is stored in localStorage AND applied to `document.documentElement.classList`. The `theme-init.js` IIFE applies `.dark` class, then `useTheme` reads from localStorage on mount and may re-apply. In practice they should match, but there's a window where they could diverge (e.g., user changes localStorage manually between IIFE and hook mount).

2. **No cleanup of stale `rafId`:** If the component unmounts before the rAF fires, `rafId.current` is set to null in the effect but the rAF callback still executes. It accesses `pendingTheme.current` which is still valid (ref), but `document.documentElement.classList.toggle` runs on an unmounted component's behalf.

---

## 3.4 State Duplication Map

| State | Source | Duplicate Location | Risk |
|-------|--------|-------------------|------|
| `currency` | cartStore.currency | ProductControls local price display logic | Medium (divergence if store updates but component doesn't re-render) |
| `theme` | useTheme hook + localStorage | theme-init.js IIFE | Low (intentional dual-source for FOUC prevention) |
| `shippingRegion` | CartDrawer local state | SHIPPING_REGIONS constant | Low (UI-only selection) |
| `form` | CheckoutForm local state | localStorage `mmwafrika-checkout-form` | Medium (stale form data if localStorage corrupted) |
| `activeOverlay` | overlayStore | Navbar's `isMobileMenuOpen` derived boolean | Low (derived, not duplicated) |

---

# 🔍 SECTION 4 — RENDERING LOGIC

## 4.1 Server Components

| File | Route | Notes |
|------|-------|-------|
| layout.tsx | All | Imports Client components — valid boundary |
| page.tsx | / | Composes HeroSection, BentoGrid, NewsletterSection |
| not-found.tsx | * | Custom 404 |
| about/page.tsx | /about | Placeholder |
| admin/page.tsx | /admin | isAdmin check |
| checkout/page.tsx | /checkout | Server wrapper only |
| collections/page.tsx | /collections | Placeholder |
| collections/[category]/page.tsx | /collections/[category] | Mock data fetch |
| collections/[category]/loading.tsx | /collections/[category] | Skeleton |
| community/page.tsx | /community | Mock photos |
| contact/page.tsx | /contact | Placeholder |
| custom-orders/page.tsx | /custom-orders | Placeholder |
| pets/page.tsx | /pets | Placeholder |
| privacy/page.tsx | /privacy | Placeholder |
| products/[slug]/page.tsx | /products/[slug] | Mock data fetch |
| products/[slug]/loading.tsx | /products/[slug] | Skeleton |
| returns/page.tsx | /returns | Placeholder |
| shipping/page.tsx | /shipping | Placeholder |
| terms/page.tsx | /terms | Placeholder |
| Footer.tsx | — | Static footer |
| ProductGrid.tsx | — | Server component grid |
| ProductCard.tsx | — | Server component card |
| HeroSection.tsx | — | Static hero |
| BentoGrid.tsx | — | Static bento layout |

## 4.2 Client Components

| File | Hydration Risk | Mount Guard |
|------|---------------|-------------|
| Navbar | Low | `mounted` state guards cart badge |
| MobileMenu | Medium | `mounted` state guards entire portal |
| CartDrawer | Medium | `mounted` state guards entire portal |
| ProductControls | Low | No mount guard needed (interactive only) |
| CheckoutClient | Low | `mounted` state guards empty cart view |
| CheckoutForm | Low | No mount guard |
| OrderSummary | Low | Pure presentational |
| WhatsAppFAB | Low | Always renders, conditionally styled |
| ThemeToggle | Low | `mounted` state guards with skeleton |
| CurrencyToggle | Low | Always renders |
| BackButton | Low | Always renders |
| NewsletterSection | Low | Always renders |
| EnvironmentProvider | Low | Renders null |
| AdminCommunityModeration | Low | Mock data |
| OverlayDebugPanel | Low | Dev-only |

## 4.3 Hydration Failure Risk Points

| Location | Risk Level | Cause |
|----------|-----------|-------|
| Navbar cart badge | **Low** | Guarded by `mounted` state |
| ThemeToggle icon | **Low** | Guarded by `mounted` state |
| CartDrawer/MobileMenu portals | **Medium** | `createPortal` to `document.body` — if SSR produces different output than CSR, hydration mismatch. Currently guarded by `!mounted` returning null, so portal is not created during SSR. **However**, the `Navbar` always renders `<MobileMenu />` as a child, and MobileMenu is a Client Component. During SSR, it renders nothing. During hydration, it renders the portal. This is correct but fragile. |
| `suppressHydrationWarning` on `<html>` | **Present** | Indicates known SSR/CSR divergence (theme class) |
| `OverlayDebugPanel` reading `document.body.style.overflow` | **Low** | Guarded by `typeof document !== 'undefined'` |

## 4.4 Conditional Rendering Paths

| Component | Condition | Paths |
|-----------|-----------|-------|
| Navbar cart badge | `mounted && totalItems > 0` | Show badge / hide badge |
| Navbar mobile menu button icon | `isMobileMenuOpen` | X icon / hamburger icon |
| MobileMenu | `!mounted \|\| !isOpen` | null / portal |
| CartDrawer | `!mounted \|\| !isOpen` | null / portal |
| CartDrawer items list | `items.length === 0` | Empty state / items list |
| CartDrawer bottom bar | `items.length > 0` | Hidden / visible |
| CheckoutClient | `!mounted` | Loading spinner |
| CheckoutClient | `items.length === 0` | Empty cart message |
| CheckoutClient | items exist | Full checkout form |
| CheckoutForm | `status === 'success'` | Success message / form |
| CheckoutForm | `status === 'error'` | Error banner + form |
| ThemeToggle | `!mounted` | Skeleton icon |
| WhatsAppFAB | `isAnyOpen` | Disabled / enabled |
| OverlayDebugPanel | `!isDev` | null / debug panel |
| ProductCard badge | `badgeLabel` | Show / hide |
| ProductCard lifestyle image | `lifestyleImage` | Show / hide on hover |
| AdminCommunityModeration | `isAdmin` | Access denied / moderation UI |

## 4.5 Portal Usage

| Component | Portal Target | Content |
|-----------|--------------|---------|
| MobileMenu | `document.body` | Backdrop + aside panel |
| CartDrawer | `document.body` | Backdrop + aside panel |

Both portals use React.Fragment (`<>...</>`) containing TWO elements: backdrop div + aside panel.

## 4.6 Multiple Render Paths for Same UI

**None identified.** Each route has a single page.tsx with a deterministic render path.

---

# 🔍 SECTION 5 — UI LAYERING & Z-INDEX SYSTEM

## 5.1 All Z-Index Values

| Value | Class/Element | Purpose |
|-------|--------------|---------|
| `1` (inline `z-10`) | Trust badges bar (HeroSection), product card gradient overlay | Content above images |
| `10` | ProductCard badge, product page badge | Over product images |
| `15` | `.quick-shop-fab` (CSS class, NOT used in JSX) | Dead code |
| `20` | `.whatsapp-fab` → WhatsAppFAB component | Floating action button |
| `25` | `.cart-backdrop` (CSS class, NOT used in JSX) | Dead code |
| `50` | `.z-navbar` → Navbar `<header>` | Fixed navigation |
| `55` | `.z-overlay-backdrop` → MobileMenu & CartDrawer backdrop | Overlay backdrop |
| `60` | `.z-overlay` → MobileMenu & CartDrawer aside panel | Overlay panel |
| `9999` (inline `z-[9999]`) | OverlayDebugPanel | Dev-only debug overlay |

## 5.2 Z-Index Stacking Context Map

```
z-[9999]  OverlayDebugPanel (dev only)
    │
z-60    CartDrawer / MobileMenu aside panel
    │
z-55    CartDrawer / MobileMenu backdrop
    │
z-50    Navbar header
    │
z-20    WhatsAppFAB
    │
z-15    .quick-shop-fab (dead code)
    │
z-10    ProductCard badges, image overlays
    │
z-1     HeroSection trust bar
    │
z-0     Default page content
```

## 5.3 Conflicts Identified

| Conflict | Severity | Details |
|----------|----------|---------|
| `.cart-backdrop` (z-25) vs `.z-overlay-backdrop` (z-55) | **Low** | `.cart-backdrop` is never used in JSX. Dead CSS rule. |
| `.quick-shop-fab` (z-15) vs `.whatsapp-fab` (z-20) | **Low** | `.quick-shop-fab` is never used in JSX. Dead CSS rule. Both would occupy the same screen position (bottom-right) if active. |
| Navbar (z-50) sits below overlays (z-55/60) | **Correct** | Overlays properly cover navbar |
| WhatsAppFAB (z-20) sits below overlays (z-55/60) | **Correct** | FAB properly hidden behind overlay backdrop |
| No stacking context created by `backdrop-filter` | **Potential issue** | Both Navbar and overlay backdrops use `backdrop-filter`, which creates new stacking contexts. This can cause z-index to behave unexpectedly within those contexts. Currently not causing issues because all z-index values are on `position: fixed` elements which escape local stacking contexts. |

## 5.4 Elements That Escape via Portal

| Component | Portal | Escapes |
|-----------|--------|---------|
| MobileMenu | `createPortal(..., document.body)` | Yes — entire menu + backdrop |
| CartDrawer | `createPortal(..., document.body)` | Yes — entire drawer + backdrop |

## 5.5 Elements That Are Trapped

| Element | Trap Reason |
|---------|------------|
| CartDrawer focus trap | Tab cycling within panel — correct behavior |
| MobileMenu focus trap | Tab cycling within panel — correct behavior |

---

# 🔍 SECTION 6 — INTERACTION SYSTEM

## 6.1 All Interactive Elements

| Element | Trigger | State Change | Re-renders | Handler Status |
|---------|---------|-------------|------------|---------------|
| **Navbar — Cart Button** | Click | overlayStore: openOverlay/closeOverlay | CartDrawer, MobileMenu, WhatsAppFAB, Navbar | ✅ Active |
| **Navbar — Mobile Menu Button** | Click | overlayStore: openOverlay/closeOverlay | MobileMenu, CartDrawer, WhatsAppFAB, Navbar | ✅ Active |
| **Navbar — Nav Links** | Click | Navigation (Link) | Page change | ✅ Active |
| **Navbar — Logo Link** | Click | Navigation to / | Page change | ✅ Active |
| **CurrencyToggle (all instances)** | Click | cartStore.setCurrency | All components reading currency | ✅ Active |
| **ThemeToggle (all instances)** | Click | useTheme.toggle | All components (via CSS variables) | ✅ Active |
| **MobileMenu — Backdrop Click** | Click | overlayStore.closeOverlay | MobileMenu, dependent components | ✅ Active |
| **MobileMenu — Close Button** | Click | overlayStore.closeOverlay | MobileMenu, dependent components | ✅ Active |
| **MobileMenu — Nav Links** | Click | Navigation + closeOverlay | Page + MobileMenu | ✅ Active |
| **MobileMenu — Escape Key** | Keydown | overlayStore.closeOverlay | MobileMenu, dependent components | ✅ Active |
| **MobileMenu — Tab (focus trap)** | Keydown | Focus cycling | N/A (DOM-level) | ✅ Active |
| **CartDrawer — Backdrop Click** | Click | overlayStore.closeOverlay | CartDrawer, dependent components | ✅ Active |
| **CartDrawer — Close Button** | Click | overlayStore.closeOverlay | CartDrawer, dependent components | ✅ Active |
| **CartDrawer — Remove Item** | Click | cartStore.removeItem | CartDrawer | ✅ Active |
| **CartDrawer — Quantity +** | Click | cartStore.updateQuantity | CartDrawer | ✅ Active |
| **CartDrawer — Quantity −** | Click | cartStore.updateQuantity (may remove) | CartDrawer | ✅ Active |
| **CartDrawer — Shipping Select** | Change | Local shippingRegion state | CartDrawer totals | ✅ Active |
| **CartDrawer — Checkout Button** | Click | router.push('/checkout') + closeOverlay | Navigation | ✅ Active |
| **CartDrawer — Escape Key** | Keydown | overlayStore.closeOverlay | CartDrawer, dependent components | ✅ Active |
| **CartDrawer — Tab (focus trap)** | Keydown | Focus cycling | N/A (DOM-level) | ✅ Active |
| **ProductControls — Size Buttons** | Click | Local selectedSize state | ProductControls | ✅ Active |
| **ProductControls — Currency Buttons** | Click | cartStore.setCurrency | ProductControls + all currency readers | ✅ Active |
| **ProductControls — Add to Bag** | Click | cartStore.addItem + openOverlay + local added state | CartDrawer + ProductControls | ✅ Active |
| **CheckoutForm — Input Change** | Change | Local form state + clear error | CheckoutForm | ✅ Active |
| **CheckoutForm — Submit** | Submit | Validate → simulate → clearCart → success | CheckoutForm | ✅ Active (mock) |
| **CheckoutForm — Try Again** | Click | setStatus('idle') | CheckoutForm | ✅ Active |
| **NewsletterSection — Input Change** | Change | Local email state | NewsletterSection | ✅ Active |
| **NewsletterSection — Submit** | Submit | Validate → simulate → success | NewsletterSection | ✅ Active (mock) |
| **WhatsAppFAB — Click** | Click | External navigation (wa.me) | None | ✅ Active |
| **BackButton — Click** | Click | router.back() | Navigation | ✅ Active |
| **AdminCommunityModeration — Approve/Reject** | Click | **NONE** | None | ❌ **STUB — no handler** |

## 6.2 Dead Buttons

| Element | Location | Issue |
|---------|----------|-------|
| AdminCommunityModeration — Approve buttons (×6) | /admin | Render only, no onClick handler |
| AdminCommunityModeration — Reject buttons (×6) | /admin | Render only, no onClick handler |

## 6.3 Broken Handlers

**None identified** — all attached handlers function correctly for their current implementation scope.

---

# 🔍 SECTION 7 — SCROLL & OVERLAY BEHAVIOR

## 7.1 Scroll Lock Mechanism

```
openOverlay() → lockBody()
  └─ lockCount++
  └─ document.body.style.overflow = 'hidden'
  └─ document.body.style.position = 'fixed'    ← ⚠️ causes scroll-to-top
  └─ document.body.style.width = '100%'

closeOverlay() → unlockBody()
  └─ lockCount--
  └─ if lockCount <= 0: reset all body styles
```

## 7.2 Scroll Lock Issues

| Issue | Severity | Details |
|-------|----------|---------|
| **Body scrolls to top on lock** | **High** | `position: fixed` on body forces viewport to top. Scroll position is NOT saved or restored. User loses their place on the page. |
| **lockCount is module-level** | **Medium** | Not in Zustand store. HMR resets it to 0 while body may still be locked. No recovery mechanism. |
| **No scroll position save/restore** | **High** | When overlay closes, user is at the top of the page regardless of where they opened it from. |
| **Multiple openOverlay calls stack** | **Low** | lockCount correctly prevents double-locking, but closing one overlay unlocks the body even if another conceptually needs it locked. |

## 7.3 Scroll Container Isolation

| Container | Scroll Behavior | Isolation |
|-----------|----------------|-----------|
| MobileMenu nav | `overflow-y-auto overscroll-contain` | ✅ Properly contained |
| CartDrawer items list | `overflow-y-auto overscroll-contain` | ✅ Properly contained |

## 7.4 Overlay Interaction Isolation

| Overlay | Backdrop Click Close | Escape Close | Focus Trap | Body Scroll Lock |
|---------|---------------------|--------------|------------|-----------------|
| MobileMenu | ✅ | ✅ | ✅ | ✅ (lockCount) |
| CartDrawer | ✅ | ✅ | ✅ | ✅ (lockCount) |

## 7.5 Overlay Conflicts

| Scenario | Outcome | Issue |
|----------|---------|-------|
| Open MobileMenu → Open CartDrawer | MobileMenu hides, CartDrawer shows, lockCount = 2 | MobileMenu's focus trap cleanup may not run if overlay state changes without unmount. **Potential focus leak.** |
| Close CartDrawer (lockCount: 2→1) | Body remains locked | lockCount still > 0, body stays locked. User cannot scroll. |
| HMR while overlay open | lockCount resets to 0, body stays locked | Body styles persist (DOM state), but lockCount resets. Next closeOverlay call sets lockCount to -1, then to 0, and body unlocks. Then next openOverlay locks again. **Unpredictable.** |

---

# 🔍 SECTION 8 — STYLING SYSTEM ANALYSIS

## 8.1 Tailwind Structure

**Tailwind CSS v4** with `@theme` block in `globals.css` defining design tokens.

### Token Categories

| Category | Tokens | Mapping |
|----------|--------|---------|
| Colors | 28 CSS custom properties | All map to `var(--color-*)` |
| Fonts | 7 font families | Mix of `var(--font-*)` and static stacks |
| Text Scale | 14 text variables | Defined in `@theme` but **NOT all wired to Tailwind utilities** |
| Shadows | 2 | `--shadow-crochet`, `--shadow-drawer` |
| Spacing | 2 | `--spacing-section`, `--spacing-section-sm` |
| Animations | 3 | fadeIn, slideUp, slideInRight |

## 8.2 Custom Classes (@layer components)

| Class | Purpose | Used In |
|-------|---------|---------|
| `.border-stitch` | Dashed border | CartDrawer, CheckoutForm, ProductControls |
| `.border-stitch-strong` | 2px dashed border | NOT used in JSX |
| `.crochet-shadow` | Soft shadow | ProductCard, Navbar, CheckoutForm |
| `.no-scrollbar` | Hide scrollbar | NOT used in JSX |
| `.glass` | Frosted glass | Product detail page |
| `.btn-primary` | Primary button style | CheckoutClient |
| `.btn-secondary` | Secondary button style | NOT used in JSX |
| `.btn-accent` | Accent button style | NOT used in JSX |
| `.label-md` | Label typography | NOT used in JSX |
| `.label-sm` | Small label typography | Product detail page |
| `.product-card` | Card container + hover behavior | ProductCard |
| `.product-image` | Image hover scale | ProductCard (indirect) |
| `.badge-new/handmade/limited/pet-safe` | Badge styling | ProductCard, products/[slug]/page |
| `.accordion-trigger` | Accordion styling | NOT used in JSX |
| `.masonry-item` | Masonry layout item | NOT used in JSX |
| `.cart-drawer` | Drawer container | CartDrawer |
| `.cart-backdrop` | **DEAD** — backdrop style | Never used in JSX |
| `.sticky-bottom-bar` | Bottom bar style | NOT used in JSX |
| `.whatsapp-fab` | FAB style | WhatsAppFAB |
| `.quick-shop-fab` | **DEAD** — quick shop FAB | Never used in JSX |

## 8.3 Duplicated Styles

| Duplication | Location A | Location B | Severity |
|-------------|-----------|-----------|----------|
| Focus trap logic | MobileMenu.tsx | CartDrawer.tsx | **Medium** — Identical ~15-line logic block duplicated |
| Escape key handler | MobileMenu.tsx | CartDrawer.tsx | **Medium** — Identical useEffect pattern |
| Mounted state pattern | Navbar, MobileMenu, CartDrawer, CheckoutClient, ThemeToggle | 5 components | **Low** — Standard React pattern, but repetitive |
| `--color-secondary` in .dark | `#B0B0B0` (dead) | `#7A8563` (active) | **Low** — First value overwritten |
| Transition on body | `body { transition: background-color 0.3s }` | `body, header, footer, .btn-primary { transition: background-color 0.5s }` | **Low** — Second rule wins for body |
| Price formatting | `utils.ts` (string interpolation, 2 decimal places) | `utils/formatPrice.ts` (Intl.NumberFormat, 0 decimal places for ZAR) | **Medium** — Two different formatters produce different outputs |

## 8.4 Conflicting Classes

| Conflict | Details |
|----------|---------|
| `body` transition timing | First rule says `0.3s`, second rule says `0.5s`. The later rule (0.5s) wins due to CSS cascade. |
| `--color-secondary` in dark mode | Two values defined in `.dark` block. First is `#B0B0B0`, second is `#7A8563`. Second wins silently. |
| `formatPrice` inconsistency | `utils.ts` formats ZAR as `R 1,234.56` (2 decimals); `utils/formatPrice.ts` formats ZAR as `R 1,235` (integer). CartDrawer uses `formatPrice.ts`, ProductControls uses inline formatting. **Same price, different display.** |

## 8.5 Dead CSS Classes (defined but never used in JSX)

| Class | Definition | Status |
|-------|-----------|--------|
| `.border-stitch-strong` | @layer components | ❌ Unused |
| `.no-scrollbar` | @layer components | ❌ Unused |
| `.btn-secondary` | @layer components | ❌ Unused |
| `.btn-accent` | @layer components | ❌ Unused |
| `.label-md` | @layer components | ❌ Unused |
| `.accordion-trigger` | @layer components | ❌ Unused |
| `.masonry-item` | @layer components | ❌ Unused |
| `.cart-backdrop` | @layer components | ❌ Unused |
| `.quick-shop-fab` | @layer components | ❌ Unused |
| `.sticky-bottom-bar` | @layer components | ❌ Unused |
| `.hover-lift` | @layer utilities | ❌ Unused |
| `.hover-scale` | @layer utilities | ❌ Unused |
| `.backdrop-blur-xs` | @layer utilities | ❌ Unused |
| `.scroll-contained` | @layer utilities | ❌ Unused |
| `.img-cover` | @layer utilities | ❌ Unused |
| `.text-balance` | @layer utilities | ❌ Unused |

---

# 🔍 SECTION 9 — DATA FLOW & SIDE EFFECTS

## 9.1 All useEffect Hooks

| Component | Effect | Dependencies | Side Effect | Cleanup |
|-----------|--------|-------------|-------------|---------|
| EnvironmentProvider | Toggle `env-pets` class | `[pathname]` | `document.body.classList` | ✅ Removes class |
| Navbar (×2) | Close overlay on route change | `[pathname, closeOverlay]` | overlayStore.closeOverlay | — |
| Navbar (×2) | Set mounted = true | `[]` | Local state | — |
| MobileMenu (×3) | Set mounted | `[]` | Local state | — |
| MobileMenu (×3) | Escape key handler | `[isOpen, closeOverlay]` | `window.addEventListener` | ✅ removeEventListener |
| MobileMenu (×3) | Focus trap | `[isOpen]` | `panel.addEventListener` | ✅ removeEventListener |
| CartDrawer (×4) | Debug log | `[activeOverlay, isOpen]` | console.log | — |
| CartDrawer (×4) | Set mounted | `[]` | Local state | — |
| CartDrawer (×4) | Escape key handler | `[isOpen, closeOverlay]` | `window.addEventListener` | ✅ removeEventListener |
| CartDrawer (×4) | Focus trap | `[isOpen, trapFocus]` | trapFocus cleanup | ✅ cleanup returned |
| CartDrawer (×4) | Debug log for activeOverlay | `[activeOverlay]` | console.log | — |
| useTheme (×2) | Initialize theme from localStorage | `[]` | localStorage read, setTheme | — |
| useTheme (×2) | Apply theme to DOM + localStorage | `[theme, mounted]` | `classList.toggle`, localStorage write, rAF | ✅ cancelAnimationFrame |
| CheckoutForm (×3) | Restore form from localStorage | `[]` | localStorage read, setForm | — |
| CheckoutForm (×3) | Save form to localStorage | `[form]` | localStorage write | — |
| CheckoutForm (×3) | Scroll to feedback on status | `[status]` | `scrollIntoView` | — |
| OverlayDebugPanel (×1) | Check dev environment | `[]` | setIsDev | — |

## 9.2 Side Effects Inventory

| Side Effect | Source | Type | Risk |
|-------------|--------|------|------|
| `document.body.style` manipulation | overlayStore (lockBody/unlockBody) | **DOM mutation** | High — affects global scroll, not React-managed |
| `document.body.classList` manipulation | EnvironmentProvider | **DOM mutation** | Low — scoped to `env-pets` |
| `document.documentElement.classList` manipulation | useTheme / theme-init.js | **DOM mutation** | Medium — dual source of truth |
| `localStorage` writes | cartStore (persist), useTheme, CheckoutForm | **Persistent storage** | Medium — quota limits, serialization errors |
| `localStorage` reads | cartStore (hydration), useTheme, CheckoutForm | **Persistent storage** | Low — guarded by try/catch |
| `window.addEventListener` | MobileMenu, CartDrawer (keydown) | **Global listener** | Medium — cleanup required |
| `requestAnimationFrame` | useTheme | **Animation frame** | Low — cleaned up |
| `setTimeout` | ProductControls (added feedback), API mocks | **Timer** | Low — fires regardless of component state |
| `console.log` | overlayStore (×6), CartDrawer (×2) | **Console output** | Low — pollution in production |

## 9.3 Unintended Re-renders

| Component | Cause | Impact |
|-----------|-------|--------|
| Navbar | Reads `cartStore.getTotalItems()` — this is a function call selector. Zustand calls the function on every store change, even if items didn't change. | **Low** — function is O(n) but n is small |
| CartDrawer | Reads `cartStore.items` (entire array). Any cart change re-renders CartDrawer even when closed. | **Medium** — renders when hidden |
| WhatsAppFAB | Reads `overlayStore.isAnyOpen()` — re-renders on every overlay change | **Low** — lightweight component |
| CurrencyToggle | Reads `cartStore.currency` — re-renders only when currency changes | ✅ Optimal |

## 9.4 Infinite Loop Risk

| Location | Risk | Analysis |
|----------|------|----------|
| `useTheme` effect: `setTheme` inside useEffect | **None** | Dependencies are `[theme, mounted]`. `setTheme` is called inside the effect, but only if `mounted` is true. The initial effect sets `mounted = true`, which triggers re-render. The theme effect then runs. It reads `pendingTheme.current` (a ref), and calls `setTheme` — but the theme value hasn't changed (it was set from localStorage in the first effect). **No infinite loop.** |
| CheckoutForm: `localStorage.setItem` on `[form]` change | **None** | Form state changes only from user input or initial restore. The restore effect has `[]` dependency, so it runs once. |
| Navbar: `closeOverlay()` in `[pathname, closeOverlay]` | **None** | pathname changes on navigation, closeOverlay is stable (Zustand action). Safe. |

---

# 🔍 SECTION 10 — PERFORMANCE RISKS

## 10.1 Unnecessary Re-renders

| Component | Issue | Severity |
|-----------|-------|----------|
| CartDrawer | Always mounted in layout.tsx. Reads `cartStore.items` — re-renders on every cart mutation even when closed. | **Medium** |
| Navbar | Reads `cartStore.getTotalItems()` — function selector called on every store change. | **Low** |
| Multiple `CurrencyToggle` instances | 3 instances all subscribe to `cartStore.currency`. One change triggers 3 re-renders. | **Low** |
| Multiple `ThemeToggle` instances | 2 instances all subscribe to `useTheme`. One toggle triggers 2 re-renders. | **Low** |

## 10.2 Heavy Components

| Component | Issue | Details |
|-----------|-------|---------|
| CartDrawer | **Heaviest client component** — contains focus trap logic, item rendering, shipping selector, totals calculation, portal management | ~180 lines of JSX |
| MobileMenu | **Second heaviest** — focus trap, Escape handler, portal, full nav link list | ~100 lines |
| CheckoutForm | Form validation, 8 input fields, localStorage sync, error handling, multiple render states | ~120 lines |

## 10.3 Large DOM Trees

| Component | DOM Depth | Element Count (estimated) |
|-----------|-----------|--------------------------|
| Navbar | ~5 levels deep | ~40-60 elements (with 6 nav links + controls) |
| MobileMenu (open) | ~6 levels deep | ~30-40 elements |
| CartDrawer (open) | ~7 levels deep | ~30-80 elements (depends on cart items) |
| Product detail page | ~12 levels deep | ~100+ elements (breadcrumbs, images, controls, accordions) |

## 10.4 Missing Memoization

| Component | What Could Be Memoized | Impact |
|-----------|----------------------|--------|
| ProductCard | Not memoized. When ProductGrid re-renders, all cards re-render. | **Low** (Server Component, no re-renders) |
| CartDrawer items | `items.map(...)` — no `useMemo` for computed subtotal/shipping/total | **Low** (computed values are cheap) |
| `formatCategoryLabel` in products/[slug]/page.tsx | Pure function, called once per render | ✅ No memoization needed |
| `isActive` in Navbar | Called 6 times per render (NAV_LINKS.length) | **Low** (string comparison is cheap) |

---

# 🔍 SECTION 11 — ACCESSIBILITY & UX RISKS

## 11.1 Missing ARIA Attributes

| Element | Issue | Location |
|---------|-------|----------|
| ProductCard — "Quick View" link | No `aria-label` describing the product it navigates to | ProductCard.tsx |
| ProductCard — pet-safe SVG icon | No `aria-hidden="true"` or `aria-label` | ProductCard.tsx |
| Navbar — SVG icons in mobile nav | Inline SVGs have no `aria-hidden` | Navbar.tsx (mobile icon variant) |
| HeroSection — decorative images | May lack `aria-hidden` if `alt=""` not set | HeroSection.tsx |
| BentoGrid — decorative elements | Mixed decorative/informational content without clear ARIA separation | BentoGrid.tsx |
| CartDrawer — quantity +/- buttons | Have `aria-label` ✅ | CartDrawer.tsx |
| MobileMenu — panel | Has `role="dialog"`, `aria-modal`, `aria-label` ✅ | MobileMenu.tsx |
| CartDrawer — panel | Has `role="dialog"`, `aria-modal`, `aria-label` ✅ | CartDrawer.tsx |
| CheckoutForm — error messages | Have `role="alert"` and `aria-describedby` ✅ | CheckoutForm.tsx |
| CheckoutForm — inputs | Have `aria-invalid` ✅ | CheckoutForm.tsx |
| BackButton | No `aria-label` — text content is "Back" which is sufficient | BackButton.tsx |

## 11.2 Focus Trapping Issues

| Component | Issue | Severity |
|-----------|-------|----------|
| MobileMenu | Focus trap implemented correctly ✅ | — |
| CartDrawer | Focus trap implemented correctly ✅ | — |
| **BUT:** Focus trap uses `panel.addEventListener('keydown', handleTab)` — this attaches a NEW listener every time `isOpen` changes (MobileMenu) or `[isOpen]` changes (CartDrawer). The cleanup removes it. **However**, if the component unmounts abruptly (e.g., route change while overlay open), the cleanup may not run. | **Medium** |

## 11.3 Keyboard Navigation Problems

| Issue | Location | Details |
|-------|----------|---------|
| ProductCard "Quick View" link | ProductCard.tsx | Only visible on hover (`opacity: 0` normally). Keyboard users cannot see it until they tab to it. Focus styles not defined for this element. |
| Size selection buttons | ProductControls.tsx | No visual focus ring beyond the default `:focus-visible` styling |
| Currency toggle buttons | ProductControls.tsx, CurrencyToggle.tsx | Same as above |
| Accordion `<details>` elements | products/[slug]/page.tsx | Native HTML, keyboard accessible ✅ |
| Shipping region select | CartDrawer.tsx | Native select, keyboard accessible ✅ |

## 11.4 Mobile UX Inconsistencies

| Issue | Details |
|-------|---------|
| Navbar height `h-20` + `pt-20` on main | On very small screens (320px), the fixed navbar takes 25% of viewport height |
| CartDrawer `max-w-[450px]` | On screens < 450px, drawer fills entire screen (correct). But the `max-w` media query is not breakpoint-aware — it's always 450px max. |
| MobileMenu `max-w-sm` | Same as above — fills screen on small devices |
| `sm:hidden` breakpoint | Mobile menu button hidden on `sm` (640px+). But tablet nav icons (6 links with icons) appear at `sm` and hide at `lg`. This creates a mid-range (640px-1024px) where icon-based nav is shown — potentially cramped with 6 icons. |
| Currency toggle hidden on mobile in Navbar | `<span className="hidden sm:block">` — mobile users can only change currency via MobileMenu or ProductControls |
| WhatsAppFAB expand on hover | Hover doesn't work on touch devices. The FAB text "Need a custom stitch?" is only visible on hover. |

---

# 🔍 SECTION 12 — BUG CLASSIFICATION

| # | Issue | Severity | Affected System | Root Cause | Ripple Effect |
|---|-------|----------|----------------|-----------|--------------|
| 1 | Body scroll position lost when overlay opens | **Critical** | Scroll / Overlay | `position: fixed` on body forces viewport to top | User loses their place on page; jarring UX on product browsing |
| 2 | `lockCount` is module-level state, not in Zustand store | **Critical** | Overlay / State | HMR resets lockCount to 0 while body remains locked | Unpredictable scroll lock behavior after HMR; potential permanent body lock |
| 3 | `currency` field on CartItem is hardcoded to 'ZAR' in addItem | **High** | Cart / State | `addItem` always sets `currency: 'ZAR'` regardless of active currency | If user adds items in USD mode, stored item currency is wrong; data integrity compromised |
| 4 | `formatPrice` has two implementations with different outputs | **High** | Styling / UI | `utils.ts` uses 2-decimal string interpolation; `utils/formatPrice.ts` uses Intl.NumberFormat with 0 decimals | Same price displayed differently across components |
| 5 | `--color-secondary` defined twice in `.dark` block | **High** | Styling | First value (`#B0B0B0`) silently overridden by second (`#7A8563`) | Unintended color in dark mode; confusion for future developers |
| 6 | Admin moderation approve/reject buttons have no handlers | **High** | Interaction / Admin | Buttons render but onClick is not defined | Admin page is non-functional; moderators cannot take action |
| 7 | Focus trap cleanup may not run on abrupt unmount | **Medium** | Accessibility / Overlay | Event listener attached to panel; if route changes while overlay open, cleanup skipped | Keyboard navigation broken after overlay close; focus trapped or lost |
| 8 | CartDrawer re-renders on every cart change even when closed | **Medium** | Performance | Always mounted; subscribes to entire `items` array | Unnecessary renders when cart is modified from ProductControls |
| 9 | `getTotalPriceUSD` and `getActiveCurrency` are dead code | **Medium** | State | Defined in cartStore but never consumed by any component | Code bloat; maintenance confusion |
| 10 | `body` transition timing conflict (0.3s vs 0.5s) | **Medium** | Styling | Two separate CSS rules target `body` with different transition durations | Inconsistent theme transition timing; second rule silently wins |
| 11 | 16+ dead CSS classes in globals.css | **Low** | Styling | Component classes defined but never used in JSX | CSS bloat; confusion about available utilities |
| 12 | `openOverlay` doesn't check if overlay already open | **Low** | Overlay / State | No guard against redundant open calls | lockCount can inflate; potential focus state conflicts |
| 13 | Console.log pollution in production | **Low** | Code Quality | overlayStore has 6 console.log statements; CartDrawer has 2 | Production console pollution; performance overhead |
| 14 | ProductCard "Quick View" invisible to keyboard | **Low** | Accessibility | Only visible on CSS hover; no focus-visible equivalent | Keyboard users cannot discover Quick View link |
| 15 | WhatsAppFAB text only visible on hover | **Low** | Mobile UX | `group-hover:max-w-xs` doesn't work on touch devices | Mobile users never see FAB label text |
| 16 | `currency` not persisted in cartStore | **Medium** | State | `partialize` only saves `items`, not `currency` | User's currency preference resets on every page reload |
| 17 | OrderSummary is unnecessarily a Client Component | **Low** | Performance | No hooks or interactivity; could be Server Component | Unnecessary hydration cost |
| 18 | Stale setTimeout in ProductControls | **Medium** | State | `setTimeout(() => setAdded(false), 1200)` fires even if component unmounts | Memory leak; potential state update on unmounted component |
| 19 | Self-referencing font CSS variables | **Low** | Styling | `--font-bhineka: var(--font-bhineka), cursive` in @theme | Works due to Next.js override, but conceptually circular |
| 20 | `@theme` text scale variables not fully wired to Tailwind utilities | **Medium** | Styling | `--text-display-xl` etc. defined in @theme; Tailwind v4 may auto-generate utilities but usage is inconsistent | Text scale may not work as expected in all contexts |
| 21 | Navbar auto-closes overlay on every route change | **Low** | UX | `useEffect(() => { closeOverlay() }, [pathname])` | If user navigates with overlay open, it closes abruptly. May be intended, but no animation. |
| 22 | Mock API delay (800ms) hardcoded in production code | **Low** | Performance | `getProductBySlug` and `getProductsByCategory` have artificial delays | Every product page/category page loads 800ms slower than necessary |
| 23 | Exchange rate hardcoded | **Medium** | Data | `EXCHANGE_RATE_ZAR_TO_USD = 0.054` in constants | Prices become inaccurate as exchange rates fluctuate |
| 24 | `isAdmin = false` hardcoded | **Low** | Security/Auth | No real authentication mechanism | Admin page permanently inaccessible until auth is implemented |

---

# 🔍 SECTION 13 — LANDMINE DETECTION

## 13.1 Fragile Logic

| Location | Logic | Why It's Fragile |
|----------|-------|-----------------|
| `overlayStore.lockCount` | Module-level ref counter for scroll lock | Any HMR, module reload, or hot replacement resets it to 0. No recovery mechanism. If body is locked and lockCount resets, the next `closeOverlay()` call sets it to -1, then to 0, unlocking. The next `openOverlay()` locks again. **Completely unpredictable after HMR.** |
| `ProductControls.handleAddToBag` | `setTimeout` + `openOverlay` chained | If user navigates away before timeout fires, `openOverlay('cartDrawer')` still executes. The overlay will open on the next page. |
| `CheckoutForm` localStorage sync | Saves entire form object on every keystroke | Large forms = frequent localStorage writes. No debounce. Performance impact on slower devices. |
| `theme-init.js` IIFE | Reads localStorage synchronously in `<head>` | If localStorage is disabled (private browsing, quota exceeded), the try/catch silently swallows the error. User gets default light theme regardless of preference. |

## 13.2 Hidden Dependencies

| Dependency | Hidden Link | Risk |
|------------|------------|------|
| CartDrawer ↔ overlayStore | CartDrawer's visibility controlled entirely by overlayStore | If overlayStore breaks, CartDrawer is invisible or stuck open |
| MobileMenu ↔ overlayStore | Same as above | Same risk |
| WhatsAppFAB ↔ overlayStore | FAB disabled when overlay open | If overlayStore.isAnyOpen() returns wrong value, FAB becomes interactive behind overlays |
| Navbar ↔ pathname | Auto-close overlay on route change | If Next.js routing changes (e.g., to client-side navigation), this effect may not fire |
| ProductControls ↔ cartStore.addItem | Item structure hardcoded in handleAddToBag | If CartItem type changes, ProductControls must be updated simultaneously |
| `formatPrice.ts` ↔ CartDrawer | CartDrawer imports from `formatPrice.ts` while ProductControls uses inline formatting | Price display inconsistency |

## 13.3 Tight Coupling

| Coupling | Components | Risk |
|----------|-----------|------|
| Overlay system ↔ body DOM | overlayStore directly manipulates document.body | Non-portable; breaks if body element changes or is replaced |
| Navbar ↔ MobileMenu | Navbar renders MobileMenu as sibling; both share overlayStore state | Cannot use MobileMenu without Navbar |
| CartDrawer ↔ layout.tsx | CartDrawer is hardcoded in root layout | Cannot have pages without cart drawer |
| ProductControls ↔ Product page | ProductControls expects a specific product shape (id, slug, name, price, images, sizes) | Cannot reuse with different product types without adapter |

## 13.4 Future-Breaking Patterns

| Pattern | Why It Will Break |
|---------|------------------|
| **Single overlay type** | Adding a second concurrent overlay (e.g., confirmation dialog) requires rewriting overlayStore |
| **Module-level lockCount** | Any code splitting or lazy loading that causes module re-evaluation will reset lockCount |
| **Hardcoded currency in CartItem** | Multi-currency checkout requires CartItem to track per-item currency |
| **Mock API with artificial delay** | When real API is connected, the 800ms delay must be removed — but it's baked into the function signatures |
| **`isAdmin = false`** | Auth implementation requires rewriting the entire admin page |
| **localStorage form persistence** | Moving to server-side form submission or payment integration requires removing localStorage |

---

# 🔍 SECTION 14 — DUPLICATION & REDUNDANCY

## 14.1 Duplicate Logic

| What | Where A | Where B | Duplication Level |
|------|---------|---------|------------------|
| Focus trap implementation | MobileMenu.tsx (~15 lines) | CartDrawer.tsx (~15 lines) | **100% identical** |
| Escape key handler | MobileMenu.tsx | CartDrawer.tsx | **100% identical** |
| Mounted state pattern | Navbar, MobileMenu, CartDrawer, CheckoutClient, ThemeToggle | 5 components | **Pattern duplication** |
| Portal structure (backdrop + aside) | MobileMenu.tsx | CartDrawer.tsx | **~80% identical** |
| Price formatting | utils.ts | utils/formatPrice.ts | **Different implementations, same purpose** |
| Cart total computation | CartDrawer (inline reduce) | cartStore (getTotalPriceZAR) | **Same logic, two locations** |

## 14.2 Duplicate Styles

| What | Location A | Location B |
|------|-----------|-----------|
| `transition-colors duration-300` | Applied to 20+ elements individually | Could be a shared component class |
| `font-vintage text-h2 italic text-primary` | CartDrawer, ProductControls, CheckoutForm, BentoGrid | Repeated verbatim |
| `border-t border-dashed border-border` | CartDrawer, Footer, NewsletterSection | Repeated verbatim |
| `text-label uppercase tracking-widest` | Multiple buttons | Could be `.label-md` but not used |

## 14.3 Duplicate State Control

| What | Store A | Store B | Issue |
|------|---------|---------|-------|
| Currency display | cartStore.currency | ProductControls inline logic | ProductControls has its own currency toggle buttons that call `setCurrency` — redundant with global CurrencyToggle |
| Active overlay | overlayStore.activeOverlay | Navbar's `isMobileMenuOpen` derived boolean | Derived, not truly duplicated — but Navbar re-derives it every render |

---

# 🔍 SECTION 15 — SYSTEM WEAKNESS SUMMARY

## 15.1 Top 5 Architectural Flaws

### #1 — Scroll Lock Destroys User's Scroll Position
The `lockBody()` function sets `position: fixed` on the body, which forces the browser to scroll to the top. There is no scroll position save/restore mechanism. This means every time a user opens the cart drawer or mobile menu from anywhere on the page, they lose their place. On a product-heavy e-commerce site, this is a **severe UX flaw**.

### #2 — Module-Level State for Critical Overlay System
The `lockCount` variable lives outside the Zustand store as a plain JavaScript module variable. This is the only piece of state that manages the global scroll lock — the most critical side-effect in the app. It is:
- Invisible to Zustand DevTools
- Not serializable
- Reset by HMR
- Not reactive
- Not testable in isolation

### #3 — Dual Price Formatting Implementations
Two different `formatPrice` functions exist in the codebase with different output:
- `utils.ts`: `R 1,234.56` (2 decimal places)
- `utils/formatPrice.ts`: `R 1,235` (integer, via Intl.NumberFormat)

CartDrawer uses one, ProductControls uses inline formatting. Users see different price formats on different pages.

### #4 — Monolithic Root Layout
Every single component (Navbar, Footer, WhatsAppFAB, CartDrawer, MobileMenu, EnvironmentProvider, OverlayDebugPanel) is hardcoded in the root layout. There is no layout composition, no conditional mounting based on route, and no ability to opt out. Admin pages get the full consumer layout. 404 pages get the full layout. This will not scale.

### #5 — Single-Overlay Architecture
The overlayStore only supports one active overlay at a time. The `activeOverlay` field is a single value (`'mobileMenu'` | `'cartDrawer'` | null). This means:
- No stacked overlays (dialog over cart)
- No modal within modal
- No confirmation prompts that don't close the parent overlay

Any future feature requiring concurrent overlays requires a complete rewrite of the overlay system.

## 15.2 Most Dangerous Issue

**The scroll lock mechanism (lockCount + lockBody/unlockBody).**

This is the most dangerous because:
1. It directly manipulates the DOM outside of React's control
2. It uses module-level state that is invisible to debugging tools
3. It can leave the body permanently locked (unscrollable) after HMR
4. It destroys the user's scroll position every time
5. It affects the entire application globally
6. It has no error handling or recovery mechanism

## 15.3 What Will Break Next

**If nothing changes, the next thing to break will be:**

1. **Overlay system after a code edit during development:** HMR resets lockCount → body stays locked → developer thinks the app is broken → refreshes page → works fine again. This cycle repeats.

2. **Price display inconsistency after adding new product types:** When products with fractional pricing are added, the two different formatters will show visibly different prices for the same item on different pages.

3. **Admin page when real auth is added:** The entire admin page.tsx needs to be rewritten because `isAdmin = false` is a hardcoded placeholder that blocks all access.

4. **Cart currency when multi-currency checkout is needed:** The hardcoded `currency: 'ZAR'` in `addItem` will cause incorrect currency tracking for USD users.

---

# 🔍 SECTION 16 — RIPPLE EFFECT MAP

## Issue 1: Scroll Position Lost on Overlay Open

| Immediate Effect | Indirect Effect | Future Impact |
|-----------------|-----------------|--------------|
| User scrolled to product → opens cart → snapped to top | User must scroll back down to continue browsing | Any future modal/dialog will have the same issue. Newsletter popup, size guide popup, etc. |
| | Increased bounce rate from frustrated users | Accessibility users (screen readers) experience disorientation |
| | | Mobile users on long product pages are most affected |

## Issue 2: Module-Level lockCount

| Immediate Effect | Indirect Effect | Future Impact |
|-----------------|-----------------|--------------|
| HMR resets lockCount | Body may stay locked permanently | Any future module-splitting optimization breaks scroll lock |
| | Debug impossible via Zustand DevTools | New developers waste time debugging "random" scroll lock |
| | | Server-side rendering of overlay-related pages breaks if lockCount state leaks |

## Issue 3: Dual Price Formatters

| Immediate Effect | Indirect Effect | Future Impact |
|-----------------|-----------------|--------------|
| Cart shows `R 1,235`, Product page shows `R 1,234.56` | User confusion about actual price | International pricing (multi-currency) becomes impossible to standardize |
| | Trust erosion — "why does the price change?" | Accounting/checkout reconciliation errors |
| | | Tax calculation based on different rounded values |

## Issue 4: Monolithic Root Layout

| Immediate Effect | Indirect Effect | Future Impact |
|-----------------|-----------------|--------------|
| Admin pages show consumer Navbar/Footer | Admin UI cluttered with irrelevant elements | Cannot add layout variants (e.g., minimal checkout layout) |
| | WhatsAppFAB shows on admin pages | Cannot have layout-less pages (e.g., API routes with UI) |
| | | A/B testing layouts is impossible |

## Issue 5: Single-Overlay Architecture

| Immediate Effect | Indirect Effect | Future Impact |
|-----------------|-----------------|--------------|
| Cannot show confirmation dialog over cart | Must close cart, then show dialog | Any future modal system requires complete rewrite |
| | Workaround: use browser alert/confirm | Inconsistent UX patterns across the app |
| | | Cannot implement stacked modals (e.g., image zoom + cart) |

## Issue 6: Hardcoded Currency in CartItem

| Immediate Effect | Indirect Effect | Future Impact |
|-----------------|-----------------|--------------|
| USD user adds item → item stored as ZAR | Checkout calculates in wrong currency | International customers see wrong prices at checkout |
| | Currency toggle on product page doesn't affect stored item | Revenue impact from pricing errors |
| | | Multi-currency support requires CartItem type redesign |

## Issue 7: Focus Trap Cleanup on Abrupt Unmount

| Immediate Effect | Indirect Effect | Future Impact |
|-----------------|-----------------|--------------|
| Route change while overlay open → focus trap not cleaned | Keyboard navigation broken on next page | Accessibility lawsuit risk |
| | Event listener leaks into next page's DOM | Performance degradation over session |
| | | Any future route-based overlay transitions break |

## Issue 8: Stale setTimeout in ProductControls

| Immediate Effect | Indirect Effect | Future Impact |
|-----------------|-----------------|--------------|
| User adds to cart → navigates away → timeout fires | `setAdded(false)` on unmounted component → React warning | Memory leak accumulation |
| | `openOverlay('cartDrawer')` fires on wrong page | Cart drawer opens unexpectedly |
| | | Any future async feedback pattern will have same issue |

---

# 🔍 SECTION 17 — CONFIDENCE SCORE

| Metric | Score | Rationale |
|--------|-------|-----------|
| **UI Stability** | **6/10** | Core UI works, but scroll lock destroys position, overlay system is fragile, and mobile UX has inconsistencies. The visual layer is sound (Tailwind tokens, CSS variables), but interactive behavior is brittle. |
| **State Integrity** | **5/10** | Zustand stores are well-structured but have significant gaps: `lockCount` outside store, `currency` not persisted, hardcoded currency in CartItem, dead getters, dual source of truth for theme. Cart state is the most reliable; overlay state is the weakest. |
| **Architecture Health** | **5/10** | Clean separation of Server/Client components is good. Mock API layer is well-isolated. But monolithic root layout, single-overlay architecture, module-level state, and tight coupling between layout components limit scalability. Good for MVP, problematic for growth. |
| **Scalability** | **4/10** | Current architecture supports the existing 4-product catalog adequately. Adding more products, categories, payment integration, real auth, stacked modals, or multi-currency checkout all require significant architectural changes. The overlay system, layout composition, and cart store are the primary bottlenecks. |

---

# APPENDIX A — Technologies & Versions

| Technology | Version | Notes |
|-----------|---------|-------|
| Next.js | 16.2.2 | App Router, Server Components default |
| React | 19.2.4 | Latest — `'use client'` directive required |
| React DOM | 19.2.4 | `createPortal` available |
| Zustand | 5.0.12 | State management, persist middleware |
| Tailwind CSS | 4.2.2 | `@import "tailwindcss"` v4 syntax |
| TypeScript | 6.0.2 | Strict mode enabled |
| PostCSS | 8.5.8 | With @tailwindcss/postcss v4 |

---

# APPENDIX B — File Count Summary

| Category | Count |
|----------|-------|
| Total source files (TS/TSX/CSS) | 34 |
| Server Components | 19 |
| Client Components | 15 |
| Custom hooks | 1 |
| Zustand stores | 2 |
| Utility files | 5 |
| Route files (page.tsx) | 14 |
| Loading files | 2 |
| CSS files | 1 |
| Font files | 2 |
| Dead CSS classes | 16+ |
| Dead JS functions | 2 (getTotalPriceUSD, getActiveCurrency) |

---

# APPENDIX C — Placeholder Pages Inventory

| Route | Status | Has Content |
|-------|--------|------------|
| `/about` | Placeholder | ❌ "Coming soon" |
| `/collections` | Placeholder | ❌ "Coming soon" |
| `/contact` | Placeholder | ❌ "Coming soon" |
| `/custom-orders` | Placeholder | ❌ "Coming soon" |
| `/pets` | Placeholder | ❌ "Coming soon" |
| `/privacy` | Placeholder | ❌ "Coming soon" |
| `/returns` | Placeholder | ❌ "Coming soon" |
| `/shipping` | Placeholder | ❌ "Coming soon" |
| `/terms` | Placeholder | ❌ "Coming soon" |

**9 of 14 routes are placeholders.** Only `/`, `/products/[slug]`, `/collections/[category]`, `/checkout`, `/admin`, and `/community` have meaningful content.

---

*End of Forensic Audit.*
