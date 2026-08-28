# Bloom & Glow — Backend (Flask + PostgreSQL)

Real API for the shop, replacing the `json-server` mock (`../db.json`).
Same data your frontend already expects — products, users, orders — now
backed by PostgreSQL, with real JWT auth and password hashing instead of
plaintext passwords in a JSON file.

## Stack

- **Flask 3** — app framework
- **Flask-SQLAlchemy** — ORM / models
- **PostgreSQL** — database
- **Flask-JWT-Extended** — JWT auth (access tokens, role claims)
- **Flask-Bcrypt** — password hashing
- **Flask-CORS** — allows the Vercel-hosted frontend to call this API
- **pytest** — test suite (`tests/`)

## Local setup

This uses **Render's free Postgres** as the database for local dev too —
no Postgres install needed on your machine. (Render allows only one free
Postgres per account, so this same instance is also what gets used once
the backend is deployed — see "Deploying" below.)

1. On [render.com](https://render.com), **New > PostgreSQL**. Free plan is
   fine. Name it something like `bloom-and-glow-db`.
2. Once it's up, open it and copy the **External Database URL** (starts
   with `postgresql://`) — that's what lets you connect to it from your
   own machine, not just from another Render service.
3. Note: Render's free Postgres **expires after 30 days** (14-day grace
   period to upgrade before data is deleted) — fine for a capstone demo
   timeline, just don't expect it to still be there next semester.

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# edit .env: paste the Render "External Database URL" in as DATABASE_URL,
# and set JWT_SECRET_KEY to a random value (see the comment in .env.example)
```

Create the tables and import the existing `../db.json` data (test accounts
+ product catalog) so you don't start from empty:

```bash
python seed.py
```

Run it:

```bash
python wsgi.py
```

The API is now on `http://localhost:4000` — the same port and base URL
`frontend/src/api/*.js` already hardcodes, so **no frontend changes are
needed just to point at this instead of json-server**. (Longer-term, those
files should read the base URL from `VITE_API_URL` instead of a hardcoded
`localhost:4000`, so the deployed Vercel frontend can point at wherever
this backend ends up hosted — see "Deploying" below.)

## Running tests

```bash
pytest
```

No database setup needed — tests run against a throwaway local SQLite file
(created and torn down automatically), not your Render Postgres instance,
so running the suite can never touch or wipe your real dev/demo data.

Tests use `TEST_DATABASE_URL` (defaults to `bloom_and_glow_test` on
localhost) and create/drop tables per test, so they never touch your real
dev data.

## API overview

All routes are prefixed `/api`. Protected routes expect
`Authorization: Bearer <token>` (the `token` returned from login/register).

| Method | Route | Auth | Notes |
|---|---|---|---|
| POST | `/auth/register` | — | `{name, email, password}` → `{user, token}` |
| POST | `/auth/login` | — | `{email, password}` → `{user, token}` |
| GET | `/auth/me` | any | re-validate a stored token |
| GET | `/products` | — | public catalog list |
| POST | `/products` | admin | create product |
| PATCH | `/products/:id` | admin | update product |
| DELETE | `/products/:id` | admin | delete product |
| GET | `/users` | admin | list all users |
| PATCH | `/users/:id` | admin | `{role}` and/or `{disabled}` |
| POST | `/orders` | any | place an order (own cart) |
| GET | `/orders` | any | own orders (customer) / all orders (admin, order_manager) |
| GET | `/orders/:id` | owner or staff | single order / invoice |
| PATCH | `/orders/:id/status` | admin, order_manager | advance fulfillment |
| GET | `/analytics/dashboard` | admin, order_manager | stat card totals |
| GET | `/analytics/sales-trend` | admin, order_manager | last 12 days of revenue |
| GET | `/analytics/top-products` | admin, order_manager | best sellers by units sold |
| GET | `/analytics/category-breakdown` | admin, order_manager | revenue by category |
| GET | `/reports/products.csv` | admin, order_manager | CSV export |
| GET | `/reports/orders.csv` | admin, order_manager | CSV export |
| GET | `/health` | — | uptime check |

## Known differences from the old json-server mock

- **Product `status`** is always recomputed from `stock` server-side
  (`< 10` → "Low Stock", `0` → "Out of Stock", else "Active") instead of
  trusted from the client — a few rows in the old `db.json` had drifted out
  of sync with their real stock count.
- **`AdminDashboard`/`AdminAnalytics`'s "top products" list** used a mocked
  `views` field (page views were never actually tracked). `/analytics/top-products`
  returns real data instead, keyed as `unitsSold` — update those two
  components to read that field name.
- **Orders now persist for real** (Postgres, not Redux-only state), so
  order history survives a page refresh — this removes the "Order data is
  in-memory only" item from the main README's Known Limitations.
- **Placing an order decrements the matching product's stock.** Best-effort
  (clamped at 0, not a hard reservation/lock) — fine for a demo, not
  production-grade for real concurrent checkouts.

## Deploying (Render)

If you already created the free Postgres instance for local dev (see
"Local setup" above), reuse that same one here — Render only allows one
free Postgres per account, so there's no separate "production" database to
create.

1. Push this `backend/` folder to the repo (already tracked once you commit it).
2. **New > Web Service** on Render, connect the repo, root directory `backend`.
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn wsgi:app`
3. Add environment variables on the web service: `DATABASE_URL` (paste the
   same Postgres URL you put in your local `.env` — use the **Internal**
   Database URL instead of External if the web service is in the same
   Render account/region as the database, it's faster), `JWT_SECRET_KEY`
   (a random string — can reuse the one from your local `.env`), `CORS_ORIGINS`
   (your Vercel URL, e.g. `https://bloom-and-glow-ten.vercel.app`).
4. Tables + seed data already exist from running `python seed.py` locally
   against this same database — no need to re-run it. (If you ever do need
   to: Render's Shell tab on the web service, or run it locally again.)
5. Update the frontend's API base URL (`VITE_API_URL`) to the Render
   service's `https://...onrender.com` URL, both locally in `.env` and as a
   Vercel environment variable, then redeploy the frontend.

Render's free tier spins a web service down after inactivity — the first
request after idling can take ~30-50s to wake it back up. Worth mentioning
to your mentor before a live demo.
