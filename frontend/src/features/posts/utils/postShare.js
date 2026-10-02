export function isMongoObjectId(value) {
  return /^[a-f\d]{24}$/i.test(String(value || ''))
}

export function sharePostPath(postId) {
  return `/share/posts/${postId}`
}

export function buildShareUrl(postId, origin = typeof window !== 'undefined' ? window.location.origin : '') {
  if (!postId) return ''
  return `${origin}${sharePostPath(postId)}`
}
