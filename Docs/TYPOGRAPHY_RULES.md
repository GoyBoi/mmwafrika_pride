# Typography Rule Set — MmwAfrika Pride Couture

> **Design Principle:** Premium luxury, not playful. Script fonts are rare accents — never the workhorse.

---

## 1. Font Roles

| Token | Font | Role | Usage |
|---|---|---|---|
| `--font-bhineka` | Bhineka (script) | **Decorative / Signature** | Tiny handwritten accents only |
| `--font-vintage` | Vintage Brush (script) | **Elegant Accent / Tagline** | Section headers, brand name accents |
| `--font-sans` | Inter | **Body / Readability** | 90% of all text — paragraphs, buttons, inputs, nav |
| `--font-serif` | Noto Serif | **Editorial Headings** | Product names, formal titles |

---

## 2. Usage Ratios (per page)

| Font | Max Surface | Rationale |
|---|---|---|
| `font-bhineka` | **≤ 10%** | Signature only — if it's more than a short phrase, it's wrong |
| `font-vintage` | **≤ 30%** | Section accents — headers, taglines, brand lockup |
| `font-sans` / `font-serif` | **≥ 60%** | Everything else — body, UI, navigation, product info |

---

## 3. DO / DON'T

### ✅ DO

| Rule | Example |
|---|---|
| Bhineka for short decorative phrases (≤ 6 words) | `"crafted with care"` |
| Bhineka for emotional signatures | `"Your piece is being prepared with love"` |
| Vintage for section headers | `"The Cart"`, `"The Stitch"`, `"Your Order"` |
| Vintage for brand name accent | `"MmwAfrika" Pride Couture` |
| Vintage for taglines | `"Handmade with Love"` |
| Sans-serif for all body text | paragraphs, descriptions, form labels |
| Serif for product names | `"{product.name}"` |
| Serif for formal page titles | `"Complete Your Order"` |

### ❌ DON'T

| Rule | Why |
|---|---|
| Never use bhineka in paragraphs | Illegible at body size |
| Never use bhineka in buttons/inputs | Breaks affordance |
| Never use bhineka in navigation | Users need to scan quickly |
| Never use bhineka in product descriptions | Readability > decoration |
| Never use bhineka at display-xl / display-lg sizes | Overpowers the page |
| Never use vintage for body text | Script at small sizes is hard to read |
| Never use vintage in form labels, prices, badges | Functional text needs clarity |
| Never use vintage for random decoration | Only for headers, taglines, brand accent |

---

## 4. Applied Rules by Component

### Hero Section

| Element | Font | Tailwind Class |
|---|---|---|
| Brand overline (`MmwAfrika Pride Couture`) | `font-vintage` + `font-sans` for "MmwAfrika" | `text-h3 italic` |
| Main heading (`Unique Crochet Couture...`) | `font-sans` | `text-display-xl` |
| Tagline (`Handmade with Love`) | `font-vintage` | `text-h2 italic` |
| Supporting text (`Custom Orders...`) | `font-vintage` | `text-h3 font-light` |
| Signature (`crafted with care`) | `font-bhineka` | `text-body-sm` |

### Navbar

| Element | Font | Tailwind Class |
|---|---|---|
| Brand name (`MmwAfrika Pride Couture`) | `font-vintage` + `font-sans` for "MmwAfrika" | `text-h2 italic` |
| Nav links | `font-sans` | `text-label` |
| Cart badge count | `font-sans` | `text-label` |

### Product Cards

| Element | Font | Tailwind Class |
|---|---|---|
| Product name | `font-sans` (or `font-serif` for editorial) | `text-card` |
| Price | `font-sans` | `text-price` |
| Size labels | `font-sans` | `text-label` |
| "Add to Bag" button | `font-sans` | `text-label` |

### Product Detail Page (PDP)

| Element | Font | Tailwind Class |
|---|---|---|
| Product name | `font-sans` | `text-h1` |
| Decorative subtitle (`Crafted with intention`) | `font-bhineka` | `text-h2 italic` |
| Section headers (`The Stitch`, `Materials & Care`) | `font-vintage` | `text-h2` |
| Description body | `font-sans` | `text-body-md` |
| Price | `font-sans` | `text-price` |

### Cart / Checkout

| Element | Font | Tailwind Class |
|---|---|---|
| Drawer title (`The Cart`) | `font-vintage` | `text-h2` |
| Order total label | `font-vintage` | `text-h3` |
| Checkout page title | `font-vintage` | `text-h1 italic` |
| Section headers (`Shipping Details`, `Your Order`) | `font-vintage` | `text-h2 italic` |
| Success decorative text | `font-bhineka` | `text-h2` |
| All form fields, labels, prices | `font-sans` | `text-body-md` / `text-label` |

### Footer

| Element | Font | Tailwind Class |
|---|---|---|
| Section headings | `font-vintage` | `text-h3` |
| Links, descriptions, legal text | `font-sans` | `text-body-sm` |
| Copyright, policy text | `font-sans` | `text-body-sm` |

---

## 5. Quick Decision Tree

```
What am I styling?

├── It's a button, input, badge, price, nav link, form label
│   └── → font-sans (text-label)
│
├── It's a paragraph, description, body text
│   └── → font-sans (text-body-md)
│
├── It's a product name
│   └── → font-sans or font-serif (text-h1/card)
│
├── It's a section header (The Cart, The Stitch, etc.)
│   └── → font-vintage (text-h2)
│
├── It's a tagline or brand accent
│   └── → font-vintage (italic)
│
├── It's a short emotional phrase (≤ 6 words)
│   └── → font-bhineka (text-h2 or smaller)
│
└── It's anything else
    └── → font-sans (default)
```

---

## 6. Size Limits

| Font | Min Size | Max Size |
|---|---|---|
| `font-bhineka` | `text-body-sm` | `text-h2` (never larger) |
| `font-vintage` | `text-body-sm` | `text-h1` |
| `font-sans` | `text-label` (0.75rem) | `text-display-xl` |
| `font-serif` | `text-body-md` | `text-h1` |
