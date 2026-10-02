# Auth

Session bootstrap, email/password auth, and Google OAuth handoff.

## Architecture

- `api/` — auth HTTP clients and Google OAuth URL helper
- `queries/` — TanStack Query keys for `/auth/me` and mutation options for register/login/logout
- `providers/AuthProvider` — session cookies + context; uses query/mutation options under the hood
- `hooks/useAuth` — reads auth context for UI
- `screens/AuthCallback` — finishes Google OAuth via refresh

Login and Register pages call `useAuth()` only — no direct API imports for mutations.
