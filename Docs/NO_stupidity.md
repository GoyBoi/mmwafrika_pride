# 🔍 COMPREHENSIVE STRUCTURAL AUDIT — MMWAFRIKA PRIDE COUTURE

> **Date:** 6 April 2026  
> **Framework:** Next.js 16.2.2, React 19.2.4, Zustand 5.0.12, Tailwind CSS v4.2.2, TypeScript 6.0.2  
> **Phase:** 1 (Structural Audit)

---

## 🧩 PROMPT 1 — GLOBAL ARCHITECTURE MAP

### Layout Hierarchy

```
<html lang="en" data-scroll-behavior="smooth">
  <head>
    └─ <script> (blocking theme detection — reads localStorage, sets .dark class)
  <body class="min-h-screen flex flex-col antialiased">
    ├─ <EnvironmentProvider /> (toggles body.env-pets class)
    ├─ <Navbar /> (fixed top nav, z-50)
    ├─ <main class="flex-grow pt-20">
    │   └─ {children} (all pages render here)
    ├─ <Footer /> (server component, multi-column)
    ├─ <WhatsAppFAB /> (fixed bottom-right, z-[60])
    └─ <CartDrawer /> (slide-in cart, z-[55]/z-[60])
```

### Layout Files

| File | Type | Purpose |
|---|---|---|
| `src/app/layout.tsx` | Root layout | Only layout file. Wraps entire app, injects theme script, composes Navbar + main + Footer + WhatsAppFAB + CartDrawer |
| `src/app/not-found.tsx` | 404 page | Renders its own `<main>` wrapper (bypasses root layout's main) |

**⚠️ No nested layout files exist** — no route segment overrides the root layout. All pages inherit the same shell.

### Page Composition

| Route | File | Type | Composition |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Server | `<HeroSection />` + `<BentoGrid />` + `<NewsletterSection />` |
| `/products/[slug]` | `src/app/products/[slug]/page.tsx` | Server (async) | `<BackButton />` + breadcrumb + 2-col product detail (sticky image gallery + `<ProductControls />` + accordions) |
| `/products/[slug]` loading | `src/app/products/[slug]/loading.tsx` | Server | Skeleton matching product layout |
| `/collections` | `src/app/collections/page.tsx` | Server | `<BackButton />` + placeholder "Coming soon" |
| `/collections/[category]` | `src/app/collections/[category]/page.tsx` | Server (async) | `<BackButton />` + header + `<ProductGrid products={...} columns={4} />` |
| `/collections/[category]` loading | `src/app/collections/[category]/loading.tsx` | Server | Skeleton grid of 4 placeholders |
| `/checkout` | `src/app/checkout/page.tsx` | Server | Delegates to `<CheckoutClient />` |
| `/checkout` client | `src/app/checkout/CheckoutClient.tsx` | Client | Loading spinner / empty cart state / `<CheckoutForm />` + `<OrderSummary />` grid |
| `/admin` | `src/app/admin/page.tsx` | Server | `isAdmin` guard (currently `false`) — shows "Access Denied" or `<AdminCommunityModeration />` |
| `/about` | `src/app/about/page.tsx` | Server | Placeholder "Coming soon" |
| `/contact` | `src/app/contact/page.tsx` | Server | `<BackButton />` + placeholder "Coming soon" |
| `/community` | `src/app/community/page.tsx` | Server | Masonry gallery + "Share Your Pride" CTA |
| `/custom-orders` | `src/app/custom-orders/page.tsx` | Server | `<BackButton />` + placeholder "Coming soon" |
| `/pets` | `src/app/pets/page.tsx` | Server | `<BackButton />` + placeholder "Coming soon" |
| `/shipping` | `src/app/shipping/page.tsx` | Server | Placeholder "Coming soon" |
| `/returns` | `src/app/returns/page.tsx` | Server | Placeholder "Coming soon" |
| `/terms` | `src/app/terms/page.tsx` | Server | Placeholder "Coming soon" |
| `/privacy` | `src/app/privacy/page.tsx` | Server | Placeholder "Coming soon" |

### Component Directory Structure

```
src/components/
├── layout/
│   ├── EnvironmentProvider.tsx    — Client; toggles env-pets body class based on pathname
│   ├── Footer.tsx                 — Server; 4-col footer with shop/support/follow links
│   ├── MobileMenu.tsx             — Client; slide-in drawer from right, backdrop overlay
│   └── Navbar.tsx                 — Client; fixed top nav; responsive: desktop links / tablet icons / mobile hamburger
├── product/
│   ├── BentoGrid.tsx              — Server; 12-col CSS grid bento layout
│   ├── HeroSection.tsx            — Server; split hero with headline + CTA + trust badges
│   ├── ProductCard.tsx            — Server; hover-reveal image swap, badge overlays
│   ├── ProductControls.tsx        — Client; size selector, currency toggle, add-to-bag
│   └── ProductGrid.tsx            — Server; configurable 1/2/4 column grid
├── cart/
│   └── CartDrawer.tsx             — Client; slide-in cart with quantity controls, shipping calculator
├── checkout/
│   ├── CheckoutForm.tsx           — Client; shipping form, localStorage draft, validation
│   └── OrderSummary.tsx           — Client; sticky order summary with line items
├── admin/
│   └── AdminCommunityModeration.tsx — Client; masonry grid with approve/reject buttons
└── ui/
    ├── BackButton.tsx             — Client; calls router.back()
    ├── CurrencyToggle.tsx         — Client; pill toggle ZAR/USD
    ├── NewsletterSection.tsx      — Client; email signup form
    ├── ThemeToggle.tsx            — Client; sun/moon icon toggle
    └── WhatsAppFAB.tsx            — Server; fixed WhatsApp link
```

### Supporting Directories

| Directory | Files | Purpose |
|---|---|---|
| `src/lib/` | `constants.ts`, `types.ts`, `utils.ts`, `utils/formatPrice.ts`, `auth.ts`, `api/products.ts` | Constants, types, utilities, mock API, auth stub |
| `src/store/` | `cartStore.ts` | Zustand store with localStorage persistence (key: `mmwafrika-cart`) |
| `src/hooks/` | `useTheme.ts` | Theme hook: reads localStorage, respects prefers-color-scheme |
| `src/styles/` | `globals.css` | Tailwind CSS v4 with @theme block, dark mode, custom utilities |
| `src/fonts/` | `Bhineka.woff2`, `Vintage.woff2` | Local fonts (loaded via next/font/local) |
| `public/images/placeholders/` | `bento/default.svg`, `hero/default.svg`, `product/default.svg` | Placeholder SVGs (all product/hero images point here) |

### Providers & Root Wrappers

**No separate providers.tsx file.** Root layout composes providers inline:

| Provider/Wrapper | Type | Purpose |
|---|---|---|
| `EnvironmentProvider` | Client | Toggles `body.env-pets` CSS class when pathname includes `/pets` or `/pet-` |
| `Navbar` | Client | Fixed top nav with cart badge, currency toggle, theme toggle, mobile menu |
| `Footer` | Server | Multi-column footer with links, social icons, copyright |
| `WhatsAppFAB` | Server | Fixed-position WhatsApp floating action button |
| `CartDrawer` | Client | Slide-in cart drawer with shipping calculator |

**No React Context providers are used.** State is managed entirely through **Zustand** (cart store) and **local component state** (mobile menu, theme).

---

## 🧩 PROMPT 2 — NAVIGATION SYSTEM TRACE

### Navbar Component (`src/components/layout/Navbar.tsx`)

**State ownership:**
```tsx
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
```

**Responsive breakpoints:**
- `lg:flex` — Full text links with active underline indicator (desktop)
- `sm:flex lg:hidden` — Icon-only links (tablet)
- `<sm` — Hamburger menu only (mobile)

**Nav links source:** `src/lib/constants.ts`
```ts
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/collections' },
  { label: 'Custom Orders', href: '/custom-orders' },
  { label: 'Pets', href: '/pets' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]
```

**Auto-close on navigation:**
```tsx
useEffect(() => { setIsMobileMenuOpen(false) }, [pathname])
```

### MobileMenu Component (`src/components/layout/MobileMenu.tsx`)

**Props interface:**
```tsx
interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}
```

**Behavior:**
- Renders as slide-in drawer from right
- Backdrop tap → closes menu
- X button → closes menu
- Nav link click → closes menu (via `onClick={onClose}`)
- Contains: nav links, "Shop the Collection" CTA, CurrencyToggle, ThemeToggle

### Connection Flow

```
Navbar (owns state)
  ├─ setIsMobileMenuOpen (controls)
  ├─ <MobileMenu isOpen={...} onClose={() => setIsMobileMenuOpen(false)} />
  └─ useEffect(() => setIsMobileMenuOpen(false), [pathname]) — auto-close on route change
```

---

## 🧩 PROMPT 3 — STATE OWNERSHIP (Hamburger Menu)

| Question | Answer |
|---|---|
| **Where is open/close state stored?** | `useState(false)` inside `Navbar.tsx` (line 13) |
| **Which component controls it?** | `Navbar` — the single owner. Defines both `isMobileMenuOpen` and `setIsMobileMenuOpen`. |
| **Who consumes it?** | 1. **Navbar itself** — toggles hamburger/X icon (lines 86-91), passes props to MobileMenu.<br>2. **MobileMenu** — reads `isOpen` for CSS transform/backdrop visibility; calls `onClose` on backdrop tap, X button, nav link clicks. |

**⚠️ No global state** (Zustand, Context, Redux) for mobile menu. Pure local component state, lifted one level up from MobileMenu to Navbar.

---

## 🧩 PROMPT 4 — MODAL / OVERLAY SYSTEM

### All Overlay Components

| Component | File | Type | Z-index | Mount Strategy |
|---|---|---|---|---|
| **Navbar header** | `Navbar.tsx` | Fixed top bar | `z-50` | Always mounted (in layout.tsx) |
| **Cart Drawer backdrop** | `CartDrawer.tsx:34` | Backdrop | `z-[55]` | Conditional: `if (!mounted \|\| !isCartOpen) return null` |
| **Cart Drawer panel** | `CartDrawer.tsx:35` | Slide-in (right) | `z-[60]` | Same conditional |
| **Mobile Menu backdrop** | `MobileMenu.tsx:17-23` | Backdrop | `z-[99]` | Conditional: `{isOpen && (...)}` |
| **Mobile Menu panel** | `MobileMenu.tsx:24` | Slide-in (right) | `z-[100]` | Always rendered, CSS `translate-x-full` / `translate-x-0` |
| **WhatsApp FAB** | `WhatsAppFAB.tsx` | Floating button | `z-[60]` | Always mounted (in layout.tsx) |
| **Back Button** | `BackButton.tsx` | Sticky bar | `z-40` | Conditional per page |

### Z-index Stacking Order (low → high)

```
z-40   BackButton (sticky)
z-50   Navbar (fixed header)
z-55   Cart Drawer backdrop
z-60   Cart Drawer panel + WhatsApp FAB
z-99   Mobile Menu backdrop
z-100  Mobile Menu panel
```

### Portals

**⚠️ No `ReactDOM.createPortal` is used anywhere.** All overlays render inline in the React tree using `fixed` positioning. They are part of the normal DOM tree, not portaled to `document.body`.

### Body Scroll Locking

**Only CartDrawer manipulates body scroll:**
```tsx
// CartDrawer.tsx line 27
useEffect(() => {
  document.body.style.overflow = isCartOpen ? 'hidden' : 'auto'
  return () => { document.body.style.overflow = 'auto' }
}, [isCartOpen])
```

**⚠️ MobileMenu does NOT lock body scroll** — relies solely on semi-transparent backdrop.

### Keyboard Handling

**CartDrawer handles Escape key:**
```tsx
useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsCartOpen(false) }
  window.addEventListener('keydown', handleEsc)
  return () => window.removeEventListener('keydown', handleEsc)
}, [setIsCartOpen])
```

**⚠️ MobileMenu has NO keyboard escape handler.**

---

## 🧩 PROMPT 5 — SCROLL CONTAINERS

### Global Scroll Behavior

**File:** `src/styles/globals.css`
```css
html { scroll-behavior: smooth; ... }
```

### Layout-Level Scrolling

**File:** `src/app/layout.tsx`
```tsx
<body className="min-h-screen flex flex-col ...">
  <Navbar />
  <main className="flex-grow pt-20">{children}</main>
  <Footer />
  <WhatsAppFAB />
  <CartDrawer />
</body>
```

**⚠️ No dedicated scroll container.** The `<html>` element is the primary scroll container. `<body>` uses `min-h-screen flex flex-col`, and `<main>` uses `flex-grow pt-20` (20px padding compensates for fixed navbar height of `h-20`).

### Internal Scroll Containers

| Location | Element | Purpose |
|---|---|---|
| CartDrawer content area | `<div className="flex-1 overflow-y-auto px-8 py-4 space-y-10">` | Scrollable cart items list |
| Product cards | `.product-image { transition: transform 0.7s; }` | Image zoom on hover |
| CSS utility | `.no-scrollbar { scrollbar-width: none; }` | Hides scrollbar while keeping scroll |

### HTML Attribute

Layout sets `data-scroll-behavior="smooth"` on `<html>`, but actual smooth scrolling comes from CSS `scroll-behavior: smooth` in globals.css.

---

## 🧩 PROMPT 6 — CSS RESPONSIBILITY MAP

### Architecture: Tailwind CSS v4 with `@theme` directive

Uses Tailwind CSS v4's new `@import "tailwindcss"` syntax (not older `@tailwind` directives), with custom `@theme` block.

### Layer 1: `@theme` Block (Design Tokens)

Custom tokens defined in `src/styles/globals.css`:

**Colors (25+ custom):** `--color-bg`, `--color-surface`, `--color-accent`, `--color-whatsapp`, etc.  
**Fonts:** `--font-headline`, `--font-body`, `--font-bhineka`, `--font-vintage`  
**Text scales:** `--text-display-xl`, `--text-h1`, `--text-h2`, `--text-body-md`, `--text-price`, etc.  
**Shadows:** `--shadow-crochet`, `--shadow-drawer`  
**Spacing:** `--spacing-section`, `--spacing-section-sm`

These become available as Tailwind utility classes: `bg-bg`, `text-primary`, `font-vintage`, `text-h2`, `shadow-crochet`, etc.

### Layer 2: `.dark` Override Block

All dark mode colors defined under `.dark { ... }` — class-based dark mode strategy (not `prefers-color-scheme` media query).

### Layer 3: `@layer base` (Reset + Defaults)

- Box-sizing reset
- `html { scroll-behavior: smooth }`
- `prefers-reduced-motion` support
- Body defaults with transition on `background-color` and `color`
- `body.env-pets` overrides accent color for pet section
- `:focus-visible` outline with accent ring
- `::selection` styling

### Layer 4: `@layer components` (Reusable Classes)

| Class | Purpose |
|---|---|
| `.border-stitch` / `.border-stitch-strong` | Dashed border styling |
| `.crochet-shadow` | Box shadow using theme token |
| `.no-scrollbar` | Hide scrollbar |
| `.glass` | Frosted glass effect |
| `.btn-primary` / `.btn-secondary` / `.btn-accent` | Button variants |
| `.label-md` / `.label-sm` | Typography label classes |
| `.product-card` + `.quick-view` + `.product-image` | Card hover animations |
| `.badge-*` (4 variants) | Product badges |
| `.accordion-trigger` / `.accordion-icon` | Accordion patterns |
| `.masonry-item` | Masonry grid items |
| `.cart-drawer` / `.cart-backdrop` | Drawer layout + backdrop |
| `.sticky-bottom-bar` | Fixed bottom bar pattern |
| `.whatsapp-fab` / `.quick-shop-fab` | Floating action buttons |

### Layer 5: `@layer utilities`

- `.text-balance`, `.img-cover`, `.hover-lift`, `.hover-scale`, `.backdrop-blur-xs`

### Layer 6: `.container` (Outside any layer)

Manual container queries for max-width 80rem with responsive padding.

### ⚠️ CSS Conflicts & Duplications

1. **`.cart-drawer` z-index defined in TWO places:**
   - `globals.css` line 162: `z-index: 60`
   - `CartDrawer.tsx` line 35: Tailwind class `z-[60]`
   These agree but are redundant.

2. **`.cart-backdrop` is defined in globals.css but NEVER used as a class:**
   - `globals.css` line 163: `.cart-backdrop { z-index: 55; ... }`
   - `CartDrawer.tsx` line 34 uses inline Tailwind classes: `fixed inset-0 bg-black/30 backdrop-blur-sm z-[55]`
   - **Dead code.**

3. **`--color-secondary` is defined TWICE in `.dark` block:**
   - Line 102: `--color-secondary: #B0B0B0;`
   - Line 112: `--color-secondary: #7A8563;`
   The second definition (sage green) overwrites the first (gray). May be intentional or a bug.

4. **`.whatsapp-fab` z-index in globals.css (`z-index: 60`) vs WhatsAppFAB.tsx (`z-[60]`):**
   Both define same z-index via different mechanisms. Component uses Tailwind class directly, so `.whatsapp-fab` CSS class in globals.css is partially dead.

5. **No CSS conflict between Tailwind and global styles** — Tailwind v4's `@theme` block properly integrates custom properties as design tokens.

---

## 🧩 PROMPT 7 — EVENT HANDLER TRACE

### Navbar.tsx

| Element | Handler | Action |
|---|---|---|
| Cart button `<button>` | `onClick={toggleCart}` | Calls Zustand `toggleCart()` — flips `isCartOpen` |
| Mobile hamburger/X `<button>` | `onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}` | Toggles local state |
| Desktop nav `<Link>` elements | No explicit `onClick` — default Next.js navigation |
| Mobile icon `<Link>` elements (sm breakpoint) | No explicit `onClick` — default Next.js navigation |
| `CurrencyToggle` component | Internal |
| `ThemeToggle` component | Internal |

### MobileMenu.tsx

| Element | Handler | Action |
|---|---|---|
| Backdrop `<div>` | `onClick={onClose}` | Closes menu (tap-to-close) |
| X close `<button>` | `onClick={onClose}` | Closes menu |
| Each nav `<Link>` | `onClick={onClose}` | Closes menu after navigation |
| "Shop the Collection" `<Link>` | `onClick={onClose}` | Closes menu after navigation |
| `CurrencyToggle` inside MobileMenu | Internal |
| `ThemeToggle` inside MobileMenu | Internal |

### CartDrawer.tsx

| Element | Handler | Action |
|---|---|---|
| Backdrop `<div>` | `onClick={() => setIsCartOpen(false)}` | Closes cart |
| X close `<button>` | `onClick={() => setIsCartOpen(false)}` | Closes cart |
| Remove item `<button>` | `onClick={() => removeItem(item.productId, item.size)}` | Removes from Zustand store |
| Quantity `-` `<button>` | `onClick={() => updateQuantity(..., quantity - 1)}` | Decrements |
| Quantity `+` `<button>` | `onClick={() => updateQuantity(..., quantity + 1)}` | Increments |
| Empty state "Browse the Collection" `<Link>` | `onClick={() => setIsCartOpen(false)}` | Closes cart |
| Shipping `<select>` | `onChange={(e) => setShippingRegion(e.target.value)}` | Updates local region state |
| "Secure Checkout" `<button>` | `onClick={() => { setIsCartOpen(false); router.push('/checkout') }}` | Closes cart, navigates |

### ⚠️ Links/Buttons WITHOUT Explicit Handlers

- **Desktop nav `<Link>` elements in Navbar** — no `onClick`, rely on default Next.js `<Link>` navigation.
- **Mobile icon-only `<Link>` elements in Navbar** (sm breakpoint) — no `onClick`, default navigation.
- **Logo/Brand `<Link>` in Navbar** — no `onClick`, default navigation to `/`.

---

## 🧩 PROMPT 8 — ROUTING SYSTEM

### All Routes

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ Working | Home page — HeroSection + BentoGrid + NewsletterSection |
| `/collections` | ⚠️ Placeholder | Shows "Coming soon" |
| `/collections/[category]` | ✅ Working | Product grid (async data fetch) |
| `/products/[slug]` | ✅ Working | Product detail page (async data fetch) |
| `/checkout` | ✅ Working | Checkout form + order summary |
| `/admin` | ⚠️ Guarded | `isAdmin = false` — shows "Access Denied" |
| `/about` | ⚠️ Placeholder | Shows "Coming soon" |
| `/contact` | ⚠️ Placeholder | Shows "Coming soon" |
| `/community` | ✅ Working | Masonry gallery + CTA |
| `/custom-orders` | ⚠️ Placeholder | Shows "Coming soon" |
| `/pets` | ⚠️ Placeholder | Shows "Coming soon" |
| `/shipping` | ⚠️ Placeholder | Shows "Coming soon" |
| `/returns` | ⚠️ Placeholder | Shows "Coming soon" |
| `/terms` | ⚠️ Placeholder | Shows "Coming soon" |
| `/privacy` | ⚠️ Placeholder | Shows "Coming soon" |

### Navigation Paths (from constants.ts)

**NAV_LINKS:**
```
Home → /
Shop → /collections
Custom Orders → /custom-orders
Pets → /pets
About → /about
Contact → /contact
```

**FOOTER_LINKS:**
```
Shop:
  Clothing → /collections/clothing
  Plushies → /collections/plushies
  Your Pets → /collections/pets
  New Arrivals → /collections?sort=newest
Support:
  WhatsApp → https://wa.me/27790427032
  Email → mailto:hello@mmwafrika.com
  Shipping Policy → /shipping
  Returns → /returns
Legal:
  Privacy Policy → /privacy
  Terms of Service → /terms
```

### ⚠️ Routes Referenced but Not Implemented

- `/collections/clothing` — Footer link (should work via dynamic `[category]` route)
- `/collections/plushies` — Footer link (should work via dynamic `[category]` route)
- `/collections/pets` — Footer link (should work via dynamic `[category]` route)
- `/collections?sort=newest` — Footer link (query param not handled)

### ⚠️ Links That Do Nothing (Dead Ends)

- **SOCIAL links** in constants.ts: `instagram: '#'`, `tiktok: '#'`, `facebook: '#'` — all point to `#`
- **Footer "Stories" section** — `stories: []` in FOOTER_LINKS (empty array)

---

## 🧩 PROMPT 9 — ICON SYSTEM

### No External Icon Library

**Zero icon packages installed.** No `lucide`, `@heroicons`, `react-icons`, `@tabler`, `heroicons` found in package.json.

### All Icons Are Inline SVGs

**39 inline SVG icons** found across the codebase. Icon paths appear to be heavily inspired by **Feather Icons** (shopping bag, X, trash, chevron, sun, moon match Feather's path data).

**Icon rendering pattern:**
- `viewBox="0 0 24 24"` (Feather-style 24x24 grid)
- `fill="none" stroke="currentColor" strokeWidth="1.5"` (outline icons)
- OR `fill="currentColor"` (filled icons like WhatsApp, social media)
- `strokeLinecap="round" strokeLinejoin="round"` for consistency

### Icon Locations

| File | Icons Used |
|---|---|
| `Navbar.tsx` | Brand logo (custom compass-like SVG), 6 nav icons (home, shop, custom orders, pets, about, contact), shopping bag, hamburger, X |
| `MobileMenu.tsx` | X close button |
| `CartDrawer.tsx` | X close, trash, shopping bag (empty state), chevron down, arrow-right, shield |
| `ThemeToggle.tsx` | Sun (dark mode), moon (light mode), placeholder circle |
| `WhatsAppFAB.tsx` | WhatsApp logo (filled path) |
| `Footer.tsx` | Instagram, TikTok, Facebook social icons |
| `ProductCard.tsx` | Pet-safe paw icon |
| `HeroSection.tsx` | Arrow-right icon |
| `BentoGrid.tsx` | Smiley face icon |
| `ProductControls.tsx` | Warning triangle icon |
| `BackButton.tsx` | Text-only (`← Back`), no SVG |
| Various page components | Chevron, checkmark, alert, etc. |

### ⚠️ Icon System Issues

- **No centralized icon component** — each file defines its own SVGs inline
- **Duplicate SVG code** — same icons (X, chevron, etc.) defined multiple times across files
- **No icon library** — would benefit from lucide-react or heroicons for consistency and maintainability

---

## 🧩 PROMPT 10 — THEME SYSTEM

### useTheme Hook (`src/hooks/useTheme.ts`)

```ts
const THEME_KEY = 'mmwafrika-theme'

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)
  // ...
  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])
  return { theme, toggle, mounted }
}
```

**State storage:**
- **In-memory:** React `useState` within each `useTheme()` call
- **Persistence:** `localStorage` under key `'mmwafrika-theme'`
- **DOM application:** `document.documentElement.classList.toggle('dark', theme === 'dark')` via `requestAnimationFrame`

### Hydration Safety

**Layout.tsx includes blocking `<script>` in `<head>`:**
```html
<script dangerouslySetInnerHTML={{ __html: `(function(){
  try {
    var t=localStorage.getItem('mmwafrika-theme');
    if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches)){
      document.documentElement.classList.add('dark')
    }
  } catch(e) {}
})();` }} />
```

This runs before React hydration to prevent flash of wrong theme.

**System preference fallback:** If no localStorage value exists, checks `window.matchMedia('(prefers-color-scheme: dark)').matches`.

### ThemeToggle Component (`src/components/ui/ThemeToggle.tsx`)

```tsx
export default function ThemeToggle() {
  const { theme, toggle, mounted } = useTheme()
  // renders sun icon (light mode) or moon icon (dark mode)
  return <button onClick={toggle} ...>
}
```

### Where ThemeToggle Is Rendered (3 locations)

1. **Navbar.tsx** (desktop `sm:block`) — `<span className="hidden sm:block"><ThemeToggle /></span>`
2. **MobileMenu.tsx** (mobile) — inside footer section alongside CurrencyToggle
3. **No other locations** — not rendered on product pages, checkout, or admin

### ⚠️ Theme System Race Condition

Every call to `useTheme()` creates its **own independent `useState`**. This means:
- If `ThemeToggle` is rendered twice (Navbar + MobileMenu), they each have separate state instances.
- They sync to the same `localStorage` key and same `document.documentElement.classList`, so they stay visually in sync.
- **BUT:** The `useEffect` that writes to `document.documentElement` runs on every `theme` change, so toggling one will update the DOM, but the *other* component's internal `useState` will NOT update — it will be stale until the next toggle or re-mount.
- **This is a subtle but real race condition with dual-mounted toggles.**

### Dark Mode CSS Strategy

**Class-based, not media-query-based:**
```css
/* Light mode (default) */
:root {
  --color-bg: #FAFAF9;
  --color-primary: #2C2C2C;
  /* ... */
}

/* Dark mode (triggered by .dark class on <html>) */
.dark {
  --color-bg: #1A1A1A;
  --color-primary: #F5F5F5;
  /* ... */
}
```

**No automatic system theme tracking after initial load.** User must manually toggle.

---

## 📊 PHASE 1 SUMMARY — KEY FINDINGS

### ✅ Strengths
- Clean architecture with server components by default
- Zustand for cart state with localStorage persistence
- Well-organized Tailwind CSS v4 with custom @theme tokens
- Hydration-safe theme system with blocking script
- Responsive navbar with auto-close on navigation
- Good z-index layering for overlays

### ⚠️ Issues Identified
1. **MobileMenu has no body scroll lock** — user can scroll background
2. **MobileMenu has no Escape key handler** — accessibility gap
3. **Theme state race condition** — dual ThemeToggle instances have independent state
4. **Dead CSS code** — `.cart-backdrop`, `.whatsapp-fab` classes in globals.css unused
5. **Duplicate `--color-secondary` in `.dark` block** — first definition overwritten
6. **No icon library** — 39 inline SVGs with duplication
7. **11 of 16 routes are placeholders** — "Coming soon" pages
8. **Social links point to `#`** — dead ends
9. **No portals for overlays** — all inline (works but not ideal for complex cases)
10. **Footer "Stories" section is empty** — `stories: []`

### 🔴 Critical (Must Fix)
- Theme state race condition (Prompt 10)
- MobileMenu missing Escape key handler (Prompt 4)
- MobileMenu missing body scroll lock (Prompt 4)

### 🟡 Important (Should Fix)
- Dead CSS code cleanup (Prompt 6)
- Duplicate CSS variable in `.dark` block (Prompt 6)
- Social links are dead ends (Prompt 8)
- No centralized icon system (Prompt 9)

### 🟢 Nice to Have
- Consider React Portal for complex overlays
- Consider icon library (lucide-react recommended)
- Implement empty "Stories" footer section

---

# 🔍 PHASE 2 — BEHAVIORAL AUDIT (WHAT ACTUALLY HAPPENS)

> **Date:** 6 April 2026  
> **Phase:** 2 (Behavioral Audit)

---

## 🚨 PROMPT 11 — HAMBURGER MENU BEHAVIOR

### What State Changes

When hamburger is clicked:
```tsx
// Navbar.tsx line 91
onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
```

**State changes:**
1. `isMobileMenuOpen` toggles from `false` → `true` (or vice versa) in Navbar's local state
2. This triggers re-render of:
   - Navbar's hamburger/X icon swap (lines 86-91)
   - MobileMenu component receives new `isOpen` prop

### What DOM Elements Change

**Backdrop (MobileMenu.tsx line 17-23):**
```tsx
{isOpen && (
  <div className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-sm" onClick={onClose} />
)}
```
- **When closed:** Not in DOM at all (conditional render)
- **When open:** Appears instantly as full-screen semi-transparent overlay

**Menu panel (MobileMenu.tsx line 24):**
```tsx
<aside className={`fixed inset-y-0 right-0 z-[100] ... ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
```
- **Always in DOM** (not conditionally rendered)
- Uses CSS transform to slide in/out:
  - Closed: `translate-x-full` (off-screen right)
  - Open: `translate-x-0` (visible)
- Transition: `transition-transform duration-300` (300ms slide animation)

**Hamburger icon (Navbar.tsx lines 86-91):**
```tsx
{isMobileMenuOpen ? (
  <svg>...</svg> // X icon
) : (
  <svg>...</svg> // Hamburger icon
)}
```
- Swaps between 3-line hamburger → X icon instantly (no animation)

### Expected vs Actual Behavior

| Behavior | Expected | Actual | Status |
|---|---|---|---|
| Menu slides in from right | ✅ Slide animation | ✅ CSS transform with 300ms transition | ✅ Works |
| Backdrop appears | ✅ Fade/opacity | ✅ Conditional render (instant) | ⚠️ No animation |
| Body scroll locks | ❌ Should lock | ❌ No scroll lock | 🔴 **FAILS** |
| Focus trapped inside | ❌ Should trap | ❌ No focus trap | 🔴 **FAILS** |
| Escape closes | ❌ Should close | ❌ No Escape handler | 🔴 **FAILS** |
| Icon animates | ⚠️ Should animate | ⚠️ Instant swap (no transition) | 🟡 Minor |
| Backdrop animates | ⚠️ Should fade | ⚠️ Instant appear/disappear | 🟡 Minor |

**Root cause:** MobileMenu is a lightweight overlay missing critical accessibility and UX features that CartDrawer has.

---

## 🚨 PROMPT 12 — SCROLL LOCK FAILURE

### Why Body Is Still Scrollable

**The missing code:**
```tsx
// CartDrawer HAS this (CartDrawer.tsx line 27):
useEffect(() => {
  document.body.style.overflow = isCartOpen ? 'hidden' : 'auto'
  return () => { document.body.style.overflow = 'auto' }
}, [isCartOpen])

// MobileMenu DOES NOT have this
```

**What's missing in MobileMenu.tsx:**
There is **zero** `useEffect` that manipulates `document.body.style.overflow`. The component relies entirely on the backdrop for visual coverage but does nothing to prevent background scroll.

### How to Fix

Add to MobileMenu.tsx:
```tsx
useEffect(() => {
  document.body.style.overflow = isOpen ? 'hidden' : 'auto'
  return () => { document.body.style.overflow = 'auto' }
}, [isOpen])
```

### Why This Matters

When menu is open on mobile:
1. User taps hamburger → menu opens
2. User tries to navigate menu
3. User accidentally scrolls finger up/down
4. **Background page scrolls behind the menu** — broken UX
5. User loses their place on the page

**CartDrawer does this correctly** — MobileMenu needs the same treatment.

---

## 🚨 PROMPT 13 — SCROLL BLEED ANALYSIS

### Why Scroll Propagates to Background

**Architecture issue:** The entire app shares a single scroll container — the `<html>` element.

```
<html> ← Primary scroll container
  <body> ← min-h-screen flex flex-col (does NOT scroll independently)
    <Navbar /> ← fixed position (doesn't scroll)
    <main> ← flex-grow (content scrolls through html/body)
    <Footer />
```

When MobileMenu opens:
1. Menu panel has `h-screen` (100vh height)
2. If content exceeds 100vh, it should scroll internally
3. **But:** No `overflow-y: auto` on the menu's inner container
4. **Result:** Scroll event bubbles up to `<html>` — background scrolls instead

### Missing Containment Logic

**CartDrawer has proper scroll containment:**
```tsx
// CartDrawer.tsx line 46
<div className="flex-1 overflow-y-auto px-8 py-4 space-y-10">
  {/* Scrollable content area */}
</div>
```

**MobileMenu has NO scroll container:**
```tsx
// MobileMenu.tsx line 26
<div className="flex flex-col h-screen p-10 justify-between">
  {/* All content here — no overflow-y if content exceeds height */}
</div>
```

### The Fix

MobileMenu needs:
1. **Outer container:** `overflow-hidden` to prevent bleed
2. **Inner scrollable area:** `overflow-y-auto` on the nav section
3. **Body lock:** `document.body.style.overflow = 'hidden'` (Prompt 12)

```tsx
<aside className="fixed inset-y-0 right-0 z-[100] w-full max-w-sm bg-surface-container-lowest shadow-2xl transition-transform duration-300 transform overflow-hidden ${...}">
  <div className="flex flex-col h-screen p-10">
    {/* Header — fixed at top */}
    <div className="flex justify-between items-center mb-12 flex-shrink-0">
      {/* Brand + X button */}
    </div>
    
    {/* Scrollable nav area */}
    <div className="flex-1 overflow-y-auto space-y-12">
      <nav className="flex flex-col space-y-2 ...">
        {NAV_LINKS.map(...)}
      </nav>
    </div>
    
    {/* Footer — fixed at bottom */}
    <div className="space-y-8 flex-shrink-0">
      {/* Currency, Theme, CTA */}
    </div>
  </div>
</aside>
```

---

## 🚨 PROMPT 14 — MOBILE MENU OVERFLOW

### Why Content Exceeds Viewport Height

**Current layout (MobileMenu.tsx line 26):**
```tsx
<div className="flex flex-col h-screen p-10 justify-between">
```

This sets the container to `h-screen` (100vh) but:
- Has `justify-between` which spreads content across full height
- Has NO `overflow` constraint
- Child elements can exceed the container's bounds

### Why It's Not Scrollable

**No overflow property is set anywhere on the menu panel.**

The `aside` has:
```tsx
className="fixed inset-y-0 right-0 z-[100] w-full max-w-sm bg-surface-container-lowest shadow-2xl transition-transform duration-300 transform ..."
```

Missing: `overflow-hidden` or `overflow-y-auto`

### The Exact Container Causing This

**File:** `src/components/layout/MobileMenu.tsx`  
**Line:** 26  
**Element:** `<div className="flex flex-col h-screen p-10 justify-between">`

This container:
- Is `h-screen` (100vh)
- Uses `justify-between` to distribute content
- Has **NO overflow handling**
- Children (nav links + footer) can exceed available space on small screens
- No internal scroll mechanism exists

### On a 375px iPhone SE in Portrait:

```
h-screen = ~667px
Header (brand + X) = ~60px
Nav links (6 items × ~56px) = ~336px
Footer (currency + theme + CTA) = ~200px
Padding (p-10 = 40px × 2) = 80px
Total needed = ~676px
Available = ~667px
Overflow = ~9px (and growing on smaller screens)
```

**Result:** Content clips at bottom, last items may be unreachable.

---

## 🚨 PROMPT 15 — TOUCH SCROLL BEHAVIOR (MOBILE)

### Passive Listeners

**No custom scroll event listeners exist in the codebase.**

The grep search for `addEventListener.*scroll` returned zero matches. There are no passive/active listener conflicts because no manual scroll listeners are registered.

### Overflow Configuration Issues

**Current state:**
- `<html>` — default `overflow: visible` (scrolls naturally)
- `<body>` — `min-h-screen flex flex-col` (no overflow constraint)
- MobileMenu panel — NO overflow property set
- MobileMenu inner container — NO overflow property set

**On mobile browsers:**
- iOS Safari: Scroll events bubble through overlays by default
- Android Chrome: Same behavior — touch events propagate to background
- Both require explicit `overflow: hidden` on body AND `overflow-y: auto` on the overlay container

**The problem:**
1. User touches mobile menu
2. User drags finger up/down
3. Browser looks for scrollable container
4. Finds none inside menu (no `overflow-y: auto`)
5. Falls back to `<html>` scroll
6. Background page scrolls instead of menu

### Touch-Specific Fix

For proper mobile behavior:
```css
/* Add to MobileMenu's outer container */
overflow-y: auto;
-webkit-overflow-scrolling: touch; /* iOS momentum scroll */
overscroll-behavior: contain; /* Prevent scroll chaining */
```

In Tailwind classes:
```tsx
className="... overflow-y-auto overscroll-contain"
```

---

## 🚨 PROMPT 16 — BUTTON FUNCTIONALITY CHECK

### All Buttons — Functional Status

#### ✅ Buttons WITH Proper Handlers

| Button | Location | Handler | Function |
|---|---|---|---|
| Hamburger | Navbar.tsx | `onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}` | ✅ Opens/closes menu |
| X (close menu) | MobileMenu.tsx | `onClick={onClose}` | ✅ Closes menu |
| Cart button | Navbar.tsx | `onClick={toggleCart}` | ✅ Opens cart via Zustand |
| X (close cart) | CartDrawer.tsx | `onClick={() => setIsCartOpen(false)}` | ✅ Closes cart |
| Remove item | CartDrawer.tsx | `onClick={() => removeItem(...)}` | ✅ Removes from cart |
| Quantity -/+ | CartDrawer.tsx | `onClick={() => updateQuantity(...)}` | ✅ Updates quantity |
| Secure Checkout | CartDrawer.tsx | `onClick={() => { setIsCartOpen(false); router.push('/checkout') }}` | ✅ Closes cart, navigates |
| Theme toggle | ThemeToggle.tsx | `onClick={toggle}` | ✅ Toggles theme |
| Currency toggle | CurrencyToggle.tsx | Internal | ✅ Toggles currency |
| Newsletter submit | NewsletterSection.tsx | `onSubmit` | ✅ Mock form submission |

#### ⚠️ Buttons WITH Issues

| Button | Location | Issue | Severity |
|---|---|---|---|
| Backdrop tap (MobileMenu) | MobileMenu.tsx line 20 | `onClick={onClose}` — works, but no `role="button"` or `tabIndex` | 🟡 Accessibility |
| Backdrop tap (CartDrawer) | CartDrawer.tsx line 34 | Same — works but not keyboard accessible | 🟡 Accessibility |

#### 🔴 Buttons/Links WITHOUT Handlers (Dead)

| Element | Location | Issue |
|---|---|---|
| **Instagram link** | Footer.tsx | `href="#"` — goes nowhere |
| **TikTok link** | Footer.tsx | `href="#"` — goes nowhere |
| **Facebook link** | Footer.tsx | `href="#"` — goes nowhere |
| **Footer "Stories" section** | constants.ts | Empty array — not rendered at all |

#### ✅ Links That Work (Default Next.js Navigation)

All `<Link>` components without explicit `onClick` handlers still work because Next.js `<Link>` handles navigation automatically:
- Desktop nav links (Navbar.tsx)
- Tablet icon links (Navbar.tsx)
- Logo link (Navbar.tsx)
- All footer links (Footer.tsx)
- All page-internal links (BentoGrid, HeroSection, etc.)

**These are NOT broken** — they just don't have additional side effects beyond navigation.

---

## 🚨 PROMPT 17 — THEME TOGGLE DISAPPEARANCE

### Where It Was Before

**In the Navbar (desktop/tablet):**
```tsx
// Navbar.tsx line 82
<span className="hidden sm:block"><ThemeToggle /></span>
```

This renders ThemeToggle at `sm` breakpoint (640px+) and above.

### Where It Is Now

**Two locations:**
1. **Navbar.tsx (sm and up):** `<span className="hidden sm:block"><ThemeToggle /></span>`
2. **MobileMenu.tsx (mobile only):** Inside the drawer's footer section

### Why It "Disappears" on Mobile

**It doesn't disappear — it moves.**

The ThemeToggle in Navbar has:
```tsx
className="hidden sm:block"
```

This means:
- `<640px` (mobile): **Hidden** (`display: none`)
- `≥640px` (tablet+): **Visible**

But MobileMenu has its own ThemeToggle instance:
```tsx
// MobileMenu.tsx lines 49-52
<div className="flex items-center justify-between px-2 py-4 border-t border-dashed border-border">
  <span className="font-body text-sm text-secondary">Theme</span>
  <ThemeToggle />
</div>
```

This is only visible when MobileMenu is open (mobile only).

### The Actual Behavior

| Viewport | Navbar ThemeToggle | MobileMenu ThemeToggle | User sees |
|---|---|---|---|
| Mobile (<640px) | ❌ Hidden | ✅ In hamburger menu | Theme toggle inside mobile menu |
| Tablet (640-1024px) | ✅ Visible | ❌ Menu closed | Theme toggle in navbar |
| Desktop (>1024px) | ✅ Visible | ❌ Menu closed | Theme toggle in navbar |

**⚠️ The race condition (from Phase 1):** Both ThemeToggle instances have independent `useState`. Toggling one updates the DOM but not the other's internal state. They stay visually in sync via localStorage/DOM, but React state diverges.

### Why This Design Was Chosen

- **Space constraint:** Mobile navbar only has hamburger + cart + currency toggle
- **UX pattern:** Mobile users expect settings in the slide-out menu
- **Desktop pattern:** Desktop users expect controls visible in navbar

**The design is intentional but the implementation has the race condition bug.**

---

## 🚨 PROMPT 18 — Z-INDEX & LAYERING

### Stacking Context Analysis

**Current z-index values:**

| Element | Z-index | Type | Context |
|---|---|---|---|
| BackButton | `z-40` | Sticky | Normal flow |
| Navbar | `z-50` | Fixed | Creates stacking context |
| Cart backdrop | `z-[55]` | Fixed | Normal flow |
| Cart panel | `z-[60]` | Fixed | Normal flow |
| WhatsApp FAB | `z-[60]` | Fixed | Normal flow |
| Mobile menu backdrop | `z-[99]` | Fixed | Normal flow |
| Mobile menu panel | `z-[100]` | Fixed | Normal flow |

### Is the Menu Properly Above Everything?

**✅ Yes.** Mobile menu panel (`z-[100]`) is above:
- Navbar (`z-50`) ✅
- Cart drawer (`z-[60]`) ✅
- WhatsApp FAB (`z-[60]`) ✅
- BackButton (`z-40`) ✅

### Potential Conflicts

#### 1. Cart Panel and WhatsApp FAB Share Z-index

Both use `z-[60]`:
- Cart panel (CartDrawer.tsx line 35)
- WhatsApp FAB (WhatsAppFAB.tsx)

**Result:** Since CartDrawer renders AFTER WhatsAppFAB in layout.tsx, it appears above FAB when both are open. This is **correct behavior** but relies on render order, not explicit z-index hierarchy.

**Risk:** If render order changes, this could break.

#### 2. Mobile Menu Backdrop vs Cart Backdrop

- Mobile menu backdrop: `z-[99]`
- Cart backdrop: `z-[55]`

If both are open simultaneously (possible — no mutual exclusion), mobile menu backdrop would appear above cart. **This is a edge case not handled.**

#### 3. No Stacking Context Isolation

None of these elements create their own stacking context with `isolation: isolate`. They all live in the root stacking context. This works now but could cause issues if new overlays are added.

**Recommendation:**
```css
/* Add to overlay containers */
isolation: isolate; /* Creates new stacking context */
```

### Element Interference

**Current interference:**
- ✅ No overlap between cart drawer (right, max-w-[450px]) and mobile menu (right, max-w-sm)
- ✅ Navbar (`z-50`) doesn't block mobile menu (`z-[100]`)
- ⚠️ WhatsApp FAB (`z-[60]`) could overlap with cart drawer panel (`z-[60]`) on narrow screens

**On mobile with cart open:**
- Cart panel: `w-full max-w-[450px]` — may cover entire screen on mobile
- WhatsApp FAB: Fixed bottom-right — would be underneath cart panel
- **This is acceptable** — FAB shouldn't be clickable when cart is open

---

## 🚨 PROMPT 19 — NAVBAR MOBILE MODE

### Portrait vs Landscape Comparison

#### Portrait Mode (<640px)

**What renders:**
```
[Logo]          [Currency] [Cart] [Hamburger]
```

- **Nav links:** ❌ Hidden (both text AND icon versions)
- **Currency toggle:** ✅ Visible
- **Theme toggle:** ❌ Hidden (`hidden sm:block`)
- **Cart button:** ✅ Visible
- **Hamburger:** ✅ Visible

#### Tablet Mode (640px - 1024px)

**What renders:**
```
[Logo]   [🏠] [🛍️] [✏️] [🐾] [ℹ️] [✉️]   [Currency] [Theme] [Cart] [Hamburger]
```

- **Nav links (text):** ❌ Hidden (`hidden lg:flex`)
- **Nav links (icons):** ✅ Visible (`sm:flex lg:hidden`)
- **Currency toggle:** ✅ Visible
- **Theme toggle:** ✅ Visible (`sm:block`)
- **Cart button:** ✅ Visible
- **Hamburger:** ✅ Visible (always shown on tablet)

#### Desktop Mode (>1024px)

**What renders:**
```
[Logo]   Home  Shop  Custom Orders  Pets  About  Contact   [Currency] [Theme] [Cart]
```

- **Nav links (text):** ✅ Visible (`lg:flex`)
- **Nav links (icons):** ❌ Hidden (`lg:hidden`)
- **Currency toggle:** ✅ Visible
- **Theme toggle:** ✅ Visible
- **Cart button:** ✅ Visible
- **Hamburger:** ❌ Hidden (`sm:hidden`)

### Which Components Change

| Breakpoint | Nav Links | Theme | Hamburger |
|---|---|---|---|
| <640px | ❌ All hidden | In MobileMenu | ✅ Shown |
| 640-1024px | Icons only | In navbar | ✅ Still shown |
| >1024px | Text links | In navbar | ❌ Hidden |

### Why Icons Appear Inconsistent

**The icon rendering logic (Navbar.tsx lines 52-69):**

```tsx
const getIcon = (label: string) => {
  switch (label) {
    case 'Home': return <home-icon-paths />
    case 'Shop': return <shopping-bag-paths />
    case 'Custom Orders': return <edit/pencil-paths />
    case 'Pets': return <custom-animal-face-paths />
    case 'About': return <info-circle-paths />
    case 'Contact': return <mail-paths />
    default: return <circle /> // Fallback
  }
}
```

**Issues:**

1. **Hardcoded string matching** — `case 'Custom Orders':` matches the label from constants.ts exactly. If label changes, icon breaks silently.

2. **No type safety** — No TypeScript enforcement that NAV_LINKS labels match switch cases.

3. **Icons don't match function semantically:**
   - "Custom Orders" → Pencil/edit icon (makes sense ✏️)
   - "Pets" → Custom animal face (creative but unclear 🐾)
   - "About" → Info circle (standard ℹ️)
   - "Contact" → Envelope (standard ✉️)

4. **Different icon style from desktop** — Desktop uses text labels, tablet uses abstract icons. Users must learn two different representations.

5. **Hamburger shown on tablet despite having nav icons** — Why have icon nav if hamburger is still needed? Redundant navigation methods.

---

## 🚨 PROMPT 20 — ICON CLARITY AUDIT

### Icon Semantic Clarity

| Icon | Used For | Clarity | Match Function? | Notes |
|---|---|---|---|---|
| **Compass/crosshair** | Brand logo | 🟡 Abstract | ⚠️ Decorative | Works as brand mark, not functional icon |
| **Home (house)** | Home nav | ✅ Clear | ✅ Perfect | Universal pattern |
| **Shopping bag** | Shop nav | ✅ Clear | ✅ Good | Standard e-commerce pattern |
| **Pencil/edit** | Custom Orders | ✅ Clear | ✅ Good | Edit = customization |
| **Animal face** | Pets | 🟡 Unclear | ⚠️ Creative but ambiguous | Could be "animals", "nature", "wildlife" |
| **Info circle** | About | ✅ Clear | ✅ Perfect | Universal pattern |
| **Envelope** | Contact | ✅ Clear | ✅ Perfect | Universal pattern |
| **Shopping bag (cart)** | Cart button | ✅ Clear | ✅ Perfect | Standard e-commerce |
| **Hamburger (3 lines)** | Open menu | ✅ Clear | ✅ Perfect | Universal mobile pattern |
| **X (close)** | Close menu/cart | ✅ Clear | ✅ Perfect | Universal close pattern |
| **Sun** | Light mode toggle | ✅ Clear | ✅ Perfect | Universal pattern |
| **Moon** | Dark mode toggle | ✅ Clear | ✅ Perfect | Universal pattern |
| **Trash** | Remove item | ✅ Clear | ✅ Perfect | Universal delete pattern |
| **Chevron down** | Shipping selector | ✅ Clear | ✅ Good | Standard dropdown indicator |
| **Arrow right** | Checkout/CTA | ✅ Clear | ✅ Good | Forward action pattern |
| **Shield** | Secure checkout | ✅ Clear | ✅ Perfect | Security indicator |
| **Paw** | Pet-safe badge | ✅ Clear | ✅ Perfect | Clear pet association |
| **WhatsApp logo** | WhatsApp FAB | ✅ Clear | ✅ Perfect | Brand recognition |
| **Instagram** | Social link | ✅ Clear | ✅ Perfect | Brand recognition |
| **TikTok** | Social link | ✅ Clear | ✅ Perfect | Brand recognition |
| **Facebook** | Social link | ✅ Clear | ✅ Perfect | Brand recognition |
| **Smiley face** | BentoGrid section | 🟡 Unclear | ⚠️ Decorative | Doesn't communicate section purpose |
| **Warning triangle** | ProductControls | ✅ Clear | ✅ Good | Standard warning pattern |
| **Arrow left (←)** | Back button | ✅ Clear | ✅ Perfect | Universal back pattern (text-based) |

### Icon System Strengths

- ✅ All icons use consistent `viewBox="0 0 24 24"` grid
- ✅ Consistent `strokeWidth="1.5"` for outline icons
- ✅ Consistent `strokeLinecap="round" strokeLinejoin="round"`
- ✅ All use `currentColor` for theme awareness
- ✅ Clear `aria-label` on interactive icons

### Icon System Weaknesses

1. **🔴 No centralized icon library**
   - 39 inline SVG definitions across files
   - Same icons (X, chevron, shopping bag) defined 3-4 times each
   - Maintenance nightmare — changing an icon requires updating multiple files

2. **🟡 No TypeScript enforcement**
   - Icons are just SVG elements — no type checking
   - No guarantee two "X" icons are identical
   - No way to audit which icons are duplicates

3. **🟡 Inconsistent fill vs stroke**
   - Most icons: `fill="none" stroke="currentColor"` (outline style)
   - Social/WhatsApp icons: `fill="currentColor"` (filled style)
   - Both work but visual weight differs

4. **🟡 Missing semantic labels**
   - Some icons have `aria-label`, some don't
   - Decorative icons should have `aria-hidden="true"` (some do, some don't)

5. **🟡 "Pets" icon ambiguity**
   - Custom animal face SVG doesn't clearly communicate "pets"
   - Could be confused with "wildlife", "nature", or decorative element
   - Consider using a standard paw print or pet silhouette

### Recommendation

**Move to an icon system:**

```tsx
// src/components/icons/index.tsx
import { LucideIcon } from 'lucide-react'

export const Icons = {
  Home: (props) => <svg ...>{/* home paths */}</svg>,
  Shop: (props) => <svg ...>{/* shopping bag paths */}</svg>,
  // ... etc
}

// Usage:
import { Icons } from '@/components/icons'
<Icons.Home className="w-5 h-5" />
```

**Or adopt lucide-react (recommended):**
```bash
npm install lucide-react
```

Then replace all inline SVGs with:
```tsx
import { Home, ShoppingBag, Edit, Paw, Info, Mail } from 'lucide-react'

<Home className="w-5 h-5" />
```

Benefits:
- Single source of truth per icon
- Type-safe props
- Consistent API
- Tree-shakeable (only bundle icons you use)
- Accessible by default

---

## 📊 PHASE 2 SUMMARY — KEY FINDINGS

### 🔴 Critical Issues (Break UX)

| Issue | Prompt | Impact |
|---|---|---|
| **MobileMenu doesn't lock body scroll** | 12, 13 | Background scrolls when menu is open |
| **MobileMenu content not scrollable** | 14, 15 | Content clips on small screens, unreachable items |
| **MobileMenu has no Escape key handler** | 11 | Keyboard users can't close menu |
| **No focus trap in MobileMenu** | 11 | Tab key escapes to background |
| **Theme toggle race condition** | 17 | Dual instances have divergent React state |

### 🟡 Important Issues (Degrade UX)

| Issue | Prompt | Impact |
|---|---|---|
| Mobile menu backdrop has no animation | 11 | Abrupt appearance |
| Hamburger icon has no animation | 11 | Instant swap instead of morph |
| Social links go nowhere (`href="#"`) | 16 | Dead ends for users |
| Tablet has redundant nav + hamburger | 19 | Confusing dual navigation |
| WhatsApp FAB + Cart share z-index | 18 | Potential overlap edge case |
| "Pets" icon semantically unclear | 20 | Doesn't clearly communicate purpose |

### 🟢 Minor Issues (Polish)

| Issue | Prompt | Impact |
|---|---|---|
| No `isolation: isolate` on overlays | 18 | Fragile stacking context |
| Icon duplication (39 inline SVGs) | 20 | Maintenance burden |
| No type safety for icon mapping | 19 | Silent breakage risk |
| Backdrop not keyboard accessible | 16 | Accessibility gap |

### 🎯 Phase 2 Priority Fix Order

1. **Add body scroll lock to MobileMenu** (Prompt 12) — 5 min fix
2. **Make MobileMenu content scrollable** (Prompts 13-15) — 10 min refactor
3. **Add Escape key handler to MobileMenu** (Prompt 11) — 2 lines
4. **Add focus trap to MobileMenu** (Prompt 11) — 10 lines
5. **Fix theme toggle race condition** (Prompt 17) — Requires shared state
6. **Add backdrop animation** (Prompt 11) — Tailwind transition
7. **Fix social links or remove them** (Prompt 16) — Update constants.ts
8. **Adopt icon library** (Prompt 20) — Install + refactor (larger task)

---

*End of Phase 2 — Behavioral Audit Complete*
