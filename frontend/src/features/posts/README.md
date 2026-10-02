# Posts

Create, edit, list, share, and read posts.

## Architecture

- `api/` — pure HTTP clients (`GET`/`POST`/`PATCH`/`DELETE`)
- `queries/` — TanStack Query keys, `queryOptions`, and mutation option factories
- `hooks/` — UI-facing hooks that wrap queries/mutations
- `screens/` — route pages that only compose hooks + components
- `components/` — presentational pieces

Screens should not import from `api/` or `queries/` directly — only from `hooks/`.
