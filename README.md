

 //BLOOM AND GLOW PROJECT
# Elvis's section — Home / Product Listing + Product Detail

These files replace the placeholders on the `feature/admin-orderhistory-morgan`
branch structure (same paths apply on `feature/shop-elvis` once you branch off).

## Where each file goes

```
src/pages/Home.jsx            → replaces the placeholder Home page
src/pages/ProductDetail.jsx   → replaces the placeholder ProductDetail page
src/data/mockProducts.js      → adds a `description` field to each product
                                 (needed for the detail page copy)
```

## How to apply it

```bash
git checkout -b feature/shop-elvis   # or your existing branch
# copy the 3 files from this folder into the matching paths in your repo

# Bloom & Glow — Beauty Shop Frontend

React + Redux Toolkit + React Router, matching the Figma wireframes and ERD
submitted for Project 16.

## Getting started

```bash
 develop
npm install
npm run dev
```

 
Then visit:
- `/` — Home / product listing (search, category pills, add-to-cart)
- `/products/1` (or any product id) — Product detail page

## What's wired up

- **Home.jsx** reads `state.products` (from `productsSlice`, already seeded
  with `mockProducts`). Search and category filtering dispatch
  `setSearchTerm` / `setActiveCategory`, which the slice already supports.
  Clicking "Skincare / Haircare / Makeup" in the NavBar sets `?category=`
  in the URL, which Home syncs into the slice automatically.
- Clicking a product card navigates to `/products/:id` (matches the route
  already defined in `App.jsx`).
- **ProductDetail.jsx** reads the product straight from `state.products.items`
  by id, with a quantity stepper capped at available stock.
- "Add to Cart" on both pages dispatches `addItem` into the existing
  `cartSlice` (owned by Timothy) — no changes needed there, it just works.
- Styling uses only the existing design tokens (`var(--color-primary)`,
  `var(--gradient-primary)`, etc.) and the shared `Card` / `Button` / `Badge`
  components — nothing new introduced.

## Verified

- `npx oxlint` → 0 warnings, 0 errors
- `npm run build` → builds clean


## Design tokens

All colors/gradient live in `src/styles/tokens.css`, pulled directly from the
Figma file's palette:

- `--color-primary`: #bf4a6b (rose)
- `--color-gold`: #bd9445
- `--gradient-primary`: the rose → blush → gold gradient used on nav
  logo, gradient buttons, and admin stat cards

Reuse these tokens (`var(--color-primary)`, `var(--gradient-primary)`, etc.)
rather than hardcoding new colors, so every branch stays visually consistent.

## Branch ownership (matches the Trello board)

| Branch | Owner | Pages |
|---|---|---|
| `feature/setup-shared-layout` | shared | `components/layout/*`, `styles/tokens.css`, routing |
| `feature/auth-damaris` | Damaris | Login, Sign Up |
| `feature/shop-elvis` | Elvis | Home/Product Listing, Product Detail |
| `feature/cart-checkout-timothy` | Timothy | Cart, Checkout, Order Confirmation |
| `feature/admin-orderhistory-morgan` | Morgan | Admin Dashboard, Admin Product Management, Order History |

Everything currently builds and routes — non-owned pages are placeholder
stubs so `npm run dev` works immediately on any branch. Redux slices for
every domain already exist in `src/features/*` with mock data seeded from
`src/data/mockProducts.js`, so pages can be built against real-looking state
without waiting on the backend.
 
