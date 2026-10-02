import mongoose from 'mongoose'
import { AppError, HTTP_STATUS } from '../constants/errors.js'
import { FOLLOW_LIMITS } from '../constants/follows.js'
import { POST_STATUS } from '../constants/posts.js'
import { Follow } from '../models/Follow.js'
import { Post } from '../models/Post.js'
import { User } from '../models/User.js'
import { sanitizeUser } from '../utils/sanitize.js'

const AUTHOR_SELECT = 'name email avatar role'

function toObjectId(id) {
  return new mongoose.Types.ObjectId(String(id))
}

export const followService = {
  async followUser(follower, targetUserId) {
    if (String(follower.id) === String(targetUserId)) {
      throw new AppError('You cannot follow yourself', HTTP_STATUS.BAD_REQUEST)
    }

    const target = await User.findById(targetUserId).select(AUTHOR_SELECT)
    if (!target) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    }

    try {
      await Follow.create({
        follower: follower.id,
        following: targetUserId,
      })
    } catch (error) {
      if (error?.code === 11000) {
        throw new AppError('You already follow this author', HTTP_STATUS.CONFLICT)
      }
      throw error
    }

    return sanitizeUser(target)
  },

  async unfollowUser(follower, targetUserId) {
    const result = await Follow.findOneAndDelete({
      follower: follower.id,
      following: targetUserId,
    })

    if (!result) {
      throw new AppError('Follow relationship not found', HTTP_STATUS.NOT_FOUND)
    }

    return null
  },

  async listMyFollows(follower) {
    const follows = await Follow.find({ follower: follower.id })
      .sort({ createdAt: -1 })
      .populate('following', AUTHOR_SELECT)

    return follows
      .map((follow) => follow.following)
      .filter(Boolean)
      .map(sanitizeUser)
  },

  async getFollowingIds(followerId) {
    const follows = await Follow.find({ follower: followerId }).select('following').lean()
    return follows.map((follow) => String(follow.following))
  },

  async getSuggestions(follower, query = {}) {
    const limit = query.limit ?? FOLLOW_LIMITS.SUGGESTIONS_DEFAULT
    const followerId = toObjectId(follower.id)

    const alreadyFollowing = await Follow.find({ follower: followerId }).select('following').lean()
    const excludeIds = [
      followerId,
      ...alreadyFollowing.map((follow) => toObjectId(follow.following)),
    ]

    const publishedAuthors = await Post.aggregate([
      {
        $match: {
          isDeleted: false,
          status: POST_STATUS.PUBLISHED,
          author: { $nin: excludeIds },
        },
      },
      { $group: { _id: '$author' } },
      { $sample: { size: limit } },
    ])

    if (publishedAuthors.length === 0) {
      return []
    }

    const authorIds = publishedAuthors.map((row) => row._id)
    const users = await User.find({ _id: { $in: authorIds } }).select(AUTHOR_SELECT)

    const byId = new Map(users.map((user) => [String(user._id), sanitizeUser(user)]))
    return authorIds.map((id) => byId.get(String(id))).filter(Boolean)
  },
}
