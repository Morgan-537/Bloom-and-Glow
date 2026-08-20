# Bloom & Glow — Beauty Shop Frontend

React + Redux Toolkit + React Router, matching the Figma wireframes and ERD
submitted for Project 16.

## Getting started

```bash
npm install
npm run dev
```

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
