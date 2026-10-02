export const ROUTES = {
  HOME: '/',
  FEED: '/feed',
  LOGIN: '/login',
  REGISTER: '/register',
  AUTH_CALLBACK: '/auth/callback',
  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_POSTS: '/admin/posts',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAIL: '/admin/users/:id',
  CREATE_POST: '/dashboard/create-post',
  MY_POSTS: '/myposts',
  EDIT_POST: '/myposts/:id/edit',
  PUBLIC_POSTS: '/posts',
  POST_DETAIL: '/posts/:id',
  SHARE_POST: '/share/posts/:id',
}

export function editPostPath(id) {
  return `/myposts/${id}/edit`
}

export function adminUserPath(id) {
  return `/admin/users/${id}`
}

/** In-app post detail path (owner/reader views). Share links use sharePostPath. */
export function postDetailPath(postOrId) {
  const id = postOrId && typeof postOrId === 'object' ? postOrId.id : postOrId
  return `/posts/${id}`
}

export function sharePostPath(postId) {
  return `/share/posts/${postId}`
}

export const PASSWORD_HINT =
  'Use 8+ characters with upper, lower, number, and special character.'
