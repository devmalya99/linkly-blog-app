export const ADMIN_ROLE = 'admin'
export const USER_ROLE = 'user'

export const ADMIN_POSTS_PAGE_SIZE = 5
export const ADMIN_USERS_PAGE_SIZE = 5

export const ADMIN_STATUS_FILTER = {
  ALL: 'all',
  PUBLISHED: 'published',
  DRAFT: 'draft',
}

export const ADMIN_DELETED_FILTER = {
  ALL: 'all',
  ACTIVE: 'false',
  DELETED: 'true',
}

export const ADMIN_DELETED_FILTER_LABELS = {
  [ADMIN_DELETED_FILTER.ALL]: 'All visibility',
  [ADMIN_DELETED_FILTER.ACTIVE]: 'Active only',
  [ADMIN_DELETED_FILTER.DELETED]: 'Deleted only',
}

export const ADMIN_USER_ROLE_FILTER = {
  ALL: 'all',
  USER: 'user',
  ADMIN: 'admin',
}

export const ADMIN_USER_ROLE_FILTER_LABELS = {
  [ADMIN_USER_ROLE_FILTER.ALL]: 'All roles',
  [ADMIN_USER_ROLE_FILTER.USER]: 'Users',
  [ADMIN_USER_ROLE_FILTER.ADMIN]: 'Admins',
}

export const ADMIN_USER_SORT = {
  JOINED_NEWEST: 'joinedNewest',
  JOINED_OLDEST: 'joinedOldest',
}

export const ADMIN_USER_SORT_LABELS = {
  [ADMIN_USER_SORT.JOINED_NEWEST]: 'Joined newest',
  [ADMIN_USER_SORT.JOINED_OLDEST]: 'Joined earliest',
}

export const ADMIN_USER_POSTS_TAB = {
  ALL: 'all',
  PUBLISHED: 'published',
  DRAFT: 'draft',
  DELETED: 'deleted',
}

export const ADMIN_USER_POSTS_TAB_LABELS = {
  [ADMIN_USER_POSTS_TAB.ALL]: 'All',
  [ADMIN_USER_POSTS_TAB.PUBLISHED]: 'Published',
  [ADMIN_USER_POSTS_TAB.DRAFT]: 'Drafts',
  [ADMIN_USER_POSTS_TAB.DELETED]: 'Deleted',
}
