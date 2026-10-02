export function sanitizeUser(user) {
  const source = typeof user.toObject === 'function' ? user.toObject() : { ...user }

  return {
    id: String(source._id ?? source.id),
    name: source.name,
    email: source.email,
    role: source.role,
    avatar: source.avatar ?? '',
  }
}

/** Admin user list/detail payload — includes join date and optional post count. */
export function sanitizeAdminUser(user, extras = {}) {
  const base = sanitizeUser(user)
  const source = typeof user.toObject === 'function' ? user.toObject() : { ...user }

  const result = {
    ...base,
    createdAt: source.createdAt ?? null,
  }

  if (extras.postCount !== undefined) {
    result.postCount = extras.postCount
  } else if (source.postCount !== undefined) {
    result.postCount = source.postCount
  }

  return result
}

export function sanitizePost(post) {
  const source = typeof post.toObject === 'function' ? post.toObject() : { ...post }

  let author = null
  if (source.author && typeof source.author === 'object' && (source.author._id || source.author.id)) {
    author = sanitizeUser(source.author)
  } else if (source.author) {
    author = String(source.author)
  }

  return {
    id: String(source._id ?? source.id),
    title: source.title,
    slug: source.slug,
    content: source.content ?? '',
    excerpt: source.excerpt ?? '',
    category: source.category,
    tags: source.tags ?? [],
    status: source.status,
    coverImage: source.coverImage ?? null,
    author,
    publishedAt: source.publishedAt ?? null,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  }
}

/** Admin list/dashboard payload — includes soft-delete flags. */
export function sanitizeAdminPost(post) {
  const base = sanitizePost(post)
  const source = typeof post.toObject === 'function' ? post.toObject() : { ...post }

  return {
    ...base,
    isDeleted: Boolean(source.isDeleted),
    deletedAt: source.deletedAt ?? null,
  }
}

export function sanitizeComment(comment) {
  const source = typeof comment.toObject === 'function' ? comment.toObject() : { ...comment }

  let author = null
  if (source.author && typeof source.author === 'object' && (source.author._id || source.author.id)) {
    author = sanitizeUser(source.author)
  } else if (source.author) {
    author = String(source.author)
  }

  return {
    id: String(source._id ?? source.id),
    content: source.content ?? '',
    post: String(source.post?._id ?? source.post ?? ''),
    author,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  }
}

/** Minimal public payload for share links (draft or published). */
export function sanitizeSharedPost(post) {
  const source = typeof post.toObject === 'function' ? post.toObject() : { ...post }

  let authorName = ''
  if (source.author && typeof source.author === 'object') {
    authorName = source.author.name ?? ''
  }

  return {
    id: String(source._id ?? source.id),
    title: source.title,
    content: source.content ?? '',
    excerpt: source.excerpt ?? '',
    category: source.category,
    tags: source.tags ?? [],
    coverImage: source.coverImage ?? null,
    publishedAt: source.publishedAt ?? null,
    author: { name: authorName },
  }
}
