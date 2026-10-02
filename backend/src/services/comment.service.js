import { AppError, HTTP_STATUS } from '../constants/errors.js'
import { COMMENT_LIMITS } from '../constants/comments.js'
import { POST_STATUS } from '../constants/posts.js'
import { ROLES } from '../constants/roles.js'
import { Comment } from '../models/Comment.js'
import { Post } from '../models/Post.js'
import { sanitizeComment, sanitizeRecentComment } from '../utils/sanitize.js'

const AUTHOR_SELECT = 'name email avatar role'

function buildPagination({ page, limit, total }) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}

function getPostAuthorId(post) {
  return String(post.author?._id ?? post.author)
}

function canDeleteComment(user, comment, post) {
  if (!user) return false
  if (user.role === ROLES.ADMIN) return true
  if (String(comment.author?._id ?? comment.author) === String(user.id)) return true
  if (getPostAuthorId(post) === String(user.id)) return true
  return false
}

async function findCommentablePost(postId) {
  const post = await Post.findById(postId).select('_id author status isDeleted')

  if (!post || post.isDeleted) {
    throw new AppError('Post not found', HTTP_STATUS.NOT_FOUND)
  }

  return post
}

export const commentService = {
  async getComments(postId, query = {}) {
    const post = await findCommentablePost(postId)
    const page = query.page ?? 1
    const limit = query.limit ?? COMMENT_LIMITS.LIST_DEFAULT
    const skip = (page - 1) * limit

    const filter = { post: post._id }
    const [items, total] = await Promise.all([
      Comment.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', AUTHOR_SELECT),
      Comment.countDocuments(filter),
    ])

    return {
      items: items.map(sanitizeComment),
      pagination: buildPagination({ page, limit, total }),
    }
  },

  async getRecentCommentsForAuthor(user, query = {}) {
    const limit = query.limit ?? COMMENT_LIMITS.RECENT_DEFAULT
    const postIds = await Post.find({
      author: user.id,
      isDeleted: false,
    }).distinct('_id')

    if (postIds.length === 0) {
      return {
        items: [],
        total: 0,
        newCount: 0,
      }
    }

    const since = new Date(
      Date.now() - COMMENT_LIMITS.NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000,
    )
    const filter = { post: { $in: postIds } }

    const [items, total, newCount] = await Promise.all([
      Comment.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('author', AUTHOR_SELECT)
        .populate('post', 'title'),
      Comment.countDocuments(filter),
      Comment.countDocuments({
        ...filter,
        createdAt: { $gte: since },
      }),
    ])

    return {
      items: items.map(sanitizeRecentComment),
      total,
      newCount,
    }
  },

  async createComment(user, postId, payload) {
    const post = await findCommentablePost(postId)

    if (post.status !== POST_STATUS.PUBLISHED) {
      throw new AppError('Comments are only allowed on published posts', HTTP_STATUS.BAD_REQUEST)
    }

    const comment = await Comment.create({
      content: payload.content,
      author: user.id,
      post: post._id,
    })

    await comment.populate('author', AUTHOR_SELECT)

    return sanitizeComment(comment)
  },

  async updateComment() {
    throw new AppError('updateComment is not implemented yet', HTTP_STATUS.NOT_IMPLEMENTED)
  },

  async deleteComment(user, commentId) {
    const comment = await Comment.findById(commentId)

    if (!comment) {
      throw new AppError('Comment not found', HTTP_STATUS.NOT_FOUND)
    }

    const post = await Post.findById(comment.post).select('_id author isDeleted')

    if (!post) {
      throw new AppError('Post not found', HTTP_STATUS.NOT_FOUND)
    }

    if (!canDeleteComment(user, comment, post)) {
      throw new AppError('You do not have permission to delete this comment', HTTP_STATUS.FORBIDDEN)
    }

    await comment.deleteOne()
  },
}
