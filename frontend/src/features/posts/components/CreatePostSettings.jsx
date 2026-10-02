import {
  POST_CATEGORIES,
  TAG_SUGGESTIONS,
} from '../constants/createPostContent'
import { CoverImageField } from './CoverImageField'

export function CreatePostSettings({
  category,
  tags,
  excerpt,
  slug,
  coverImage,
  onCategoryChange,
  onExcerptChange,
  onSlugChange,
  onCoverImageChange,
  onRemoveTag,
  onAddTag,
  coverDisabled = false,
}) {
  const availableSuggestions = TAG_SUGGESTIONS.filter((tag) => !tags.includes(tag))

  return (
    <div className="flex flex-col gap-6 lg:col-span-4">
      <section className="rounded-xl border border-border-subtle bg-surface-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary-container">tune</span>
          <h2 className="font-title-md text-title-md text-text-primary">Post Settings</h2>
        </div>

        <CoverImageField
          coverImage={coverImage}
          disabled={coverDisabled}
          onChange={onCoverImageChange}
        />

        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-label-tag text-label-tag tracking-wider text-text-muted uppercase">
              Editorial
            </span>
          </div>
          <label className="mb-1.5 block font-label-md text-label-md text-text-primary" htmlFor="post-category">
            Category <span className="text-status-error">*</span>
          </label>
          <div className="relative">
            <select
              className="h-11 w-full appearance-none rounded-lg border border-border-subtle bg-surface-white px-3.5 pr-10 font-body-sm text-body-sm text-text-primary focus:border-primary-container focus:outline-none focus:ring-[3px] focus:ring-primary-container/12"
              id="post-category"
              onChange={(event) => onCategoryChange(event.target.value)}
              value={category}
            >
              <option value="">Select a category...</option>
              {POST_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 material-symbols-outlined text-[20px] text-text-muted">
              expand_more
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="font-label-md text-label-md text-text-primary" htmlFor="post-tags">
              Tags
            </label>
            <span className="font-meta-sm text-meta-sm text-text-muted">Up to 5 tags</span>
          </div>
          <div className="mb-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                className="inline-flex items-center gap-1 rounded bg-primary-container/10 px-2 py-1 font-label-tag text-label-tag text-primary-container"
                key={tag}
              >
                {tag}
                <button
                  aria-label={`Remove ${tag}`}
                  className="hover:text-brand-ink"
                  onClick={() => onRemoveTag(tag)}
                  type="button"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {availableSuggestions.length > 0 && tags.length < 5 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-meta-sm text-meta-sm text-text-muted">Suggestions:</span>
              {availableSuggestions.map((tag) => (
                <button
                  className="rounded border border-border-subtle bg-background-warm px-2 py-1 font-label-tag text-label-tag text-text-muted transition-colors hover:border-primary-container hover:text-primary-container"
                  key={tag}
                  onClick={() => onAddTag(tag)}
                  type="button"
                >
                  + {tag}
                </button>
              ))}
            </div>
          ) : null}
          <input className="sr-only" id="post-tags" readOnly value={tags.join(',')} />
        </div>

        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="font-label-md text-label-md text-text-primary" htmlFor="post-excerpt">
              Excerpt (SEO & Feed Preview)
            </label>
            <span className="font-meta-sm text-meta-sm text-text-muted">{excerpt.length}/160</span>
          </div>
          <textarea
            className="min-h-[88px] w-full resize-none rounded-lg border border-border-subtle bg-surface-white px-3.5 py-2.5 font-body-sm text-body-sm text-text-primary placeholder:text-text-muted focus:border-primary-container focus:outline-none focus:ring-[3px] focus:ring-primary-container/12"
            id="post-excerpt"
            maxLength={160}
            onChange={(event) => onExcerptChange(event.target.value)}
            placeholder="A short summary for feeds and search engines..."
            value={excerpt}
          />
        </div>

        <div>
          <label className="mb-1.5 block font-label-md text-label-md text-text-primary" htmlFor="post-slug">
            URL Slug (Auto-generated)
          </label>
          <div className="flex overflow-hidden rounded-lg border border-border-subtle bg-surface-container-low">
            <span className="inline-flex items-center gap-1 border-r border-border-subtle px-3 font-meta-sm text-meta-sm text-text-muted">
              <span className="material-symbols-outlined text-[14px]">link</span>
              slug
            </span>
            <input
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 font-body-sm text-body-sm text-text-muted focus:outline-none"
              id="post-slug"
              onChange={(event) => onSlugChange(event.target.value)}
              placeholder="your-title-here"
              type="text"
              value={slug}
            />
          </div>
          <p className="mt-1.5 font-meta-sm text-meta-sm text-text-muted">
            After saving, use Share on the post page to copy a public link (`/share/posts/...`).
          </p>
        </div>
      </section>
    </div>
  )
}
