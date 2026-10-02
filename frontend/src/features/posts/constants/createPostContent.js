export const POST_CATEGORIES = [
  'Engineering',
  'Architecture',
  'Design Systems',
  'Product Craft',
  'Essays',
  'AI Interfaces',
]

export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
}

export const TAG_SUGGESTIONS = ['TypeScript', 'Minimal', 'Web Dev']

export const DEFAULT_TAGS = ['React', 'Design Systems']

export function slugifyTitle(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export function estimateReadMinutes(wordCount) {
  if (wordCount <= 0) return 0
  return Math.max(1, Math.ceil(wordCount / 200))
}

export function countWords(value) {
  const trimmed = value.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

export function buildCreatePostPayload({
  title,
  contentHtml,
  category,
  tags,
  excerpt,
  slug,
  slugTouched,
  status,
  coverImage,
}) {
  const payload = {
    title: title.trim(),
    content: contentHtml || '',
    category,
    tags,
    excerpt: excerpt.trim(),
    status,
    coverImage: coverImage || null,
  }

  if (slugTouched && slug.trim()) {
    payload.slug = slug.trim()
  }

  return payload
}

export function buildUpdatePostPayload({
  title,
  contentHtml,
  category,
  tags,
  excerpt,
  slug,
  status,
  coverImage,
}) {
  return {
    title: title.trim(),
    content: contentHtml || '',
    category,
    tags,
    excerpt: excerpt.trim(),
    slug: slug.trim() || undefined,
    status,
    coverImage: coverImage || null,
  }
}

export function formatApiError(error) {
  const details = error?.data?.errors
  if (Array.isArray(details) && details.length > 0) {
    return details.map((item) => item.message || item).join(' ')
  }
  return error?.message || 'Something went wrong. Please try again.'
}
