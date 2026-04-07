# UI Cleanup & Typography System

> Last updated: 6 April 2026

---

## 1. Typography Tokens (Tailwind Config)

### Font Families
| Token | CSS Variable | Fallback |
|-------|-------------|----------|
| `font-bhineka` | `var(--font-bhineka)` | `serif` |
| `font-vintage` | `var(--font-vintage)` | `serif` |
| `font-sans` | (Inter) | `system-ui, sans-serif` |
| `font-serif` | (Noto Serif) | `Georgia, serif` |

### Font Sizes
| Token | Size | Line Height | Letter Spacing | Usage |
|-------|------|-------------|----------------|-------|
| `text-display-xl` | `clamp(3.5rem, 6vw, 4.5rem)` | 1.05 | -0.025em | Hero headlines |
| `text-display-lg` | `clamp(2.5rem, 5vw, 3.5rem)` | 1.1 | -0.02em | Accent lines, sub-heroes |
| `text-h1` | `clamp(2.25rem, 4vw, 3rem)` | 1.15 | -0.015em | Page titles |
| `text-h2` | `clamp(1.75rem, 3vw, 2.25rem)` | 1.2 | -0.01em | Section headers |
| `text-h3` | `clamp(1.5rem, 2.5vw, 1.75rem)` | 1.25 | -0.005em | Sub-sections |
| `text-body-lg` | `1.125rem` | 1.6 | 0 | Long-form body |
| `text-body-md` | `1rem` | 1.6 | 0 | Standard body |
| `text-body-sm` | `0.875rem` | 1.5 | 0 | Secondary body |
| `text-label` | `0.75rem` | 1.4 | 0.05em | Uppercase labels |
| `text-price` | `1.25rem` | 1.3 | 0 | Product pricing |

---

## 2. Component Typography Changes

### Rules Applied
- **Product names** → `text-body-md`
- **Prices** → `text-price`
- **Buttons** → `text-label uppercase` (consistent across all CTAs)
- **Labels** → `text-label` (already includes uppercase + tracking via token)
- **Bhineka/Vintage** → NOT used in buttons, inputs, or navigation

---

### File: `src/components/layout/Navbar.tsx`

| Element | Before | After |
|---------|--------|-------|
| Brand name | `text-2xl` | `text-h2` |
| Nav links | `text-xs uppercase tracking-widest` (+ `font-medium` on non-active) | `text-label` |
| Cart badge count | `text-[10px]` | `text-label` |

### File: `src/components/cart/CartDrawer.tsx`

| Element | Before | After |
|---------|--------|-------|
| "Your Selection" label | `label-md text-[10px] tracking-[0.2em] uppercase` | `text-label` |
| "The Cart" heading | `font-headline text-3xl` | `font-vintage text-h2` |
| Item name (h3) | `font-headline text-lg` | `font-sans text-body-md` |
| Size label | `font-label text-xs` | `text-label` |
| Quantity stepper buttons | `text-xs` | `text-sm` |
| Item price | `font-headline text-lg` | `text-price` |
| Empty state heading | `text-lg` | `text-h3` |
| Empty state body | `text-sm` | `text-body-md` |
| Empty state link | `text-sm` | `text-body-md` |
| Shipping label | `label-md text-[10px] tracking-[0.2em] uppercase` | `text-label` |
| Transit time | `text-xs` | `text-label` |
| Subtotal/Shipping rows | `text-sm` | `text-body-sm` |
| Total label | `font-headline text-xl` | `font-vintage text-h3` |
| Total amount | `font-headline text-2xl` | `text-price` |
| Checkout button | `text-on-secondary font-label font-semibold tracking-widest uppercase text-sm` | `text-label uppercase text-sm` |
| Security badge text | `text-[10px] font-medium tracking-tight` | `text-label` |

### File: `src/components/product/ProductCard.tsx`

| Element | Before | After |
|---------|--------|-------|
| Product name (h3) | `font-headline text-xl italic` | `font-sans text-body-md` |
| ZAR price | `font-body text-sm font-semibold` | `text-price font-semibold` |
| USD price | `font-body text-xs` | `text-body-sm` |
| Quick View button | `font-label text-xs uppercase tracking-widest` | `text-label uppercase` |

### File: `src/components/product/ProductControls.tsx`

| Element | Before | After |
|---------|--------|-------|
| Price display | `text-2xl font-body font-light` | `text-price font-light` |
| Currency toggle buttons | `text-[10px] font-bold uppercase tracking-widest` | `text-label` |
| "Select Size" label | `text-[10px] uppercase tracking-[0.3em] font-bold` | `text-label` |
| Add to Bag button | `font-label font-bold tracking-widest uppercase` | `text-label font-bold uppercase` |

### File: `src/components/product/HeroSection.tsx`

| Element | Before | After |
|---------|--------|-------|
| Hero heading (h1) | `font-headline text-5xl md:text-7xl lg:text-8xl italic` | `font-sans text-display-xl` |
| Hero body text | `text-on-surface-variant text-lg md:text-xl font-light` | `font-bhineka text-display-lg md:text-h2 text-secondary/70` |
| Editorial labels | `text-[10px] uppercase tracking-[0.2em] font-bold` | `text-label` |
| Image overlay label | `font-headline italic text-sm` | `font-vintage text-h3 italic` |
| Trust badges | `font-headline text-2xl` | `font-vintage text-h2` |

### File: `src/app/checkout/CheckoutClient.tsx`

| Element | Before | After |
|---------|--------|-------|
| Empty state heading | `font-headline text-3xl` | `font-vintage text-h2` |
| Empty state body | `text-on-surface-variant` | `text-body-md` |
| Page title (h1) | `font-headline text-4xl md:text-5xl` | `font-vintage text-h1` |

### File: `src/components/checkout/CheckoutForm.tsx`

| Element | Before | After |
|---------|--------|-------|
| Success heading | `font-headline text-3xl` | `font-vintage text-h2` |
| Success body | `text-on-surface-variant` | `text-body-md` |
| Success accent line | *(none)* | `font-bhineka text-display-lg md:text-h2` — "Your piece is being prepared with love" |
| Form section title | `font-headline text-2xl` | `font-vintage text-h2` |
| Form labels | `text-[10px] uppercase tracking-[0.2em] font-bold` | `text-label uppercase tracking-wide` |
| Form inputs | `font-body text-sm` | `text-body-md` |
| Error messages | `text-xs` | `text-body-sm` |
| Submit button | `font-label font-bold tracking-widest uppercase text-sm` | `text-label font-bold uppercase` |
| Footer text | `text-xs` | `text-body-sm` |
| Error state message | `text-sm` | `text-body-md` |
| Error state retry | `text-xs` | `text-body-sm` |

### File: `src/components/checkout/OrderSummary.tsx`

| Element | Before | After |
|---------|--------|-------|
| Section title | `font-headline text-2xl` | `font-vintage text-h2` |
| Item name | `font-headline text-base` | `font-sans text-body-md` |
| Size label | `text-xs` | `text-label` |
| Quantity label | `text-xs` | `text-label` |
| Item price | `text-sm font-semibold` | `text-price font-semibold` |
| Subtotal/Shipping rows | `text-sm` | `text-body-sm` |
| Total label | `font-headline text-lg` | `font-vintage text-h3` |
| Total amount | `font-headline text-2xl` | `text-price font-bold` |
| Trust signal | `text-xs` | `text-body-sm` |

### File: `src/app/products/[slug]/page.tsx`

| Element | Before | After |
|---------|--------|-------|
| Product title (h1) | `font-headline text-4xl md:text-5xl lg:text-6xl font-bold italic` | `font-sans text-h1 font-semibold` |
| Accent line | *(new)* | `font-bhineka text-display-lg md:text-h1 text-secondary/60` — "Crafted with intention" |
| ZAR price | `text-3xl font-body font-light` | `text-price` |
| USD price | `text-lg font-body` | `text-body-md` |
| Description | `text-lg font-body font-light` | `text-body-md` |
| Section headers (accordion) | `font-headline text-xl` | `font-vintage text-h2` |
| Accordion body | `text-secondary font-light leading-relaxed text-sm` | `text-body-md text-secondary` |

---

## 3. Font Files Required

Place in `/public/fonts/`:
- `Bhineka.woff2`
- `Vintage.woff2`

CSS variables registered in `app/layout.tsx`:
- `--font-bhineka`
- `--font-vintage`

---

## 4. Design Decisions

- **Bhineka** is used sparingly as an accent font (hero body text, PDP accent line) — adds warmth and personality
- **Vintage** is used for section headers and decorative elements — provides editorial character
- **Buttons, inputs, nav links** never use Bhineka or Vintage — maintain readability and consistency
- **All sizes use `clamp()`** for fluid responsive scaling without breakpoints
- **Line heights are purpose-built** — tight for headings (1.05-1.25), relaxed for body (1.5-1.6)
