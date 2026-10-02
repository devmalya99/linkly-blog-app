# Feed

Authenticated home feed at `/feed`.

## Purpose

- **For You** — seeded random published posts (5/page)
- **Following** — posts from authors the user follows
- **Trending** — most comments in the last 7 days
- **Categories** — filter by existing post categories
- **Authors to follow** — right-rail suggestions with follow/unfollow

## Architecture

- Screen: `screens/Feed.jsx` (tabs + list + right rail)
- API: `api/feedApi.js`, `api/followApi.js`
- Server state: TanStack Query under `queries/`
- URL state: `?tab=` / `?category=` / `?page=`

## API dependencies

- `GET /feed`
- `GET|POST|DELETE /follows/*`

## Known limitations

- For You randomness is session-seeded (stable pagination within a tab session)
- No author profile pages yet — follow from the suggestions rail
- Explore Topics is out of scope for v1
