# Architectural Analysis: MmwAfrika Frontend

## 1. Theme & Color Governance

### Implementation: CSS Variables + Custom Hook (NOT next-themes)

The project uses a **CSS Variable-driven approach** with a custom `useTheme` hook. No third-party theme provider (next-themes, styled-components) is used.

#### How It Works

**Light mode** variables are defined in the `@theme` block of `globals.css`. **Dark mode** variables are defined in a `.dark {}` selector block. Tailwind color utilities reference these CSS variables directly.

```
globals.css (@theme block)          → defines --color-bg, --color-primary, etc. (light)
globals.css (.dark {} block)        → overrides same variables (dark)
tailwind.config.js (colors: {})     → maps Tailwind names to var(--color-*)
```

#### Key Color Variables

| Variable | Light Mode | Dark Mode | Purpose |
|----------|------------|-----------|---------|
| `--color-bg` | `#F7F5F2` (warm off-white) | `#0E0E0E` (near-black) | Page background |
| `--color-primary` | `#1A1A1A` (near-black) | `#F5F5F5` (near-white) | Primary text |
| `--color-surface` | `#EFEAE5` | `#161616` | Surface/cards |
| `--color-card` | `#FFFFFF` | `#1E1E1E` | Card backgrounds |
| `--color-accent` | `#C6A962` (gold) | `#D4AF37` (brighter gold) | Accent elements |
| `--color-border` | `#E2DDD7` | `#2A2A2A` | Borders/dividers |

#### Theme Toggle Mechanism

1. **FOUC prevention**: `public/theme-init.js` runs synchronously in `<head>` before paint, reads `localStorage`, and adds `.dark` class to `<html>` immediately.
2. **Runtime toggle**: `useTheme` hook (`src/hooks/useTheme.ts`) toggles `.dark` class on `document.documentElement` via `requestAnimationFrame` and persists to `localStorage`.
3. **Visual transition**: `body` has `transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease` — creating a smooth crossfade.
4. **No React re-render cascade**: Only `ThemeToggle` component re-renders; all other elements update via CSS variable swap.

#### Design Flaw Noted in Audits

Each caller to `useTheme()` gets its own independent `useState` instance. If multiple components call it, they each have separate state synced only via `localStorage` + DOM side effects. Currently only `ThemeToggle` calls it, so no bug in practice.

#### Environment-Specific Override

`EnvironmentProvider` toggles `body.env-pets` class on pet-related pages, which overrides `--color-accent` to green (`#829273`) in `globals.css`.

#### Key Files

| Purpose | Path |
|---------|------|
| Global CSS with all color variables | `src/styles/globals.css` |
| Tailwind color mappings | `tailwind.config.js` |
| Custom theme hook | `src/hooks/useTheme.ts` |
| Theme toggle UI | `src/components/ui/ThemeToggle.tsx` |
| FOUC prevention script | `public/theme-init.js` |
| Root layout (loads theme-init.js) | `src/app/layout.tsx` |
| Pet environment override | `src/components/layout/EnvironmentProvider.tsx` |

#### Implication for Logo Styling

The "black" parts of the logo should use `text-primary` (which maps to `var(--color-primary)`). This will **automatically flip** from `#1A1A1A` (light) to `#F5F5F5` (dark) when the theme changes — no additional code needed.

---

## 2. Typography Implementation

### Script Font for "MmwAfrika": Bhineka

The brand name uses **Bhineka**, a custom local handwritten/script font loaded via Next.js `localFont`.

#### Font Stack

| Font | CSS Variable | Tailwind Class | Usage |
|------|-------------|----------------|-------|
| **Bhineka** | `--font-bhineka` | `font-bhineka` | Brand name "MmwAfrika", accent text |
| **Vintage** | `--font-vintage` | `font-vintage` | "Pride Couture", italic accents |
| Inter | `--font-inter` | `font-sans` / `font-body` | Body text, labels |
| Noto Serif | `--font-noto-serif` | `font-serif` / `font-headline` | Headings |

#### Font Loading

Both custom fonts are loaded in `src/app/layout.tsx`:

```tsx
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
```

Applied to `<html>` element alongside Google fonts:
```tsx
<html className={`${notoSerif.variable} ${inter.variable} ${bhineka.variable} ${vintage.variable}`} ...>
```

#### CSS Variable Definition (globals.css)

```css
--font-bhineka: var(--font-bhineka), cursive;
--font-vintage: var(--font-vintage), serif;
```

#### Tailwind Font Family Mapping (tailwind.config.js)

```js
fontFamily: {
  headline: ['Noto Serif', 'Georgia', 'serif'],
  body: ['Inter', 'system-ui', 'sans-serif'],
  label: ['Inter', 'system-ui', 'sans-serif'],
  serif: ['Noto Serif', 'Georgia', 'serif'],
  sans: ['Inter', 'system-ui', 'sans-serif'],
  bhineka: ['var(--font-bhineka)', 'cursive'],
  vintage: ['var(--font-vintage)', 'serif'],
},
```

#### Text Size Scale (CSS Variables via Tailwind v4 @theme)

| Variable | Size | Usage |
|----------|------|-------|
| `--text-display-xl` | `clamp(3.5rem, 6vw, 4.5rem)` | Hero brand "MmwAfrika" |
| `--text-display-lg` | `clamp(2.5rem, 5vw, 3.5rem)` | Large displays |
| `--text-h1` | `clamp(2.25rem, 4vw, 3rem)` | "Pride Couture" |
| `--text-h2` | `clamp(1.75rem, 3vw, 2.25rem)` | Section headings |
| `--text-h3` | `clamp(1.5rem, 2.5vw, 1.75rem)` | Sub-headings |
| `--text-body-md` | `1rem` | Body paragraphs |
| `--text-body-sm` | `0.875rem` | Small text |
| `--text-label` | `0.75rem` | Labels, badges, buttons |

#### Implication for Multi-Color Split

To get multi-color split within a single word (e.g., "Mmw" gold + "Afrika" primary), wrap in separate `<span>` tags within the same parent while keeping it a single string for SEO/accessibility:

```tsx
<span className="font-bhineka font-semibold text-display-xl leading-[1]">
  <span className="text-accent">Mmw</span>
  <span className="text-primary">Afrika</span>
</span>
```

---

## 3. Component Structure

### Hero Section: `src/components/product/HeroSection.tsx`

The Hero is a **pure static component** — no state hooks, no subscriptions, no global store awareness.

#### Complete Left Column JSX Structure

```tsx
<div className="flex flex-col items-center text-center space-y-10 z-10">
  {/* Text content block */}
  <div className="space-y-8">
    {/* Brand name lockup */}
    <div className="flex items-end justify-center gap-5 flex-wrap">
      <span className="font-bhineka font-semibold text-display-xl text-primary leading-[1]">MmwAfrika</span>
      <span className="font-vintage italic text-h1 text-primary">Pride Couture</span>
    </div>

    {/* Main h1 heading */}
    <h1 className="font-sans text-h3 leading-[1.25] text-primary">
      Unique <span className="font-semibold">Crochet Couture</span>,<br />
      Plushies &amp; Blankets
    </h1>

    {/* Accent taglines */}
    <p className="font-vintage text-h3 italic text-accent">Handmade with Love</p>
    <p className="font-vintage text-h3 text-on-surface-variant font-light">Custom Orders are Welcome</p>
    <p className="font-bhineka text-body-md text-on-surface-variant">crafted with care</p>
  </div>

  {/* CTA buttons */}
  <div className="flex flex-col sm:flex-row gap-4 pt-4">
    <Link href="/collections" className="btn-primary">Shop the Collection</Link>
    <Link href="/custom-orders" className="btn-secondary">Custom Orders</Link>
  </div>

  {/* Trust badge / est line */}
  <div className="pt-8 border-t border-border/20 flex items-center gap-4">
    <span className="text-label text-primary">Artisanal Excellence</span>
    <div className="h-[1px] w-12 bg-border" />
    <span className="text-label text-accent">Est. 2024</span>
  </div>
</div>
```

#### Key Observations

- **"MmwAfrika" is a single `<span>`** — not an `<h1>`, not a custom `<Typography>` component
- The layout is **center-aligned** (`items-center text-center`)
- Uses `space-y-10` for vertical spacing between major blocks
- Three sub-blocks: brand lockup, CTA buttons, trust line
- The `<h1>` is a separate element below the brand name (not the brand itself)

#### Full Component Structure

```tsx
<section className="relative overflow-hidden pt-12 pb-24 md:pt-24 md:pb-32 px-8 max-w-7xl mx-auto">
  <div className="grid lg:grid-cols-2 gap-16 items-center">
    {/* LEFT COLUMN: Text content */}
    <div className="flex flex-col items-center text-center space-y-10 z-10">
      {/* ...brand, heading, buttons, trust line... */}
    </div>

    {/* RIGHT COLUMN: Hero image with decorative elements */}
    <div className="relative flex items-center justify-center">
      {/* Decorative background card with -z-10 */}
      {/* Main hero image */}
      {/* Small overlapping thumbnail */}
    </div>
  </div>
</section>
```

---

## 4. The "Stripes" Logic

### Pan-African Stripes: NOT IMPLEMENTED

**There are no Pan-African stripes anywhere in this codebase.**

Search conducted for:
- `pan-african`, `stripe`, `african-stripe`, `flag-stripe` patterns in all CSS, TSX, TS, JSX, JS, and SVG files — **zero matches**
- File names containing `stripe` or `pan` — **zero relevant matches**

#### What Exists Instead

The Hero section's right column (image side) has:
- A decorative rotated background card: `bg-surface-container-low rounded-xl -rotate-2`
- A small overlapping thumbnail image
- A `-z-10` utility on the decorative background card to push it behind the main image

No Pan-African flag colors, stripe patterns, SVG backgrounds, or pseudo-element stripes exist.

#### If Stripes Are Needed

Options for implementation:
1. **CSS pseudo-element (`::after`)** — good for anchoring stripes to a specific container
2. **Separate decorative component** — good if stripes need their own positioning logic or animations
3. **Background SVG** — good for precise geometric control and scalability
4. **Tailwind utility classes** — good for simple gradient stripes on a container

To ensure stripes stay anchored to text regardless of screen size or font-scaling, use `position: relative` on the text container and `position: absolute` on the stripe element with appropriate `inset` values.

---

## 5. Parent-Child State

### Overlay State: Zustand Store

The entire overlay system is managed by a **Zustand store** at `src/store/overlayStore.ts`.

#### Store Structure

| Property | Type | Purpose |
|----------|------|---------|
| `activeOverlay` | `OverlayType \| null` | `'mobileMenu'`, `'cartDrawer'`, or `null` |
| `scrollY` | `number` | Saved scroll position when overlay opens |

#### Methods

| Method | Purpose |
|--------|---------|
| `isAnyOpen()` | Returns `activeOverlay !== null` |
| `openOverlay(overlay)` | Sets `activeOverlay`, locks body scroll, adds `paddingRight` to prevent layout shift |
| `closeOverlay()` | Clears `activeOverlay`, restores scroll, unlocks body |

#### How Components Derive `isOpen`

| Component | Derivation |
|-----------|------------|
| MobileMenu | `activeOverlay === 'mobileMenu'` |
| Navbar | `activeOverlay === 'mobileMenu'` |
| CartDrawer | `activeOverlay === 'cartDrawer'` |
| WhatsAppFAB | `isAnyOpen()` |

There is no `mobileMenuOpen` or `menuOpen` boolean state — the single `activeOverlay` discriminated union replaces multiple independent booleans.

---

### How Overlay State Affects Hero Visibility/Z-Index

**HeroSection has NO direct dependency on any overlay state.** It is a pure static component with no state hooks, no subscriptions, no `useOverlayStore` import.

#### Indirect Effect via Z-Index Layering

| Layer | Z-Index | Purpose |
|-------|---------|---------|
| Base content (Hero) | 0 (default) | Default stacking |
| Floating labels, badges | 10 | Inside decorative elements |
| FABs (WhatsApp) | 20 | `.whatsapp-fab` class |
| Navbar | 50 | `.z-navbar` |
| Overlay backdrops | 55 | `.z-overlay-backdrop` |
| Overlay panels (cart, menu) | 60 | `.z-overlay` |
| Debug panel (dev only) | 9999 | Inline `z-[9999]` |

The Hero section has no explicit z-index (resolves to `auto` / `0`), so it renders **behind** all overlay backdrops (z-55) and overlay panels (z-60). This is correct — the Hero naturally disappears behind overlay backdrops without any explicit visibility management.

#### Inside HeroSection

The only z-index usage is `-z-10` on a decorative background card:
```tsx
<div className="absolute -inset-4 bg-surface-container-low rounded-xl -rotate-2 group-hover:rotate-0 transition-transform duration-700 -z-10" />
```
This pushes the decorative card behind the hero image.

---

### Theme Toggle: Re-render vs Class Swap

**The theme toggle uses a CSS class swap, NOT a React re-render cascade.**

#### Mechanism

1. `toggle()` calls `setTheme(prev => prev === 'dark' ? 'light' : 'dark')`
2. State change triggers `useEffect` which uses `requestAnimationFrame` to batch DOM operations:
   ```ts
   document.documentElement.classList.toggle('dark', pendingTheme.current === 'dark')
   localStorage.setItem(THEME_KEY, pendingTheme.current)
   ```
3. The CSS `.dark` selector in `globals.css` redefines all CSS custom properties
4. All elements using `var(--color-...)` automatically restyle via CSS — **no React re-render needed for child components**

#### Transition Effects on Theme Change

| Element | Transition |
|---------|------------|
| `body, header, footer, .btn-primary` | `background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease` |
| `<body>` via layout.tsx | `transition-colors duration-300` |
| Various components | `transition-colors duration-300` |

**No page-level animation** — the theme change is a smooth CSS variable swap, no layout animation, no content fade or slide.

---

### MobileMenu Overlay/Backdrop

**File:** `src/components/layout/MobileMenu.tsx`

- Uses `createPortal(..., document.body)` to render outside the React tree hierarchy
- **Backdrop**: `fixed inset-0 z-overlay-backdrop bg-black/50 backdrop-blur-sm` with opacity transition (`opacity-100` when open, `opacity-0` when closed)
- **Panel**: `fixed inset-y-0 right-0 z-overlay w-full max-w-sm bg-surface-container-lowest shadow-2xl` with `translateX` transition (`translate-x-0` when open, `translate-x-full` when closed)
- Uses `useOverlayBehavior` hook which provides:
  - **Escape key handler**: closes overlay on Escape
  - **Focus trap**: traps Tab/Shift+Tab navigation within the panel

The MobileMenu is always rendered (not conditionally), but its visual presence is controlled entirely by CSS transitions on `opacity` (backdrop) and `translateX` (panel). The `mounted` state gates SSR mismatch.

---

### Navbar and Page Content Interaction

**File:** `src/components/layout/Navbar.tsx`

- Fixed position: `fixed top-0 left-0 right-0 z-navbar h-20`
- Semi-transparent with backdrop blur: `bg-bg/80 backdrop-blur-xl`
- Auto-closes overlays on route change: `useEffect(() => { closeOverlay() }, [pathname, closeOverlay])`
- Contains inline `<MobileMenu />` as a sibling

**Content interaction summary:**
- The Navbar is always visible at `z-50`, above page content but below overlays
- When MobileMenu is open: backdrop at `z-55` dims everything (including Hero and Navbar), panel at `z-60` sits on top
- The Hero section is never hidden or repositioned — it simply sits behind overlays when active
- The `<main>` element in `layout.tsx` has `pt-20` (80px) to account for the fixed navbar height

---

## Summary: Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| CSS Variables over `dark:` classes | Single source of truth, no need to annotate every element with `dark:`, easier to maintain |
| Custom hook over next-themes | Simpler, fewer dependencies, full control over FOUC prevention |
| Zustand for overlays | Single source of truth, avoids multiple competing boolean states |
| Hero is stateless | Pure presentational component, no awareness of global state needed |
| Z-index layer system (0, 10, 20, 50, 55, 60) | Explicit, documented, semantic utility classes |
| `theme-init.js` sync IIFE | Prevents FOUC by applying `.dark` class before first paint |
| `<html suppressHydrationWarning>` | Prevents React hydration mismatches since DOM class may differ from server-rendered HTML |
