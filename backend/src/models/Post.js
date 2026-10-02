import mongoose from 'mongoose'
import { POST_CATEGORIES, POST_STATUS } from '../constants/posts.js'

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, index: true, maxlength: 80 },
    content: { type: String, default: '' },
    excerpt: { type: String, default: '', trim: true, maxlength: 160 },
    category: {
      type: String,
      required: true,
      enum: POST_CATEGORIES,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length <= 5
        },
        message: 'A post can have at most 5 tags',
      },
    },
    status: {
      type: String,
      enum: Object.values(POST_STATUS),
      default: POST_STATUS.DRAFT,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverImage: { type: String, default: null, maxlength: 500 },
    publishedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

// Admin dashboard counts + list filters: equality(isDeleted, status) → sort(createdAt)
postSchema.index({ isDeleted: 1, status: 1, createdAt: -1 })

// Admin / author lists: equality(author, isDeleted) → sort(createdAt)
postSchema.index({ author: 1, isDeleted: 1, createdAt: -1 })

// Admin All Posts with author + status (+ isDeleted when provided)
postSchema.index({ author: 1, status: 1, isDeleted: 1, createdAt: -1 })

// Admin status-only filter → sort(createdAt)
postSchema.index({ status: 1, createdAt: -1 })

// Soft-delete visibility filter without status → sort(createdAt)
postSchema.index({ isDeleted: 1, createdAt: -1 })

// Unfiltered admin recent / All Posts default sort
postSchema.index({ createdAt: -1 })

// Public feed: equality(isDeleted, status) → sort(publishedAt, createdAt)
postSchema.index({ isDeleted: 1, status: 1, publishedAt: -1, createdAt: -1 })

export const Post = mongoose.model('Post', postSchema)
