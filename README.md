# Bloom & Glow — Beauty Shop

An e-commerce storefront and admin panel for a beauty/skincare shop, built as a
capstone project. Customers can browse products, filter by category, check
out, and track their order history; shop owners get a full admin panel for
managing products, orders, users, and sales reporting.

Frontend and backend are fully wired up and working end to end: the backend
is a real Flask API backed by PostgreSQL (hosted on Supabase), and the
frontend talks to it directly — no mock API involved anymore.

**Live deployment:**
- Frontend: https://bloom-and-glow-ten.vercel.app
- Backend API: https://bloom-and-glow-umy0.onrender.com
- Interactive API docs (Swagger): https://bloom-and-glow-umy0.onrender.com/apidocs

## Tech stack

**Frontend**
- **React 18** + **Redux Toolkit** for UI and state management
- **React Router v6** for routing, including protected/admin-only routes
- **Vite 5** as the build tool and dev server
- **Tailwind CSS v4** (via `@tailwindcss/vite`) plus a small set of shared
  design tokens (see below) for anything Tailwind utilities don't cover
- **Jest** + **React Testing Library** + **Babel** for testing

**Backend**
- **Flask 3** + **Flask-SQLAlchemy** for the API and ORM
- **Flask-JWT-Extended** for authentication (JWT bearer tokens, with `role`
  embedded as a claim so route guards don't need a DB lookup per request)
- **Flask-Bcrypt** for password hashing
- **Flask-CORS** for cross-origin requests from the frontend
- **PostgreSQL** (hosted on Supabase) as the database
- **gunicorn** as the production WSGI server (Render)
- **flask-swagger-ui** serving a hand-written OpenAPI 3.0.3 spec at `/apidocs`

## Getting started

You need the backend and frontend running at the same time. You have two
options for the backend: run it locally, or just point your local frontend
at the already-deployed Render backend if you don't need to change backend
code.

### Backend — Option A: run it locally

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env` with:
DATABASE_URL=<your Supabase Postgres connection string>
JWT_SECRET_KEY=<any random string>
CORS_ORIGINS=http://localhost:5173



Then create the tables and seed some starter data (pulled from the legacy
`db.json`, including the test accounts below):

```bash
python seed.py            # create tables + import db.json if present
python seed.py --fresh    # or: drop all tables first, then recreate + import
```

Start the API:

```bash
flask run
```

The API is now live at `http://127.0.0.1:5000`, with interactive docs at
`http://127.0.0.1:5000/apidocs`.

### Backend — Option B: use the hosted backend

Skip all of the above and just point your frontend's `VITE_API_URL` (below)
at `https://bloom-and-glow-umy0.onrender.com`. Note this is a free-tier
Render service — it spins down after inactivity, so the first request after
a while can take ~50 seconds to wake back up.

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env` with:
VITE_API_URL=http://127.0.0.1:5000


(or the Render URL from Option B above). Then:

```bash
npm run dev
```

Visit `http://localhost:5173`.

### Optional: product photo search (Unsplash API)

Admin > Products includes a "Search Unsplash for a photo" tool so an admin
can pick a real product photo instead of pasting an image URL by hand. It's
optional — the rest of the app works fine without it, and the Image URL
field can still be filled in by hand. To enable it, add to `frontend/.env`:
VITE_UNSPLASH_ACCESS_KEY=<your key from unsplash.com/developers>


Free "Demo" API keys are capped at 50 requests/hour, no credit card
required. Restart `npm run dev` after editing `.env` — Vite only reads it on
startup, not on save.

`.env` is gitignored, so each teammate/deploy needs its own.

### Test accounts

Seeded from `db.json` via `python seed.py`:

| Role     | Email                     | Password    |
|----------|---------------------------|-------------|
| Admin    | admin@bloomandglow.com    | (see `db.json`) |
| Customer | jane@example.com          | (see `db.json`) |

You can also just sign up a new account from `/signup` — it's written to
the real database via `POST /api/auth/register` and works immediately.

## Available scripts

Frontend (run from `frontend/`):

| Script              | What it does                                      |
|---------------------|----------------------------------------------------|
| `npm run dev`       | Start the Vite dev server                          |
| `npm run build`     | Production build                                   |
| `npm run preview`   | Preview the production build locally               |
| `npm test`          | Run the Jest test suite once                       |
| `npm run test:watch`| Run Jest in watch mode                             |

Backend (run from `backend/`, with the venv active):

| Command                  | What it does                                   |
|---------------------------|-------------------------------------------------|
| `flask run`               | Start the API on port 5000                      |
| `python seed.py`          | Create tables and import starter data           |
| `python seed.py --fresh`  | Drop all tables, then recreate and re-seed      |

## What's implemented

**Shop & discovery** — home page with search and category filtering
(Skincare / Haircare / Makeup), product detail pages, product photos for the
full catalog.

**Auth & account** — real login/register/session-restore backed by the Flask
API (JWT stored in `localStorage`, rehydrated on page refresh via
`GET /api/auth/me`), with role-aware navigation (customers see "My Orders",
admins see an "Admin" link) and logout.

**Cart & checkout** — add/remove/update quantities, delivery address and
billing forms, and a real order placed via `POST /api/orders` — persisted to
Postgres, not just simulated client-side. Order confirmation doubles as an
invoice viewer for past orders.

**Order history** — customers can see all their real past orders (fetched
from the API) and reopen any of them as an invoice at `/orders/:id`.

**Responsive layout** — the shop nav, admin sidebar, data tables, and the
home/product-detail/dashboard/analytics/reports grids adapt from a single
column on phones up to the full multi-column desktop layout, via Tailwind's
`md`/`lg` breakpoints. Data tables scroll horizontally on narrow screens
instead of squeezing columns unreadably thin.

**Admin panel** (`/admin/*`, admin-role only):
- **Dashboard** — real sales/order/product/customer stats, a 30-day trend
  chart, and top-selling products, all computed from the live database
- **Products** — product catalog management, including an optional Unsplash
  photo search when adding/editing a product (see "Getting started" above)
- **Orders** — search and filter real orders, advance fulfillment status
  (Processing → Shipped → Delivered, or Cancelled)
- **Users & Roles** — real accounts from the database, with role changes and
  enable/disable controls
- **Analytics** — real stat cards, a 12-day sales trend, top-selling
  products, and a revenue-by-category breakdown
- **Reports** — CSV export for the product catalog and order history

## Testing

Tests live alongside the code they cover (`*.test.js` / `*.test.jsx`) and run
with Jest + Babel + `jest-environment-jsdom`. Current coverage:

- `cartSlice.test.js` — add/remove/update quantity, totals
- `orderSlice.test.js` — placing an order, delivery/billing updates, and the
  admin order-status flow
- `authSlice.test.js` — login/register success and failure handling
- `mockProducts.test.js` — a regression test guarding against duplicate
  product ids (an earlier bug caused React key collisions that made clicking
  a product card open the wrong product)
- `Badge.test.jsx` — a small component-render test using React Testing
  Library

Run `npm test` from `frontend/` to execute all of them.

**Note:** `orderSlice` and `authSlice` were changed from synchronous
reducers to async thunks when the app was connected to the real backend, so
these test files may need updating to mock `fetch`/`apiFetch` calls rather
than testing plain reducer logic — check `npm test` output before assuming
full coverage is current.

## Known limitations

- **"Views" on the Analytics/Dashboard pages are really units sold.** The
  backend has no page-view tracking, so "Top Performing/Selling Products"
  is computed from real order line-items instead — a deliberate
  substitution, not a bug.
- **`order_manager` accounts can't reach `/admin/orders` in the UI.** The
  backend permits this role to update order status, but the frontend's
  route guard currently only allows `admin`. This is a product decision
  still open, not yet resolved.
- **Revenue by Category always shows "Uncategorized".** Order line-items
  don't carry a category field from the backend, so this breakdown doesn't
  yet reflect real categories.
- **Render free tier spins down after inactivity.** The first request to
  the live backend after a period of no traffic can take up to ~50 seconds.

## Project structure
backend/
app/ Flask app factory, models, routes, decorators
seed.py One-time table creation + starter-data import from db.json
wsgi.py Entry point used by gunicorn in production
frontend/src/
api/ REST calls to the real Flask backend (or Render in production)
app/ Redux store setup
components/ Shared UI (layout, buttons, cards, badges) and route guards
data/ Seed data (mock product catalog, pre-backend)
features/ Redux slices + feature-specific pages, grouped by domain
(auth, cart, checkout, order, products, admin)
pages/ Route-level pages, including the admin panel under pages/admin
styles/ Shared design tokens and global CSS
test/ Jest mocks for CSS/image imports


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
| Cart, Checkout, Order Confirmation, backend/frontend integration | Timothy |
| Admin panel, Order History             | Morgan  |