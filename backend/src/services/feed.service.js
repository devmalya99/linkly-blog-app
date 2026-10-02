import crypto from 'node:crypto'
import mongoose from 'mongoose'
import { FEED_LIMITS, FEED_TABS } from '../constants/feed.js'
import { POST_STATUS } from '../constants/posts.js'
import { Comment } from '../models/Comment.js'
import { Post } from '../models/Post.js'
import { followService } from './follow.service.js'
import { sanitizePost } from '../utils/sanitize.js'

const AUTHOR_SELECT = 'name email avatar role'

function buildPagination({ page, limit, total }) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit) || 1),
  }
}

function publishedFilter(extra = {}) {
  return {
    isDeleted: false,
    status: POST_STATUS.PUBLISHED,
    ...extra,
  }
}

/**
 * Deterministic score from seed + id so pagination stays stable within a session.
 */
function seededScore(seed, id) {
  return crypto.createHash('sha256').update(`${seed}:${id}`).digest('hex')
}

async function getForYouFeed({ page, limit, seed }) {
  const posts = await Post.find(publishedFilter()).select('_id').lean()
  const total = posts.length

  if (total === 0) {
    return {
      items: [],
      pagination: buildPagination({ page, limit, total: 0 }),
    }
  }

  const ranked = posts
    .map((post) => ({
      id: String(post._id),
      score: seededScore(seed, String(post._id)),
    }))
    .sort((a, b) => (a.score < b.score ? -1 : a.score > b.score ? 1 : 0))

  const skip = (page - 1) * limit
  const pageIds = ranked.slice(skip, skip + limit).map((row) => row.id)

  if (pageIds.length === 0) {
    return {
      items: [],
      pagination: buildPagination({ page, limit, total }),
    }
  }

  const docs = await Post.find({
    _id: { $in: pageIds.map((id) => new mongoose.Types.ObjectId(id)) },
  }).populate('author', AUTHOR_SELECT)

  const byId = new Map(docs.map((doc) => [String(doc._id), sanitizePost(doc)]))
  const items = pageIds.map((id) => byId.get(id)).filter(Boolean)

  return {
    items,
    pagination: buildPagination({ page, limit, total }),
  }
}

async function getTrendingFeed({ page, limit }) {
  const since = new Date(Date.now() - FEED_LIMITS.TRENDING_WINDOW_DAYS * 24 * 60 * 60 * 1000)
  const skip = (page - 1) * limit

  const [ranked, countResult] = await Promise.all([
    Comment.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$post', commentCount: { $sum: 1 } } },
      { $sort: { commentCount: -1, _id: 1 } },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: '_id',
          as: 'post',
        },
      },
      { $unwind: '$post' },
      {
        $match: {
          'post.isDeleted': false,
          'post.status': POST_STATUS.PUBLISHED,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]),
    Comment.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$post', commentCount: { $sum: 1 } } },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: '_id',
          as: 'post',
        },
      },
      { $unwind: '$post' },
      {
        $match: {
          'post.isDeleted': false,
          'post.status': POST_STATUS.PUBLISHED,
        },
      },
      { $count: 'total' },
    ]),
  ])

  const total = countResult[0]?.total ?? 0

  if (ranked.length === 0) {
    return {
      items: [],
      pagination: buildPagination({ page, limit, total }),
    }
  }

  await Post.populate(
    ranked.map((row) => row.post),
    {
      path: 'author',
      select: AUTHOR_SELECT,
    },
  )

  const items = ranked.map((row) => ({
    ...sanitizePost(row.post),
    commentCount: row.commentCount,
  }))

  return {
    items,
    pagination: buildPagination({ page, limit, total }),
  }
}

async function getFollowingFeed(user, { page, limit }) {
  const followingIds = await followService.getFollowingIds(user.id)

  if (followingIds.length === 0) {
    return {
      items: [],
      pagination: buildPagination({ page, limit, total: 0 }),
    }
  }

  const filter = publishedFilter({
    author: { $in: followingIds.map((id) => new mongoose.Types.ObjectId(id)) },
  })

  const skip = (page - 1) * limit
  const [docs, total] = await Promise.all([
    Post.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', AUTHOR_SELECT),
    Post.countDocuments(filter),
  ])

  return {
    items: docs.map(sanitizePost),
    pagination: buildPagination({ page, limit, total }),
  }
}

async function getCategoryFeed({ page, limit, category }) {
  const filter = publishedFilter({ category })
  const skip = (page - 1) * limit

  const [docs, total] = await Promise.all([
    Post.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', AUTHOR_SELECT),
    Post.countDocuments(filter),
  ])

  return {
    items: docs.map(sanitizePost),
    pagination: buildPagination({ page, limit, total }),
  }
}

export const feedService = {
  async getFeed(user, query = {}) {
    const { tab, page, limit, category, seed } = query

    switch (tab) {
      case FEED_TABS.FOR_YOU:
        return getForYouFeed({ page, limit, seed })
      case FEED_TABS.TRENDING:
        return getTrendingFeed({ page, limit })
      case FEED_TABS.FOLLOWING:
        return getFollowingFeed(user, { page, limit })
      case FEED_TABS.CATEGORY:
        return getCategoryFeed({ page, limit, category })
      default:
        return getForYouFeed({ page, limit, seed })
    }
  },
}
