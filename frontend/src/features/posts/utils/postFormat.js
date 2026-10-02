export function formatPostDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function statusLabel(status) {
  if (status === 'published') return 'Published'
  if (status === 'draft') return 'Draft'
  return status
}
