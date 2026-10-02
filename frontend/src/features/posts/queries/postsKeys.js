export const postsKeys = {
  all: ['posts'],
  lists: () => [...postsKeys.all, 'list'],
  list: (params) => [...postsKeys.lists(), params],
  my: () => [...postsKeys.all, 'my'],
  myList: (params) => [...postsKeys.my(), params],
  recent: (limit) => [...postsKeys.all, 'recent', limit],
  recommended: (id) => [...postsKeys.all, 'recommended', id],
  detail: (id) => [...postsKeys.all, 'detail', id],
  shared: (id) => [...postsKeys.all, 'shared', id],
  bySlug: (slug) => [...postsKeys.all, 'slug', slug],
}
