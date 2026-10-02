import { SOCKET_EVENTS } from '../socket/events.js'
import { getIO } from '../socket/io.js'
import { sanitizeUser } from '../utils/sanitize.js'

function buildCommentToastPayload({ postId, commentId, postTitle, actor }) {
  const from =
    actor && typeof actor === 'object'
      ? sanitizeUser(actor)
      : { id: String(actor ?? ''), name: 'Someone', avatar: '', role: 'user' }

  const title = postTitle ?? ''
  const fromName = from.name || 'Someone'

  return {
    type: 'comment',
    post: { id: String(postId), title },
    comment: { id: String(commentId) },
    from,
    message: `${fromName} commented on your post "${title}"`,
    createdAt: new Date().toISOString(),
  }
}

export const notificationService = {
  notifyPostComment({ recipientId, actorId, postId, commentId, postTitle, actor }) {
    if (String(recipientId) === String(actorId)) {
      return null
    }

    const payload = buildCommentToastPayload({ postId, commentId, postTitle, actor })
    getIO()?.to(`user:${String(recipientId)}`).emit(SOCKET_EVENTS.COMMENT, payload)
    return payload
  },
}
