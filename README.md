# vigil-app

TanStack Start (SSR) dashboard for Vigil.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Dashboard runs on `http://localhost:3001`. Requires `vigil-backend` running on `:4000`.

## Routes

- `/login`, `/signup` — public
- `/dashboard` — overview (auth required)
- `/sessions`, `/sessions/:id` — session list + detail
- `/signals` — frustration signals feed
- `/settings` — org, API keys, integrations
