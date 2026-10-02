import { postDetailPath } from '../../../utils/constants'

export function notificationPostPath(notification) {
  const postId = notification?.post?.id
  if (!postId) return null
  return `${postDetailPath(postId)}#comments`
}
