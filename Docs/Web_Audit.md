# Currency State & Price Formatting Audit

## Executive Summary

The "sequential toggle" bug (clicking EUR forces ZAR→USD→EUR instead of jumping directly) is caused by **two competing UI patterns** for the same store action. The Zustand store's `setCurrency(code)` is a direct setter — but the `CurrencyToggle` component wraps it in a cycling `nextCurrency()` function, creating the sequential behavior. Meanwhile, `ProductControls.tsx` uses direct setters correctly.

**Root cause:** `CurrencyToggle.tsx` (used in Navbar + MobileMenu) computes `nextCurrency = CURRENCIES[(cycleIndex + 1) % CURRENCIES.length]` and calls `setCurrency(nextCurrency.code)`. This is a single-button cycler, not a direct selector.

---

## 1. The Store: `src/store/cartStore.ts`

### Store Architecture

Currency state lives in the **Zustand cart store** — there is no dedicated `currencyStore.ts`. The store uses `zustand/middleware` `persist` for localStorage synchronization.

```typescript
type CartState = {
  items: CartItem[]
  currency: Currency          // default: 'ZAR'
  isHydrated: boolean
  checkoutSession: CheckoutSession | null
  // ...actions
  setCurrency: (c: Currency) => void
}
```

### `setCurrency` Implementation (line 78)

```typescript
setCurrency: (c) => set({ currency: c }),
```

**Verdict:** This is a **direct setter**. It accepts any `Currency` value (`'ZAR' | 'USD' | 'EUR'`) and sets it immediately. There is **no `nextCurrency()` function in the store**. The cycling logic is entirely a UI-layer concern.

### Persistence Configuration (lines 120-127)

```typescript
partialize: (state) => ({ items: state.items, currency: state.currency }),
migrate: (persistedState, version) => {
  if (!persistedState) return { items: [], currency: 'ZAR' }
  if (version !== CART_SCHEMA_VERSION) {
    return { items: [], currency: 'ZAR' }
  }
  return persistedState
},
```

**Verdict:** Currency **is persisted** to localStorage under the key `mmwafrika-cart`. Schema version migrations (currently v3) reset currency to `'ZAR'` on version mismatch.

---

## 2. The UI Components: Two Competing Patterns

### Pattern A — The Cycler: `CurrencyToggle.tsx` (SEQUENTIAL — THE BUG)

**File:** `src/components/ui/CurrencyToggle.tsx`

```typescript
const CURRENCIES: { code: 'ZAR' | 'USD' | 'EUR'; label: string }[] = [
  { code: 'ZAR', label: 'ZAR' },
  { code: 'USD', label: 'USD' },
  { code: 'EUR', label: 'EUR' },
]

export default function CurrencyToggle() {
  const currency = useCartStore((s) => s.currency)
  const setCurrency = useCartStore((s) => s.setCurrency)

  const cycleIndex = CURRENCIES.findIndex((c) => c.code === currency)
  const nextCurrency = CURRENCIES[(cycleIndex + 1) % CURRENCIES.length]

  const toggleCurrency = () => { setCurrency(nextCurrency.code) }
  // ...
}
```

**This is the bug.** The entire component is a **single button** that cycles through currencies sequentially: ZAR → USD → EUR → ZAR → ...

When a user clicks "EUR" but the current state is ZAR, the component computes `nextCurrency` as USD (the next in the array), sets that, then on the next click it becomes EUR. The user must click **twice** to get from ZAR to EUR.

**Rendered output:** A pill-shaped toggle showing all three currency labels, with the active one highlighted. Clicking **anywhere** on the pill advances to the next currency — it does NOT let you pick a specific one.

### Pattern B — Direct Selectors: `ProductControls.tsx` (CORRECT)

**File:** `src/components/product/ProductControls.tsx`

```typescript
const currency = useCartStore((state) => state.currency)
const setCurrency = useCartStore((state) => state.setCurrency)
// ...
<button onClick={() => setCurrency('ZAR')}>ZAR</button>
<button onClick={() => setCurrency('USD')}>USD</button>
<button onClick={() => setCurrency('EUR')}>EUR</button>
```

**This is correct.** Each button calls `setCurrency` with a specific currency code directly. Clicking EUR always sets EUR immediately, regardless of current state.

### Where Each Pattern Is Used

| Component | File | Pattern | Behavior |
|-----------|------|---------|----------|
| **CurrencyToggle** | `src/components/ui/CurrencyToggle.tsx` | A — Cycler | Single button, cycles ZAR→USD→EUR→ZAR |
| **Navbar** | `src/components/layout/Navbar.tsx` (line 117) | Uses CurrencyToggle | Sequential cycling (bug) |
| **MobileMenu** | `src/components/layout/MobileMenu.tsx` (line 66) | Uses CurrencyToggle | Sequential cycling (bug) |
| **ProductControls** | `src/components/product/ProductControls.tsx` (lines 47-49) | B — Direct | Each button jumps directly to target |

### Mobile-First Analysis

**Both Navbar and MobileMenu use the same `CurrencyToggle` component.** There is no duplication — they import the identical component from `@/components/ui/CurrencyToggle`. The bug manifests in **both** desktop (Navbar) and mobile (MobileMenu) contexts equally.

---

## 3. Price Formatting Pipeline

### The `formatPrice` Function

**File:** `src/lib/utils/formatPrice.ts`

```typescript
export type Currency = 'ZAR' | 'USD' | 'EUR'

const CURRENCY_CONFIG: Record<Currency, { locale: string; minimumFractionDigits: number }> = {
  ZAR: { locale: 'en-ZA', minimumFractionDigits: 0 },
  USD: { locale: 'en-US', minimumFractionDigits: 2 },
  EUR: { locale: 'en-DE', minimumFractionDigits: 2 },
}

export function formatPrice(amount: number, currency: Currency = 'ZAR'): string {
  const { locale, minimumFractionDigits } = CURRENCY_CONFIG[currency]
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(amount)
}
```

**Verdict:** This is the **single source of truth** for price formatting. It delegates to `Intl.NumberFormat` with per-currency locale configuration. No `useCurrency` hook exists — this is a pure function.

**Output examples:**
- ZAR: `R 3 450` (en-ZA, 0 decimals)
- USD: `$186.00` (en-US, 2 decimals)
- EUR: `172,00 €` (en-DE, 2 decimals)

### Exchange Rates — Hardcoded Dead Code

**File:** `src/lib/constants.ts` (line 8)

```typescript
export const EXCHANGE_RATE_ZAR_TO_USD = 0.054
```

**File:** `src/lib/utils.ts` (lines 5-6)

```typescript
export function convertZarToUsd(zarAmount: number): number {
  return Number((zarAmount * EXCHANGE_RATE_ZAR_TO_USD).toFixed(2))
}
export function convertUsdToZar(usdAmount: number): number {
  return Number((usdAmount / EXCHANGE_RATE_ZAR_TO_USD).toFixed(2))
}
```

**Verdict:** These conversion functions are **dead code**. They are exported from `utils.ts` but **never imported or consumed anywhere** in the application.

**Why:** Products store **pre-computed prices** for all three currencies directly in the product data:

```typescript
// src/lib/api/products.ts
price: { ZAR: 3450, USD: 186, EUR: 172 }
```

USD/EUR prices are **manually authored** at data-entry time, not calculated from ZAR at runtime. The exchange rate constant is orphaned.

### Price Display Pipeline

```
Product Data (products.ts)
  price: { ZAR: 3450, USD: 186, EUR: 172 }
        │
        ▼
  Client Component reads active currency:
  currency = useCartStore(s => s.currency)
        │
        ▼
  Price selection with ZAR fallback:
  price?.[currency] ?? price.ZAR
        │
        ▼
  formatPrice(amount, currency)
  Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 })
        │
        ▼
  Display: "R 3 450"  (or "$186.00" / "172,00 €")
  Styled with CSS class: text-price (--text-price: 1.25rem)
```

**The universal pattern across all components:**
```typescript
formatPrice(price?.[currency] ?? price.ZAR, currency)
```

The `?? price.ZAR` fallback ensures that if a product's price object is missing the selected currency key, it defaults to ZAR.

### All Price-Displaying Components

| Component | File | How Price Is Read |
|-----------|------|-------------------|
| **ProductCard** | `src/components/product/ProductCard.tsx:64` | `formatPrice(price?.[currency] ?? price.ZAR, currency)` |
| **ProductControls** | `src/components/product/ProductControls.tsx:45` | `formatPrice(product.price?.[currency] ?? product.price.ZAR, currency)` |
| **Product Detail (Server)** | `src/app/products/[slug]/page.tsx:57` | `formatPrice(product.price.ZAR, 'ZAR')` — **hardcoded to ZAR** |
| **CartDrawer** | `src/components/cart/CartDrawer.tsx:94,124-126` | `formatPrice(item.price?.[currency] ?? item.price.ZAR, currency)` for items; `formatPrice(subtotal, currency)` for summary |
| **OrderSummary** | `src/components/checkout/OrderSummary.tsx:28,35-37` | `formatPrice(item.totalPrice, session.currency)` |
| **Order Confirmation** | `src/app/order-confirmation/page.tsx:60,68` | `formatPrice(item.totalPrice, order.currency)` |

---

## 4. Persistence & Hydration

### localStorage Persistence

Currency state **is persisted** via Zustand's `persist` middleware:

```typescript
{
  name: 'mmwafrika-cart',
  partialize: (state) => ({ items: state.items, currency: state.currency }),
}
```

Key: `mmwafrika-cart` (shared with cart items). Value stored includes `{ items: [...], currency: "EUR" }`.

### Hydration Flow

```
1. Page loads → Zustand store initializes with default: currency: 'ZAR'
2. persist middleware reads localStorage 'mmwafrika-cart'
3. If found, restores stored currency (e.g., 'EUR')
4. onRehydrateStorage callback fires → state.isHydrated = true
```

### Flash of Default Currency (FODC) — YES, IT EXISTS

**There is no FODC prevention.** Unlike the theme system (which has `theme-init.js` — a synchronous IIFE in `<head>` that runs before paint), the currency system has **no equivalent**.

**What happens on load:**

1. Server renders with `currency: 'ZAR'` (the default)
2. React hydrates on client with `currency: 'ZAR'`
3. Zustand `persist` middleware reads localStorage asynchronously
4. Store updates to the saved currency (e.g., `'EUR'`)
5. React re-renders all price-displaying components

**Visible effect:** If a user previously selected EUR, on page load they will briefly see prices in ZAR before the store rehydrates and switches to EUR. This is the **Flash of Default Currency**.

**Why it's less severe than FOUC:**
- The rehydration happens very quickly (single tick after hydration)
- Prices update via React state, not CSS, so the transition is fast
- No `transition-colors` on the price text itself (only on the currency toggle button background)

**But it still exists** and could be noticeable on slow connections or with large carts.

### No Currency Init Script

The `layout.tsx` loads `theme-init.js` synchronously in `<head>`:

```html
<script src="/theme-init.js" />
```

There is **no equivalent `currency-init.js`**. The theme system blocks paint to prevent FOUC. The currency system has no such mechanism.

---

## 5. Server-Side Consistency

### The Product Detail Page Problem

**File:** `src/app/products/[slug]/page.tsx` (line 57)

```typescript
<span className="text-price text-accent">
  {formatPrice(product.price.ZAR, 'ZAR')}
</span>
<span className="text-body-md text-secondary">Select currency on product page</span>
```

**This is a Server Component.** It cannot read from the Zustand store (client-only). The price is **hardcoded to ZAR** regardless of the user's saved preference.

**The mitigation text below says:** "Select currency on product page" — acknowledging this limitation to the user.

Below this, the `ProductControls` client component renders with its own currency toggle and displays the correct currency. So users see **two prices** — the server-rendered ZAR price and the client-rendered selected-currency price.

### Why Server Can't Know User's Currency

The standard approaches and their status:

| Approach | Status |
|----------|--------|
| Cookie-based (read `currency` from request cookie) | **NOT implemented** — Zustand persist doesn't use cookies |
| URL parameter (`?currency=EUR`) | **NOT implemented** |
| Server-side store hydration from cookie | **NOT implemented** |
| Accept-Language header detection | **NOT implemented** |

### Current Behavior Summary

| Page | Currency Behavior |
|------|-------------------|
| **Home page** | All prices from client components — respond to stored currency after hydration |
| **Collections page** | ProductCard components — respond to stored currency after hydration |
| **Product detail page** | Server-rendered price **always ZAR**; client `ProductControls` below responds to stored currency |
| **Cart drawer** | Responds to stored currency after hydration |
| **Checkout** | Uses `session.currency` locked at `beginCheckout()` time |
| **Order confirmation** | Uses `order.currency` from stored order |

---

## 6. Inconsistencies & Dead Code

### Inconsistency: `CURRENCIES` Constant Mismatch

**`src/lib/constants.ts`** (line 7):
```typescript
export const CURRENCIES = { ZAR: { symbol: 'R', code: 'ZAR' }, USD: { symbol: '$', code: 'USD' } }
```
Only defines ZAR and USD — **missing EUR**.

**`src/components/ui/CurrencyToggle.tsx`** (lines 5-9):
```typescript
const CURRENCIES: { code: 'ZAR' | 'USD' | 'EUR'; label: string }[] = [
  { code: 'ZAR', label: 'ZAR' },
  { code: 'USD', label: 'USD' },
  { code: 'EUR', label: 'EUR' },
]
```
Defines its own local array with all three currencies. The `constants.ts` version is unused.

### Dead Code Inventory

| Code | File | Status |
|------|------|--------|
| `convertZarToUsd()` | `src/lib/utils.ts:5` | Exported, never imported elsewhere |
| `convertUsdToZar()` | `src/lib/utils.ts:6` | Exported, never imported elsewhere |
| `EXCHANGE_RATE_ZAR_TO_USD` | `src/lib/constants.ts:8` | Only consumed by dead conversion functions |
| `CURRENCIES` constant | `src/lib/constants.ts:7` | Not imported by any component |

---

## 7. Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│  Zustand Cart Store (cartStore.ts)                  │
│  ┌───────────────────────────────────────────────┐  │
│  │  currency: 'ZAR' (default)                    │  │
│  │  setCurrency: (c) => set({ currency: c })     │  │
│  │  persist → localStorage 'mmwafrika-cart'      │  │
│  └───────────────────────────────────────────────┘  │
└──────────────┬──────────────────────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐  ┌─────────────────────┐
│ CurrencyToggle│  │ ProductControls     │
│ (Cycler BUG) │  │ (Direct setter OK)  │
│              │  │                     │
│ Single button│  │ 3 buttons:          │
│ cycles       │  │ setCurrency('ZAR')  │
│ ZAR→USD→EUR  │  │ setCurrency('USD')  │
│              │  │ setCurrency('EUR')  │
└──────┬───────┘  └──────────┬──────────┘
       │                     │
       ▼                     ▼
┌──────────────────────────────────────────────────────┐
│  formatPrice(amount, currency)                       │
│  → Intl.NumberFormat(locale, { style: 'currency' }) │
│  → ZAR: 'R 3 450'  USD: '$186.00'  EUR: '172,00 €'  │
└──────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────┐
│  Product Data: price: { ZAR: 3450, USD: 186, EUR: 172 } │
│  Selection: price?.[currency] ?? price.ZAR           │
└──────────────────────────────────────────────────────┘
```

---

## 8. Issues Found & Severity

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | **CurrencyToggle cycles sequentially instead of direct selection** | **HIGH** | `src/components/ui/CurrencyToggle.tsx` |
| 2 | **Product detail page server price hardcoded to ZAR** | **MEDIUM** | `src/app/products/[slug]/page.tsx:57` |
| 3 | **Flash of Default Currency (FODC) on page load** | **LOW-MEDIUM** | No init script, Zustand async rehydration |
| 4 | **Dead conversion utilities (`convertZarToUsd`, etc.)** | **LOW** | `src/lib/utils.ts` |
| 5 | **`CURRENCIES` constant in constants.ts missing EUR** | **LOW** | `src/lib/constants.ts:7` (unused anyway) |
| 6 | **No server-side currency awareness** | **MEDIUM** | Architecture gap — requires cookie/URL param |

---

## 9. Recommended Fixes

### Fix #1: CurrencyToggle — Replace Cycler with Direct Selection

Change `CurrencyToggle.tsx` from a single-button cycler to a pill group where each currency is individually clickable (matching the `ProductControls` pattern):

```typescript
// Replace the toggleCurrency/cycleIndex logic with:
<div className="flex items-center bg-surface-container p-1 rounded-full border-stitch transition-colors duration-300">
  {CURRENCIES.map((c) => (
    <button
      key={c.code}
      onClick={() => setCurrency(c.code)}
      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${
        currency === c.code ? 'bg-card shadow-sm text-primary' : 'text-secondary'
      }`}
      aria-label={`Show prices in ${c.label}`}
    >
      {c.label}
    </button>
  ))}
</div>
```

This makes the Navbar and MobileMenu currency selector behave identically to the product page selector — click EUR, get EUR immediately.

### Fix #2: Server-Side Price — Accept the Limitation or Add Cookie

**Option A (simplest):** Remove the hardcoded ZAR price from the server component. Show only the client-side `ProductControls` price. The user sees one price, in their saved currency.

**Option B (proper):** Add a cookie-based currency preference that the server can read, then pass it as a prop to `ProductControls` or format the server price accordingly. Requires a `currency-init.js` equivalent to set the cookie before the server render (not possible with SSR) or reading from the request cookie in the server component.

**Option C (pragmatic):** Keep the current setup but improve the helper text from "Select currency on product page" to something more contextual.

### Fix #3: FODC Prevention

Create a `currency-init.js` equivalent that runs synchronously in `<head>`:

```javascript
(function(){
  try {
    var cart = localStorage.getItem('mmwafrika-cart');
    if (cart) {
      var data = JSON.parse(cart);
      if (data.state && data.state.currency) {
        document.documentElement.setAttribute('data-currency', data.state.currency);
      }
    }
  } catch(e) {}
})();
```

Then use this attribute to show/hide price elements or defer rendering until hydration completes. However, since prices are rendered by React (not CSS variables), this is harder to solve than FOUC. The most practical approach is ensuring the `isHydrated` flag gates price display.

### Fix #4: Clean Up Dead Code

Remove:
- `convertZarToUsd()` and `convertUsdToZar()` from `src/lib/utils.ts`
- `EXCHANGE_RATE_ZAR_TO_USD` from `src/lib/constants.ts`
- `CURRENCIES` constant from `src/lib/constants.ts` (or update it to include EUR and use it as the single source of truth)
