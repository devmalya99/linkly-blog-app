import {
  MY_POSTS_PAGE_SIZE,
  MY_POSTS_SORT,
  MY_POSTS_STATUS_FILTER,
  PRIMARY_CATEGORY_PILLS,
} from '../constants/myPostsContent'

export function categoryPillClass(category) {
  if (PRIMARY_CATEGORY_PILLS.has(category)) {
    return 'bg-primary-container/10 text-primary-container'
  }
  return 'bg-surface-container-high text-text-primary'
}

export function statusBadgeClass(status) {
  if (status === 'published') {
    return {
      wrap: 'bg-status-success/10 text-status-success',
      dot: 'bg-status-success',
    }
  }
  if (status === 'draft') {
    return {
      wrap: 'bg-status-warning/10 text-status-warning',
      dot: 'bg-status-warning',
    }
  }
  return {
    wrap: 'bg-status-error/10 text-status-error',
    dot: 'bg-status-error',
  }
}

export function countByStatus(posts) {
  const published = posts.filter((post) => post.status === 'published').length
  const draft = posts.filter((post) => post.status === 'draft').length

  return {
    all: posts.length,
    published,
    draft,
  }
}

export function filterMyPosts(posts, { status, search }) {
  const query = search.trim().toLowerCase()

  return posts.filter((post) => {
    if (status === MY_POSTS_STATUS_FILTER.PUBLISHED && post.status !== 'published') return false
    if (status === MY_POSTS_STATUS_FILTER.DRAFT && post.status !== 'draft') return false

    if (!query) return true

    const haystack = `${post.title || ''} ${post.excerpt || ''} ${post.category || ''}`.toLowerCase()
    return haystack.includes(query)
  })
}

export function sortMyPosts(posts, sort) {
  const next = [...posts]

  if (sort === MY_POSTS_SORT.TITLE) {
    return next.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
  }

  const direction = sort === MY_POSTS_SORT.OLDEST ? 1 : -1
  return next.sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime()
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime()
    return (aTime - bTime) * direction
  })
}

export function paginateMyPosts(posts, page, pageSize = MY_POSTS_PAGE_SIZE) {
  const total = posts.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1)
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const start = (safePage - 1) * pageSize
  const items = posts.slice(start, start + pageSize)
  const from = total === 0 ? 0 : start + 1
  const to = start + items.length

  return {
    items,
    page: safePage,
    totalPages,
    total,
    from,
    to,
  }
}
