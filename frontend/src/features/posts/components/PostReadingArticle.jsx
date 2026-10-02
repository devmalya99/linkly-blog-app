import { formatPostDate, statusLabel } from '../utils/postFormat'
import { CoverImage } from './CoverImage'

function authorInitials(name) {
  if (!name) return '?'
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function PostReadingArticle({
  post,
  actions = null,
  showStatus = false,
  statusNote = null,
}) {
  const dateLabel = formatPostDate(post.publishedAt || post.createdAt)
  const hasDate = dateLabel !== '—'
  const authorName = post.author?.name

  return (
    <article className="animate-[fadeIn_0.35s_ease-out]">
      <CoverImage
        alt={post.title ? `Cover for ${post.title}` : 'Post cover'}
        className="mb-8 border border-border-subtle"
        rounded="rounded-xl"
        size="hero"
        src={post.coverImage}
      />

      <header className="border-b border-border-subtle pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-primary-container/10 px-2.5 py-1 font-label-tag text-label-tag text-primary-container uppercase">
            {post.category}
          </span>
          {showStatus ? (
            <span
              className={`rounded-md px-2.5 py-1 font-label-tag text-label-tag uppercase ${
                post.status === 'published'
                  ? 'bg-status-success/10 text-status-success'
                  : 'bg-surface-container text-text-muted'
              }`}
            >
              {statusLabel(post.status)}
            </span>
          ) : null}
          {statusNote ? (
            <span className="rounded-md bg-surface-container px-2.5 py-1 font-label-tag text-label-tag text-text-muted uppercase">
              {statusNote}
            </span>
          ) : null}
        </div>

        <h1 className="mt-5 font-newsreader text-[2.25rem] leading-[1.2] font-semibold tracking-[-0.02em] text-text-primary sm:text-[2.75rem] sm:leading-[1.15]">
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="mt-4 max-w-2xl font-body-md text-body-md leading-7 text-text-muted">
            {post.excerpt}
          </p>
        ) : null}

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container font-label-md text-label-md font-semibold text-on-surface-variant"
            >
              {authorInitials(authorName)}
            </span>
            <div className="min-w-0">
              {authorName ? (
                <p className="truncate font-label-md text-label-md font-medium text-text-primary">
                  {authorName}
                </p>
              ) : null}
              {hasDate ? (
                <p className="font-meta-sm text-meta-sm text-text-muted">{dateLabel}</p>
              ) : null}
            </div>
          </div>

          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </header>

      <div
        className="tiptap-editor prose-content mt-10 min-h-[8rem] font-body-reading text-body-reading leading-[1.75] text-text-primary [&_p]:my-4 [&_p:first-child]:mt-0"
        dangerouslySetInnerHTML={{ __html: post.content || '<p></p>' }}
      />

      {post.tags?.length ? (
        <footer className="mt-12 border-t border-border-subtle pt-8">
          <p className="mb-3 font-label-tag text-label-tag text-text-muted uppercase">Tags</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                className="rounded-md bg-surface-container-low px-3 py-1.5 font-label-md text-label-md text-text-muted"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </footer>
      ) : null}
    </article>
  )
}
