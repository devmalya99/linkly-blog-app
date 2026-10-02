# Comments

Flat, authenticated comments on published posts.

## Purpose

Registered users can view and add comments on published posts. Comment authors, post authors, and admins can delete comments from the post detail page.

## Architecture

- `api/` — HTTP clients for list/create/delete
- `queries/` — TanStack Query keys, query options, and mutation options
- `hooks/useComments` — wraps queries/mutations for the UI (pagination + submit/delete)
- `components/` — section, form, list item, sign-in prompt
- `utils/commentPermissions` — delete visibility rules

Posts own the page; this feature is mounted via `CommentsSection` on `PostDetail`.

## API dependencies

- `GET /posts/:postId/comments?page&limit` (auth)
- `POST /posts/:postId/comments` (auth)
- `DELETE /comments/:id` (auth)

## Known limitations

- No replies, threading, or mentions
- No comment edit UI
- Admin dashboard moderation is out of scope for this version
- Soft-deleted posts cannot list/create comments; existing rows stay in MongoDB until hard-deleted individually
