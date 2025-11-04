# Game Top-up Site (Demo scaffold)

This is a minimal Node.js + Express + SQLite scaffold for a game top-up website with:
- Public storefront (index.html) for players to submit top-up requests
- Admin dashboard (admin.html) to view and complete/cancel requests
- Owner dashboard (owner.html) for summary
- Simple SQLite DB located at `db/topup.db`

## Features
- No real game API integration — this is a demo that stores requests to the database.
- Default users: admin / owner (passwords can be set via environment variables ADMIN_PASS and OWNER_PASS)

## Setup (local)
1. Install Node.js (v18+)
2. In project folder:
   ```bash
   npm install
   npm run init-db
   npm start
   ```
3. Open `http://localhost:3000`

## Deployment
- For full backend support you need a host that supports Node.js (Render, Railway, Heroku, VPS).
- Vercel can work with serverless functions, but this scaffold expects a persistent Node process.

## How to connect to real game APIs
- Each top-up must call the game's top-up API or use an external top-up provider.
- Add code in `server.js` to call those provider APIs when processing a `pending` order (e.g., upon admin completing the order).

## Security notes
- This scaffold uses an in-memory session store — not suitable for production.
- Replace with JWT or persistent session store for production.
- Hashes are stored via bcrypt; change default passwords and use HTTPS in production.
