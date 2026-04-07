# SYSTEM INTERROGATION REPORT — CartDrawer Z-Index & Visibility

**Date:** 2026-04-06
**Subject:** CartDrawer opens behind UI / fails to open correctly

---

## PHASE 1 — COMPONENT MAP (GROUND TRUTH)

### 1. Navbar
- **File:** `/src/components/layout/Navbar.tsx`
- **Type:** `'use client'` (Client Component)
- **State:** Zustand — reads `activeOverlay`, `openOverlay`, `closeOverlay` from `overlayStore`; reads `getTotalItems()` from `cartStore`
- **Renders:** `<header>` + `<MobileMenu />` as sibling — NO portal
- **z-index:** `z-navbar` = **50** (fixed position)

### 2. Cart Button (within Navbar)
- **Component:** `<button onClick={handleCartClick}>` inside `Navbar.tsx` (line ~100)
- **Type:** Inline button with SVG cart icon + badge
- **Action:** Calls `handleCartClick()` — toggles `openOverlay('cartDrawer')` / `closeOverlay()`
- **Parent z-index:** Inherits from `<header>` = **50**

### 3. CartDrawer
- **File:** `/src/components/cart/CartDrawer.tsx`
- **Type:** `'use client'` (Client Component)
- **State:** Zustand — reads `items`, `removeItem`, `updateQuantity`, `currency` from `cartStore`; reads `activeOverlay`, `closeOverlay` from `overlayStore`
- **Renders:** Uses `createPortal(...)` → portals directly to `document.body`
- **Visibility condition:** `if (!mounted || !isOpen) return null` where `isOpen = activeOverlay === 'cartDrawer'`
- **z-index:** Has class `z-overlay` = **40** (from `@layer base`), BUT also has class `cart-drawer` which in `@layer components` sets `z-index: 30`

### 4. MobileMenu
- **File:** `/src/components/layout/MobileMenu.tsx`
- **Type:** `'use client'` (Client Component)
- **State:** Zustand — reads `activeOverlay`, `closeOverlay` from `overlayStore`
- **Renders:** Uses `createPortal(...)` → portals directly to `document.body`
- **Visibility condition:** `if (!mounted || !isOpen) return null` where `isOpen = activeOverlay === 'mobileMenu'`
- **z-index:** Panel has `z-overlay` = **40**; backdrop has `z-overlay-backdrop` = **35**

### 5. Overlay System (overlayStore)
- **File:** `/src/store/overlayStore.ts`
- **Type:** `'use client'` (Zustand store)
- **State:** `activeOverlay: OverlayType` where `OverlayType = 'mobileMenu' | 'cartDrawer' | null`
- **Actions:** `openOverlay(type)`, `closeOverlay()`, `isAnyOpen()`
- **Side effects:** `lockBody()` / `unlockBody()` — sets `body.style.overflow = 'hidden'`, `body.style.position = 'fixed'`, `body.style.width = '100%'`
- **Renders:** Nothing (pure store)

### 6. Cart Store (cartStore)
- **File:** `/src/store/cartStore.ts`
- **Type:** `'use client'` (Zustand store with `persist` middleware)
- **State:** `items: CartItem[]`, `currency: 'ZAR' | 'USD'`
- **Actions:** `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `setCurrency`
- **Renders:** Nothing (pure store)
- **Persistence:** `persist` to `localStorage` under key `mmwafrika-cart`

### 7. layout.tsx
- **File:** `/src/app/layout.tsx`
- **Type:** Server Component (default)
- **Renders children:** YES — `{children}` inside `<main>`
- **Direct children in `<body>`:**
  1. `<EnvironmentProvider />`
  2. `<Navbar />`
  3. `<main>` with `{children}`
  4. `<Footer />`
  5. `<WhatsAppFAB />`
  6. `<CartDrawer />`
  7. `<OverlayDebugPanel />`

### 8. WhatsAppFAB
- **File:** `/src/components/ui/WhatsAppFAB.tsx`
- **Type:** `'use client'` (Client Component)
- **State:** Reads `isAnyOpen()` from `overlayStore`
- **Renders:** `<a>` tag with conditional classes
- **z-index:** `.whatsapp-fab` = **20** (fixed position)
- **Interaction blocker when overlay open:** `pointer-events-none opacity-50`

### 9. EnvironmentProvider
- **File:** `/src/components/layout/EnvironmentProvider.tsx`
- **Type:** `'use client'` (Client Component)
- **Renders:** `null` (side-effect only — toggles `env-pets` class on body)

### 10. OverlayDebugPanel
- **File:** `/src/components/debug/OverlayDebugPanel.tsx`
- **Type:** `'use client'` (Client Component)
- **Renders:** Debug info div (dev only)
- **z-index:** `z-[9999]` (fixed, bottom-left)
- **Interaction:** `pointer-events-none` — does NOT block clicks

---

## PHASE 2 — CLICK FLOW TRACE (CRITICAL)

### Step-by-step execution chain when user taps the cart icon:

```
1. USER CLICK
   → <button onClick={handleCartClick}> in Navbar.tsx

2. handleCartClick() triggered
   → console.log('[Navbar] Cart button clicked')
   → console.log('[Navbar] Current activeOverlay:', activeOverlay)

3. TOGGLE LOGIC
   → if (activeOverlay === 'cartDrawer') {
       → closeOverlay()
     } else {
       → openOverlay('cartDrawer')
     }

4. openOverlay('cartDrawer') called (assuming cart was closed)
   → console.log('[overlayStore] openOverlay called: cartDrawer')
   → lockBody() executed:
     → lockCount = 1
     → document.body.style.overflow = 'hidden'
     → document.body.style.position = 'fixed'
     → document.body.style.width = '100%'
   → console.log('[overlayStore] → body locked, setting activeOverlay to cartDrawer')
   → set({ activeOverlay: 'cartDrawer' })
   → console.log('[overlayStore] → state updated. activeOverlay is now: cartDrawer')

5. Zustand state change propagates → triggers re-renders in:
   a) Navbar.tsx → reads activeOverlay → re-renders (but no visual change for cartDrawer)
   b) CartDrawer.tsx → reads activeOverlay → re-renders
   c) MobileMenu.tsx → reads activeOverlay → re-renders (isOpen = false, stays hidden)
   d) WhatsAppFAB.tsx → reads isAnyOpen() → re-renders (adds pointer-events-none)
   e) OverlayDebugPanel.tsx → reads activeOverlay → re-renders

6. CartDrawer re-render
   → isOpen = activeOverlay === 'cartDrawer' → TRUE
   → mounted = true (from useEffect)
   → Passes condition: `if (!mounted || !isOpen) return null` → DOES NOT return null
   → Executes createPortal(<>...</>, document.body)

7. createPortal renders to document.body:
   a) <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-overlay-backdrop" onClick={handleClose} />
   b) <aside className="cart-drawer fixed right-0 top-0 h-full w-full max-w-[450px] bg-surface-container-lowest shadow-drawer z-overlay ...">
      → Cart content renders inside

8. DOM STATE AFTER:
   - body: overflow='hidden', position='fixed', width='100%'
   - overlayStore.activeOverlay = 'cartDrawer'
   - CartDrawer: portal'd to document.body, visible
   - Backdrop: portal'd to document.body, covers full viewport
   - WhatsAppFAB: disabled (pointer-events-none opacity-50)
   - Navbar: still visible at z-index 50
```

---

## PHASE 3 — VISIBILITY CONTROL LOGIC

### CartDrawer visibility conditions:

**Mount guard:**
```tsx
if (!mounted || !isOpen) return null
```
- `mounted`: Set to `true` after first render via `useEffect(() => { setMounted(true) }, [])`
- `isOpen`: Computed as `activeOverlay === 'cartDrawer'`

**Rendering strategy:**
- **(b) Conditionally rendered** — does NOT render when `!mounted || !isOpen`
- When condition passes, it uses `createPortal` to render to `document.body`

**Classes controlling visual state:**
```tsx
className="cart-drawer fixed right-0 top-0 h-full w-full max-w-[450px] bg-surface-container-lowest shadow-drawer z-overlay flex flex-col transition-transform duration-300 translate-x-0"
```

**Critical class analysis:**
| Class | Source | Property | Value |
|-------|--------|----------|-------|
| `cart-drawer` | `@layer components` in globals.css | `position` | `fixed` |
| `cart-drawer` | `@layer components` in globals.css | `z-index` | **30** |
| `fixed` | Tailwind | `position` | `fixed` |
| `right-0 top-0` | Tailwind | positioning | pinned to top-right |
| `z-overlay` | `@layer base` in globals.css | `z-index` | **40** |
| `translate-x-0` | Tailwind | `transform` | `translateX(0)` |
| `transition-transform duration-300` | Tailwind | transition | animates transform |

**⚠️ Z-INDEX CONFLICT DETECTED:**
- `.cart-drawer` class (from `@layer components`) sets `z-index: 30`
- `.z-overlay` class (from `@layer base`) sets `z-index: 40`
- **Both classes are applied to the same element simultaneously**
- CSS cascade order: `@layer components` loads BEFORE `@layer base`
- `@layer base` rules come AFTER `@layer components` in the CSS file
- **Winner: `z-index: 40` from `.z-overlay`** (later in cascade, same specificity)

**Other state affecting visibility:**
- `overlayStore.activeOverlay` — sole gatekeeper
- NO other state affects CartDrawer visibility directly
- `cartStore.items` only affects content, not visibility

---

## PHASE 4 — DOM RENDER LOCATION (CRITICAL)

### Mount location:
- **CartDrawer uses `createPortal(..., document.body)`**
- Portals DIRECTLY to `<body>` — bypasses the React tree in `layout.tsx`

### NOT mounted inside:
- ❌ Inside layout.tsx React tree (rendered there but portaled out)
- ❌ Inside Navbar
- ❌ Inside page.tsx

### Closest positioned parent with z-index:
- **There is none** — `document.body` is the parent
- `<body>` itself has NO `position: relative/absolute/fixed` and NO `z-index`
- `<html>` has NO `position` or `z-index`

### Does any parent have stacking-context-creating properties?
- **NO** — `document.body` has none
- **NO** — `<html>` has none
- The portal escapes all stacking contexts from the React tree

### Parents that DO have transform/opacity/filter/z-index:
| Element | Property | Value | Creates stacking context? |
|---------|----------|-------|--------------------------|
| `<header>` (Navbar) | `position: fixed` + `z-index: 50` | — | YES |
| `<main>` | `padding-top` only | — | NO |
| `<Footer>` | No positioning | — | NO |
| `.whatsapp-fab` | `position: fixed` + `z-index: 20` | — | YES |

---

## PHASE 5 — Z-INDEX & LAYER STACK

### Complete z-index hierarchy (all fixed/positioned elements):

| Element | z-index | Position | Parent | Source |
|---------|---------|----------|--------|--------|
| OverlayDebugPanel | **9999** | fixed | body | inline `z-[9999]` |
| Navbar (`<header>`) | **50** | fixed | body | `.z-navbar` |
| CartDrawer `<aside>` | **40** | fixed | body | `.z-overlay` (WINNER) |
| MobileMenu `<aside>` | **40** | fixed | body | `.z-overlay` |
| CartDrawer backdrop | **35** | fixed | body | `.z-overlay-backdrop` |
| MobileMenu backdrop | **35** | fixed | body | `.z-overlay-backdrop` |
| CartDrawer (CSS class) | **30** | fixed | body | `.cart-drawer` (LOSER) |
| WhatsAppFAB | **20** | fixed | body | `.whatsapp-fab` |
| QuickShopFAB | **15** | fixed | body | `.quick-shop-fab` |
| Sticky bottom bar | **10** | fixed | body | `.sticky-bottom-bar` |

### ⚠️ CRITICAL Z-INDEX CONFLICT:

**CartDrawer has TWO competing z-index declarations:**
1. `.cart-drawer` → `z-index: 30` (defined in `@layer components`)
2. `.z-overlay` → `z-index: 40` (defined in `@layer base`)

**The effective z-index is 40** because:
- Tailwind CSS `@layer` cascade: `base` > `components` > `utilities`
- The `@layer base` block with `.z-overlay` appears AFTER `@layer components` block with `.cart-drawer`
- Same specificity (both single-class selectors), so later declaration wins

### Which element is ABOVE the CartDrawer in the stacking order?

**Navbar (`z-index: 50`) is ABOVE CartDrawer (`z-index: 40`).**

Since BOTH are `position: fixed` and portaled/siblings to `document.body`, they exist in the same stacking context. The Navbar at z=50 will always render above the CartDrawer at z=40.

**The Navbar header element is specifically:**
```html
<header className="fixed top-0 w-full z-navbar ...">  <!-- z-navbar = 50 -->
```

This means the Navbar's background (`bg-bg/80 backdrop-blur-xl`) and border (`border-b border-dashed border-border`) will render ON TOP OF the CartDrawer.

---

## PHASE 6 — INTERACTION BLOCKERS

### Does CartDrawer have `pointer-events: none`?
- **NO** — CartDrawer itself has no `pointer-events` restriction
- Only WhatsAppFAB gets `pointer-events-none` when overlay is open

### Is there a backdrop covering it?
- **YES** — The backdrop renders WITHIN the same `createPortal` call:
  ```tsx
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-overlay-backdrop" onClick={handleClose} />
  ```
- Backdrop z-index = **35** (`.z-overlay-backdrop`)
- CartDrawer z-index = **40** (`.z-overlay`)
- **Backdrop is BELOW CartDrawer** — correct behavior, NOT a blocker

### Is opacity 0 but still mounted?
- **NO** — CartDrawer has no opacity-based visibility control
- It's either fully rendered or returns `null`

### Is transform pushing it off-screen?
- **NO** — `translate-x-0` keeps it on-screen
- No animation class for `translateX(100%)` on mount (unlike a typical slide-in drawer)
- **NOTE:** The Tailwind config has `slideInRight` keyframe (`translateX(100%)` → `translateX(0)`) but it is NOT applied to CartDrawer

### POTENTIAL BLOCKER — Navbar overlap:
- **Navbar at z=50 renders ABOVE CartDrawer at z=40**
- The Navbar occupies `top-0 w-full` with `h-20` (80px height)
- **The top 80px of the CartDrawer is BEHIND the Navbar**
- This means the CartDrawer's close button area (at `pt-12`) sits UNDER the Navbar

---

## PHASE 7 — OVERLAY SYSTEM CONFLICT

### overlayStore analysis:

**State model:**
- Single-value state: `activeOverlay: 'mobileMenu' | 'cartDrawer' | null`
- Only ONE overlay can be active at a time

**openOverlay() behavior:**
```tsx
openOverlay: (type) => {
  lockBody()
  set({ activeOverlay: type })
}
```
- Does NOT check if another overlay is already open
- Directly replaces `activeOverlay` value
- This means opening cart while mobile menu is open will CLOSE mobile menu (by replacing state)

**closeOverlay() behavior:**
```tsx
closeOverlay: () => {
  unlockBody()
  set({ activeOverlay: null })
}
```
- Unconditionally sets to `null`
- Does NOT check which overlay is currently active

### Potential conflicts:

**1. Navbar route change handler:**
```tsx
// Navbar.tsx line 22
useEffect(() => { closeOverlay() }, [pathname, closeOverlay])
```
- On ANY route change, closes the active overlay
- This is correct behavior, not a conflict

**2. No useEffect syncing between cartStore and overlayStore:**
- Confirmed: NO cross-store synchronization exists
- Confirmed: NO race conditions detected in state management

**3. MobileMenu close button vs CartDrawer:**
- MobileMenu's backdrop `onClick={closeOverlay}` sets `activeOverlay = null`
- CartDrawer's backdrop `onClick={handleClose}` → `closeOverlay()` → `activeOverlay = null`
- Both use the SAME `closeOverlay` from the store — no conflict

**4. Cart button toggle logic:**
```tsx
const handleCartClick = () => {
  if (activeOverlay === 'cartDrawer') {
    closeOverlay()
  } else {
    openOverlay('cartDrawer')
  }
}
```
- If `activeOverlay === 'mobileMenu'`, clicking cart button calls `openOverlay('cartDrawer')`
- This replaces state directly — mobile menu closes, cart opens
- **NO conflict here** — expected behavior

### current activeOverlay value when cart is clicked:
- If no overlay is open: `null` → changes to `'cartDrawer'`
- If mobile menu is open: `'mobileMenu'` → changes to `'cartDrawer'`
- If cart is already open: `'cartDrawer'` → changes to `null`

### No race conditions, duplicate state control, or useEffect conflicts detected in the overlay system itself.

---

## PHASE 8 — FINAL DIAGNOSIS (NO FIXES)

### 1. Why does the CartDrawer appear behind other UI?

**Root cause: z-index conflict between Navbar and CartDrawer.**

The Navbar `<header>` has `z-navbar` = **50**.
The CartDrawer `<aside>` has `z-overlay` = **40** (effective value after CSS cascade resolution).

Both are `position: fixed` children of `document.body`, existing in the same stacking context. The Navbar at z=50 will always render above the CartDrawer at z=40.

**The top 80px of the CartDrawer (the entire header section with the close button) renders BEHIND the Navbar.**

Additionally, the CartDrawer element has a **dual z-index declaration**:
- `.cart-drawer` class sets `z-index: 30`
- `.z-overlay` class sets `z-index: 40`
- The CSS cascade resolves to `z-index: 40`, but the presence of two conflicting declarations on the same element indicates a design inconsistency.

### 2. Why does it sometimes fail to open?

**Root cause: NOT a state or rendering failure — it IS opening, but the visible portion may be obscured.**

The CartDrawer correctly:
- Receives `activeOverlay === 'cartDrawer'`
- Passes the `!mounted || !isOpen` guard
- Renders via `createPortal` to `document.body`

**However**, the top portion (including the `pt-12` padding area where the close button lives) sits behind the Navbar. On shorter viewports or with certain content configurations, the visible lower portion of the drawer may appear as if the drawer "didn't open" because:
1. The backdrop darkens the screen (user sees this)
2. The drawer panel slides in but its top is hidden behind the Navbar
3. The user sees only the right-edge portion of the drawer, which may look like a partial render or failure

### 3. Which exact component or CSS rule is responsible?

**Primary responsible component:**
- **`/src/components/layout/Navbar.tsx`** — specifically the `<header>` element with `z-navbar` class (z-index: 50)

**Primary responsible CSS rule:**
- **`/src/styles/globals.css` line 185**: `.z-navbar { z-index: 50; }` — higher than CartDrawer's z=40
- **`/src/styles/globals.css` line 173**: `.cart-drawer { ... z-index: 30; ... }` — conflicting with the `z-overlay` utility
- **`/src/styles/globals.css` line 186**: `.z-overlay { z-index: 40; }` — the effective value, but still below Navbar

**The CartDrawer class list in the component:**
```tsx
className="cart-drawer fixed right-0 top-0 h-full ... z-overlay ..."
```
Contains BOTH `.cart-drawer` (z=30) AND `.z-overlay` (z=40), creating an internal z-index conflict resolved by CSS cascade to z=40, which is still below the Navbar at z=50.

**The stacking order is:**
```
z=9999  OverlayDebugPanel      ← always on top (dev only)
z=50    Navbar <header>        ← ABOVE CartDrawer ← PROBLEM
z=40    CartDrawer <aside>     ← CartDrawer effective z-index
z=40    MobileMenu <aside>     ← Same as CartDrawer
z=35    Backdrops              ← Below drawers
z=30    .cart-drawer CSS class ← Overridden by .z-overlay
z=20    WhatsAppFAB            ← Below everything
```
