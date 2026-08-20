
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

