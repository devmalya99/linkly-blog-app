export const feedKeys = {
  all: ['feed'],
  lists: () => [...feedKeys.all, 'list'],
  list: (params) => [...feedKeys.lists(), params],
}

export const followKeys = {
  all: ['follows'],
  me: () => [...followKeys.all, 'me'],
  suggestions: (params = {}) => [...followKeys.all, 'suggestions', params],
}
