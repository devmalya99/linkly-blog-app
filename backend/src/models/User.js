import mongoose from 'mongoose'
import { ROLES } from '../constants/roles.js'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    avatar: { type: String, default: '' },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
  },
  { timestamps: true },
)

// Admin author dropdown / user list: sort by name
userSchema.index({ name: 1 })

export const User = mongoose.model('User', userSchema)
