# Typography Audit Log

---

## Prompt 33 — Typography Source of Truth

### Overview
Typography sizes in this project are defined through a **three-layer system**:
1. **CSS Custom Properties** in `globals.css` (source of truth)
2. **Tailwind v4 `@theme` directive** mapping CSS variables to utility classes
3. **Component-level overrides** via inline styles or additional Tailwind classes

---

### Layer 1: CSS Custom Properties (Source)
**File:** `src/styles/globals.css`

All text sizes are defined as CSS custom properties within the `@theme` block:

| Variable | Size Value | Line Height | Letter Spacing |
|----------|-----------|-------------|----------------|
| `--text-display-xl` | `clamp(3.5rem, 6vw, 4.5rem)` | 1.05 | -0.025em |
| `--text-display-lg` | `clamp(2.5rem, 5vw, 3.5rem)` | 1.1 | -0.02em |
| `--text-h1` | `clamp(2.25rem, 4vw, 3rem)` | 1.15 | -0.015em |
| `--text-h2` | `clamp(1.75rem, 3vw, 2.25rem)` | 1.2 | -0.01em |
| `--text-h3` | `clamp(1.5rem, 2.5vw, 1.75rem)` | 1.25 | -0.005em |
| `--text-hero` | `72px` | 1.1 | -0.02em |
| `--text-hero-sm` | `60px` | 1.1 | -0.02em |
| `--text-section` | `36px` | 1.2 | -0.01em |
| `--text-body-md` | `1rem` (16px) | 1.6 | 0 |
| `--text-body-sm` | `0.875rem` (14px) | 1.5 | 0 |
| `--text-label` | `0.75rem` (12px) | 1.4 | 0.05em |
| `--text-price` | `1.25rem` (20px) | 1.3 | 0 |
| `--text-card` | `20px` | 1.3 | 0 |

---

### Layer 2: Tailwind Utility Classes
**Tailwind v4** automatically creates utility classes from CSS custom properties defined in `@theme`. This means:
- `text-display-xl` → `font-size: var(--text-display-xl)`
- `text-h1` → `font-size: var(--text-h1)`
- `text-h2` → `font-size: var(--text-h2)`
- etc.

**Note:** Line-height and letter-spacing are defined as separate CSS variables but are **NOT automatically applied** by Tailwind. They would need to be manually composed or the component must rely on inherited/default values.

---

### Layer 3: Font Family Definitions
**CSS Variables:**
```css
--font-headline: 'Noto Serif', Georgia, serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-label: 'Inter', system-ui, sans-serif;
--font-serif: 'Noto Serif', Georgia, serif;
--font-sans: 'Inter', system-ui, sans-serif;
--font-bhineka: var(--font-bhineka), cursive;  /* CIRCULAR REFERENCE */
--font-vintage: var(--font-vintage), serif;    /* CIRCULAR REFERENCE */
```

**Tailwind Config (`tailwind.config.js`):**
```js
fontFamily: {
  headline: ['Noto Serif', 'Georgia', 'serif'],
  body: ['Inter', 'system-ui', 'sans-serif'],
  label: ['Inter', 'system-ui', 'sans-serif'],
  serif: ['Noto Serif', 'Georgia', 'serif'],
  sans: ['Inter', 'system-ui', 'sans-serif'],
  bhineka: ['var(--font-bhineka)', 'cursive'],
  vintage: ['var(--font-vintage)', 'serif'],
}
```

---

### Typography Source by Element

#### Hero Section (`src/components/product/HeroSection.tsx`)

| Element | Tailwind Class | CSS Variable | Override | Winning Layer |
|---------|---------------|--------------|----------|---------------|
| "MmwAfrika" | `text-display-xl` + `font-bhineka` | `--text-display-xl` + `var(--font-bhineka)` | `leading-[1]`, `font-semibold` | **Tailwind class** (CSS var provides size, component overrides line-height/weight) |
| "Pride Couture" | `text-h1` + `font-vintage` | `--text-h1` + `var(--font-vintage)` | `italic` | **Tailwind class** |
| Hero H1 ("Unique Crochet Couture...") | `text-h3` + `font-sans` | `--text-h3` + `var(--font-sans)` | `leading-[1.25]`, `font-semibold` on span | **Component override wins** (explicit leading-[1.25] matches CSS var, but `font-sans` overrides default `h1` styling) |
| "Handmade with Love" | `text-h3` + `font-vintage` | `--text-h3` | `italic`, `text-accent` | **Tailwind class** |
| "Custom Orders are Welcome" | `text-h3` + `font-vintage` | `--text-h3` | `font-light` | **Component override wins** (font-light not in CSS var) |
| "crafted with care" | `text-body-md` + `font-bhineka` | `--text-body-md` | `text-on-surface-variant` | **Tailwind class** |
| "The Heritage Collection" | `text-h3` + `font-vintage` | `--text-h3` | `italic` | **Tailwind class** |
| Trust Badges | `text-h2` + `font-vintage` | `--text-h2` | — | **Tailwind class** |

#### Navbar (`src/components/layout/Navbar.tsx`)

| Element | Tailwind Class | CSS Variable | Override | Winning Layer |
|---------|---------------|--------------|----------|---------------|
| Navbar Logo (desktop) | `lg:text-h2` + `font-vintage` | `--text-h2` | `text-xs sm:text-sm` (responsive), `italic`, `tracking-tight`, `whitespace-nowrap` | **Mixed**: Responsive classes win at different breakpoints. `lg:text-h2` uses CSS var, `text-xs`/`text-sm` use Tailwind defaults |
| "MmwAfrika" span in logo | — | — | `font-sans`, `font-semibold`, `tracking-wide`, `not-italic` | **Component override wins** (explicit font/weight/letter-spacing) |
| Nav Links | `text-label` | `--text-label` | `text-primary`/`text-secondary` | **Tailwind class** |

#### Base HTML Elements (`globals.css` @layer base)

| Element | CSS Rule | Winning Layer |
|---------|----------|---------------|
| `body` | `font-family: var(--font-body)` | **CSS layer base** |
| `h1-h6` | `font-family: var(--font-headline)`, `font-weight: 600`, `letter-spacing: -0.02em`, `color: var(--color-primary)` | **CSS layer base** (can be overridden by component classes) |

---

### Where Overrides Happen

1. **Line-height overrides:**
   - `leading-[1]` on "MmwAfrika" hero text (vs CSS var `1.05`)
   - `leading-[1.25]` on hero H1 (matches CSS var `--text-h3--line-height`)
   
2. **Font-weight overrides:**
   - `font-semibold` on "MmwAfrika" (vs CSS var default)
   - `font-light` on "Custom Orders are Welcome"
   - `font-semibold` on "Crochet Couture" span

3. **Font-family overrides:**
   - `font-sans` on hero H1 (overrides default `h1` → `font-headline` from base layer)
   - `font-vintage` on multiple elements (circular reference issue)

4. **Letter-spacing overrides:**
   - `tracking-tight` on navbar logo
   - `tracking-wide` on "MmwAfrika" span in navbar

---

### Why Changes Don't Reflect Visually

1. **Circular CSS Variable References:**
   - `--font-bhineka: var(--font-bhineka), cursive;` references itself
   - `--font-vintage: var(--font-vintage), serif;` references itself
   - **Result:** These fall back to the second value (`cursive` and `serif` respectively), but the actual custom font is never loaded

2. **Missing Font Imports:**
   - `Bhineka` and `Vintage` fonts are referenced but may not be imported in `layout.tsx`
   - **Result:** Browser falls back to generic `cursive`/`serif`

3. **Line-height Not Auto-Applied:**
   - CSS vars like `--text-h3--line-height` exist but aren't automatically applied by Tailwind `text-h3` class
   - **Result:** Elements need explicit `leading-*` classes or inherit default browser line-height

4. **Specificity Conflicts:**
   - Base layer sets `h1 { font-family: var(--font-headline) }` but components use `font-sans` on `<h1>` elements
   - **Result:** Tailwind utility class wins due to higher specificity, but semantic HTML uses wrong font

---

## Prompt 34 — Typography Conflict Detection

### Detected Conflicts

#### Conflict 1: Font Family for `bhineka` and `vintage`

**Location:** `globals.css` lines 38-39, `tailwind.config.js` lines 40-41

| Layer | Definition |
|-------|-----------|
| CSS Variable | `--font-bhineka: var(--font-bhineka), cursive;` (circular) |
| Tailwind Config | `bhineka: ['var(--font-bhineka)', 'cursive']` |

**Which Wins:** Neither works correctly. The CSS variable is self-referential, so it resolves to `cursive`. Tailwind then uses `var(--font-bhineka)` which also resolves to `cursive`.

**Why:** The CSS variable should reference a loaded font (e.g., from `next/font`), but instead references itself.

---

#### Conflict 2: H1 Font Family

**Location:** `globals.css` line 128, HeroSection.tsx line 15

| Layer | Definition |
|-------|-----------|
| Base CSS | `h1 { font-family: var(--font-headline); }` → Noto Serif |
| Component | `<h1 className="font-sans ...">` → Inter |

**Which Wins:** **Component class** (`font-sans`) wins due to higher CSS specificity.

**Why:** The `h1` element should semantically use headline font, but designer wanted Inter for this specific hero H1.

---

#### Conflict 3: Navbar Logo Responsive Sizing

**Location:** Navbar.tsx line 36

| Breakpoint | Class | Computed Size |
|-----------|-------|---------------|
| Mobile (<640px) | `text-xs` | 0.75rem (12px) |
| Tablet (640px+) | `text-sm` | 0.875rem (14px) |
| Desktop (1024px+) | `lg:text-h2` | `clamp(1.75rem, 3vw, 2.25rem)` |

**Which Wins:** Depends on viewport. No conflict, just responsive design.

**Why:** Progressive scaling for different screen sizes.

---

#### Conflict 4: Line-height Application

**Location:** globals.css vs component usage

| Layer | Definition |
|-------|-----------|
| CSS Variable | `--text-h3--line-height: 1.25` |
| Tailwind Utility | `text-h3` only applies `font-size`, NOT line-height |
| Component | `leading-[1.25]` on HeroSection H1 |

**Which Wins:** **Component explicit override** (`leading-[1.25]`)

**Why:** Tailwind v4 doesn't automatically compose line-height from CSS variables. The `text-h3` class only sets `font-size: var(--text-h3)`.

---

#### Conflict 5: Letter-spacing on Headings

**Location:** `globals.css` line 128, individual components

| Layer | Definition |
|-------|-----------|
| Base CSS | `h1-h6 { letter-spacing: -0.02em; }` |
| CSS Variable | `--text-h1--tracking: -0.015em`, `--text-h2--tracking: -0.01em`, etc. |
| Component | `tracking-tight` (Tailwind default: -0.025em) |

**Which Wins:** **Component class** if applied, otherwise **base CSS** (-0.02em)

**Why:** CSS variable tracking values exist but aren't automatically applied. Base layer hardcodes -0.02em for all headings.

---

### Summary of Conflicts

| Conflict | Layers Involved | Winner | Root Cause |
|----------|----------------|--------|------------|
| `bhineka`/`vintage` fonts | CSS var ↔ Tailwind | Neither (fallback) | Circular variable reference |
| H1 font family | Base CSS ↔ Component | Component | Higher specificity |
| Navbar logo size | Responsive classes | Viewport-dependent | Intentional responsive design |
| Line-height application | CSS var ↔ Tailwind ↔ Component | Component explicit | Tailwind doesn't auto-compose |
| Letter-spacing | Base CSS ↔ CSS var ↔ Component | Component or Base | CSS vars not auto-applied |

---

## Prompt 35 — Visual Scaling Reality Check

### Measured Visual Sizes (Based on Code Analysis)

#### Hero Section Text Elements

| Element | Declared Class | Computed Size (at 1440px viewport) | Visual Weight Factors |
|---------|---------------|-----------------------------------|----------------------|
| "MmwAfrika" | `text-display-xl` | `clamp(3.5rem, 6vw, 4.5rem)` ≈ **86.4px** (6vw of 1440) | `font-bhineka` (falls back to `cursive`), `font-semibold`, `leading-[1]` |
| "Pride Couture" | `text-h1` | `clamp(2.25rem, 4vw, 3rem)` ≈ **57.6px** (4vw of 1440) | `font-vintage` (falls back to `serif`), `italic` |
| Hero H1 "Unique Crochet Couture..." | `text-h3` | `clamp(1.5rem, 2.5vw, 1.75rem)` ≈ **36px** (2.5vw of 1440) | `font-sans` (Inter), `leading-[1.25]` |
| Subtext "Handmade with Love" | `text-h3` | Same as H1: **36px** | `font-vintage` (serif), `italic`, `text-accent` (gold color) |
| "Custom Orders are Welcome" | `text-h3` | Same: **36px** | `font-vintage`, `font-light`, `text-on-surface-variant` (muted) |
| Trust Badges | `text-h2` | `clamp(1.75rem, 3vw, 2.25rem)` ≈ **43.2px** | `font-vintage` (serif), `opacity-60` |

#### Navbar Logo

| Element | Declared Class | Computed Size (Desktop) | Visual Weight Factors |
|---------|---------------|------------------------|----------------------|
| "MmwAfrika" span | `font-sans` + inherited `text-h2` | **43.2px** | `font-semibold`, `tracking-wide` (wider letters = looks bigger) |
| "Pride Couture" span | `font-vintage` + inherited `text-h2` | **43.2px** | `italic` (reduces visual width), `tracking-tight` on parent |

---

### Why They Appear Similar Despite Different Classes

#### 1. **"MmwAfrika" vs "Pride Couture" in Hero**
   - **Declared:** `text-display-xl` (86.4px) vs `text-h1` (57.6px) — 50% size difference
   - **Reality:** They appear closer in size because:
     - `font-bhineka` falls back to generic `cursive` which has different x-height proportions
     - `font-vintage` falls back to generic `serif` which often renders larger than specified
     - `italic` on "Pride Couture" slants letters, creating optical illusion of height
     - **Without custom fonts loaded, the size difference is muted**

#### 2. **Hero H1 vs Subtext Elements**
   - **Declared:** All use `text-h3` (36px)
   - **Reality:** They appear the same size but different visual weight because:
     - `font-sans` (Inter) has larger x-height than `font-vintage` (serif fallback)
     - `font-light` on "Custom Orders" makes it appear smaller/thinner
     - `text-accent` (gold) on "Handmade with Love" creates visual prominence
     - `text-on-surface-variant` (muted gray) on "Custom Orders" makes it recede

#### 3. **Trust Badges vs Hero H1**
   - **Declared:** `text-h2` (43.2px) vs `text-h1` (57.6px)
   - **Reality:** Trust badges may appear similar or larger because:
     - `opacity-60` reduces visual weight but not actual size
     - `font-vintage` serif letters often have taller ascenders/descenders
     - Positioned lower on page, context affects perception

#### 4. **Navbar Logo "MmwAfrika" vs "Pride Couture"**
   - **Declared:** Both inherit `text-h2` (43.2px)
   - **Reality:** "MmwAfrika" appears larger because:
     - `font-sans` (Inter) has 75% x-height vs serif's ~50%
     - `font-semibold` adds stroke weight = looks bigger
     - `tracking-wide` spreads letters = occupies more horizontal space
     - "Pride Couture" is `italic` = letters lean, appear shorter

---

### Root Causes of Visual Discrepancies

| Issue | Impact | Fix Required |
|-------|--------|--------------|
| **Custom fonts not loading** | All font-family vars fall back to generics, changing visual proportions | Import `Bhineka` and `Vintage` fonts in `layout.tsx` |
| **Line-height not auto-applied** | Elements may have different vertical rhythm than intended | Use explicit `leading-*` classes or create composite utility classes |
| **Letter-spacing not auto-applied** | Headings don't match designed tracking values | Apply `tracking-*` classes matching CSS var values |
| **Font-weight variations** | Same size, different weights create visual hierarchy | Ensure weights match design intent |
| **Color/opacity affecting perception** | Muted colors make text appear smaller | Consider visual hierarchy in design system |
| **Circular CSS variables** | `--font-bhineka` and `--font-vintage` reference themselves | Fix variable definitions to reference actual font names or loaded font objects |

---

### Recommended Actions

1. **Fix circular font variable references:**
   ```css
   /* Before (broken) */
   --font-bhineka: var(--font-bhineka), cursive;
   --font-vintage: var(--font-vintage), serif;
   
   /* After (working) */
   --font-bhineka: 'Bhineka', cursive;
   --font-vintage: 'Vintage Serif', serif;
   ```

2. **Import custom fonts in `layout.tsx`:**
   ```ts
   import { Inter, Noto_Serif } from 'next/font/google'
   // Add Bhineka and Vintage via local font files or Google Fonts if available
   ```

3. **Create composite text utility classes** that include size + line-height + tracking:
   ```css
   .text-display-xl {
     font-size: var(--text-display-xl);
     line-height: var(--text-display-xl--line-height);
     letter-spacing: var(--text-display-xl--tracking);
   }
   ```

4. **Audit all `h1-h6` elements** to ensure they use intended font families, not relying on base layer defaults

---

*Audit Date: 6 April 2026*
*Files Analyzed: globals.css, tailwind.config.js, HeroSection.tsx, Navbar.tsx, and all page components*

---

## Prompt 24 — Scroll Ownership Map

### ALL Scrollable Containers

#### 1. Document Root (html/body)

| Property | Value |
|----------|-------|
| **Element** | `<html>` + `<body>` |
| **Overflow Rule** | Default (implicit `overflow: visible`) |
| **Scroll Direction** | Vertical |
| **Trigger** | Content exceeds viewport height |
| **CSS** | `html { scroll-behavior: smooth; }` (globals.css line 123) |
| **Body Override** | `overflow: hidden` when CartDrawer open (CartDrawer.tsx line 27) |

**Owner:** Default document scroll. Always exists unless body overflow is explicitly hidden.

---

#### 2. Cart Drawer Content Area

| Property | Value |
|----------|-------|
| **Element** | `<div className="flex-1 overflow-y-auto px-8 py-4 space-y-10">` (CartDrawer.tsx line 45) |
| **Overflow Rule** | `overflow-y: auto` |
| **Scroll Direction** | Vertical only |
| **Trigger** | Cart items exceed available drawer height |
| **Parent** | `<aside className="cart-drawer ... flex flex-col">` (fixed position, full height) |

**Owner:** When CartDrawer is open AND cart items exceed drawer viewport.

---

#### 3. Mobile Menu Panel

| Property | Value |
|----------|-------|
| **Element** | `<aside className="fixed inset-y-0 right-0 z-[100] w-full max-w-sm ...">` (MobileMenu.tsx line 24) |
| **Overflow Rule** | **NONE DEFINED** (implicit `overflow: visible`) |
| **Scroll Direction** | Vertical (if content overflows) |
| **Trigger** | Menu content exceeds viewport height |
| **Inner Container** | `<div className="flex flex-col h-screen p-10 justify-between">` — uses `h-screen` (100vh) |

**Owner:** **UNDEFINED**. No explicit overflow rule. Browser default applies.

---

#### 4. Product Image Containers

| Property | Value |
|----------|-------|
| **Element** | Multiple `<div className="... overflow-hidden ...">` |
| **Overflow Rule** | `overflow: hidden` |
| **Scroll Direction** | N/A (scrolling disabled) |
| **Trigger** | N/A |
| **Locations** | ProductCard.tsx line 12, HeroSection.tsx lines 32/39, BentoGrid.tsx lines 16/30, [slug]/page.tsx lines 40/44 |

**Owner:** None. These are scroll-contained by design.

---

#### 5. Newsletter Section

| Property | Value |
|----------|-------|
| **Element** | `<div className="... overflow-hidden ...">` (NewsletterSection.tsx line 22) |
| **Overflow Rule** | `overflow: hidden` |
| **Scroll Direction** | N/A |
| **Trigger** | N/A |

**Owner:** None. Decorative containment only.

---

#### 6. 404 Page Container

| Property | Value |
|----------|-------|
| **Element** | `<div className="... overflow-hidden ...">` (not-found.tsx line 22) |
| **Overflow Rule** | `overflow: hidden` |
| **Scroll Direction** | N/A |
| **Trigger** | N/A |

**Owner:** None. Decorative containment only.

---

#### 7. WhatsApp FAB Expand Text

| Property | Value |
|----------|-------|
| **Element** | `<span className="max-w-0 overflow-hidden group-hover:max-w-xs ...">` (WhatsAppFAB.tsx line 7) |
| **Overflow Rule** | `overflow: hidden` (transitions to visible via max-width) |
| **Scroll Direction** | N/A |
| **Trigger** | Hover on FAB |

**Owner:** None. Animation containment only.

---

### Scroll Ownership Matrix

| Scenario | Primary Scroll Owner | Secondary Scroll Regions | Body Overflow |
|----------|---------------------|-------------------------|---------------|
| **Normal page view** | Document (html/body) | None | `auto` |
| **Cart Drawer open (empty)** | Document (html/body) | None | `hidden` |
| **Cart Drawer open (with items)** | Document (html/body) + Cart inner area | Cart drawer `overflow-y: auto` | `hidden` |
| **Mobile Menu open** | Document (html/body) | Mobile menu (implicit) | **NOT SET** |
| **Mobile Menu + Cart both open** | **CONFLICT** | Both try to own scroll | `hidden` (Cart sets it) |

---

### What Happens When Two Scroll Regions Overlap?

**Scenario: Mobile Menu Open + Cart Drawer Open**

1. CartDrawer sets `document.body.style.overflow = 'hidden'`
2. Mobile Menu does **NOT** set body overflow
3. Both are `position: fixed` overlays at different z-indices (Menu: z-[100], Cart: z-[60])
4. If user scrolls while Mobile Menu is on top:
   - **Cart's body overflow lock** prevents document scroll
   - **Mobile Menu has no internal scroll containment** → events pass through to whatever is underneath
   - **Result:** Undefined behavior — depends on which element has focus/capture

**Scenario: Cart Drawer Open + User Scrolls on Cart Content**

1. Body overflow is `hidden` — document cannot scroll
2. Cart inner div has `overflow-y: auto` — it captures scroll
3. When cart content reaches end → **scroll events have nowhere to go** → they die
4. **This is correct behavior** — no bleed in this case

---

## Prompt 25 — Scroll Bleed Simulation

### Scenario: Mobile Menu Open → User Scrolls Aggressively

#### Step-by-Step Event Trace

**Initial State:**
```
- Mobile Menu: OPEN (z-[100], fixed, right-side panel)
- Backdrop: OPEN (z-[99], fixed, full screen, onClick closes menu)
- Cart Drawer: CLOSED
- Document Body: overflow = 'auto' (NOT locked)
- Mobile Menu aside: NO overflow rule, NO overscroll-behavior, NO touch-action
```

**User Action:** Two-finger scroll / mouse wheel / trackpad swipe on mobile menu panel

**Event Flow:**

1. **Touch/Wheel Event fires** on Mobile Menu `<aside>` element
2. **Browser checks:** Does this element have scrollable content? 
   - **Answer:** NO explicit `overflow` rule, so browser looks at content height
   - Menu content: `<div className="flex flex-col h-screen p-10 justify-between">`
   - If content fits within `h-screen` (100vh) → **no scroll needed** → event not consumed
3. **Event bubbles up** from `<aside>` → backdrop → document
4. **Document receives scroll event** → `overflow: auto` → **document scrolls**
5. **Visual result:** Background page scrolls BEHIND the open mobile menu

**This is scroll bleed.**

---

#### Where Events Leak

| Event Phase | Element | Consumes? | Why |
|-------------|---------|-----------|-----|
| 1. Touch/Wheel start | Mobile Menu `<aside>` | **NO** | No overflow rule, content may not exceed height |
| 2. Bubble | Backdrop `<div>` | **NO** | `position: fixed`, no scroll container, pointer-events only for click |
| 3. Bubble | `<body>` | **NO** | `overflow: auto` (default), not locked |
| 4. Final target | `<html>` / Document | **YES** | Default scroll container → **SCROLLS THE PAGE** |

---

#### Why Scroll Bleed Happens (Root Cause Analysis)

**Three missing protections:**

1. **No body overflow lock when Mobile Menu opens:**
   - CartDrawer.tsx line 27: `document.body.style.overflow = isCartOpen ? 'hidden' : 'auto'`
   - MobileMenu.tsx: **ZERO** body overflow management
   - **Result:** Body remains scrollable while menu is open

2. **No overscroll-behavior on mobile menu:**
   - No `overscroll-behavior: contain` on the menu panel
   - **Result:** Scroll events chain (bleed) to parent even if menu itself scrolls

3. **No touch-action restriction:**
   - No `touch-action: none` on backdrop or menu container
   - **Result:** Touch gestures pass through to underlying elements

---

#### CartDrawer Comparison (Does It Bleed?)

**CartDrawer IS protected:**
```tsx
useEffect(() => { 
  document.body.style.overflow = isCartOpen ? 'hidden' : 'auto'; 
  return () => { document.body.style.overflow = 'auto' } 
}, [isCartOpen])
```

**Body overflow is set to `hidden`** when cart is open → document cannot scroll → no bleed.

**However**, the cart's inner `overflow-y: auto` div has no `overscroll-behavior: contain`, so if user scrolls past the end of cart items, the scroll event dies (body is locked) — **this is safe**.

---

#### Exact Scroll Bleed Paths

```
PATH 1: Mobile Menu → Document Scroll (ACTIVE BUG)
  Touch/Wheel → <aside> (MobileMenu) → <body> → <html> → PAGE SCROLLS
  Missing: body overflow lock, overscroll-behavior

PATH 2: Cart Drawer inner → Document Scroll (SAFE)
  Touch/Wheel → <div overflow-y-auto> → <body overflow=hidden> → EVENT DIES
  Protected: body overflow = hidden

PATH 3: Cart Drawer backdrop → Document Scroll (SAFE)
  Touch/Wheel → backdrop div → <body overflow=hidden> → EVENT DIES
  Protected: body overflow = hidden

PATH 4: Mobile Menu backdrop → Document Scroll (ACTIVE BUG)
  Touch/Wheel → backdrop div → <body> → <html> → PAGE SCROLLS
  Missing: body overflow lock, touch-action restriction
```

---

## Prompt 26 — Scroll Containment Audit

### Mechanism Check

| Mechanism | Implemented? | Where | Coverage |
|-----------|-------------|-------|----------|
| **Overflow Locking** (`overflow: hidden` on body) | ⚠️ PARTIAL | CartDrawer.tsx line 27 | ✅ Cart open: YES ❌ Mobile menu open: NO |
| **overscroll-behavior** | ❌ MISSING | Nowhere in codebase | 0% coverage |
| **touch-action control** | ❌ MISSING | Nowhere in codebase | 0% coverage |
| **scroll chaining prevention** | ❌ MISSING | Nowhere in codebase | 0% coverage |

---

### What's Missing, Where, and Consequences

#### 1. Body Overflow Lock for Mobile Menu

**Missing In:** `MobileMenu.tsx`

**What Should Happen:**
```tsx
useEffect(() => {
  document.body.style.overflow = isOpen ? 'hidden' : 'auto'
  return () => { document.body.style.overflow = 'auto' }
}, [isOpen])
```

**Current State:** No overflow management at all.

**Consequence:** 
- User opens mobile menu → scrolls → background page scrolls behind menu
- Visual disorientation: content moves while menu stays fixed
- On iOS Safari, can cause rubber-banding effect on the body
- Breaks the modal overlay illusion

---

#### 2. overscroll-behavior: contain

**Missing In:** EVERYWHERE — not a single instance in codebase

**Where It's Needed:**

| Element | File | Required Value | Why |
|---------|------|---------------|-----|
| Mobile Menu `<aside>` | MobileMenu.tsx line 24 | `overscroll-behavior: contain` | Prevent scroll chaining to body |
| Cart Drawer inner scroll area | CartDrawer.tsx line 45 | `overscroll-behavior: contain` | Prevent scroll chaining when list ends |
| Cart Drawer `<aside>` | CartDrawer.tsx line 35 | `overscroll-behavior: contain` | Secondary containment |

**What It Does:**
- `overscroll-behavior: contain` disables scroll chaining
- When user reaches end of scrollable area, scroll events STOP instead of propagating to parent
- Also disables pull-to-refresh and overscroll glow effects on the element

**Consequence of Missing:**
- Cart drawer: user scrolls to end of items → if body weren't locked, scroll would chain to document
- Mobile menu: user scrolls → scroll chains directly to body → page scrolls behind menu
- On mobile browsers, pull-to-refresh can trigger when scrolling inside drawers

---

#### 3. touch-action Control

**Missing In:** EVERYWHERE

**Where It's Needed:**

| Element | Required Value | Why |
|---------|---------------|-----|
| Mobile Menu backdrop | `touch-action: none` | Prevent any touch gestures on backdrop from affecting underlying page |
| Cart Drawer backdrop | `touch-action: none` | Same — backdrop should only handle tap-to-close, not scroll |

**What It Does:**
- `touch-action: none` disables all touch gestures (scroll, pinch, zoom) on the element
- More robust than CSS overflow alone — works at the touch event level

**Consequence of Missing:**
- On mobile, two-finger scroll on backdrop scrolls the page behind it
- Pinch-zoom on backdrops can accidentally zoom underlying content
- Touch gestures are not intercepted

---

#### 4. Scroll Chaining Prevention (JavaScript Level)

**Missing In:** EVERYWHERE

**What It Is:**
- JavaScript event listeners that call `e.preventDefault()` on wheel/touchmove events
- More aggressive than CSS-only solutions

**Where It Would Be Needed:**
- Mobile Menu: on the `<aside>` element
- Cart Drawer: on the backdrop element (for touch devices)

**Current Pattern:**
- CartDrawer relies solely on `body.style.overflow = 'hidden'`
- This works on most browsers but **fails on iOS Safari** which ignores body overflow hidden for scroll events

**Consequence of Missing:**
- iOS Safari users can still scroll the background page even with `overflow: hidden` on body
- Known iOS bug: `position: fixed` elements don't fully lock scroll on older iOS versions

---

### Complete Audit Summary Table

| Component | Overflow Lock | overscroll-behavior | touch-action | Scroll Chain Prevention | Overall Status |
|-----------|--------------|---------------------|--------------|------------------------|----------------|
| **CartDrawer** | ✅ body:hidden | ❌ Missing | ❌ Missing | ❌ Missing (iOS vulnerable) | ⚠️ Partially Protected |
| **MobileMenu** | ❌ Missing | ❌ Missing | ❌ Missing | ❌ Missing | ❌ NOT Protected |
| **Cart Backdrop** | N/A | ❌ Missing | ❌ Missing | ❌ Missing | ❌ Not Protected |
| **Menu Backdrop** | N/A | ❌ Missing | ❌ Missing | ❌ Missing | ❌ Not Protected |
| **Document (html)** | N/A | ❌ Missing (should be `none`) | ❌ Missing | N/A | ❌ Not Configured |

---

### Exact Consequences

| Consequence | Severity | Affected Users | Trigger |
|-------------|----------|---------------|---------|
| **Background page scrolls behind mobile menu** | HIGH | 100% mobile users | Open menu + scroll |
| **Background page scrolls behind cart drawer (iOS)** | HIGH | iOS Safari users | Open cart + scroll past items |
| **Pull-to-refresh triggers inside drawers** | MEDIUM | Android Chrome mobile users | Scroll up aggressively in drawer |
| **Overscroll glow effect visible on drawers** | LOW | Android users | Scroll to end of drawer content |
| **Pinch-zoom on backdrops** | LOW | Mobile users | Two-finger gesture on backdrop |
| **Scroll position lost when closing overlays** | MEDIUM | All users | Scroll page → open menu → close → position may shift |

---

### Recommended Fixes (Priority Order)

**P0 — Critical (Mobile Menu scroll bleed):**
```tsx
// MobileMenu.tsx — Add this useEffect
useEffect(() => {
  document.body.style.overflow = isOpen ? 'hidden' : 'auto'
  return () => { document.body.style.overflow = 'auto' }
}, [isOpen])
```

**P1 — High (overscroll-behavior on all overlays):**
```css
/* globals.css — Add to @layer components */
.cart-drawer { overscroll-behavior: contain; }
.mobile-menu-panel { overscroll-behavior: contain; }
```

**P2 — Medium (touch-action on backdrops):**
```tsx
// CartDrawer backdrop — add className
<div className="fixed inset-0 ... touch-action-none" onClick={() => setIsCartOpen(false)} />

// MobileMenu backdrop — add className
<div className="fixed inset-0 ... touch-action-none" onClick={onClose} />
```

**P3 — Low (iOS-specific scroll lock fix):**
```tsx
// For full iOS support, add position fixed lock instead of overflow hidden
useEffect(() => {
  if (isOpen) {
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }
}, [isOpen])
```

---

*Scroll Audit Date: 6 April 2026*
*Files Analyzed: globals.css, MobileMenu.tsx, CartDrawer.tsx, layout.tsx, and all component files with overflow/scroll rules*

---

## Prompt 21 — State Authority Mapping

### ALL UI Visibility State Variables

---

### 1. Mobile Menu Visibility

| Property | Details |
|----------|---------|
| **State Variable** | `isMobileMenuOpen` (boolean) |
| **Declared** | `Navbar.tsx` line 13: `useState(false)` |
| **Mutated By** | `Navbar.tsx`: hamburger button `onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}` (line 86), `useEffect` on `pathname` change: `setIsMobileMenuOpen(false)` (line 19), `MobileMenu` props: `onClose={() => setIsMobileMenuOpen(false)}` (line 96) |
| **Consumed By** | `Navbar.tsx`: hamburger icon swap (X vs ☰, lines 87-93), `MobileMenu.tsx`: `isOpen` prop controls backdrop render (line 17) and aside transform (line 24) |
| **Scope** | **Lifted** — declared in parent (Navbar), passed as prop to child (MobileMenu) |
| **Classification** | ✅ **SAFE** — single source of truth, clear ownership |

**Dependency Graph:**
```
Navbar (declares)
  ├── Navbar hamburger button (mutates: toggle)
  ├── Navbar useEffect pathname (mutates: close on navigation)
  ├── Navbar JSX (consumes: icon swap)
  └── MobileMenu (consumes via props)
        ├── backdrop (consumes: conditional render)
        └── aside (consumes: translate-x class toggle)
```

---

### 2. Cart Drawer Visibility

| Property | Details |
|----------|---------|
| **State Variable** | `isCartOpen` (boolean) |
| **Declared** | `src/store/cartStore.ts` line 24: Zustand store, initial value `false` |
| **Mutated By** | `Navbar.tsx`: cart bag button `onClick={toggleCart}` (line 80), `CartDrawer.tsx`: close button `onClick={() => setIsCartOpen(false)}` (line 42), backdrop `onClick={() => setIsCartOpen(false)}` (line 34), checkout button `onClick={() => { setIsCartOpen(false); router.push('/checkout') }}` (line 95), collections link `onClick={() => setIsCartOpen(false)}` (line 78) |
| **Consumed By** | `CartDrawer.tsx`: early return `if (!mounted || !isCartOpen) return null` (line 30), body overflow effect (line 27), `Navbar.tsx`: cart badge count (line 83 — indirectly via store subscription) |
| **Scope** | **Global** — Zustand store with localStorage persistence |
| **Classification** | ✅ **SAFE** — single source of truth, persisted, accessible everywhere |

**Dependency Graph:**
```
cartStore (declares isCartOpen, toggleCart, setIsCartOpen)
  ├── Navbar toggleCart button (mutates: toggle)
  ├── CartDrawer close button (mutates: set false)
  ├── CartDrawer backdrop (mutates: set false)
  ├── CartDrawer checkout button (mutates: set false + navigate)
  ├── CartDrawer collections link (mutates: set false + navigate)
  ├── CartDrawer (consumes: conditional render)
  ├── CartDrawer useEffect (consumes: body overflow lock)
  └── CartDrawer useEffect (consumes: Escape key listener)
```

---

### 3. Theme (Light/Dark)

| Property | Details |
|----------|---------|
| **State Variable** | `theme` (`'light' | 'dark'`), `mounted` (boolean) |
| **Declared** | `src/hooks/useTheme.ts` line 8-9: `useState<'light'|'dark'>('light')`, `useState(false)` |
| **Mutated By** | `useTheme.ts`: `toggle` callback (line 34), `useEffect` on mount reads `localStorage` (line 16), `useEffect` syncs to DOM `classList` + `localStorage` via `requestAnimationFrame` (lines 23-30) |
| **Consumed By** | `ThemeToggle.tsx`: icon swap (sun vs moon, lines 17-20), conditional render during SSR mismatch (lines 8-13) |
| **Scope** | **Global-ish** — each component calling `useTheme()` gets its OWN local state, synced via `localStorage` + DOM side effects |
| **Classification** | ⚠️ **FRAGMENTED** — see Prompt 22 for details |

**Dependency Graph:**
```
localStorage (source of truth for persistence)
  └── useTheme hook (each caller gets independent useState)
        ├── useEffect (reads localStorage on mount)
        ├── useEffect (writes to DOM classList + localStorage on change)
        ├── toggle callback (mutates local state)
        └── ThemeToggle (consumes theme, mounted, calls toggle)
              ├── SVG sun icon (consumes: theme === 'dark')
              ├── SVG moon icon (consumes: theme === 'light')
              └── placeholder (consumes: mounted === false)

Document <html> (side effect target)
  └── classList.toggle('dark') ← driven by useTheme useEffect
```

---

### 4. Cart Items

| Property | Details |
|----------|---------|
| **State Variable** | `items` (CartItem[]) |
| **Declared** | `src/store/cartStore.ts` line 24: Zustand store, initial `[]` |
| **Mutated By** | `addItem`, `removeItem`, `updateQuantity`, `clearCart` (all in cartStore), `ProductControls.tsx` calls `addItem` (not yet wired — uses local `added` state only) |
| **Consumed By** | `CartDrawer.tsx`: renders item list (line 48), calculates subtotal/shipping/total (lines 22-24), `Navbar.tsx`: `getTotalItems()` for badge count (line 16), `CheckoutClient.tsx`: reads items for order snapshot |
| **Scope** | **Global** — Zustand store with localStorage persistence (`mmwafrika-cart`) |
| **Classification** | ✅ **SAFE** — single source of truth, persisted |

---

### 5. Cart Currency

| Property | Details |
|----------|---------|
| **State Variable** | `currency` (`'ZAR' | 'USD'`) |
| **Declared** | `src/store/cartStore.ts` line 24: initial `'ZAR'` |
| **Mutated By** | `setCurrency` action in cartStore, `CurrencyToggle` component (calls `setCurrency`) |
| **Consumed By** | `CartDrawer.tsx`: price formatting (line 22, 69), `ProductControls.tsx`: price display, `Navbar.tsx`: indirectly |
| **Scope** | **Global** — Zustand store |
| **Classification** | ✅ **SAFE** — single source of truth |

---

### 6. Cart Shipping Region (Local)

| Property | Details |
|----------|---------|
| **State Variable** | `shippingRegion` (string) |
| **Declared** | `CartDrawer.tsx` line 20: `useState('za')` |
| **Mutated By** | `<select>` onChange (line 87) |
| **Consumed By** | `CartDrawer.tsx`: shipping cost calculation (line 23), dropdown value (line 87), transit estimate display (line 91) |
| **Scope** | **Local** — CartDrawer only |
| **Classification** | ✅ **SAFE** — single consumer, no sharing needed |

---

### 7. Mounted State (CartDrawer)

| Property | Details |
|----------|---------|
| **State Variable** | `mounted` (boolean) |
| **Declared** | `CartDrawer.tsx` line 19: `useState(false)` |
| **Mutated By** | `useEffect(() => { setMounted(true) }, [])` (line 26) |
| **Consumed By** | `CartDrawer.tsx`: early return guard (line 30), navbar cart badge (line 83) |
| **Scope** | **Local** — prevents hydration mismatch |
| **Classification** | ✅ **SAFE** — standard SSR hydration guard |

---

### 8. Mounted State (Navbar)

| Property | Details |
|----------|---------|
| **State Variable** | `mounted` (boolean) |
| **Declared** | `Navbar.tsx` line 14: `useState(false)` |
| **Mutated By** | `useEffect(() => { setMounted(true) }, [])` (line 20) |
| **Consumed By** | `Navbar.tsx`: cart badge conditional render (line 83) |
| **Scope** | **Local** — prevents hydration mismatch |
| **Classification** | ✅ **SAFE** — standard SSR hydration guard |

---

### 9. Mounted State (Theme)

| Property | Details |
|----------|---------|
| **State Variable** | `mounted` (boolean) |
| **Declared** | `useTheme.ts` line 9: `useState(false)` |
| **Mutated By** | `useEffect(() => { setMounted(true) }, [])` (line 15) |
| **Consumed By** | `ThemeToggle.tsx`: placeholder during SSR (line 8) |
| **Scope** | **Local to useTheme hook** — each hook caller gets own `mounted` |
| **Classification** | ⚠️ **FRAGMENTED** if multiple components use `useTheme` — each gets independent `mounted` state |

---

### 10. Checkout Form State

| Property | Details |
|----------|---------|
| **State Variables** | `form`, `errors`, `status`, `errorMessage` |
| **Declared** | `CheckoutForm.tsx` lines 14-17: 4x `useState` |
| **Mutated By** | `handleChange` (form), validation logic (errors), submit handler (status, errorMessage) |
| **Consumed By** | `CheckoutForm.tsx`: input values, error displays, success/error UI |
| **Scope** | **Local** — form only |
| **Classification** | ✅ **SAFE** — self-contained form state |

---

### 11. Newsletter State

| Property | Details |
|----------|---------|
| **State Variables** | `email`, `status`, `errorMessage` |
| **Declared** | `NewsletterSection.tsx` lines 6-8: 3x `useState` |
| **Mutated By** | Input onChange (email), submit handler (status, errorMessage) |
| **Consumed By** | `NewsletterSection.tsx`: input value, status display |
| **Scope** | **Local** — newsletter only |
| **Classification** | ✅ **SAFE** — self-contained |

---

### 12. Product Controls State

| Property | Details |
|----------|---------|
| **State Variables** | `selectedSize`, `quantity`, `added` |
| **Declared** | `ProductControls.tsx` lines 14, 15, 19: 3x `useState` |
| **Mutated By** | Size selector, quantity buttons, add-to-cart button |
| **Consumed By** | `ProductControls.tsx`: UI only |
| **Scope** | **Local** — product controls only |
| **Classification** | ⚠️ **LEAKING POTENTIAL** — `added` state is local animation flag, but add-to-cart should update global cart store (may not be wired) |

---

### 13. Environment (Pet Theme)

| Property | Details |
|----------|---------|
| **State Source** | URL pathname (`/pets` or `/pet-`) |
| **Declared** | `EnvironmentProvider.tsx` line 7: `usePathname()` |
| **Mutated By** | Next.js router (pathname changes) |
| **Consumed By** | `document.body.classList` — toggles `env-pets` class (line 11) |
| **Scope** | **Global side effect** — mutates DOM directly |
| **Classification** | ✅ **SAFE** — no React state, just DOM mutation on route change |

---

### Complete State Classification Summary

| Classification | Count | State Variables |
|---------------|-------|----------------|
| ✅ **SAFE** | 9 | isMobileMenuOpen, isCartOpen, items, currency, shippingRegion, mounted (CartDrawer), mounted (Navbar), checkout form, newsletter, environment |
| ⚠️ **FRAGMENTED** | 2 | theme (useTheme), mounted (useTheme) |
| ⚠️ **LEAKING POTENTIAL** | 1 | added (ProductControls) |

---

## Prompt 22 — Duplicate State Detection

### Confirmed Duplication #1: `mounted` State (3 Instances)

**The Same Concept, Three Separate Implementations:**

| Location | Declaration | Purpose |
|----------|------------|---------|
| `CartDrawer.tsx` line 19 | `const [mounted, setMounted] = useState(false)` | Hydration guard |
| `Navbar.tsx` line 14 | `const [mounted, setMounted] = useState(false)` | Hydration guard |
| `useTheme.ts` line 9 | `const [mounted, setMounted] = useState(false)` | Hydration guard |

**How They Can Desync:**
- Each is independent `useState(false)` → all start as `false` during SSR
- Each has its own `useEffect(() => { setMounted(true) }, [])` → all fire after first client render
- They **cannot** technically desync because they all follow the same lifecycle
- **But** they create 3 separate re-render cycles when they could be unified

**Real Impact:**
- 3 components re-render independently when they each transition `false → true`
- If `ThemeToggle` is rendered inside `Navbar`, and both have mounted checks, the theme toggle placeholder renders during Navbar's "mounted" phase even if ThemeToggle's own `mounted` is ready

**Failure Scenario (Minor):**
```
1. SSR: Navbar mounted=false, CartDrawer mounted=false, Theme.mounted=false
2. Hydrate: All 3 useEffects schedule state updates
3. Render cycle 1: Navbar mounts (re-render), Theme mounted (re-render)
4. Render cycle 2: CartDrawer mounts (re-render)
5. Result: 3 separate re-renders instead of 1 coordinated update
```

**Not a bug, but wasteful.** A single `useIsMounted` hook shared via context would reduce this to 1 state update.

---

### Confirmed Duplication #2: Theme State — localStorage + DOM + React State

**Three Sources of Truth for the Same Concept:**

| Source | Location | Update Mechanism |
|--------|----------|-----------------|
| React `useState` | `useTheme.ts` line 8: `const [theme, setTheme] = useState<'light'|'dark'>('light')` | `toggle()` callback |
| `localStorage` | `mmwafrika-theme` key | Written by `useTheme` useEffect (line 29) |
| DOM `classList` | `document.documentElement.classList` | Toggled by `useTheme` useEffect via rAF (line 27) |

**How They Can Desync:**

**Desync Scenario 1 — Stale React State:**
```
1. Tab A: User clicks toggle → React state: 'dark', localStorage: 'dark', DOM: 'dark'
2. Tab B: User opens site (same browser, same localStorage) → useTheme reads localStorage: 'dark'
3. Tab A: User closes tab
4. Tab B: React state is 'dark', DOM is 'dark', localStorage is 'dark' — SYNCED
5. No desync here because useEffect reads localStorage on mount
```

**Desync Scenario 2 — Manual DOM Interference (REAL BUG):**
```
1. User loads page → layout.tsx inline script reads localStorage, sets <html class="dark">
2. useTheme.ts useEffect runs → reads localStorage → setTheme('dark')
3. useEffect sync runs → document.documentElement.classList.toggle('dark', true) — redundant but correct
4. External script or browser extension removes 'dark' class from <html>
5. DOM: no 'dark' class, React state: 'dark', localStorage: 'dark'
6. UI shows light theme (CSS drives from classList), but ThemeToggle shows sun icon (thinks it's dark)
7. VISUAL MISMATCH: Component UI doesn't match actual theme
```

**Desync Scenario 3 — Multiple useTheme Callers (CONFIRMED):**
```
1. ThemeToggle calls useTheme() → gets its own useState instance
2. AnotherComponent calls useTheme() → gets DIFFERENT useState instance
3. ThemeToggle calls toggle() → only updates ITS OWN useState
4. AnotherComponent's useState is UNCHANGED
5. DOM updates (shared side effect), localStorage updates
6. But AnotherComponent won't re-render because its useState never changed
7. AnotherComponent renders with stale theme value until its next render cycle
```

**Current Reality:** Only `ThemeToggle` calls `useTheme()`, so Scenario 3 doesn't trigger today. But the hook is designed as if it could be called from multiple places — and it would break.

---

### Confirmed Duplication #3: Cart Open State — Partial Overlap

**Two mechanisms that both try to control body scroll:**

| Mechanism | Location | What It Does |
|-----------|----------|-------------|
| CartDrawer `useEffect` | `CartDrawer.tsx` line 27 | `document.body.style.overflow = isCartOpen ? 'hidden' : 'auto'` |
| MobileMenu — **MISSING** | `MobileMenu.tsx` | Nothing — no body overflow management |

**Not exactly duplicate state, but related concepts handled differently:**
- CartDrawer: manages `isCartOpen` (global store) + body overflow (local effect)
- MobileMenu: receives `isOpen` (lifted prop) + NO body overflow management

**How They Desync:**
```
1. Cart open → isCartOpen=true → body overflow='hidden'
2. User somehow opens mobile menu while cart is open (cart at z-60, menu at z-100)
3. Mobile menu has no overflow management → doesn't touch body
4. User closes cart → isCartOpen=false → body overflow='auto'
5. Mobile menu still open → body now scrollable → SCROLL BLEED
```

**This is a coordination failure, not state duplication.** The two overlays should coordinate their body overflow behavior.

---

### Summary of Confirmed Duplications

| Duplication | Components Involved | Desync Risk | Actual Impact |
|-------------|-------------------|-------------|---------------|
| `mounted` state (×3) | CartDrawer, Navbar, useTheme | Low — same lifecycle | Wasteful re-renders (3→1 optimizable) |
| Theme tri-sync | React state + localStorage + DOM classList | Medium — external DOM manipulation can break sync | Visual mismatch between toggle icon and actual theme |
| Body overflow coordination | CartDrawer + MobileMenu | High — when both overlays interact | Scroll bleed when cart closes but menu stays open |

---

## Prompt 23 — State Mutation Chain

### User Clicks Hamburger Menu — Full Execution Trace

**Initial State:**
```
- isMobileMenuOpen: false
- MobileMenu: rendered but translated off-screen (translate-x-full)
- Backdrop: not rendered (conditional on isOpen)
- Body overflow: 'auto'
- Hamburger icon: ☰ (three horizontal lines)
```

---

#### Phase 1: Event → State Change

**Step 1: Click Event Fires**
```
Element: <button> at Navbar.tsx line 86
Event: onClick
Handler: () => setIsMobileMenuOpen(!isMobileMenuOpen)
Value: false → true
```

**Step 2: React Schedules State Update**
```
React internal: isMobileMenuOpen queued as true
No immediate re-render — batched with any other pending updates
```

---

#### Phase 2: Re-render

**Components Re-rendered:**

| Component | Re-rendered? | Why |
|-----------|-------------|-----|
| `Navbar` | ✅ YES | Owns `isMobileMenuOpen` state — state change triggers re-render |
| `MobileMenu` | ✅ YES | Receives new `isOpen` prop (`false → true`) |
| `MobileMenu` backdrop | ✅ YES (new render) | Conditional render: `{isOpen && <div ...>}` — was null, now renders |
| `MobileMenu` aside | ✅ YES | Class changes based on `isOpen` prop |
| `ThemeToggle` (inside MobileMenu) | ✅ YES | Re-rendered as child of MobileMenu (parent re-render) |
| `CurrencyToggle` (inside MobileMenu) | ✅ YES | Re-rendered as child of MobileMenu |
| `CartDrawer` | ❌ NO | Not affected — no prop/state change |
| Page content (`{children}`) | ❌ NO | Navbar doesn't re-render children below nav |
| `Footer` | ❌ NO | Separate component, no dependency |

**Unnecessary Re-renders:**
- `ThemeToggle` re-renders even though nothing about it changed — it's a child of MobileMenu which always re-renders when Navbar does. **Could be memoized** with `React.memo`.
- `CurrencyToggle` same issue.

---

#### Phase 3: DOM Mutations

**DOM Nodes Changed:**

| DOM Node | Before | After | Change Type |
|----------|--------|-------|-------------|
| Navbar hamburger `<button>` | Contains ☰ icon (3 lines) | Contains ✕ icon (2 diagonal lines) | Child element swap |
| MobileMenu backdrop `<div>` | Does not exist in DOM | New `<div>` inserted at z-[99] | DOM insertion |
| MobileMenu `<aside>` | `className="... translate-x-full"` | `className="... translate-x-0"` | Class change |
| `<body>` | `overflow: auto` (default) | **UNCHANGED** — MobileMenu doesn't set overflow | NO CHANGE (BUG) |

---

#### Phase 4: CSS Effects

**CSS Transitions Triggered:**

| Element | CSS Property | Transition | Duration |
|---------|-------------|------------|----------|
| MobileMenu `<aside>` | `transform: translateX(full → 0)` | `transition-transform duration-300` | 300ms |
| MobileMenu backdrop | `opacity: 0 → 1` (new element) | None — instant appearance with `bg-black/50 backdrop-blur-sm` | Instant |
| Hamburger icon SVG | Element swap (no transition) | None | Instant swap |

**Visual Result:**
1. Backdrop instantly appears (black 50% + blur)
2. Menu panel slides in from right over 300ms
3. Hamburger icon instantly changes to X

---

### Complete Execution Chain Diagram

```
CLICK on <button> (Navbar.tsx:86)
  │
  ▼
setIsMobileMenuOpen(true)
  │
  ▼
React batch update
  │
  ├─► Navbar re-render
  │     ├─► Hamburger icon: ☰ → ✕ (SVG swap)
  │     └─► MobileMenu props: isOpen=true
  │           │
  │           ▼
  │     MobileMenu re-render
  │           ├─► Backdrop: null → <div> inserted into DOM
  │           │     - z-[99], fixed, full-screen, bg-black/50, backdrop-blur-sm
  │           │     - onClick={onClose} wired
  │           │
  │           ├─► Aside: translate-x-full → translate-x-0
  │           │     - CSS transition: 300ms slide-in
  │           │
  │           ├─► ThemeToggle re-render (unnecessary)
  │           └─► CurrencyToggle re-render (unnecessary)
  │
  └─► useEffect on pathname change: NOT triggered (pathname didn't change)
        (This effect only runs when pathname changes, not on menu toggle)
```

---

### Every DOM Node Affected

| # | Node | Change | Driven By |
|---|------|--------|-----------|
| 1 | Navbar `<button>` (hamburger) | SVG children replaced | Navbar JSX, conditional rendering |
| 2 | `<body>` (new child) | MobileMenu backdrop `<div>` inserted | MobileMenu conditional render |
| 3 | `<body>` (new child) | MobileMenu `<aside>` class changed | MobileMenu className template literal |
| 4 | MobileMenu `<aside>` (class attribute) | `translate-x-full` → `translate-x-0` | `isOpen ? 'translate-x-0' : 'translate-x-full'` |

**Total: 4 DOM mutations** (1 element swap, 1 insertion, 1 class change, 1 new child)

---

### Identified Issues

#### Unnecessary Re-renders

| Component | Why It Re-renders | Should It? | Fix |
|-----------|------------------|------------|-----|
| `ThemeToggle` (in MobileMenu) | Parent (MobileMenu) re-renders on every `isOpen` change | NO — its props/theme state didn't change | Wrap in `React.memo()` |
| `CurrencyToggle` (in MobileMenu) | Same — child of MobileMenu | NO | Wrap in `React.memo()` |
| All `NAV_LINKS` `<Link>` elements | MobileMenu re-renders entire list | NO — links don't depend on `isOpen` (menu is always rendered, just translated) | Extract nav list to memoized component |

---

#### Delayed Updates

| Update | Expected Timing | Actual Timing | Gap | Impact |
|--------|---------------|---------------|-----|--------|
| Body overflow lock | Should happen on menu open | **NEVER HAPPENS** | Permanent | Scroll bleed on every mobile menu interaction |
| Menu close on route change | Should close instantly | Happens on next render cycle | 1 frame delay | Negligible — `useEffect` fires after render |

---

#### Missing Side-Effects

| Missing Side-Effect | Expected Behavior | Current Behavior | Consequence |
|--------------------|-------------------|------------------|-------------|
| **Body overflow lock** | `document.body.style.overflow = 'hidden'` when menu opens | Not implemented | Page scrolls behind open menu |
| **Focus trap** | Focus should be trapped inside mobile menu when open | Not implemented | Tab key can move focus to page content behind menu |
| **aria-hidden on background** | Main content should get `aria-hidden="true"` when menu open | Not implemented | Screen readers read background content |
| **Scroll position restore** | If page was scrolled, menu open shouldn't lose position | Body overflow not locked, so scroll position can drift | User loses their place |
| **Escape key handler** | Pressing Escape should close menu | Not implemented | Keyboard users stuck |
| **Return focus** | When menu closes, focus should return to hamburger button | Not implemented | Focus lost or moves to top of page |

---

### Comparison: Cart Drawer Open Chain (For Reference)

```
CLICK on cart bag button (Navbar.tsx:80)
  │
  ▼
toggleCart() → Zustand store update (isCartOpen: false → true)
  │
  ├─► Zustand notifies subscribers
  │     ├─► CartDrawer re-render (subscribes to isCartOpen)
  │     │     ├─► Early return guard passes (mounted=true, isCartOpen=true)
  │     │     ├─► Backdrop <div> rendered
  │     │     └─► Aside rendered
  │     │
  │     └─► Navbar re-render (subscribes to getTotalItems — not isCartOpen)
  │           └─► Actually NO — Navbar only subscribes to getTotalItems, 
  │               not isCartOpen. toggleCart is called but store doesn't 
  │               trigger Navbar re-render unless totalItems changes.
  │               This is CORRECT — Navbar doesn't need to re-render.
  │
  ├─► CartDrawer useEffect fires (dependency: isCartOpen)
  │     └─► document.body.style.overflow = 'hidden'
  │
  └─► CartDrawer useEffect fires (dependency: setIsCartOpen)
        └─► window.addEventListener('keydown', handleEsc)
```

**CartDrawer: 2 DOM mutations** (body overflow, keydown listener) + component renders.
**MobileMenu: 3 DOM mutations** (no body overflow, no keydown listener) + component renders.

**The difference:** CartDrawer has side effects (overflow lock, Escape handler). MobileMenu has none.

---

*State Audit Date: 6 April 2026*
*Files Analyzed: cartStore.ts, useTheme.ts, Navbar.tsx, MobileMenu.tsx, CartDrawer.tsx, EnvironmentProvider.tsx, ThemeToggle.tsx, ProductControls.tsx, CheckoutForm.tsx, NewsletterSection.tsx, layout.tsx*

---

## Prompt 42 — Visual Hierarchy Validation

### Visual Hierarchy Tiers (As Designed)

| Tier | Element | Intended Dominance | Actual Implementation |
|------|---------|-------------------|----------------------|
| **T1 — Primary Brand** | "MmwAfrika" | DOMINANT — largest, boldest, first word | `text-display-xl` (clamp 3.5rem–4.5rem), `font-bhineka`, `font-semibold`, `leading-[1]` |
| **T2 — Secondary Brand** | "Pride Couture" | SUPPORTING — elegant, secondary emphasis | `text-h1` (clamp 2.25rem–3rem), `font-vintage`, `italic` |
| **T3 — Hero Headline** | "Unique Crochet Couture, Plushies & Blankets" | DESCRIPTIVE — explains the offering | `text-h3` (clamp 1.5rem–1.75rem), `font-sans` |
| **T4 — Taglines** | "Handmade with Love", "Custom Orders are Welcome" | EMOTIONAL SUPPORT | `text-h3` (same as T3!), `font-vintage`, `italic`/`font-light` |
| **T5 — Micro Copy** | "crafted with care" | SUBTLE ACCENT | `text-body-md` (1rem), `font-bhineka` |
| **T6 — Trust Signals** | "Artisanal Excellence", "Est. 2024" | FOOTER ANCHOR | `text-label` (0.75rem), uppercase |

---

### What Dominates Visually (Reality)

**The hero section has a hierarchy problem: T3, T4 are the SAME size.**

| Element | Declared Size | Computed (1440px) | Visual Weight |
|---------|--------------|-------------------|---------------|
| "MmwAfrika" | `text-display-xl` | ~86px | **HIGHEST** — largest by far, boldest font |
| "Pride Couture" | `text-h1` | ~58px | **HIGH** — but reduced by italic slant and serif fallback |
| "Unique Crochet Couture..." | `text-h3` | ~36px | **MEDIUM** — Inter sans-serif, `font-semibold` on span adds weight |
| "Handmade with Love" | `text-h3` | ~36px | **MEDIUM-LOW** — same size as T3 but italic + gold color draws attention |
| "Custom Orders are Welcome" | `text-h3` | ~36px | **LOW** — same size but `font-light` + muted gray makes it recede |
| "crafted with care" | `text-body-md` | 16px | **LOWEST** — 2.25× smaller than T4 |
| Trust badges (bottom) | `text-h2` | ~43px | **MEDIUM-HIGH** — actually LARGER than hero headline |

---

### What SHOULD Dominate (Luxury Brand Logic)

For a luxury couture brand, the visual hierarchy should be:

1. **Brand name** ("MmwAfrika") — immediately identifiable, memorable
2. **Hero headline** — what they offer, clear and concise
3. **Secondary brand** ("Pride Couture") — reinforces luxury positioning
4. **Emotional taglines** — single, powerful statement
5. **Micro copy** — minimal, almost whisper-quiet
6. **Trust signals** — subdued but present

---

### Where Hierarchy Is Broken

#### Broken #1: Taglines Same Size as Hero Headline

**Problem:** "Handmade with Love" and "Custom Orders are Welcome" use `text-h3` — the **exact same size** as the actual hero headline "Unique Crochet Couture, Plushies & Blankets."

**Impact:** Three lines compete at the same visual level. The eye doesn't know which to read first.

**Expected:** Taglines should be `text-body-md` or smaller, with reduced weight/color. The headline should be `text-h1` or `text-h2` at minimum.

---

#### Broken #2: Trust Badges Larger Than Hero Headline

**Problem:** Trust badges at the bottom use `text-h2` (~43px) while the hero H1 uses `text-h3` (~36px). The footer trust section is visually louder than the main message.

**Impact:** After reading the hero, the eye hits larger text at the bottom — visual gravity pulls attention away from the core message.

**Expected:** Trust badges should be `text-label` or `text-body-sm` — they're credibility markers, not headlines.

---

#### Broken #3: "crafted with care" is Too Small for Its Role

**Problem:** This is a brand ethos statement but uses `text-body-md` (16px) — the smallest text in the hero cluster except labels.

**Impact:** It visually disappears. On a brand page, the ethos line should whisper but still be felt — 16px is too close to body copy.

**Expected:** Should be `text-label` with uppercase + wide letter-spacing for a luxury fashion label feel.

---

#### Broken #4: "MmwAfrika" and "Pride Couture" Size Gap Too Large

**Problem:** "MmwAfrika" is ~86px. "Pride Couture" is ~58px. That's a 48% size difference. In luxury branding, the two parts of the brand name should feel like a unified lockup, not two separate hierarchies.

**Impact:** "Pride Couture" reads as a subtitle, not half of the brand name. The full brand is "MmwAfrika Pride Couture" — it should feel like one mark.

**Expected:** "Pride Couture" should be closer to `text-display-lg` (clamp 2.5rem–3.5rem) to narrow the gap while still creating secondary emphasis.

---

#### Broken #5: Navbar Logo vs Hero Logo Disconnect

**Problem:**
- Navbar logo: `text-xs` mobile (12px) → `text-sm` tablet (14px) → `text-h2` desktop (~43px)
- Hero "MmwAfrika": `text-display-xl` (~86px)

The jump from navbar to hero is **6×** on desktop. While hero should be bigger, this extreme jump creates a jarring transition — the brand appears tiny in the navbar then explodes on the hero.

**Expected:** Navbar logo should be closer to `text-xl` (~20px) minimum on desktop to create a smoother scale.

---

### Visual Hierarchy Score

| Tier | Expected Rank | Actual Rank | Status |
|------|-------------|-------------|--------|
| MmwAfrika (T1) | 1st (largest) | ✅ 1st | CORRECT |
| Pride Couture (T2) | 2nd | ✅ 2nd | CORRECT (but gap too large) |
| Hero Headline (T3) | 3rd | ⚠️ Tied 3rd | BROKEN (same size as taglines) |
| Taglines (T4) | 4th | ⚠️ Tied 3rd | BROKEN (too prominent) |
| Trust Badges | 6th (subdued) | ❌ 3rd | BROKEN (larger than headline) |
| Micro Copy (T5) | 5th | ✅ 5th | CORRECT (but too small) |
| Labels (T6) | 7th (smallest) | ✅ 7th | CORRECT |

---

## Prompt 43 — Luxury Brand Alignment Check

### Evaluation Against Luxury Brand Standards

---

#### SPACING

**What's Good:**
- Hero section uses `pt-12 pb-24 md:pt-24 md:pb-32` — generous vertical breathing room
- `gap-16 lg:gap-24` between hero columns — luxury whitespace
- Footer has `pt-24 pb-12` — appropriate closure spacing
- `spacing-section: 6rem` design token — good macro spacing

**What's Cheap-Looking:**

| Element | Current | Luxury Standard | Issue |
|---------|---------|----------------|-------|
| Hero text stack `space-y-8` | 32px gap between brand name and taglines | Luxury: 48px–64px minimum between distinct typographic elements | Feels cramped — taglines crowd the brand |
| Button gap `gap-4` | 16px between CTA buttons | Luxury: 24px–32px | Buttons feel like a cluster, not intentional choices |
| Trust badges `gap-12` | 48px between badges | Luxury: 64px–96px with individual breathing room | Badges feel like a toolbar, not curated markers |
| Footer grid `gap-12` | 48px | Acceptable | Fine |
| Product cards `mb-6` | 24px below image | Luxury: 32px–40px | Product info too close to image |
| Hero image decoration `-inset-4` | 16px bleed | Feels arbitrary | Decorative element without purpose |

**Overcrowded Areas:**
1. **Hero text stack** — 5 text elements in `space-y-8` + buttons + divider = 9 stacked elements in one column
2. **Navbar** — logo + 6 nav links + currency toggle + theme toggle + cart + hamburger = 10 interactive elements in one row
3. **Trust badges row** — 4 badges at `text-h2` size creates a wall of text

**Imbalance:**
1. Hero left column (text) is 9 elements deep; right column (image) is 1 hero + 1 floating inset — visual weight is HEAVY on the left
2. Mobile menu has `p-10` padding but content is unevenly distributed — top section is dense, bottom section has large gaps

---

#### TYPOGRAPHY CONTRAST

**What's Good:**
- Serif (Noto Serif) + Sans (Inter) pairing — classic luxury contrast
- Gold accent (`#C6A962`) on neutral background — elegant color hierarchy
- `font-light` on "Custom Orders" — good use of weight variation

**What's Cheap-Looking:**

| Issue | Details | Impact |
|-------|---------|--------|
| **Too many font families** | Bhineka + Vintage + Noto Serif + Inter = 4 typefaces | Luxury brands use 2 maximum (1 serif + 1 sans). 4 feels like a template. |
| **Italic overuse** | "Pride Couture", "Handmade with Love", "The Heritage Collection", navbar logo, product page tagline | Italic is used as a crutch for differentiation instead of proper type hierarchy |
| **Missing font contrast in hero** | Three lines at `text-h3` — no size differentiation between headline and taglines | No hierarchy = no luxury |
| **Label text too small** | `text-label` at 0.75rem (12px) with uppercase + tracking on nav links | At 12px uppercase with 0.05em tracking, nav links are hard to scan |
| **Inconsistent body text** | `text-body-md` (16px) used for product names AND micro copy | Same size for different purposes destroys hierarchy |

---

#### RESTRAINT

**What's Good:**
- Color palette is restrained — warm neutrals with gold accent
- Dashed borders (`border-stitch`) are a unique brand touch, not overused
- Grayscale trust badges with hover color reveal — subtle and sophisticated

**What's Cheap-Looking:**

| Element | Why It Looks Cheap | Fix |
|---------|-------------------|-----|
| **Trust badges at `text-h2`** | Large text shouting brand values = feels like a banner ad, not luxury | Reduce to `text-label` or `text-body-sm` with generous spacing |
| **5 text elements in hero stack** | "MmwAfrika", "Pride Couture", headline, tagline 1, tagline 2, micro copy = 6 lines | Luxury: Brand name (2 lines) + 1 headline + 1 tagline. Max 4. |
| **`opacity-60 grayscale` trust badges** | Faded text strip at the bottom of hero feels like sponsorship logos on a racing car | Remove entirely, or integrate as small icons with minimal text |
| **Glass morphism on hero image overlay** | `glass` class with blur on "The Heritage Collection" label | Glassmorphism is 2021-era trend, not timeless luxury |
| **Floating inset image** | `-bottom-12 -left-20` absolute positioned small image | Feels like a design template trick, not intentional composition |
| **Badge micro-copy on product cards** | "Best Seller", "Handmade", "Limited", "Pet-Safe Material" all fighting for attention | Choose ONE badge per product. Multiple badges = garage sale |

---

### Luxury Brand Scorecard

| Criteria | Score | Notes |
|----------|-------|-------|
| Spacing generosity | 6/10 | Good macro spacing, cramped micro spacing |
| Typography restraint | 4/10 | 4 fonts, italic overuse, no size hierarchy |
| Color discipline | 8/10 | Excellent — restrained palette with purposeful accent |
| Visual hierarchy | 3/10 | Taglines same size as headlines, trust badges too large |
| Decorative restraint | 5/10 | Dashed borders good, glass morphism dated, floating image gimmicky |
| Content density | 4/10 | Hero has too many text elements; trust badge wall |
| Consistency | 5/10 | Same concepts styled differently across components |

**Overall: 5/10 — Mid-market execution with luxury aspirations**

---

### Cheapest-Looking Elements (Ranked)

| Rank | Element | Why | Severity |
|------|---------|-----|----------|
| 1 | Trust badges row at `text-h2` | Looks like a sponsorship banner strip | HIGH |
| 2 | Hero text stack (6 lines, 3 at same size) | Wall of text, no clear entry point | HIGH |
| 3 | Glass morphism overlay on hero image | Dated trend (2021), not timeless | MEDIUM |
| 4 | Floating inset image at `-bottom-12 -left-20` | Template decoration, not intentional design | MEDIUM |
| 5 | Multiple badges on product cards | Cluttered, reduces perceived value | MEDIUM |
| 6 | 4 font families in one page | Lacks typographic discipline | LOW-MEDIUM |

---

### Overcrowded Areas (Ranked)

| Rank | Area | Element Count | Should Be |
|------|------|--------------|-----------|
| 1 | Hero left column | 9 stacked elements | 4–5 maximum |
| 2 | Navbar (desktop) | 10 interactive elements | 7–8 maximum |
| 3 | Trust badges row | 4 badges at headline size | 3–4 at label size |
| 4 | Mobile menu | Brand + tagline + 6 links + currency + theme + CTA = 11 elements | 8–9 maximum |
| 5 | Product card | Image + gradient overlay + badge + pet-safe + quick-view + name + icon + 2 prices = 9 | 5–6 maximum |

---

### Imbalance Map

```
HERO SECTION:
  Left: ██████████████████████████████ (HEAVY — 9 text elements, 2 buttons, 1 divider)
  Right: ████████████ (LIGHT — 1 image, 1 overlay, 1 floating inset)
  Balance: 70/30 — should be 55/45 or 60/40

NAVBAR:
  Left:  ████ (logo)
  Center: ████████████████████ (6 nav links with underlines)
  Right:  ████████████ (currency + theme + cart + hamburger)
  Balance: 20/40/40 — center overloaded

FOOTER:
  Col 1: ████████████ (brand + description)
  Col 2: ██████ (4 links)
  Col 3: ████████ (4 links including WhatsApp)
  Col 4: ████ (3 social icons)
  Balance: 30/20/25/25 — acceptable for a 4-column footer
```

---

## Prompt 44 — Root Cause Synthesis

### Top 5 Root Causes (Not Symptoms)

---

### Root Cause #1: Typography System Has No Enforced Hierarchy

**The Problem:**
CSS custom properties define text sizes (`--text-display-xl`, `--text-h1`, `--text-h3`, etc.) but there is **no system enforcing which size maps to which semantic role**. Any component can use any text class for any purpose.

**Why Issues Keep Happening:**
- HeroSection uses `text-h3` for both headline AND taglines because there's no "headline" vs "tagline" class — just raw sizes
- Trust badges use `text-h2` because it "looked right" at the time — no system said "h2 is reserved for section headers"
- Navbar uses `text-xs` → `text-sm` → `text-h2` responsive chain because there's no "brand lockup" size token
- Every developer decision is ad-hoc because the design tokens are **sizes**, not **roles**

**Which Systems Are Unstable:**
- `globals.css` `@theme` block — defines sizes without semantic meaning
- `tailwind.config.js` — maps CSS vars to utilities but adds no semantic layer
- Component code — picks sizes based on visual guesswork, not system rules

**The Instability Pattern:**
```
Design token: --text-h3 = clamp(1.5rem, 2.5vw, 1.75rem)
  → HeroSection: "I'll use text-h3 for headline"
  → HeroSection: "I'll also use text-h3 for taglines — it's the same size, looks fine"
  → ProductPage: "I'll use text-h3 for product descriptions"
  → CartDrawer: "I'll use text-h3 for 'Total' label"
Result: text-h3 means nothing semantically. Hierarchy is accidental, not designed.
```

**Fix:** Create semantic typography classes:
```css
.text-brand-primary { /* MmwAfrika in hero */ }
.text-brand-secondary { /* Pride Couture in hero */ }
.text-hero-headline { /* Main value proposition */ }
.text-hero-tagline { /* Emotional support line */ }
.text-section-header { /* Section titles */ }
.text-body-primary { /* Body content */ }
.text-body-secondary { /* Muted descriptions */ }
.text-label-ui { /* Navigation, buttons */ }
```

---

### Root Cause #2: Overlay Components Don't Share a Scroll/Body-Lock System

**The Problem:**
CartDrawer and MobileMenu are two overlay systems that both need to control body scroll, but they implement it completely differently — CartDrawer does, MobileMenu doesn't.

**Why Issues Keep Happening:**
- CartDrawer was built with body overflow lock (`useEffect` line 27)
- MobileMenu was built later, copy-pasted the visual pattern (slide-in panel + backdrop) but missed the functional pattern (body lock)
- No shared `useOverlay` or `useBodyLock` hook exists to enforce the behavior
- Each overlay is a one-off implementation

**Which Systems Are Unstable:**
- Body scroll management — entirely ad-hoc per component
- Overlay lifecycle — no shared mount/unmount pattern
- z-index stacking — hardcoded values (z-55, z-60, z-99, z-100) with no system

**The Instability Pattern:**
```
Component A needs overlay → implements body lock ✓
Component B needs overlay → copies visual pattern, misses body lock ✗
Component C needs overlay → copies from B → also missing ✗
Bug report: "page scrolls behind menu" → patch B
Bug report: "page scrolls behind modal" → patch C
Repeat forever.
```

**Fix:** Create a shared overlay system:
```tsx
// hooks/useOverlayLock.ts
function useOverlayLock(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.overscrollBehavior = 'contain'
      return () => {
        document.body.style.overflow = 'auto'
        document.body.style.overscrollBehavior = ''
      }
    }
  }, [isOpen])
}

// Every overlay uses this hook. One source of truth.
```

---

### Root Cause #3: No Design Token for "Luxury Spacing" — Spacing Is Ad-Hoc

**The Problem:**
Spacing values are scattered across Tailwind utility classes (`pt-12`, `pb-24`, `gap-16`, `space-y-8`, `p-10`) with no design system governing what spacing means at each scale.

**Why Issues Keep Happening:**
- Hero uses `space-y-8` (32px) between brand name and taglines — too tight — but nobody noticed because there's no "minimum spacing between typographic tiers" rule
- Buttons use `gap-4` (16px) — button group looks cramped — because `gap-4` is the Tailwind default for "small gap"
- Trust badges use `gap-12` (48px) — looks like a toolbar — because `gap-12` felt right in isolation
- Every spacing decision is relative to the previous element, not relative to a global spacing scale

**Which Systems Are Unstable:**
- `tailwind.config.js` spacing extensions — only defines `section`, `section-sm`, `section-lg` (macro spacing)
- No micro-spacing tokens (for gaps between text elements, buttons, badges)
- Components use Tailwind defaults for everything below the section level

**The Instability Pattern:**
```
Developer looks at hero section:
  "MmwAfrika" and "Pride Couture" need some space → gap-5 (20px) — feels OK
  Taglines need some space from brand → space-y-8 (32px) — feels OK
  Buttons need space → gap-4 (16px) — feels OK
  Each decision is isolated. No relationship between gap-5, space-y-8, and gap-4.
  Result: spacing has no rhythm. Elements feel independently placed, not composed.
```

**Fix:** Define a spacing scale with semantic meaning:
```css
--space-micro: 4px;    /* Between icon and text */
--space-small: 12px;   /* Between related text elements */
--space-medium: 24px;  /* Between UI groups (buttons) */
--space-large: 48px;   /* Between major sections */
--space-xl: 96px;      /* Between page sections */
```

---

### Root Cause #4: State Architecture Is Component-Centric, Not System-Centric

**The Problem:**
State lives where it's declared in the moment, not where it belongs architecturally. `mounted` × 3, theme tri-sync, body lock on one overlay but not another — these are all symptoms of "each component manages its own universe."

**Why Issues Keep Happening:**
- Zustand store handles cart perfectly (global, persisted, single source)
- But theme uses a custom hook with independent `useState` per caller
- And mobile menu uses lifted state (correct pattern) but without shared side effects
- And `mounted` is copy-pasted 3 times instead of being a shared utility
- There's no architecture decision document saying "X pattern for global state, Y pattern for local state"

**Which Systems Are Unstable:**
- Theme state — hook-level fragmentation, will break if a second component uses `useTheme()`
- Overlay state — inconsistent side effects between CartDrawer and MobileMenu
- Hydration state — 3 independent `mounted` booleans

**The Instability Pattern:**
```
Cart: Zustand store → works perfectly
Theme: Custom hook → works by accident (only 1 consumer)
Menu: Lifted state → works but missing side effects
Mounted: Copy-paste → works but wasteful
Next overlay/modal/toggle: Which pattern do I use?
→ Developer picks the most recent pattern they remember
→ System becomes more inconsistent with each addition
```

**Fix:** Establish state architecture rules:
1. **Global UI state** (theme, currency, overlays) → Zustand store
2. **Lifted state** (parent-child sharing) → only for transient UI state (menu open/close)
3. **Local state** → only for component-internal concerns (form values, animation flags)
4. **Side effects** (body lock, focus trap) → shared hooks

---

### Root Cause #5: No Visual QA Process — Components Are Built in Isolation

**The Problem:**
HeroSection was built and looks fine in isolation at one viewport. BentoGrid was built and looks fine in isolation. ProductCard was built and looks fine in isolation. But when composed together on the homepage, the visual hierarchy breaks because no one evaluated the **composed page** as a unit.

**Why Issues Keep Happening:**
- HeroSection doesn't know BentoGrid exists — uses `text-h3` for taglines because it looks fine alone
- BentoGrid uses `text-4xl` for "Curated Placements" — which is ~36px, the same as hero's `text-h3`
- ProductCard uses `text-body-md` for product names — fine alone, but in a grid of 8 cards, it creates visual noise
- No one ever looked at the **full homepage composition** and asked "does the visual hierarchy work across all components?"

**Which Systems Are Unstable:**
- Every component's typography choices — they're made in isolation
- The homepage composition — it's just `<HeroSection /><BentoGrid /><NewsletterSection />` with no orchestration
- Cross-component visual consistency — relies on developer eyeballs, not system rules

**The Instability Pattern:**
```
Component A: "I'll use text-h3 for my section title — looks good"
Component B: "I'll use text-h3 for my tagline — looks good"
Component C: "I'll use text-h2 for my badges — looks good"
Compose A + B + C on homepage:
  → text-h3 appears 5 times at different semantic levels
  → text-h2 appears in footer AND hero (confusing)
  → No element is truly dominant because everything is loud
```

**Fix:** 
1. Create a composition-level design review process
2. Define page templates that specify which typography classes are allowed at which positions
3. Add visual regression testing (screenshots compared across deploys)

---

### Root Cause Dependency Graph

```
Root Cause #1: No typography hierarchy system
  ├──→ Visual hierarchy broken (Prompt 42)
  ├──→ Luxury brand misalignment (Prompt 43)
  └──→ Components pick sizes ad-hoc (Prompt 44, #5)

Root Cause #2: No shared overlay/scroll system
  ├──→ Scroll bleed (Prompt 25)
  ├──→ Missing containment (Prompt 26)
  └──→ State inconsistency (Prompt 22)

Root Cause #3: No spacing design system
  ├──→ Overcrowded areas (Prompt 43)
  ├──→ Imbalance (Prompt 43)
  └──→ Cheap-looking compositions (Prompt 43)

Root Cause #4: No state architecture
  ├──→ Fragmented state (Prompt 21)
  ├──→ Duplicate state (Prompt 22)
  └──→ Unnecessary re-renders (Prompt 23)

Root Cause #5: No visual QA process
  ├──→ All hierarchy issues compound
  ├──→ Luxury brand standards not enforced
  └──→ Issues only caught in production, not development
```

**The Most Unstable System:** The **typography layer** (Root Cause #1) because it cascades into every visual issue. The second most unstable is the **overlay/scroll layer** (Root Cause #2) because it creates user-facing bugs on every mobile interaction.

---

*Visual & Root Cause Audit Date: 6 April 2026*
*Files Analyzed: HeroSection.tsx, BentoGrid.tsx, ProductCard.tsx, Navbar.tsx, Footer.tsx, page.tsx, constants.ts, globals.css, tailwind.config.js, and all prior audit findings*
