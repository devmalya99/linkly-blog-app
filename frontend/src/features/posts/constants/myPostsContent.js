export const MY_POSTS_PAGE_SIZE = 6

export const MY_POSTS_STATUS_FILTER = {
  ALL: 'all',
  PUBLISHED: 'published',
  DRAFT: 'draft',
}

export const MY_POSTS_SORT = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  TITLE: 'title',
}

export const MY_POSTS_SORT_LABELS = {
  [MY_POSTS_SORT.NEWEST]: 'Newest first',
  [MY_POSTS_SORT.OLDEST]: 'Oldest first',
  [MY_POSTS_SORT.TITLE]: 'Title A–Z',
}

export const PRIMARY_CATEGORY_PILLS = new Set([
  'Engineering',
  'Architecture',
  'AI Interfaces',
])
