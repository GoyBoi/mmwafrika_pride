# RENDER FAILURE REPORT

**Date:** 2026-04-07
**Mode:** RENDER FORENSIC (no fixes, no assumptions)

---

## TRACE TARGET

**Symptom:** CartDrawer opens, debug panel shows `cartItems: 1`, but no items are visible.
**File:** `src/components/cart/CartDrawer.tsx`
**Focus:** `items.map((item) => ...)` at line 72

---

## STEP 1 — CONFIRM MAP EXECUTION

### The map call (line 72):
```tsx
{items.map((item) => (
  <div key={`${item.productId}-${item.size}`} className="flex gap-6 group">
    ...
  </div>
))}
```

### Items source (line 15):
```tsx
const items = useCartStore((state) => state.items)
```

### Selector analysis:
- **Selector:** `(state) => state.items` — selects the `items` array directly
- **Store default:** `items: []` (empty array)
- **Store type:** `CartItem[]` — always an array, never undefined/null
- **Subscription:** Zustand `useSyncExternalStore` — re-renders when `Object.is(items, prevItems)` changes

### The map executes when:
- `items.length > 0` → map runs, produces JSX elements
- `items.length === 0` → map runs, produces `[]` (empty array → no output)

### The empty state (line 94):
```tsx
{items.length === 0 && (
  <div className="text-center py-20">
    ...empty cart UI...
  </div>
)}
```

**CRITICAL:** The empty state and the map are MUTUALLY EXCLUSIVE.
- If `items.length === 0` → empty state renders, map produces nothing
- If `items.length > 0` → map renders items, empty state does NOT render

### Conclusion for Step 1:

If the cart opens showing the empty state UI ("Your bag is waiting"), then `items.length === 0` at render time. The map did NOT produce output because the array was empty.

If the cart opens showing neither items NOR empty state UI, then the aside panel itself is not visible (CSS issue — see Step 5).

---

## STEP 2 — VERIFY JSX OUTPUT

### Full JSX produced by map for each item:

```tsx
<div key={`${item.productId}-${item.size}`} className="flex gap-6 group">
  {/* IMAGE CONTAINER */}
  <div className="w-24 h-32 bg-surface-container rounded-xl overflow-hidden flex-shrink-0">
    <Image src={item.image} alt={item.name} fill className="object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700" />
  </div>

  {/* TEXT CONTENT */}
  <div className="flex flex-col justify-between py-1 flex-1">

    {/* ROW 1: Name + Remove button */}
    <div className="flex justify-between items-start">
      <h3 className="font-sans text-body-md leading-tight">{item.name}</h3>
      <button onClick={() => removeItem(item.productId, item.size)} ...>
        <svg>...</svg>
      </button>
    </div>

    {/* ROW 2: Size (conditional) */}
    {item.size && (<p className="text-label text-on-surface-variant mt-1">Size: {item.size}</p>)}

    {/* ROW 3: Quantity controls + Price */}
    <div className="flex justify-between items-end">
      <div className="flex items-center gap-4 bg-surface-container-low px-3 py-1 rounded-full">
        <button>−</button>
        <span>{item.quantity}</span>
        <button>+</button>
      </div>
      <span className="text-price">{currency === 'ZAR' ? formatPrice(item.priceZAR) : formatPriceUSD(item.priceUSD)}</span>
    </div>
  </div>
</div>
```

### Conditional checks inside map:
1. **No conditional return of `null`** inside the map callback — every iteration always returns a `<div>`.
2. **`item.size && (...)`** — the only conditional inside, and it's for the size text only. Does not affect the parent div's visibility.

### Conclusion for Step 2:
The map ALWAYS produces a visible `<div>` for each item. There are no early returns, no `null` returns, no conditional suppression of output.

---

## STEP 3 — INSPECT DOM OUTPUT (Static Analysis)

### DOM structure when cart is open and items exist:

```
<aside class="cart-drawer fixed inset-y-0 right-0 z-overlay ... translate-x-0" ...>
  <div class="px-8 pt-12 pb-6 ...">          ← Header: "Your Selection" + "The Cart"
  <div class="flex-1 overflow-y-auto ...">    ← Scroll container
    <div class="space-y-8">
      <div class="flex gap-6 group">          ← ITEM 1 (from map)
        <div class="w-24 h-32 ...">           ← Image container
        <div class="flex flex-col ...">       ← Text content
    <div class="pt-8 border-stitch ...">      ← Shipping section (items.length > 0)
  <div class="p-8 bg-surface-container ...">  ← Checkout footer (items.length > 0)
```

### DOM structure when cart is open but items is empty:

```
<aside class="cart-drawer fixed inset-y-0 right-0 z-overlay ... translate-x-0" ...>
  <div class="px-8 pt-12 pb-6 ...">          ← Header: "Your Selection" + "The Cart"
  <div class="flex-1 overflow-y-auto ...">    ← Scroll container
    <div class="space-y-8">
      <div class="text-center py-20">         ← EMPTY STATE
        <svg>...</svg>
        <p>Your bag is waiting</p>
        <p>Discover pieces crafted with intention.</p>
        <a>Browse the Collection →</a>
```

### Key difference:
- **items.length > 0:** `<div class="flex gap-6 group">` elements exist in DOM
- **items.length === 0:** `<div class="text-center py-20">` empty state exists in DOM

### How to determine the failure mode:

| What user sees | Root cause |
|---|---|
| Header + "Your bag is waiting" empty state | **items was empty at render time.** Map didn't execute because array had 0 elements. |
| Header only, no items, no empty state | **CSS visibility issue.** Panel visible but content hidden. |
| Nothing visible at all | **Panel is off-screen** (`translate-x-full` — `isOpen` is false). |

---

## STEP 4 — FORCE VISIBILITY TEST (Structural Analysis)

### Aside panel visibility chain:

**Position:** `position: fixed` (from both `.cart-drawer` class and `fixed` Tailwind)
**Vertical extent:** `inset-y-0` → `top: 0; bottom: 0` → full viewport height
**Horizontal position:** `right: 0` → pinned to right edge
**Width:** `width: 100%; max-width: 450px`
**Transform when open:** `translate-x-0` → `translateX(0)` → **fully on-screen**
**Transform when closed:** `translate-x-full` → `translateX(100%)` → **fully off-screen right**

### The `isOpen` derivation (line 26):
```tsx
const isOpen = activeOverlay === 'cartDrawer'
```

### When `isOpen === true`:
- Panel: `translate-x-0` → visible
- Backdrop: `opacity-100 pointer-events-auto` → visible and interactive

### When `isOpen === false`:
- Panel: `translate-x-full` → off-screen right
- Backdrop: `opacity-0 pointer-events-none` → invisible

### If the user CAN see the CartDrawer header but NOT the items:
→ `isOpen === true` (panel is on-screen)
→ items array is `[]` at render time (empty state shows)
→ **OR** items array has elements but they're not rendering (Step 5)

---

## STEP 5 — MINIMAL ITEM RENDER (CSS Audit)

### Item container CSS analysis:

```
Outer div:  flex gap-6 group
  → flex-direction: row (default)
  → 24px gap between children

Image div:  w-24 h-32 bg-surface-container rounded-xl overflow-hidden flex-shrink-0
  → width: 6rem (96px)
  → height: 8rem (128px)
  → background color from theme
  → flex-shrink: 0 (won't compress)

Text div:   flex flex-col justify-between py-1 flex-1
  → flex-direction: column
  → justify-content: space-between
  → flex: 1 1 0% (fills remaining space)
```

### Text visibility:
- Product name: `font-sans text-body-md` → `color: var(--color-primary)` → `#1A1A1A` (light mode) / `#F5F5F5` (dark mode)
- Background: `bg-surface-container-lowest` → `#FFFFFF` (light mode) / `#1E1E1E` (dark mode)
- Contrast ratio: **Excellent** in both modes. Text is clearly visible.

### Flex layout integrity:
- `flex-1` on text div ensures it expands to fill remaining space
- `justify-between` pushes name to top, price to bottom
- `flex-shrink-0` on image prevents it from collapsing

### Conclusion for Step 5:
**No CSS property hides the item content.** Colors have good contrast, flex layout is correct, no `display: none`, no `opacity: 0`, no `visibility: hidden`, no `height: 0`.

---

## STEP 6 — IMAGE CHECK

### Next.js Image with `fill` (line 75):
```tsx
<Image src={item.image} alt={item.name} fill className="object-cover ..." />
```

### Parent container requirement for `fill`:
The parent MUST have `position: relative`. The parent is:
```tsx
<div className="w-24 h-32 bg-surface-container rounded-xl overflow-hidden flex-shrink-0">
```

### 🔴 FINDING: Parent does NOT have `position: relative`.

**Impact:** The `<Image fill>` will position itself relative to the nearest positioned ancestor (likely the `<aside>` or the `<body>`), NOT the `96x128px` container. The image may overflow its intended container, but:

- **This does NOT hide the text content.** The text is in a separate `flex-1` sibling div.
- **This does NOT cause the item div to disappear.** The `w-24 h-32` container maintains its dimensions regardless of the image's actual positioning.
- **`overflow: hidden` on the container** clips whatever overflows, but the container itself maintains its size.

**Verdict:** The image may display incorrectly, but this does NOT explain why items.map() produces no visible output.

---

## STEP 7 — FINAL VERDICT

### Elimination:

| Hypothesis | Evidence | Status |
|---|---|---|
| **A) Map not executing** | Map executes on any array including `[]`. Produces `[]` (empty array → no JSX output). If `items.length === 0`, map produces nothing and empty state renders instead. | **LIKELY** — if user sees "Your bag is waiting", items was empty at render time |
| **B) JSX returns null** | No conditional returns null inside map callback. Every iteration always returns a `<div>`. | **DISPROVEN** |
| **C) DOM exists but hidden** | Item container CSS audit: no `display:none`, no `opacity:0`, no `height:0`, no `visibility:hidden`, good color contrast, correct flex layout. | **DISPROVEN** — if items.length > 0, items ARE visible |
| **D) Child components failing** | No `try/catch` or error boundaries around children. If `Image` threw, it would crash the entire component (error boundary or white screen). If `formatPrice` threw, same result. The component would be entirely broken, not just "empty items". | **DISPROVEN** |

### ROOT CAUSE:

### ✅ A) Map not executing — because items array is empty at render time

**The `items` array is `[]` (zero elements) when CartDrawer renders.** The map executes, but `[].map(...)` returns `[]` — no DOM nodes produced. The empty state ("Your bag is waiting") renders instead because `items.length === 0`.

**Why the debug panel shows `cartItems: 1`:** The debug panel reads `useCartStore((s) => s.items.length)` which is evaluated AFTER persist hydration completes. The panel shows the POST-hydration state. The CartDrawer rendered BEFORE hydration completed, capturing the pre-hydration `items: []`.

### Exact failure location:

**File:** `src/components/cart/CartDrawer.tsx`
**Line:** 15 — `const items = useCartStore((state) => state.items)`
**Line:** 72 — `{items.map((item) => ...)}` — produces no output because `items = []`
**Line:** 94 — `{items.length === 0 && (...)}` — renders empty state

### Failure sequence:

```
T+0    CartDrawer renders (triggered by openOverlay)
T+0    items = useCartStore((s) => s.items) → [] (pre-hydration default)
T+0    items.map(...) → [] (no output)
T+0    items.length === 0 → true → EMPTY STATE renders
T+5    Persist hydration fires → set({ items: [CartItem] })
T+5    CartDrawer re-renders → items = [CartItem] → items.map(...) → ITEM DIV
T+5    items.length === 0 → false → empty state removed
```

**The user perceives the T+0 → T+5 window (~5ms) as the cart being "empty while cartItems = 1".**

If the debug panel is visible and shows `cartItems: 1` while the cart shows empty, it means the debug panel captured the T+5 state and the cart captured the T+0 state. They're reading the same store at different moments.

### Alternative scenario (items truly not persisting):

If `partialize` was only persisting `items` and not rehydrating correctly, or if localStorage is cleared/blocked, items would be lost on page reload. The `addItem` call writes to in-memory state, but on the NEXT page load, `items` resets to `[]` until/unless persist hydrates. If persist has nothing to hydrate from (cleared storage), items stays `[]` forever.

**To distinguish between these two scenarios:**
- If the issue happens ONLY on first page load after a refresh → persist hydration race (5ms flash)
- If the issue happens AFTER clicking "Add to Bag" on an already-loaded page → items genuinely empty (store bug or data loss)
- If the issue happens after navigating to a different page and back → persist not persisting correctly
