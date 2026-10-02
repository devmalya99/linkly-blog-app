export function canDeleteComment(user, comment, post) {
  if (!user || !comment) return false
  if (user.role === 'admin') return true

  const commentAuthorId =
    comment.author && typeof comment.author === 'object' ? comment.author.id : comment.author
  if (commentAuthorId && String(commentAuthorId) === String(user.id)) return true

  const postAuthorId = post?.author && typeof post.author === 'object' ? post.author.id : post?.author
  if (postAuthorId && String(postAuthorId) === String(user.id)) return true

  return false
}

export function formatCommentDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function getAuthorInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}
