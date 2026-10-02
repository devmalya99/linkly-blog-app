import { FEED_COPY } from '../constants/feedContent'
import { authorInitials } from '../utils/feedView'

export function AuthorsToFollow({
  authors,
  followedIds,
  isLoading,
  error,
  pendingUserId,
  onFollow,
  onUnfollow,
}) {
  return (
    <aside className="rounded-xl border border-border-subtle bg-surface-white p-5">
      <h2 className="font-headline-sm text-headline-sm font-semibold tracking-tight text-text-primary">
        {FEED_COPY.authorsTitle}
      </h2>

      {isLoading ? <p className="mt-4 text-sm text-text-muted">Loading…</p> : null}
      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-status-error" role="alert">
          {error}
        </p>
      ) : null}

      {!isLoading && !error && authors.length === 0 ? (
        <p className="mt-4 text-sm text-text-muted">{FEED_COPY.authorsEmpty}</p>
      ) : null}

      <ul className="mt-4 flex flex-col gap-4">
        {authors.map((author) => {
          const isFollowing = followedIds.has(author.id)
          const isBusy = pendingUserId === author.id

          return (
            <li className="flex items-center gap-3" key={author.id}>
              {author.avatar ? (
                <img
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                  src={author.avatar}
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container font-label-md text-label-md font-semibold text-text-primary">
                  {authorInitials(author.name)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">{author.name}</p>
                <p className="truncate text-xs text-text-muted">Author</p>
              </div>
              <button
                className={
                  isFollowing
                    ? 'rounded-md border border-border-subtle px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-surface-container-low disabled:opacity-50'
                    : 'rounded-md bg-text-primary px-3 py-1.5 text-xs font-medium text-on-primary hover:opacity-90 disabled:opacity-50'
                }
                disabled={isBusy}
                onClick={() => (isFollowing ? onUnfollow(author.id) : onFollow(author.id))}
                type="button"
              >
                {isFollowing ? FEED_COPY.following : FEED_COPY.follow}
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
