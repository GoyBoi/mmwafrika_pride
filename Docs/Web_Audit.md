# System Control & Navigation Audit

---

## MASTER AUDIT — Control, Navigation & Interaction Integrity

---

### System 1: Navigation (Desktop Navbar)

| Property | Details |
|----------|---------|
| **System Name** | Desktop Navigation Bar |
| **Source of Truth** | `constants.ts` → `NAV_LINKS` array (6 items) |
| **Trigger Points** | `<Link>` elements in `Navbar.tsx` lines 43 (desktop), 72 (tablet icon nav) |
| **Consumers** | `Navbar.tsx` renders links, `isActive()` highlights current route via `usePathname()` |
| **Conflicts** | ⚠️ Three separate nav rendering modes: desktop (`lg:flex`), tablet icon grid (`sm:flex lg:hidden`), mobile hamburger (`MobileMenu`). Each has different link styles and interaction patterns. |
| **Failure Modes** | — Tablet mode uses SVG icons instead of text — icons for "Custom Orders" and "Pets" are ambiguous (pencil for custom orders? paw for pets — reasonable but not instant recognition). |

---

### System 2: Mobile Menu

| Property | Details |
|----------|---------|
| **System Name** | Mobile Slide-In Menu |
| **Source of Truth** | `Navbar.tsx` → `useState(false)` → `isMobileMenuOpen` passed as prop to `MobileMenu` |
| **Trigger Points** | Navbar hamburger button (line 86: `onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}`), MobileMenu close button (line 32: `onClick={onClose}`), MobileMenu backdrop (line 20: `onClick={onClose}`), Nav links inside menu (line 38: `onClick={onClose}`), CTA link (line 53: `onClick={onClose}`) |
| **Consumers** | `Navbar.tsx` (hamburger icon swap), `MobileMenu.tsx` (backdrop conditional render, aside translate class) |
| **Conflicts** | ❌ **NO body overflow lock** — background scrolls while menu is open. ❌ **NO Escape key handler**. ❌ **NO focus trap**. ❌ **NO `aria-hidden` on background content**. |
| **Failure Modes** | User opens menu → scrolls → background page scrolls behind menu. User presses Escape → nothing happens. User tabs → focus escapes to background content. |

---

### System 3: Cart Drawer

| Property | Details |
|----------|---------|
| **System Name** | Shopping Cart Slide Drawer |
| **Source of Truth** | `cartStore.ts` → Zustand store → `isCartOpen` boolean |
| **Trigger Points** | Navbar cart bag button (line 82: `onClick={toggleCart}`), Cart close button (line 41: `onClick={() => setIsCartOpen(false)}`), Cart backdrop (line 34: `onClick={() => setIsCartOpen(false)}`), Checkout button (line 102: `onClick` → close + navigate), Collections link (line 78: `onClick={() => setIsCartOpen(false)}`) |
| **Consumers** | `CartDrawer.tsx` (conditional render, body overflow lock, Escape key listener), `Navbar.tsx` (cart badge count via `getTotalItems()`) |
| **Conflicts** | ✅ Body overflow lock implemented. ✅ Escape key handler implemented. ⚠️ No `overscroll-behavior: contain` on inner scroll area. ⚠️ No focus trap. ⚠️ WhatsApp FAB at `z-[60]` shares z-index with Cart Drawer at `z-[60]` — stacking conflict potential. |
| **Failure Modes** | User scrolls to end of cart items → if body weren't locked, scroll would chain to document. On iOS Safari, `body overflow: hidden` may not fully prevent background scroll. |

---

### System 4: Scroll System

| Property | Details |
|----------|---------|
| **System Name** | Document Scroll + Overlay Scroll Containment |
| **Source of Truth** | Document `<html>` + `<body>` (implicit), with overrides from CartDrawer `useEffect` |
| **Trigger Points** | User scroll gestures (wheel, touch, trackpad) |
| **Consumers** | Entire page content, CartDrawer inner scroll area (`overflow-y-auto`) |
| **Conflicts** | ❌ CartDrawer locks body scroll (`overflow: hidden`), MobileMenu does NOT. When both overlays are open, CartDrawer controls body but MobileMenu doesn't coordinate → scroll bleed through MobileMenu. ❌ No `overscroll-behavior` anywhere in codebase. ❌ No `touch-action` restrictions on backdrops. |
| **Failure Modes** | See scroll bleed analysis in `all_audits.md` (Prompts 24-26). |

---

### System 5: Theme Toggle

| Property | Details |
|----------|---------|
| **System Name** | Light/Dark Theme Toggle |
| **Source of Truth** | `useTheme.ts` → local `useState` synced to `localStorage` + `document.documentElement.classList` |
| **Trigger Points** | `ThemeToggle.tsx` button (line 17: `onClick={toggle}`) |
| **Consumers** | `ThemeToggle.tsx` (icon swap sun↔moon), all components via CSS `.dark` class selector |
| **Conflicts** | ⚠️ `useTheme` creates independent `useState` per caller — if a second component calls `useTheme()`, it would have stale state. Currently only `ThemeToggle` uses it. ⚠️ `ThemeToggle` renders in Navbar (desktop: visible, mobile: hidden via `hidden sm:block`) AND inside MobileMenu (always visible when menu open). |
| **Failure Modes** | On mobile (<640px), ThemeToggle is HIDDEN from Navbar → only accessible inside MobileMenu → requires 2 taps (hamburger → toggle). External DOM manipulation of `.dark` class can desync React state from visual theme. |

---

### System 6: Currency Toggle

| Property | Details |
|----------|---------|
| **System Name** | ZAR/USD Currency Switcher |
| **Source of Truth** | `cartStore.ts` → Zustand store → `currency` ('ZAR' \| 'USD') |
| **Trigger Points** | `CurrencyToggle.tsx` button (line 12: `onClick={toggleCurrency}`), `ProductControls.tsx` ZAR/USD buttons (lines 34-35), MobileMenu contains `CurrencyToggle` component |
| **Consumers** | `CartDrawer.tsx` (price formatting), `ProductControls.tsx` (price display), `CurrencyToggle.tsx` (visual active state) |
| **Conflicts** | ✅ Single source of truth (Zustand store). ⚠️ `CurrencyToggle` renders in Navbar (desktop: visible, mobile: hidden via `hidden sm:block`) AND inside MobileMenu. No conflict — both read from same store. |
| **Failure Modes** | None confirmed. Zustand store ensures consistency across all consumers. |

---

### System 7: WhatsApp FAB

| Property | Details |
|----------|---------|
| **System Name** | WhatsApp Floating Action Button |
| **Source of Truth** | Static `<a>` element — no React state |
| **Trigger Points** | `WhatsAppFAB.tsx` anchor (line 5: `href={WHATSAPP_URL}`, `target="_blank"`) |
| **Consumers** | None — standalone external link |
| **Conflicts** | ⚠️ `z-[60]` — **same z-index as Cart Drawer** (`z-[60]`). When cart drawer opens, WhatsApp FAB may render on top of or behind the drawer depending on DOM order. Currently FAB is rendered AFTER CartDrawer in `layout.tsx` → FAB wins stacking. ⚠️ `right-24` (96px) positioning — may overlap with cart drawer on narrow viewports. |
| **Failure Modes** | Cart drawer open + WhatsApp FAB visible → FAB floats on top of drawer's backdrop area. Visually confusing — user sees WhatsApp button overlaying the dimmed background. |

---

### System 8: Overlay Stacking (z-index)

| Property | Details |
|----------|---------|
| **System Name** | Z-Index Layering System |
| **Source of Truth** | Hardcoded Tailwind `z-*` classes — no design system |
| **Trigger Points** | N/A — passive stacking |
| **Consumers** | All fixed/absolute positioned overlays |
| **Conflicts** | See detailed z-index map below. |
| **Failure Modes** | Multiple conflicts identified. |

---

### System 9: Product Controls (Add to Bag)

| Property | Details |
|----------|---------|
| **System Name** | Product Page Size/Currency/Add-to-Bag Controls |
| **Source of Truth** | Local `useState` for `selectedSize`, `added` + Zustand for `addItem`, `setIsCartOpen`, `currency` |
| **Trigger Points** | Size buttons (line 43: `onClick={() => setSelectedSize(size)}`), Currency buttons (lines 34-35), Add to Bag button (line 48: `onClick={handleAddToBag}`) |
| **Consumers** | `ProductControls.tsx` (UI updates), `cartStore.ts` (item added, cart opens) |
| **Conflicts** | ⚠️ `added` state is local animation flag (`setTimeout` 1200ms reset) — if user navigates away before timeout, state is lost. ⚠️ `currency` state exists both in Zustand store AND locally in `ProductControls` (reads from store but also has `setCurrency` buttons duplicating `CurrencyToggle` functionality). |
| **Failure Modes** | User clicks "Add to Bag" → `added` shows "Added ✓" for 1.2s → cart drawer opens. If user closes cart immediately and clicks "Add to Bag" again within 1.2s, button still shows "Added ✓" instead of processing new add. |

---

### System 10: Newsletter Form

| Property | Details |
|----------|---------|
| **System Name** | Email Newsletter Subscription |
| **Source of Truth** | Local `useState` for `email`, `status`, `errorMessage` |
| **Trigger Points** | Form `onSubmit` (line 30), input `onChange` |
| **Consumers** | `NewsletterSection.tsx` (form UI, status display) |
| **Conflicts** | None — self-contained form. |
| **Failure Modes** | Form submission has no actual backend — status transitions are simulated. `errorMessage` state exists but is never populated with real error messages. |

---

### System 11: Checkout Form

| Property | Details |
|----------|---------|
| **System Name** | Shipping Details Form |
| **Source of Truth** | Local `useState` for `form`, `errors`, `status`, `errorMessage` + localStorage persistence via `STORAGE_KEY` |
| **Trigger Points** | Form `onSubmit` (line 77), input `onChange`, "Try again" button (line 100) |
| **Consumers** | `CheckoutForm.tsx` (form UI, validation, success/error states) |
| **Conflicts** | None — self-contained. ⚠️ Form data persists in localStorage but is not synced with cart store. |
| **Failure Modes** | If cart is cleared after form submission, form data persists — user sees "Details Received" but cart is empty. |

---

## Z-Index Map (Complete)

| z-index | Element | File | Type |
|---------|---------|------|------|
| `-z-10` | Hero image decoration background | HeroSection.tsx line 31 | Absolute |
| `-z-10` | 404 page background pattern | not-found.tsx line 7 | Fixed |
| `z-10` | Hero text content | HeroSection.tsx line 9 | Relative |
| `z-10` | Product badges (badges, pet-safe) | ProductCard.tsx lines 16-17 | Absolute |
| `z-10` | Quick view overlay | ProductCard.tsx line 19 | Absolute |
| `z-[40]` | Quick Shop FAB (CSS class) | globals.css line 169 | Fixed |
| `z-50` | Navbar header | Navbar.tsx line 29 | Fixed |
| `z-[55]` | Cart Drawer backdrop | CartDrawer.tsx line 34 | Fixed |
| `z-[60]` | Cart Drawer panel | CartDrawer.tsx line 35 | Fixed |
| `z-[60]` | WhatsApp FAB | WhatsAppFAB.tsx line 5 | Fixed |
| `z-[99]` | Mobile Menu backdrop | MobileMenu.tsx line 19 | Fixed |
| `z-[100]` | Mobile Menu panel | MobileMenu.tsx line 24 | Fixed |

### Z-Index Conflicts

| Conflict | Elements | z-values | Result |
|----------|---------|----------|--------|
| **WhatsApp FAB vs Cart Drawer** | Both at `z-[60]` | 60 vs 60 | FAB renders after CartDrawer in DOM → FAB on top of drawer. Visually wrong — FAB should be below drawer. |
| **Mobile Menu vs Cart Drawer** | Menu `z-[100]` vs Cart `z-[60]` | 100 vs 60 | If both open, Mobile Menu is on top. Correct behavior (menu should overlay cart). But no coordination prevents both from opening. |
| **Mobile Menu backdrop vs Cart Drawer** | Menu backdrop `z-[99]` vs Cart panel `z-[60]` | 99 vs 60 | Menu backdrop is ABOVE the entire cart drawer. If both open, cart is trapped between menu panel and menu backdrop. |

---

## SURGICAL PROBES

---

### Probe 1: Mobile Menu Structure

**Findings:**

| Property | Value |
|----------|-------|
| Container | `<aside className="fixed inset-y-0 right-0 z-[100] w-full max-w-sm ...">` |
| Inner layout | `<div className="flex flex-col h-screen p-10 justify-between">` |
| Height | `h-screen` (100vh) |
| Overflow | **NONE** — no `overflow-y` rule |
| Padding | `p-10` (40px on all sides) |
| Content | Brand name (3xl) + tagline (sm) + close button + 6 nav links (2xl each) + Currency toggle + Theme toggle + CTA button |

**Why content exceeds viewport height:**
- `h-screen` = 100vh = exact viewport height
- `p-10` adds 40px top + 40px bottom = 80px of padding inside the 100vh container
- Available content space = 100vh - 80px
- On a 667px iPhone (common viewport): 667 - 80 = **587px available**
- Content estimate: Brand (~40px) + tagline (~24px) + close button area (~48px) + 6 nav links at ~48px each (~288px) + currency toggle (~56px) + theme toggle (~56px) + CTA (~56px) = **~628px**
- **628px > 587px** → content overflows by ~41px

**Whether the container supports scrolling:**
- **NO.** The `<aside>` has no `overflow-y` rule. The inner `<div>` uses `h-screen` with `justify-between` but no scroll container.
- Browser default: `overflow: visible` → content clips at the bottom of the 100vh container.

**Is `h-screen` causing layout clipping:**
- **YES.** `h-screen` forces the container to exactly 100vh. Combined with `p-10`, content that exceeds is clipped (not scrollable, not hidden — just cut off at the bottom).
- The bottom section (Currency toggle, Theme toggle, CTA button) may be **unreachable** on short viewports.

**Determination:**
- Items NOT fully visible: Currency toggle, Theme toggle, "Shop the Collection" CTA — these are in the bottom `<div>` pushed below the fold by `justify-between` + content overflow.
- Internal scrolling NOT possible: No `overflow-y` rule exists on any container within the menu.

---

### Probe 2: Mobile Menu Scroll Ownership

**Current behavior when mobile menu is open and user scrolls:**

```
User scrolls inside MobileMenu
  → Event target: <aside> or its children
  → Browser checks: does <aside> have overflow-y? NO
  → Browser checks: is there a scrollable ancestor? NO (it's fixed)
  → Event bubbles to <body>
  → <body> has overflow: auto (default — MobileMenu does NOT set overflow: hidden)
  → <body> scrolls
  → Result: BACKGROUND PAGE SCROLLS BEHIND OPEN MENU
```

**Which element owns scroll:** Document `<body>` (default).

**Where scroll events propagate:** `<aside>` → `<body>` → `<html>` → page scrolls.

**Why background scroll is still active:** MobileMenu has **zero** body overflow management. Unlike CartDrawer which sets `document.body.style.overflow = 'hidden'`, MobileMenu does nothing to the body.

---

### Probe 3: Overlay Stacking (z-index War)

**All fixed/absolute overlays mapped:**

| Layer | Element | z-index | Position |
|-------|---------|---------|----------|
| 1 | Navbar | `z-50` | Fixed top |
| 2 | Cart Backdrop | `z-[55]` | Fixed full-screen |
| 3 | Cart Drawer | `z-[60]` | Fixed right panel |
| 4 | WhatsApp FAB | `z-[60]` | Fixed bottom-right |
| 5 | Mobile Menu Backdrop | `z-[99]` | Fixed full-screen |
| 6 | Mobile Menu Panel | `z-[100]` | Fixed right panel |

**Stacking conflicts:**

1. **WhatsApp FAB (`z-[60]`) at same level as Cart Drawer (`z-[60]`):**
   - DOM order determines winner. FAB renders after CartDrawer in `layout.tsx` → FAB is on top.
   - **Result:** When cart drawer opens, WhatsApp button is visible on top of the dimmed backdrop area. Looks broken — should be hidden or below drawer.

2. **Mobile Menu Backdrop (`z-[99]`) above Cart Drawer (`z-[60]`):**
   - If user opens mobile menu while cart drawer is open (possible — no mutual exclusion), the menu backdrop dims everything including the cart drawer.
   - **Result:** Cart drawer is trapped visually between menu backdrop (z-99) and menu panel (z-100). Cart is inaccessible but still rendered.

3. **No mutual exclusion between overlays:**
   - Nothing prevents CartDrawer and MobileMenu from both being open simultaneously.
   - CartDrawer sets `body overflow: hidden`. MobileMenu doesn't. If both open, cart's overflow lock protects the document, but menu's lack of lock means menu content can still trigger scroll events.

---

### Probe 4: Theme Toggle Trace

**Where ThemeToggle renders:**

| Breakpoint | Location | Visible? |
|-----------|----------|----------|
| Desktop (≥1024px) | Navbar → `hidden sm:block` → **visible** | ✅ Yes |
| Tablet (640px–1023px) | Navbar → `hidden sm:block` → **visible** | ✅ Yes |
| Mobile (<640px) — Navbar | Navbar → `hidden sm:block` → **HIDDEN** | ❌ No |
| Mobile (<640px) — MobileMenu | Inside MobileMenu panel → **visible when menu open** | ✅ Yes (but requires opening menu first) |

**Is it hidden, clipped, or moved on mobile:**
- **HIDDEN** from navbar on mobile (`hidden sm:block`).
- **Accessible** only inside MobileMenu panel.
- **NOT clipped** — it's conditionally rendered, not positioned off-screen.

**Is it inside a non-scrollable container:**
- Inside MobileMenu, which has `h-screen` + no overflow → if ThemeToggle is in the clipped bottom section (Probe 1), it may be **unreachable** on short viewports.

**Placement issue:**
- On mobile, user needs 2 taps to access theme toggle: (1) hamburger, (2) toggle button.
- For a theme toggle, this is acceptable but not ideal — theme is a preference, not a navigation action.

---

### Probe 5: Navigation Link Integrity

**All `<Link>` elements audited:**

| Link | Source | Target Route | Exists? | Status |
|------|--------|-------------|---------|--------|
| Home | Navbar, MobileMenu, Footer, Breadcrumbs, Checkout | `/` | ✅ Yes | OK |
| Shop/Collections | Navbar, MobileMenu, Footer, Hero, BentoGrid, 404 | `/collections` | ✅ Yes | OK |
| Clothing | Footer | `/collections/clothing` | ⚠️ Unknown | Route may not exist yet |
| Plushies | Footer | `/collections/plushies` | ⚠️ Unknown | Route may not exist yet |
| Your Pets | Footer | `/collections/pets` | ⚠️ Unknown | Route may not exist yet |
| New Arrivals | Footer | `/collections?sort=newest` | ✅ Yes (query param) | OK |
| Custom Orders | Navbar, MobileMenu, Hero | `/custom-orders` | ✅ Yes | OK |
| Pets | Navbar | `/pets` | ✅ Yes | OK |
| About | Navbar, MobileMenu | `/about` | ✅ Yes | OK |
| Contact | Navbar | `/contact` | ✅ Yes | OK |
| Community | — | `/community` | ⚠️ No nav link | Page exists but not in navbar |
| Checkout | CartDrawer button | `/checkout` | ✅ Yes | OK |
| Privacy Policy | Footer | `/privacy` | ✅ Yes | OK |
| Terms of Service | Footer | `/terms` | ✅ Yes | OK |
| Shipping | Footer | `/shipping` | ✅ Yes | OK |
| Returns | Footer | `/returns` | ✅ Yes | OK |
| Product: Umuntu Cardigan | BentoGrid | `/products/umuntu-cardigan` | ⚠️ Hardcoded | Slug may not match product data |
| Product: Protea Plushie | BentoGrid | `/products/pet-fynbos-plushie` | ⚠️ Hardcoded | Slug may not match product data |
| Quick View (ProductCard) | ProductCard | `/products/${slug}` | ✅ Dynamic | OK |
| Browse Collections (404) | not-found.tsx | `/collections` | ✅ Yes | OK |
| Return Home (404) | not-found.tsx | `/` | ✅ Yes | OK |

**Links without routes (potential 404s):**
- `/collections/clothing` — category route exists as `[category]/page.tsx` but content may be "Coming soon"
- `/collections/plushies` — same
- `/collections/pets` — same
- `/products/umuntu-cardigan` — hardcoded slug, may not exist in product catalog
- `/products/pet-fynbos-plushie` — hardcoded slug, may not exist

**Dead UI elements:**
- Social links (Instagram, TikTok, Facebook) → `href="#"` — all placeholder URLs
- Community page exists at `/community` but is NOT linked from any navigation

---

### Probe 6: Button Event Mapping

**Every clickable element:**

| Button | Location | onClick Handler | State Mutation | UI Change | Status |
|--------|----------|----------------|---------------|-----------|--------|
| Hamburger | Navbar | `setIsMobileMenuOpen(!isMobileMenuOpen)` | `isMobileMenuOpen` toggle | Menu slides in/out, icon swaps ☰↔✕ | ✅ OK |
| Close menu | MobileMenu | `onClose` (→ `setIsMobileMenuOpen(false)`) | `isMobileMenuOpen` → false | Menu slides out, backdrop removed | ✅ OK |
| Menu backdrop | MobileMenu | `onClose` | `isMobileMenuOpen` → false | Menu closes on tap | ✅ OK |
| Nav links (menu) | MobileMenu | `onClose` + navigation | `isMobileMenuOpen` → false | Menu closes, page navigates | ✅ OK |
| CTA "Shop the Collection" | MobileMenu | `onClose` + navigation | `isMobileMenuOpen` → false | Menu closes, navigates to /collections | ✅ OK |
| Cart bag | Navbar | `toggleCart` (Zustand) | `isCartOpen` toggle | Cart drawer slides in/out | ✅ OK |
| Close cart | CartDrawer | `setIsCartOpen(false)` | `isCartOpen` → false | Cart closes, body overflow restored | ✅ OK |
| Cart backdrop | CartDrawer | `setIsCartOpen(false)` | `isCartOpen` → false | Cart closes on tap | ✅ OK |
| Remove item | CartDrawer | `removeItem(id, size)` | Cart `items` array filtered | Item removed from list, total recalculated | ✅ OK |
| Quantity − | CartDrawer | `updateQuantity(id, size, qty - 1)` | Cart `items` updated | Quantity decremented (removes if 0) | ✅ OK |
| Quantity + | CartDrawer | `updateQuantity(id, size, qty + 1)` | Cart `items` updated | Quantity incremented | ✅ OK |
| Checkout button | CartDrawer | `setIsCartOpen(false)` + `router.push('/checkout')` | `isCartOpen` → false, navigation | Cart closes, navigates to checkout | ✅ OK |
| Collections link (cart) | CartDrawer | `setIsCartOpen(false)` | `isCartOpen` → false | Cart closes, navigates | ✅ OK |
| Theme toggle | ThemeToggle | `toggle` (useTheme) | `theme` state + DOM classList + localStorage | Icon swaps sun↔moon, CSS `.dark` class toggled | ✅ OK |
| Currency toggle | CurrencyToggle | `toggleCurrency` (Zustand) | `currency` in store | Active currency pill updates | ✅ OK |
| Currency ZAR | ProductControls | `setCurrency('ZAR')` (Zustand) | `currency` in store | ZAR pill highlighted | ✅ OK |
| Currency USD | ProductControls | `setCurrency('USD')` (Zustand) | `currency` in store | USD pill highlighted | ✅ OK |
| Size buttons | ProductControls | `setSelectedSize(size)` | Local `selectedSize` state | Selected size border highlights | ✅ OK |
| Add to Bag | ProductControls | `handleAddToBag` | Adds to cart store, sets `added` flag, opens cart | Button shows "Added ✓", cart opens | ⚠️ Race condition (1.2s timer) |
| Newsletter submit | NewsletterSection | `handleSubmit` | Sets `status`, `errorMessage` | Form shows loading/success/error | ⚠️ No real backend |
| Checkout form submit | CheckoutForm | `handleSubmit` | Sets `status`, saves to localStorage | Shows success/error UI | ⚠️ No real payment |
| "Try again" button | CheckoutForm | `setStatus('idle')` | Resets status | Form reappears | ✅ OK |
| WhatsApp FAB | WhatsAppFAB.tsx | `<a href>` (native) | None | Opens WhatsApp in new tab | ✅ OK |
| Social icons | Footer | `<a href="#">` | None | **Nothing** — href="#" | ❌ DEAD LINKS |
| Back button | BackButton.tsx | `router.back()` | None | Browser navigates back | ✅ OK |

**Broken/Incomplete Flows:**
1. **Social icons (Footer):** `href="#"` — clicking does nothing useful. These are placeholder links.
2. **Newsletter form:** No actual API call — status transitions are simulated UI only.
3. **Add to Bag race condition:** 1.2s animation timer can mask duplicate clicks.

---

### Probe 7: Scroll Containment System

**Audit of scroll containment rules:**

| Rule | Implemented? | Location |
|------|-------------|----------|
| `overflow: hidden` on body (CartDrawer) | ✅ Yes | CartDrawer.tsx line 27 |
| `overflow: hidden` on body (MobileMenu) | ❌ No | Missing |
| `overflow-y: auto` on cart inner | ✅ Yes | CartDrawer.tsx line 45 |
| `overflow-y` on mobile menu | ❌ No | Missing |
| `overscroll-behavior: contain` | ❌ No | Nowhere in codebase |
| `touch-action: none` on backdrops | ❌ No | Nowhere in codebase |
| `touch-action` restrictions | ❌ No | Nowhere in codebase |

**Why scroll bleed occurs:**
1. MobileMenu has no body overflow lock → body remains scrollable → scroll events propagate to document.
2. No `overscroll-behavior` on any overlay → even if an overlay had internal scroll, events would chain to parent.
3. No `touch-action` on backdrops → touch gestures (scroll, pinch) pass through to underlying elements.

---

### Probe 8: Overlay Interaction Lock

**When CartDrawer is open:**

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Background non-interactive | Backdrop blocks clicks | ✅ Backdrop `onClick` closes cart | PASS |
| Background cannot scroll | Body overflow locked | ✅ `overflow: hidden` set | PASS |
| Only overlay content interactive | Yes | ⚠️ WhatsApp FAB (`z-[60]`) is still interactive on top of backdrop | PARTIAL FAIL |
| Escape key closes | Yes | ✅ Keydown listener added | PASS |
| Focus trapped in overlay | Yes | ❌ No focus trap implementation | FAIL |
| `aria-modal` set | Yes | ✅ `aria-modal="true"` on aside | PASS |
| `aria-hidden` on background | Yes | ❌ Not implemented on `<main>` or `<body>` children | FAIL |

**When MobileMenu is open:**

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Background non-interactive | Backdrop blocks clicks | ✅ Backdrop `onClick` closes menu | PASS |
| Background cannot scroll | Body overflow locked | ❌ No overflow lock | FAIL |
| Only overlay content interactive | Yes | ⚠️ WhatsApp FAB still interactive | PARTIAL FAIL |
| Escape key closes | Yes | ❌ No Escape key handler | FAIL |
| Focus trapped in overlay | Yes | ❌ No focus trap | FAIL |
| `aria-modal` set | Yes | ❌ Not set on MobileMenu aside | FAIL |
| `aria-hidden` on background | Yes | ❌ Not implemented | FAIL |

---

### Probe 9: Viewport Fit Test (Mobile)

| Element | Viewport Issue | Severity |
|---------|---------------|----------|
| **MobileMenu** | `h-screen` + `p-10` = content exceeds available space on viewports < 700px height. Bottom section (Currency, Theme, CTA) clipped and unreachable. | HIGH |
| **MobileMenu** | No `overflow-y` → content cannot scroll → clipped content is permanently hidden. | HIGH |
| **Hero text stack** | 6 text elements + 2 buttons + divider = 9 stacked items. On 667px viewport with 80px navbar = 587px, hero stack may require scroll but section has no explicit overflow rule (relies on body scroll). | MEDIUM |
| **Navbar** | `h-20` (80px) is large for mobile — reduces available viewport for content. | LOW |
| **ProductCard quick view** | Appears on hover — no touch equivalent on mobile. Quick view is inaccessible on touch devices. | MEDIUM |
| **WhatsApp FAB** | `bottom-8 right-24` — may overlap with mobile browser chrome (Safari bottom bar). | LOW |
| **BentoGrid** | `h-[500px]` fixed height card — on narrow viewports, this exceeds visible area and requires scroll. | LOW |

---

### Probe 10: Icon System Audit

**All icons in navigation and UI:**

| Icon | Location | Style | Clarity | Consistency |
|------|----------|-------|---------|-------------|
| ☰ Hamburger | Navbar | Stroke, 1.5px, 24px | ✅ Clear — universal menu icon | Matches other stroke icons |
| ✕ Close | Navbar, MobileMenu, CartDrawer | Stroke, 1.5px, 24px/32px | ✅ Clear — universal close icon | Consistent with hamburger |
| 🏠 Home (tablet) | Navbar | Stroke, 1.5px, 20px | ✅ Clear | Consistent |
| 🛍️ Shop (tablet) | Navbar | Stroke, 1.5px, 20px | ✅ Clear — shopping bag | Consistent |
| ✏️ Custom Orders (tablet) | Navbar | Stroke, 1.5px, 20px | ⚠️ Ambiguous — pencil could mean "edit" or "write" | Consistent style, unclear meaning |
| 🐾 Pets (tablet) | Navbar | Stroke, 1.5px, 20px | ✅ Clear — paw print | Consistent |
| ℹ️ About (tablet) | Navbar | Stroke, 1.5px, 20px | ⚠️ Info circle — generic, could mean anything | Consistent style, low specificity |
| ✉️ Contact (tablet) | Navbar | Stroke, 1.5px, 20px | ✅ Clear — envelope | Consistent |
| 🛒 Cart bag | Navbar | Stroke, 1.5px, 24px | ✅ Clear — shopping bag | Consistent |
| 🌙 Moon (theme) | ThemeToggle | Stroke, 1.5px, 20px | ✅ Clear — moon for dark mode | Consistent |
| ☀️ Sun (theme) | ThemeToggle | Stroke, 1.5px, 20px | ✅ Clear — sun for light mode | Consistent |
| ➡️ Arrow (hero image) | HeroSection | Stroke, 1.5px, 20px | ✅ Clear — external link/navigation | Consistent |
| −/+ Quantity | CartDrawer | Text characters (not SVG) | ✅ Clear | N/A (text, not icon) |
| 🗑️ Remove item | CartDrawer | Stroke, 1.5px, 20px | ✅ Clear — trash can | Consistent |
| 🔒 Secure checkout | CartDrawer | Stroke, 1.5px, 20px | ⚠️ Abstract — not an obvious "secure" icon | Consistent style |
| 📸 Instagram | Footer | Stroke, 1.5px, 20px | ✅ Clear — camera icon | Consistent |
| 🎵 TikTok | Footer | Stroke, 1.5px, 20px | ⚠️ Abstract — musical note path, not official TikTok logo | Consistent style but not recognizable |
| 📘 Facebook | Footer | Stroke, 1.5px, 20px | ✅ Clear — "f" path | Consistent |
| 💬 WhatsApp | WhatsAppFAB | **FILL** (not stroke) | ✅ Clear — official WhatsApp logo | ❌ **INCONSISTENT** — only filled icon in a stroke icon system |
| ⚠️ Alert (form error) | CheckoutForm | Fill, 14px | ✅ Clear — exclamation in circle | ❌ Inconsistent with stroke system |
| 🐾 Pet safe icon | ProductCard | Stroke, 1.5px, 20px | ⚠️ Unclear — circles + path, abstract paw representation | Consistent style |
| 🧵 Stitch detail | Product page | Stroke, 1.5px, 20px | ⚠️ Unclear — warning triangle with exclamation, suggests danger not stitch detail | ❌ Wrong icon semantically |

**Inconsistencies found:**
1. **WhatsApp FAB uses `fill`** while all other icons use `stroke` — visual mismatch.
2. **"Stitch Detail" icon is a warning triangle** — semantically wrong. Should be a needle/thread or yarn icon.
3. **TikTok icon is a musical note path** — not the recognizable TikTok logo. Users may not identify it.

**Size consistency:**
- Most icons are 20px (5×5) or 24px (6×6) — consistent within their contexts.
- Mobile menu nav icons at 20px, navbar icons at 24px — acceptable scale difference.

---

### Probe 11: Text Content Validation

**Location-based claims audited:**

| Text | Location | Issue | Required Change |
|------|----------|-------|----------------|
| **"Cape Town Crafted"** | `constants.ts` → `TRUST_BADGES` | Too narrow — brand ships worldwide, not Cape Town-specific | Change to **"South African Crafted"** |
| **"Join our monthly weaving circle in Cape Town"** | `BentoGrid.tsx` line 27 | Implies physical Cape Town location only | Change to **"in South Africa"** or **"across South Africa"** |
| **"Cape Town, SA"** | `community/page.tsx`, `AdminCommunityModeration.tsx` | Location tag on community photo — acceptable if photo was taken there | Keep if accurate, change if not |
| **"Complimentary shipping within South Africa"** | `ProductControls.tsx` line 51 | Accurate — matches `SHIPPING_COSTS.za` | ✅ Keep |
| **"Shipping Worldwide"** | `layout.tsx` metadata description | Accurate — international shipping available | ✅ Keep |
| **"Est. 2024"** | `HeroSection.tsx` line 27 | Accurate brand claim | ✅ Keep |

**Content changes needed:**
1. `constants.ts` line with `TRUST_BADGES`: `'Cape Town Crafted'` → `'South African Crafted'`
2. `BentoGrid.tsx` line 27: `'in Cape Town'` → `'across South Africa'`

---

### Probe 12: Component Boundary Audit

**Component control relationships:**

```
RootLayout (layout.tsx)
  ├── EnvironmentProvider (controls: body.env-pets class via pathname)
  ├── Navbar (controls: isMobileMenuOpen state, cart badge display)
  │     └── MobileMenu (controlled by: Navbar's isMobileMenuOpen prop)
  │           ├── CurrencyToggle (controls: currency store via setCurrency)
  │           └── ThemeToggle (controls: theme via useTheme hook)
  ├── <main> (page content — controlled by Next.js router)
  │     └── Page components (control their own local state)
  │           └── ProductControls (controls: local size/added state + cart store)
  ├── Footer (no state — static links)
  ├── WhatsAppFAB (no state — static external link)
  └── CartDrawer (controls: isCartOpen from store, body overflow, Escape key)
        └── CheckoutForm (controls: own form state + localStorage)
```

**Where boundaries are unclear:**

1. **Navbar ↔ MobileMenu:** Navbar owns `isMobileMenuOpen` state, MobileMenu receives it as prop. But MobileMenu also needs to control body overflow (missing) and Escape key (missing) — these responsibilities have no home. Should there be a `useMobileMenu` hook that owns ALL mobile menu side effects?

2. **CartDrawer ↔ Navbar:** Both read from `cartStore`. Navbar calls `toggleCart()`, CartDrawer calls `setIsCartOpen()`. They share control of the same state but from different locations. This works because Zustand is a single source, but the **intent** is unclear — should Navbar be allowed to close the cart, or only open it?

3. **ThemeToggle ↔ useTheme:** ThemeToggle doesn't own any state — it's a pure consumer of `useTheme()`. But `useTheme()` creates independent state per caller. If another component calls `useTheme()`, it gets its own state instance. The boundary between "hook owns state" and "component owns state" is blurry.

4. **ProductControls ↔ CartDrawer:** ProductControls adds items to cart AND opens cart drawer (`setIsCartOpen(true)`). This means a product page component controls cart drawer visibility — crossing component boundaries. The product page shouldn't know about the cart drawer UI.

5. **CurrencyToggle (×2):** Renders in both Navbar and ProductControls. Both call `setCurrency` on the same Zustand store. No conflict, but the currency toggle UI is duplicated with different visual designs (pill toggle in Navbar vs separate buttons in ProductControls).

**Where props/state flow becomes messy:**

```
Navbar
  ├── isMobileMenuOpen (state) → MobileMenu (prop)
  │     └── onClose (callback) → setIsMobileMenuOpen (state setter)
  │           └── Missing: body overflow, Escape key, focus trap
  │              (no place in this chain to add them)
  │
  └── toggleCart (Zustand action) → cartStore
        └── CartDrawer (subscribes to isCartOpen)
              └── Body overflow (useEffect in CartDrawer)
              └── Escape key (useEffect in CartDrawer)
              └── Focus trap (MISSING — nowhere to put it)

The asymmetry is the problem:
  - CartDrawer owns its side effects (overflow, Escape)
  - MobileMenu has NO home for side effects
  - Next overlay will face the same question: where do side effects go?
```

---

## FAILURE MODE SUMMARY

| Failure Mode | System | Severity | Root Cause |
|-------------|--------|----------|------------|
| Background scrolls behind mobile menu | MobileMenu scroll ownership | HIGH | No body overflow lock |
| Bottom content unreachable in mobile menu | MobileMenu viewport fit | HIGH | `h-screen` + `p-10` + no overflow-y |
| WhatsApp FAB on top of cart drawer | z-index stacking | MEDIUM | Both at `z-[60]`, DOM order decides |
| Social links go nowhere | Navigation link integrity | MEDIUM | `href="#"` placeholders |
| Mobile menu has no Escape key handler | Overlay interaction lock | MEDIUM | No keyboard accessibility |
| No focus trap in any overlay | Overlay interaction lock | MEDIUM | Accessibility gap |
| "Stitch Detail" uses warning icon | Icon semantics | LOW | Wrong icon choice |
| TikTok icon not recognizable | Icon clarity | LOW | Musical note ≠ TikTok logo |
| "Cape Town Crafted" too narrow | Text content | LOW | Should be "South African Crafted" |
| Add to Bag race condition (1.2s) | ProductControls | LOW | Timer-based animation masks duplicate clicks |
| Newsletter form has no backend | Form integrity | LOW | Simulated UI only |
| Product page controls cart drawer visibility | Component boundaries | LOW | Cross-boundary state mutation |

---

## SUCCESS CONDITION CHECKLIST

| Condition | Status | Notes |
|-----------|--------|-------|
| Every interaction has a clear owner | ⚠️ MOSTLY | MobileMenu side effects have NO owner |
| No duplicate or conflicting control systems | ⚠️ MOSTLY | Currency toggle has 2 visual implementations; theme state fragmented |
| No hidden or unreachable UI | ❌ FAIL | MobileMenu bottom section unreachable on short viewports |
| No scroll bleed or interaction leakage | ❌ FAIL | MobileMenu allows background scroll; WhatsApp FAB leaks through cart backdrop |

**Overall: FAILS success condition.** 2 of 4 criteria not met, 2 partially met.

---

*System Control & Navigation Audit Date: 6 April 2026*
*Files Analyzed: All components in src/, cartStore.ts, useTheme.ts, constants.ts, globals.css, tailwind.config.js, layout.tsx, all page components*
