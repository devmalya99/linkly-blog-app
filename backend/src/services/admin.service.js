import { AppError, HTTP_STATUS } from '../constants/errors.js'
import { ACTIVITY_ACTIONS, ACTIVITY_RESOURCES } from '../constants/activity.js'
import { POST_LIMITS, POST_STATUS } from '../constants/posts.js'
import { ROLES } from '../constants/roles.js'
import { Comment } from '../models/Comment.js'
import { Post } from '../models/Post.js'
import { User } from '../models/User.js'
import { logActivity } from '../utils/activityLog.js'
import { sanitizeAdminPost, sanitizeAdminUser } from '../utils/sanitize.js'
import { ADMIN_USER_SORT } from '../validators/admin.validator.js'

const AUTHOR_SELECT = 'name email avatar role'

function pending(action) {
  throw new AppError(`${action} is not implemented yet`, HTTP_STATUS.NOT_IMPLEMENTED)
}

function percent(part, whole) {
  if (!whole) return 0
  return Math.round((part / whole) * 100)
}

function buildPagination({ page, limit, total }) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildUserMatch({ search, role }) {
  const match = {}

  if (role) {
    match.role = role
  }

  if (search) {
    const pattern = escapeRegex(search)
    match.$or = [
      { name: { $regex: pattern, $options: 'i' } },
      { email: { $regex: pattern, $options: 'i' } },
    ]
  }

  return match
}

async function countNonDeletedPosts(userId) {
  return Post.countDocuments({ author: userId, isDeleted: false })
}

async function countAdmins() {
  return User.countDocuments({ role: ROLES.ADMIN })
}

async function softDeleteUserPosts(userId) {
  const posts = await Post.find({ author: userId, isDeleted: false })

  if (posts.length === 0) return 0

  const now = new Date()
  await Promise.all(
    posts.map(async (post) => {
      post.isDeleted = true
      post.deletedAt = now
      post.slug = `${post.slug}-deleted-${post._id}`.slice(0, POST_LIMITS.SLUG_MAX)
      await post.save()
    }),
  )

  return posts.length
}

export const adminService = {
  async getDashboard() {
    const [
      users,
      deletedCount,
      publishedActive,
      draftActive,
      comments,
      recentDocs,
    ] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments({ isDeleted: true }),
      Post.countDocuments({ isDeleted: false, status: POST_STATUS.PUBLISHED }),
      Post.countDocuments({ isDeleted: false, status: POST_STATUS.DRAFT }),
      Comment.countDocuments(),
      Post.find()
        .sort({ createdAt: -1 })
        .limit(POST_LIMITS.RECENT_DEFAULT)
        .populate('author', AUTHOR_SELECT),
    ])

    const activeTotal = publishedActive + draftActive
    const total = publishedActive + draftActive + deletedCount

    return {
      counts: {
        users,
        posts: total,
        comments,
      },
      contentRatio: {
        published: publishedActive,
        draft: draftActive,
        publishedPercent: percent(publishedActive, activeTotal),
        draftPercent: percent(draftActive, activeTotal),
      },
      distribution: {
        total,
        published: {
          count: publishedActive,
          percent: percent(publishedActive, total),
        },
        draft: {
          count: draftActive,
          percent: percent(draftActive, total),
        },
        deleted: {
          count: deletedCount,
          percent: percent(deletedCount, total),
        },
      },
      recentPosts: recentDocs.map(sanitizeAdminPost),
    }
  },

  async listUsers(query = {}) {
    const { page, limit, search, role, sort = ADMIN_USER_SORT.JOINED_NEWEST } = query
    const skip = (page - 1) * limit
    const sortDir = sort === ADMIN_USER_SORT.JOINED_OLDEST ? 1 : -1
    const match = buildUserMatch({ search, role })

    const [result] = await User.aggregate([
      { $match: match },
      {
        $facet: {
          items: [
            { $sort: { createdAt: sortDir } },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: 'posts',
                let: { userId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$author', '$$userId'] },
                          { $eq: ['$isDeleted', false] },
                        ],
                      },
                    },
                  },
                  { $count: 'count' },
                ],
                as: 'postStats',
              },
            },
            {
              $addFields: {
                postCount: { $ifNull: [{ $arrayElemAt: ['$postStats.count', 0] }, 0] },
              },
            },
            {
              $project: {
                name: 1,
                email: 1,
                role: 1,
                avatar: 1,
                createdAt: 1,
                postCount: 1,
              },
            },
          ],
          total: [{ $count: 'count' }],
        },
      },
    ])

    const items = (result?.items ?? []).map((user) =>
      sanitizeAdminUser(user, { postCount: user.postCount ?? 0 }),
    )
    const total = result?.total?.[0]?.count ?? 0

    return {
      items,
      pagination: buildPagination({ page, limit, total }),
    }
  },

  async getUser(id) {
    const user = await User.findById(id).select('name email avatar role createdAt')

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    }

    const postCount = await countNonDeletedPosts(user._id)
    return sanitizeAdminUser(user, { postCount })
  },

  async updateUser(actor, id, payload = {}) {
    if (String(actor.id) === String(id) && payload.role !== undefined) {
      throw new AppError('You cannot change your own role', HTTP_STATUS.FORBIDDEN)
    }

    const user = await User.findById(id)

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    }

    if (
      payload.role === ROLES.USER &&
      user.role === ROLES.ADMIN &&
      (await countAdmins()) <= 1
    ) {
      throw new AppError('Cannot demote the last remaining admin', HTTP_STATUS.FORBIDDEN)
    }

    if (payload.name !== undefined) {
      user.name = payload.name
    }

    if (payload.role !== undefined) {
      user.role = payload.role
    }

    await user.save()

    const postCount = await countNonDeletedPosts(user._id)
    return sanitizeAdminUser(user, { postCount })
  },

  async deleteUser(actor, id, context = {}) {
    if (String(actor.id) === String(id)) {
      throw new AppError('You cannot delete your own account', HTTP_STATUS.FORBIDDEN)
    }

    const user = await User.findById(id)

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    }

    if (user.role === ROLES.ADMIN && (await countAdmins()) <= 1) {
      throw new AppError('Cannot delete the last remaining admin', HTTP_STATUS.FORBIDDEN)
    }

    const deletedPosts = await softDeleteUserPosts(user._id)
    await Comment.deleteMany({ author: user._id })
    await User.findByIdAndDelete(user._id)

    await logActivity({
      userId: actor.id,
      action: ACTIVITY_ACTIONS.DELETE_USER,
      resourceType: ACTIVITY_RESOURCES.USER,
      resourceId: id,
      metadata: {
        email: user.email,
        role: user.role,
        deletedPosts,
        admin: true,
      },
      ipAddress: context.ipAddress,
    })
  },

  async listPosts(query = {}) {
    const { page, limit, status, author, deleted } = query
    const filter = {}

    if (author) {
      filter.author = author
    }

    if (deleted === true) {
      filter.isDeleted = true
    } else if (deleted === false) {
      filter.isDeleted = false
    }

    if (status) {
      filter.status = status
      // Soft-deleted posts keep their old status. Status tabs should only count
      // active posts unless the admin explicitly chose "Deleted only".
      if (deleted !== true) {
        filter.isDeleted = false
      }
    }

    const skip = (page - 1) * limit
    const [items, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', AUTHOR_SELECT),
      Post.countDocuments(filter),
    ])

    return {
      items: items.map(sanitizeAdminPost),
      pagination: buildPagination({ page, limit, total }),
    }
  },

  updatePost() {
    pending('updatePost')
  },

  async deletePost(user, id, context = {}) {
    const post = await Post.findOne({ _id: id, isDeleted: false }).populate('author', AUTHOR_SELECT)

    if (!post) {
      throw new AppError('Post not found', HTTP_STATUS.NOT_FOUND)
    }

    post.isDeleted = true
    post.deletedAt = new Date()
    post.slug = `${post.slug}-deleted-${post._id}`.slice(0, POST_LIMITS.SLUG_MAX)
    await post.save()

    await logActivity({
      userId: user.id,
      action: ACTIVITY_ACTIONS.DELETE_POST,
      resourceType: ACTIVITY_RESOURCES.POST,
      resourceId: post._id,
      metadata: { slug: post.slug, admin: true },
      ipAddress: context.ipAddress,
    })
  },

  listComments() {
    pending('listComments')
  },

  updateComment() {
    pending('updateComment')
  },

  deleteComment() {
    pending('deleteComment')
  },
}
