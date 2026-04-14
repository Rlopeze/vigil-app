# Vigil App — Frustration Detection Platform

## What is Vigil

Vigil is a B2B SaaS that detects customer frustration in real time. Website owners embed a lightweight JavaScript snippet on their site. The snippet monitors user behavior and sends frustration signals (rage clicks, dead clicks, error loops, mouse thrashing) to the Vigil API. Users view and manage these signals from the Vigil dashboard.

## Architecture

This is a monorepo with three workspaces:

```
vigil-app/
├── apps/
│   ├── api/           # Express.js backend (port 3001)
│   └── web/           # TanStack Start frontend (port 3003)
├── packages/
│   └── shared/        # @vigil/shared — types used by both apps
```

### apps/api — Express.js Backend

- **Auth**: JWT-based signup/login with bcrypt password hashing
- **Projects**: each user creates projects, each project gets an API key (`vgl_xxxx`)
- **Signal ingestion**: public `POST /api/ingest` endpoint authenticated by API key (x-api-key header)
- **Tracker snippet**: served as static file at `/t/vigil.js` — customers embed this on their sites
- **In-memory store**: all data lives in memory (swap for a real DB when ready)

Key routes:
- `POST /api/auth/signup` — create account
- `POST /api/auth/login` — get JWT token
- `GET /api/auth/me` — get current user
- `POST /api/projects` — create project (returns API key)
- `GET /api/projects` — list user's projects
- `GET /api/projects/:id/signals` — get signals for a project
- `GET /api/projects/:id/sessions` — get sessions for a project
- `POST /api/ingest` — receive signals from tracker (public, API key auth)

### apps/web — TanStack Start Frontend

- `/login` — sign in page
- `/signup` — create account page
- `/dashboard` — main product page (protected, redirects to login if no token)
  - Project sidebar (create, select projects)
  - Signal feed with real-time polling (every 2s)
  - Stats breakdown (rage clicks, dead clicks, error loops, sessions)
  - Snippet modal (copy embeddable script tag)

### packages/shared — Shared Types

Exports: `Signal`, `SignalType`, `IngestPayload`, `User`, `Project`, `Session`, `AuthResponse`, `ApiError`

## Tech stack

- **Backend**: Express 5, TypeScript, bcryptjs, jsonwebtoken, cors
- **Frontend**: React 19, TanStack Start (SPA mode), TanStack Router, Vite 8, TypeScript
- **Shared**: TypeScript types package
- **Styling**: all inline styles, no CSS framework
- **Fonts**: Inter + Space Grotesk

## Running locally

```bash
npm install

# Both at once:
npm run dev

# Or individually:
npm run dev:api    # http://localhost:3001
npm run dev:web    # http://localhost:3003
```

## The embeddable tracker snippet

Customers add this to their website:
```html
<script src="http://localhost:3001/t/vigil.js" data-key="vgl_xxxx"></script>
```

The snippet (`apps/api/public/vigil.js`) is a standalone ES5 IIFE that:
1. Reads the API key from `data-key` attribute
2. Creates a session ID (persisted in sessionStorage)
3. Detects rage clicks (3+ clicks within 50px in 2s)
4. Detects dead clicks (clicks on disabled elements)
5. Detects thrashing (erratic mouse movement)
6. Sends signals via XHR to `/api/ingest` with the API key

## Related repos

- **Landing page**: [Rlopeze/vigil](https://github.com/Rlopeze/vigil) — marketing site at vigil-brown.vercel.app
- CTAs on the landing page point to this app's frontend

## What's next

- Persistent database (replace in-memory store)
- Deploy API and frontend
- Update landing page URLs to point to production
- Email verification
- Webhook integrations (Slack, etc.)
- Session replay
