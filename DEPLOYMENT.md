# Deployment runbook

The frontend is already live at **https://swap-atelier.vercel.app** (Vercel, auto-deployed
from `client/` via the Vercel CLI). It runs on rich mock data today. This guide connects the
real Express + MongoDB backend so auth, listings, and swaps persist to a database.

Total time: ~10 minutes. You need free accounts on **MongoDB Atlas** and **Render**.

---

## 1 · MongoDB Atlas (the database)

1. Sign in at https://cloud.mongodb.com → **Create** a new project (e.g. "Swap").
2. **Build a Database** → choose the **M0 free** tier → pick a region near your Render region
   (e.g. AWS / N. Virginia to match Render's default) → **Create Deployment**.
3. In the connection dialog that appears:
   - **Create a database user** — note the username and password.
   - **Network Access** → add IP `0.0.0.0/0` (allow from anywhere — Render's IPs are dynamic).
4. **Connect → Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Insert your password, and add the database name `swap` before the `?`:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/swap?retryWrites=true&w=majority
   ```
   Keep this — it's your `MONGODB_URI`.

---

## 2 · Render (the API)

The repo ships a blueprint at [`server/render.yaml`](server/render.yaml).

1. Push this project to a GitHub repo if it isn't already (Render deploys from Git).
2. Render dashboard → **New → Blueprint** → connect the repo → Render reads `server/render.yaml`
   and proposes a **swap-api** web service (root dir `server/`, `npm install` → `npm start`).
3. Before the first deploy, set the env vars it asks for:
   | Key | Value |
   |---|---|
   | `MONGODB_URI` | the Atlas string from step 1 |
   | `JWT_SECRET` | leave as auto-generated (the blueprint sets `generateValue: true`) |
   | `CORS_ORIGINS` | `https://swap-atelier.vercel.app,http://localhost:5173` |
4. **Apply / Deploy.** On first boot the API seeds itself — watch the logs for:
   ```
   [seed] done — 7 users (admin@swap.in / admin123, others password123), 26 listings, 3 requests, 3 disputes
   [swap-api] listening on :10000
   ```
5. Confirm it's healthy: open `https://<your-service>.onrender.com/api/health` — expect
   `{"ok":true,"service":"swap-api"}`.

> **Free-tier note:** Render spins the service down after ~15 min idle; the first request
> after that takes ~30 s to wake. Fine for a portfolio demo — just load the API health URL
> once right before a live evaluation to warm it up.

---

## 3 · Vercel (point the frontend at the API)

1. Vercel dashboard → **swap-atelier** project → **Settings → Environment Variables**.
2. Add `VITE_API_URL` = `https://<your-service>.onrender.com` (no trailing slash),
   scope **Production**.
3. Redeploy: either push a commit, or from `client/` run `npx vercel deploy --prod --yes`.

The auth page detects `VITE_API_URL` at build time and switches from mock sessions to real
JWT automatically — no code change needed. (Browse/swap/dashboard still read the local seed
for now; wiring those to `lib/api.js` is a clean follow-up, endpoint-by-endpoint.)

---

## Seeded logins (after the API seeds)

| Email | Password | Role |
|---|---|---|
| `admin@swap.in` | `admin123` | admin (sees the real admin panel data) |
| `ananya@swap.in` | `password123` | member |
| `rohan@swap.in` · `priya@swap.in` · `arjun@swap.in` · `sana@swap.in` · `vikram@swap.in` | `password123` | members |

## Verifying the wired-up stack

- Register a brand-new account on the live auth page → you should land on the dashboard with a
  real JWT in `localStorage` (`swap-auth`), and the account persists across Render restarts.
- Sign in as `admin@swap.in` and hit `GET /api/admin/stats` (or the panel) → live KPIs from Mongo.

## Rollback

Removing `VITE_API_URL` from Vercel and redeploying reverts the frontend to fully self-contained
mock mode — the live demo keeps working even if the Render service is asleep or torn down.
