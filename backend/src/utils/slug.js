export function generateSlug(title) {
  const base = String(title)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return base || 'post'
}

export function withSlugSuffix(slug, count) {
  if (count <= 1) {
    return slug
  }

  return `${slug}-${count}`
}
