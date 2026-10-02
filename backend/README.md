# Inkly API

Classic Express REST API for the Inkly blog. Package manager is pnpm.

## Setup

```bash
cd backend
pnpm install
cp .env.example .env
```

Fill `MONGO_URI` and the JWT secrets in `.env`. OAuth client values stay empty until Google and Facebook apps are created.

## Run

```bash
pnpm dev
```

- Health check: `GET http://localhost:5000/api/v1/health`
- Swagger UI (non-production): `http://localhost:5000/api-docs`

## Auth

- `POST /api/v1/auth/register` — creates user only (no tokens)
- `POST /api/v1/auth/login` — returns `accessToken` + user; sets HttpOnly `refreshToken` cookie
- `POST /api/v1/auth/refresh` — uses refresh cookie, returns new access token
- `POST /api/v1/auth/logout` — Bearer access token required; revokes refresh cookie
- `GET /api/v1/auth/me` — Bearer access token required

## Tests

```bash
pnpm test
```
