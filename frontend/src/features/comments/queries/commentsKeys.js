export const commentsKeys = {
  all: ['comments'],
  lists: () => [...commentsKeys.all, 'list'],
  list: (postId, params) => [...commentsKeys.lists(), postId, params],
  recent: (params) => [...commentsKeys.all, 'recent', params],
}
