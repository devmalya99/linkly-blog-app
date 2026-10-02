import mongoose from 'mongoose'
import { AppError, HTTP_STATUS } from '../constants/errors.js'
import { ACTIVITY_ACTIONS, ACTIVITY_RESOURCES } from '../constants/activity.js'
import { POST_LIMITS, POST_STATUS } from '../constants/posts.js'
import { ROLES } from '../constants/roles.js'
import { Post } from '../models/Post.js'
import { logActivity } from '../utils/activityLog.js'
import { sanitizePost, sanitizeSharedPost } from '../utils/sanitize.js'
import { generateSlug } from '../utils/slug.js'
import { deleteObjectByUrl } from './s3.service.js'

const AUTHOR_SELECT = 'name email avatar role'

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function toObjectIds(ids) {
  return ids.map((id) => new mongoose.Types.ObjectId(String(id)))
}

/**
 * Randomly sample published posts matching `filter`, excluding given ids.
 */
async function samplePosts(filter, limit, excludeIds = []) {
  if (limit <= 0) return []

  const excludeObjectIds = toObjectIds(excludeIds)
  const match = {
    ...filter,
    ...(excludeObjectIds.length > 0 ? { _id: { $nin: excludeObjectIds } } : {}),
  }

  const docs = await Post.aggregate([{ $match: match }, { $sample: { size: limit } }])

  if (docs.length === 0) return []

  await Post.populate(docs, { path: 'author', select: AUTHOR_SELECT })
  return docs.map(sanitizePost)
}

function buildTagOverlapClause(tags) {
  const pattern = tags.map(escapeRegex).join('|')
  return {
    tags: { $elemMatch: { $regex: new RegExp(`^(?:${pattern})$`, 'i') } },
  }
}

function normalizeTags(tags = []) {
  const seen = new Set()
  const normalized = []

  for (const tag of tags) {
    const value = String(tag).trim().replace(/\s+/g, ' ')
    const key = value.toLowerCase()

    if (!value || seen.has(key)) {
      continue
    }

    seen.add(key)
    normalized.push(value)
  }

  return normalized.slice(0, POST_LIMITS.TAGS_MAX)
}

async function buildUniqueSlug(preferredSlug, title, excludeId) {
  const base = preferredSlug || generateSlug(title)
  let candidate = base.slice(0, POST_LIMITS.SLUG_MAX)
  let count = 1

  while (true) {
    const existing = await Post.exists({
      slug: candidate,
      isDeleted: false,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })

    if (!existing) {
      return candidate
    }

    count += 1
    const suffix = `-${count}`
    const maxBaseLength = POST_LIMITS.SLUG_MAX - suffix.length
    candidate = `${base.slice(0, maxBaseLength)}${suffix}`
  }
}

function buildPagination({ page, limit, total }) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}

async function paginatePosts(filter, { page, limit }, sort = { createdAt: -1 }) {
  const skip = (page - 1) * limit
  const [items, total] = await Promise.all([
    Post.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('author', AUTHOR_SELECT),
    Post.countDocuments(filter),
  ])

  return {
    items: items.map(sanitizePost),
    pagination: buildPagination({ page, limit, total }),
  }
}

function isPostOwnerOrAdmin(user, post) {
  if (!user) return false
  if (user.role === ROLES.ADMIN) return true
  return String(post.author._id ?? post.author) === String(user.id)
}

async function findActivePostById(id) {
  const post = await Post.findOne({ _id: id, isDeleted: false }).populate('author', AUTHOR_SELECT)

  if (!post) {
    throw new AppError('Post not found', HTTP_STATUS.NOT_FOUND)
  }

  return post
}

function assertCanManagePost(user, post) {
  if (!isPostOwnerOrAdmin(user, post)) {
    throw new AppError('You do not have permission to modify this post', HTTP_STATUS.FORBIDDEN)
  }
}

function assertCanViewPost(user, post) {
  if (post.status === POST_STATUS.PUBLISHED) {
    return
  }

  if (!isPostOwnerOrAdmin(user, post)) {
    throw new AppError('Post not found', HTTP_STATUS.NOT_FOUND)
  }
}

export const postService = {
  async createPost(user, payload, context = {}) {
    const status = payload.status ?? POST_STATUS.DRAFT
    const tags = normalizeTags(payload.tags)
    const slug = await buildUniqueSlug(payload.slug, payload.title)

    const post = await Post.create({
      title: payload.title,
      slug,
      content: payload.content ?? '',
      excerpt: payload.excerpt ?? '',
      category: payload.category,
      tags,
      status,
      coverImage: payload.coverImage ?? null,
      author: user.id,
      publishedAt: status === POST_STATUS.PUBLISHED ? new Date() : null,
    })

    await post.populate('author', AUTHOR_SELECT)

    await logActivity({
      userId: user.id,
      action: ACTIVITY_ACTIONS.CREATE_POST,
      resourceType: ACTIVITY_RESOURCES.POST,
      resourceId: post._id,
      metadata: { status: post.status, slug: post.slug },
      ipAddress: context.ipAddress,
    })

    return sanitizePost(post)
  },

  async getPosts(query = {}) {
    const { page, limit, category } = query
    const filter = {
      isDeleted: false,
      status: POST_STATUS.PUBLISHED,
    }

    if (category) {
      filter.category = category
    }

    return paginatePosts(filter, { page, limit }, { publishedAt: -1, createdAt: -1 })
  },

  async getRecentPosts(query = {}) {
    const limit = query.limit ?? POST_LIMITS.RECENT_DEFAULT
    const posts = await Post.find({
      isDeleted: false,
      status: POST_STATUS.PUBLISHED,
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .populate('author', AUTHOR_SELECT)

    return posts.map(sanitizePost)
  },

  async getRecommendedPosts(id) {
    const source = await findActivePostById(id)
    const limit = POST_LIMITS.RECOMMENDED
    const sourceId = String(source._id)
    const selected = []
    const excludeIds = [sourceId]

    const baseFilter = {
      isDeleted: false,
      status: POST_STATUS.PUBLISHED,
    }

    async function fill(filter) {
      const needed = limit - selected.length
      if (needed <= 0) return

      const sampled = await samplePosts(filter, needed, excludeIds)
      for (const post of sampled) {
        selected.push(post)
        excludeIds.push(post.id)
      }
    }

    const tags = Array.isArray(source.tags) ? source.tags.filter(Boolean) : []

    if (tags.length > 0) {
      await fill({
        ...baseFilter,
        category: source.category,
        ...buildTagOverlapClause(tags),
      })
    }

    await fill({
      ...baseFilter,
      category: source.category,
    })

    const title = String(source.title ?? '').trim()
    if (title) {
      const titlePattern = new RegExp(escapeRegex(title), 'i')
      await fill({
        ...baseFilter,
        $or: [{ title: titlePattern }, { content: titlePattern }],
      })
    }

    await fill(baseFilter)

    return selected
  },

  async getMyPosts(user, query = {}) {
    const { page, limit, category, status } = query
    const filter = {
      isDeleted: false,
      author: user.id,
    }

    if (category) {
      filter.category = category
    }

    if (status) {
      filter.status = status
    }

    return paginatePosts(filter, { page, limit })
  },

  async getPostById(id, user) {
    const post = await findActivePostById(id)
    assertCanViewPost(user, post)
    return sanitizePost(post)
  },

  async getSharedPostById(id) {
    const post = await Post.findOne({ _id: id, isDeleted: false }).populate('author', 'name')

    if (!post) {
      throw new AppError('Post not found', HTTP_STATUS.NOT_FOUND)
    }

    return sanitizeSharedPost(post)
  },

  async getPostBySlug(slug, user) {
    const post = await Post.findOne({ slug, isDeleted: false }).populate('author', AUTHOR_SELECT)

    if (!post) {
      throw new AppError('Post not found', HTTP_STATUS.NOT_FOUND)
    }

    assertCanViewPost(user, post)
    return sanitizePost(post)
  },

  async updatePost(user, id, payload, context = {}) {
    const post = await findActivePostById(id)
    assertCanManagePost(user, post)

    const nextStatus = payload.status ?? post.status
    const nextContent = payload.content !== undefined ? payload.content : post.content

    if (nextStatus === POST_STATUS.PUBLISHED && !String(nextContent).trim()) {
      throw new AppError('Content is required to publish a post', HTTP_STATUS.UNPROCESSABLE)
    }

    if (payload.title !== undefined) {
      post.title = payload.title
    }

    if (payload.content !== undefined) {
      post.content = payload.content
    }

    if (payload.category !== undefined) {
      post.category = payload.category
    }

    if (payload.tags !== undefined) {
      post.tags = normalizeTags(payload.tags)
    }

    if (payload.excerpt !== undefined) {
      post.excerpt = payload.excerpt
    }

    if (payload.coverImage !== undefined) {
      const previousCover = post.coverImage
      post.coverImage = payload.coverImage

      if (previousCover && previousCover !== payload.coverImage) {
        await deleteObjectByUrl(previousCover)
      }
    }

    if (payload.slug !== undefined) {
      const requestedSlug = String(payload.slug).trim()
      if (!requestedSlug) {
        throw new AppError('Slug cannot be empty', HTTP_STATUS.UNPROCESSABLE)
      }
      // Replaces the previous slug in place — old slug URLs stop resolving.
      post.slug = await buildUniqueSlug(requestedSlug, post.title, post._id)
    } else if (payload.title !== undefined) {
      post.slug = await buildUniqueSlug(post.slug, post.title, post._id)
    }

    if (payload.status !== undefined) {
      post.status = payload.status

      if (payload.status === POST_STATUS.PUBLISHED && !post.publishedAt) {
        post.publishedAt = new Date()
      }

      if (payload.status === POST_STATUS.DRAFT) {
        post.publishedAt = null
      }
    }

    await post.save()
    await post.populate('author', AUTHOR_SELECT)

    await logActivity({
      userId: user.id,
      action: ACTIVITY_ACTIONS.UPDATE_POST,
      resourceType: ACTIVITY_RESOURCES.POST,
      resourceId: post._id,
      metadata: { status: post.status, slug: post.slug },
      ipAddress: context.ipAddress,
    })

    return sanitizePost(post)
  },

  async softDeletePost(user, id, context = {}) {
    const post = await findActivePostById(id)
    assertCanManagePost(user, post)

    const coverImage = post.coverImage

    post.isDeleted = true
    post.deletedAt = new Date()
    // Free the public slug so a new post can reuse it after soft-delete.
    post.slug = `${post.slug}-deleted-${post._id}`.slice(0, POST_LIMITS.SLUG_MAX)
    post.coverImage = null
    await post.save()

    if (coverImage) {
      await deleteObjectByUrl(coverImage)
    }

    await logActivity({
      userId: user.id,
      action: ACTIVITY_ACTIONS.DELETE_POST,
      resourceType: ACTIVITY_RESOURCES.POST,
      resourceId: post._id,
      metadata: { slug: post.slug },
      ipAddress: context.ipAddress,
    })
  },
}
