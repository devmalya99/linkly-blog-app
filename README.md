# Inkly

A full-stack blog platform (MERN-style) with auth, posts, comments, follows/feed, admin tools, S3 uploads, and real-time comment notifications.

| Layer | Stack |
| --- | --- |
| Frontend | React 19, Vite, TanStack Query, React Router, TipTap |
| Backend | Express 5, MongoDB (Mongoose), Passport (Google OAuth), Socket.io, JWT |
| Package manager | **pnpm** (`10.17.1`) |

---

## Live deployments & design

| Resource | URL |
| --- | --- |
| **Frontend** | https://inkly-blog-app.netlify.app |
| **Backend API** | https://inkly-api-mr5h.onrender.com |
| **API health** | https://inkly-api-mr5h.onrender.com/api/v1/health |
| **API via Netlify proxy** | https://inkly-blog-app.netlify.app/api/v1/health |
| **Figma design** | [Inkly Blog app (FigJam)](https://www.figma.com/board/vVINPXlaDIUHrg006Fayfq/Inkly-Blog-app?node-id=0-1&p=f&t=9CShxXtWEly6fL6a-0) |

Production frontend calls `/api/v1` on the Netlify origin. Netlify rewrites `/api/*` to the Render service so auth cookies stay first-party.

> **Note:** Free Render instances may sleep when idle. The first request after idle can take ~30–60 seconds.

---

## Repository layout

```text
inkly-new-gen-blog-app/
├── frontend/          # React + Vite SPA
├── backend/           # Express API + Socket.io
├── README.md
└── …
```

---

## Prerequisites

- Node.js **18+** (22 recommended)
- [pnpm](https://pnpm.io/) `10.17.1` (`corepack enable` then `corepack prepare pnpm@10.17.1 --activate`)
- MongoDB Atlas (or local MongoDB)
- Optional: Google OAuth client, AWS S3 credentials (cover/image uploads)

---

## Installation

### 1. Clone

```bash
git clone https://github.com/devmalya99/linkly-blog-app.git
cd linkly-blog-app
```

### 2. Backend

```bash
cd backend
pnpm install
cp .env.example .env
# edit .env — see Environment setup below
pnpm dev
```

API defaults to `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
pnpm install
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:5000/api/v1
pnpm dev
```

App defaults to `http://localhost:5173`.

### Useful scripts

| Location | Command | Purpose |
| --- | --- | --- |
| `backend/` | `pnpm dev` | API with file watch |
| `backend/` | `pnpm start` | Production start |
| `backend/` | `pnpm test` | Jest integration/unit tests |
| `frontend/` | `pnpm dev` | Vite dev server |
| `frontend/` | `pnpm build` | Production build |
| `frontend/` | `pnpm lint` | Oxlint |

---

## Environment setup

### Backend (`backend/.env`)

Copy from `backend/.env.example`:

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | yes | `development` \| `test` \| `production` |
| `PORT` | no | Default `5000` (Render sets this automatically) |
| `MONGO_URI` | yes | MongoDB connection string |
| `JWT_ACCESS_SECRET` | yes | Access token secret (≥ 16 chars) |
| `JWT_REFRESH_SECRET` | yes | Refresh token secret (≥ 16 chars) |
| `JWT_ACCESS_EXPIRES_IN` | no | Default `15m` |
| `JWT_REFRESH_EXPIRES_IN` | no | Default `7d` |
| `FRONTEND_URL` | yes | SPA origin (local: `http://localhost:5173`, prod: Netlify URL) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | for Google login | OAuth web client |
| `GOOGLE_CALLBACK_URL` | for Google login | Must match Google Console **exactly** |
| `FACEBOOK_*` | optional | Facebook OAuth (not fully implemented) |
| `AWS_*` | for uploads | S3 cover/image uploads |

**Local Google OAuth example**

```text
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

**Production Google OAuth (Netlify proxy)**

```text
GOOGLE_CALLBACK_URL=https://inkly-blog-app.netlify.app/api/v1/auth/google/callback
FRONTEND_URL=https://inkly-blog-app.netlify.app
```

In Google Cloud Console (same OAuth **Web application** client):

- **Authorized JavaScript origins:** `http://localhost:5173`, `https://inkly-blog-app.netlify.app`
- **Authorized redirect URIs:** the matching `GOOGLE_CALLBACK_URL` values above

### Frontend (`frontend/.env`)

Copy from `frontend/.env.example`:

| Variable | Local | Production (Netlify) |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:5000/api/v1` | `/api/v1` |
| `VITE_SOCKET_URL` | `http://localhost:5000` (optional) | `https://inkly-api-mr5h.onrender.com` |

Socket.io talks to Render directly (Netlify’s HTTP rewrite does not proxy WebSockets).

---

## Features

### Authentication

- Email/password register & login
- JWT access token (Bearer) + HttpOnly refresh cookie
- Google OAuth (Passport)
- Session bootstrap on app load (`/auth/me` + refresh)

### Posts

- Create / edit / delete posts (TipTap rich text)
- Cover uploads to S3
- Public post listing & detail
- Share links
- Recommended / recent activity surfaces

### Comments

- Flat comments on published posts
- Authors can edit their own comments
- Authors, post owners, and admins can delete
- Real-time toast to the post author via Socket.io when someone comments

### Feed & follows

- Authenticated feed tabs: **For You**, **Following**, **Trending**, categories
- Follow / unfollow authors
- Author suggestions rail

### Admin

- Admin dashboard for users and posts (role-gated)

### Notifications

- Live comment toasts only (no inbox UI); click opens the post comments section

---

## API documentation overview

Base path: **`/api/v1`**

| Area | Prefix | Highlights |
| --- | --- | --- |
| Health | `GET /health` | Liveness |
| Auth | `/auth` | register, login, logout, refresh, me, Google OAuth |
| Users | `/users` | Profile / user resources |
| Posts | `/posts` | CRUD, listing, recommendations |
| Comments | `/posts/:postId/comments`, `/comments/:id` | List, create, update, delete |
| Follows | `/follows` | Follow / unfollow |
| Feed | `/feed` | Personalized feed tabs |
| Share | `/share` | Public share endpoints |
| Uploads | `/uploads` | Cover/image upload |
| Admin | `/admin` | Admin-only management |

**Auth model**

- `POST /auth/login` → `accessToken` in JSON + `refreshToken` HttpOnly cookie
- `POST /auth/refresh` → new access token (cookie required)
- Protected routes → `Authorization: Bearer <accessToken>`

OpenAPI source of truth: `backend/docs/openapi.js` (paths under `backend/docs/paths/`).

Some newer routes (feed, follows, uploads) may not yet appear in Swagger; use the route modules under `backend/src/routes/` as the runtime reference.

---

## Swagger docs

Swagger UI is mounted only when **`NODE_ENV` is not `production`**:

```text
http://localhost:5000/api-docs
```

### How to open it

1. Start the backend locally: `cd backend && pnpm dev`
2. Ensure `NODE_ENV=development` in `backend/.env`
3. Visit [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

Production Render (`NODE_ENV=production`) does **not** expose `/api-docs`. To inspect the contract without running the server, read `backend/docs/openapi.js`.

---

## Deployment overview

### Frontend — Netlify

- Site: https://inkly-blog-app.netlify.app
- Build: `pnpm run build` in `frontend/`
- Publish: `dist`
- `netlify.toml` proxies `/api/*` → `https://inkly-api-mr5h.onrender.com/api/:splat`
- Env: `VITE_API_BASE_URL=/api/v1`, `VITE_SOCKET_URL=https://inkly-api-mr5h.onrender.com`

### Backend — Render

- Service: https://inkly-api-mr5h.onrender.com
- Root directory: `backend`
- Build: `npx --yes pnpm@10.17.1 install --frozen-lockfile`
- Start: `node src/server.js`
- Set all `backend/.env` variables in the Render dashboard (including production `FRONTEND_URL` and `GOOGLE_CALLBACK_URL`)

### Database

- MongoDB Atlas (cloud). Allow network access from Render (typically `0.0.0.0/0` for free-tier apps).

---

## Testing

```bash
cd backend
pnpm test
```

Uses Jest + MongoDB Memory Server for integration tests under `backend/tests/`.

---

## License

Private / unpublished unless otherwise stated by the repository owner.
