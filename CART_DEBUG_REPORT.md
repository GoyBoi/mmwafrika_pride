# CART DEBUG REPORT — CartDrawer Shows Empty UI While cartItems = 1

**Date:** 2026-04-07
**Mode:** FORENSIC TRACE (no fixes applied)

---

## STEP 1 — TRACE STATE SOURCE

**File:** `src/store/cartStore.ts`

### State Structure:
```ts
{
  items: CartItem[]         // ← Array of CartItem objects
  currency: 'ZAR' | 'USD'   // ← Active currency
  addItem: (item) => void
  removeItem: (id, size) => void
  updateQuantity: (id, size, qty) => void
  clearCart: () => void
  setCurrency: (c) => void
  getTotalItems: () => number   // ← items.reduce(qty)
  getTotalPriceZAR: () => number
}
```

### CartItem Shape:
```ts
{
  productId: string
  slug: string
  name: string
  priceZAR: number
  priceUSD: number
  currency: 'ZAR' | 'USD'
  size?: string
  quantity: number
  image: string
}
```

### Persist Config:
```ts
{ name: 'mmwafrika-cart', partialize: (state) => ({ items: state.items, currency: state.currency }) }
```

**Verdict:** State structure is correct. `items` is the canonical array. `getTotalItems()` computes sum of quantities.

---

## STEP 2 — TRACE CartDrawer SUBSCRIPTION

**File:** `src/components/cart/CartDrawer.tsx`

### How it accesses cart state:
Direct Zustand selector via `useCartStore`.

### EXACT selectors used (lines 15-18):
```ts
const items = useCartStore((state) => state.items)          // ← CORRECT
const removeItem = useCartStore((state) => state.removeItem)
const updateQuantity = useCartStore((state) => state.updateQuantity)
const currency = useCartStore((state) => state.currency)
```

### Selector analysis:
- ✅ Selects `state.items` — the correct key
- ✅ NOT selecting `cartItems` (no such key exists)
- ✅ Using Zustand's selector pattern — only re-renders when `items` reference changes
- ✅ Not selecting the entire state object (no over-subscription)

**Verdict:** Subscription is correct. CartDrawer reads `state.items` directly.

---

## STEP 3 — TRACE RENDER LOGIC

**File:** `src/components/cart/CartDrawer.tsx`

### Items render location (line 72):
```tsx
{items.map((item) => (
  <div key={`${item.productId}-${item.size}`} className="flex gap-6 group">
    ...item details...
  </div>
))}
```

### Empty cart fallback (line 94):
```tsx
{items.length === 0 && (
  <div className="text-center py-20">
    ...empty state UI...
  </div>
)}
```

**Verdict:** `items.map(...)` is the render path. If `items.length === 0`, empty state shows. Both branches are mutually exclusive and correct.

---

## STEP 4 — CHECK CONDITIONAL BLOCKS

### ALL conditions found:

| Line | Condition | Effect |
|---|---|---|
| **44** | `if (!mounted) return null` | **CRITICAL — SSR guard. Returns null before hydration.** |
| 72 | `items.map(...)` | Renders each item. Safe on empty array. |
| 94 | `items.length === 0 && (...)` | Shows empty state. |
| 105 | `items.length > 0 && (...)` | Shows shipping calculator. |
| 117 | `items.length > 0 && (...)` | Shows checkout footer. |

### 🔴 LINE 44 — THE CRITICAL GUARD:
```tsx
if (!mounted) return null
```

This guard uses `mounted` state, which is set to `true` only AFTER first render via:
```tsx
useEffect(() => { setMounted(true) }, [])
```

**Execution flow:**
1. **First render (SSR):** `mounted = false` → **returns null** (portal never created)
2. **Client hydration:** `mounted = false` → **returns null** again
3. **useEffect fires:** `setMounted(true)` → triggers re-render
4. **Second render:** `mounted = true` → portal creates, drawer renders

**THIS IS CORRECT BEHAVIOR** — it prevents hydration mismatch on `createPortal(document.body)`.

**However** — here's the critical issue:

---

## STEP 5 — STYLE VISIBILITY CHECK

### `.cart-drawer` class (globals.css line 162):
```css
.cart-drawer {
  position: fixed;
  top: 0; bottom: 0; right: 0;
  width: 100%;
  max-width: 450px;
  background-color: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-drawer);
  display: flex;
  flex-direction: column;
}
```

### Inline className on `<aside>` (CartDrawer line 56):
```tsx
className={`cart-drawer fixed inset-y-0 right-0 z-overlay w-full max-w-[450px] bg-surface-container-lowest shadow-drawer flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
```

### Visibility when open (`isOpen = true`):
- `translate-x-0` → panel is at `translateX(0)` — **fully visible**
- `z-overlay` → z-index 60 — **above everything**
- `opacity` → no opacity modifier — **fully opaque**
- `display: flex` → **rendered**
- No `height: 0`, `overflow: hidden`, or `display: none`

### CSS properties analysis:
- `position: fixed` + `inset-y-0` + `right-0` → full-height panel on right
- `flex flex-col` → proper column layout
- `transition-transform duration-300 ease-in-out` → smooth slide

**Verdict:** No CSS visibility issues. Panel is fully visible when `isOpen = true`.

---

## STEP 6 — HYDRATION / CLIENT ISSUE

### Is CartDrawer a client component?
✅ YES — `'use client'` directive at top of file.

### Is cartStore client-only?
✅ YES — `'use client'` directive at top of cartStore.ts.

### Could this be a hydration mismatch?
**Partial yes.** The `if (!mounted) return null` guard prevents hydration mismatch on the portal itself. But there's a subtler issue:

**Zustand persist middleware** reads from `localStorage` synchronously during store creation. In a Next.js app:
1. SSR: store initializes with default `items: []`
2. Client: `persist` middleware hydrates from `localStorage`
3. **Hydration completes BEFORE persist fires**
4. Component renders with empty `items` on first pass
5. Persist hydration fires → `items` updates → re-render triggers

**This is the race condition.** The component may render its "open" state (from overlayStore) BEFORE the cartStore's persist middleware has finished hydrating items from localStorage.

---

## STEP 7 — FINAL VERDICT

### Root Cause (ONE line):
**Zustand persist middleware hydrates asynchronously AFTER initial render — the CartDrawer opens (via overlayStore) before cartStore's items are loaded from localStorage, so `items` is `[]` at the moment the drawer becomes visible.**

### Supporting Evidence:
1. **CartDrawer subscription** is correct — `useCartStore((state) => state.items)` (line 15)
2. **Render logic** is correct — `items.map(...)` (line 72)
3. **CSS visibility** is correct — `translate-x-0` when open, no hidden styles
4. **Mounted guard** is correct — `if (!mounted) return null` prevents SSR issues
5. **The `mounted` flag** only gates the portal creation, NOT the store hydration
6. **Persist middleware** reads localStorage asynchronously — items arrive AFTER first client render
7. **The 300ms timeout** in ProductControls (`setTimeout(() => openOverlay('cartDrawer'), 300)`) opens the drawer almost immediately — **before persist hydration completes**

### Exact failure location:
**File:** `src/components/cart/CartDrawer.tsx`
**Line:** 15 — `const items = useCartStore((state) => state.items)`
**Why:** At the moment of render (triggered by `openOverlay('cartDrawer')` from ProductControls line 34), the Zustand persist middleware has not yet finished hydrating `items` from `localStorage`. The value is `[]` (default), not the persisted array.

### Trigger chain:
```
ProductControls.handleAddToBag()
  → addItem({...})           // writes to in-memory state ✅
  → setTimeout(300ms)
    → openOverlay('cartDrawer')  // overlay opens ✅
    → CartDrawer renders with isOpen=true
    → useCartStore((s) => s.items) returns []  ❌
    → items.map() renders nothing
    → items.length === 0 shows empty state
    → (later) persist hydrates → items update → re-render → now shows items
```

**The bug is a TIMING issue, not a logic issue.** The empty cart flash happens because the drawer opens faster than persist can hydrate. In practice, persist is usually very fast (<10ms), but if the drawer opens within that window, the user sees empty content.

**If items show as `1` in a debug panel but the drawer is empty, it means persist DID hydrate eventually — the issue is the drawer was viewed during the hydration gap.**
