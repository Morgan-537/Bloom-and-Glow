# Bloom & Glow — Beauty Shop

An e-commerce storefront and admin panel for a beauty/skincare shop, built as a
capstone project. Customers can browse products, filter by category, check
out, and track their order history; shop owners get a full admin panel for
managing products, orders, users, and sales reporting.

Frontend is fully wired up and working end to end against a mock REST API
(`json-server`). A real backend (Flask/Postgres) is planned but not part of
this phase.

## Tech stack

- **React 18** + **Redux Toolkit** for UI and state management
- **React Router v6** for routing, including protected/admin-only routes
- **Vite 5** as the build tool and dev server
- **Tailwind CSS v4** (via `@tailwindcss/vite`) plus a small set of shared
  design tokens (see below) for anything Tailwind utilities don't cover
- **json-server** as a mock REST backend, backed by `db.json` at the repo
  root — this is what real login, registration, and admin user management
  talk to today
- **Jest** + **React Testing Library** + **Babel** for testing

## Getting started

You need two terminals running at the same time from the `frontend/`
directory: one for the mock API, one for the app itself.

```bash
cd frontend
npm install
```

**Terminal 1 — mock backend** (serves `db.json` on port 4000):

```bash
npm run server
```

**Terminal 2 — the app** (serves the site on port 5173):

```bash
npm run dev
```

Then visit `http://localhost:5173`. Login, signup, and the admin Users &
Roles page all depend on `npm run server` being up — if it isn't, you'll see
"Could not reach the server" instead of a login error.

### Optional: product photo search (Unsplash API)

Admin > Products includes a "Search Unsplash for a photo" tool so an admin
can pick a real product photo instead of pasting an image URL by hand. It's
optional — the rest of the app works fine without it, and the Image URL
field can still be filled in by hand. To enable it:

1. Copy `frontend/.env.example` to `frontend/.env`
2. Sign up for a free Unsplash "Demo" API key at
   [unsplash.com/developers](https://unsplash.com/developers) (no credit
   card required, capped at 50 requests/hour) and paste it into `.env` as
   `VITE_UNSPLASH_ACCESS_KEY`
3. Restart `npm run dev` — Vite only reads `.env` on startup, not on save

`.env` is gitignored, so each teammate/deploy needs its own key.

### Test accounts

Seeded in `db.json`:

| Role     | Email                     | Password    |
|----------|---------------------------|-------------|
| Admin    | admin@bloomandglow.com    | admin123    |
| Customer | jane@example.com          | password123 |

You can also just sign up a new account from `/signup` — it's written to
`db.json` through json-server and works immediately.

## Available scripts

Run from `frontend/`:

| Script              | What it does                                      |
|---------------------|----------------------------------------------------|
| `npm run dev`       | Start the Vite dev server                          |
| `npm run build`     | Production build                                   |
| `npm run preview`   | Preview the production build locally               |
| `npm run server`    | Start json-server on port 4000 against `../db.json`|
| `npm test`          | Run the Jest test suite once                       |
| `npm run test:watch`| Run Jest in watch mode                             |

## What's implemented

**Shop & discovery** — home page with search and category filtering
(Skincare / Haircare / Makeup), product detail pages, product photos for the
full catalog.

**Auth & account** — real login/register backed by json-server (not a mock),
with role-aware navigation (customers see "My Orders", admins see an "Admin"
link) and logout.

**Cart & checkout** — add/remove/update quantities, delivery address and
billing forms, simulated payment, and an order confirmation page that also
doubles as an invoice viewer for past orders.

**Order history** — customers can see all their past orders and reopen any
of them as an invoice at `/orders/:id`.

**Responsive layout** — the shop nav, admin sidebar, data tables, and the
home/product-detail/dashboard/analytics/reports grids adapt from a single
column on phones up to the full multi-column desktop layout, via Tailwind's
`md`/`lg` breakpoints. Data tables scroll horizontally on narrow screens
instead of squeezing columns unreadably thin.

**Admin panel** (`/admin/*`, admin-role only):
- **Dashboard** — sales/order stats, a 30-day trend chart, top products
- **Products** — product catalog management, including an optional Unsplash
  photo search when adding/editing a product (see "Getting started" above)
- **Orders** — search and filter orders, advance fulfillment status
  (Processing → Shipped → Delivered, or Cancelled)
- **Users & Roles** — real accounts from `db.json`, with role changes and
  enable/disable controls
- **Analytics** — stat cards plus a revenue-by-category breakdown computed
  from orders placed in the current session
- **Reports** — CSV export for the product catalog and order history

## Testing

Tests live alongside the code they cover (`*.test.js` / `*.test.jsx`) and run
with Jest + Babel + `jest-environment-jsdom`. Current coverage:

- `cartSlice.test.js` — add/remove/update quantity, totals
- `orderSlice.test.js` — placing an order, delivery/billing updates, and the
  admin order-status flow (defaults to "Processing", advances via
  `updateOrderStatus`)
- `authSlice.test.js` — login/register success and failure handling, without
  needing json-server running
- `mockProducts.test.js` — a regression test guarding against duplicate
  product ids (an earlier bug caused React key collisions that made clicking
  a product card open the wrong product)
- `Badge.test.jsx` — a small component-render test using React Testing
  Library

Run `npm test` from `frontend/` to execute all of them.

## Known limitations

- **Order data is in-memory only.** Orders live in Redux state, not
  `db.json`, so the Admin Orders/Analytics pages and a customer's order
  history reset on every page refresh. Placing an order in the current
  session is what populates them.
- **The backend is a mock.** `json-server` stands in for the real API for
  this phase — a Flask/Postgres backend is planned for later and will
  replace `db.json` and the current `src/api/*` calls.
- **The deployed (Vercel) link needs a hosted backend to fully work.**
  `src/api/*` currently points at `http://localhost:4000`, which only
  exists on a developer's own machine. On the live URL, login, products,
  and the admin panel can't reach any data until json-server (or its
  replacement) is hosted somewhere public and the API base URL is updated
  to point at it.

## Project structure

```
frontend/src/
  api/            REST calls to the json-server mock backend
  app/            Redux store setup
  components/     Shared UI (layout, buttons, cards, badges) and route guards
  data/           Seed data (mock product catalog)
  features/       Redux slices + feature-specific pages, grouped by domain
                  (auth, cart, checkout, order, products, admin)
  pages/          Route-level pages, including the admin panel under pages/admin
  styles/         Shared design tokens and global CSS
  test/           Jest mocks for CSS/image imports
```

## Design tokens

Colors and shared visual tokens live in `src/styles/tokens.css`:

- `--color-primary`: `#bf4a6b` (rose) — primary buttons, links, accents
- `--color-gold`: `#bd9445`
- `--gradient-primary`: the rose → blush → gold gradient used on the nav
  logo, gradient buttons, and admin stat cards

Reuse these tokens (`var(--color-primary)`, `var(--gradient-primary)`, etc.)
instead of hardcoding new colors, so the app stays visually consistent.

## Team

Built as a group capstone project, originally split by feature area:

| Area                                  | Owner   |
|----------------------------------------|---------|
| Shared layout, routing, design tokens  | Shared  |
| Auth — Login, Sign Up                  | Damaris |
| Shop — Home/Product Listing, Product Detail | Elvis |
| Cart, Checkout, Order Confirmation     | Timothy |
| Admin panel, Order History             | Morgan  |
