export const adminKeys = {
  all: ['admin'],
  dashboard: () => [...adminKeys.all, 'dashboard'],
  posts: () => [...adminKeys.all, 'posts'],
  postsList: (params) => [...adminKeys.posts(), params],
  users: () => [...adminKeys.all, 'users'],
  usersList: (params) => [...adminKeys.users(), 'list', params],
  userDetail: (id) => [...adminKeys.users(), 'detail', id],
}
