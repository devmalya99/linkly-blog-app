import { AppError, HTTP_STATUS } from '../constants/errors.js'
import { ACTIVITY_ACTIONS, ACTIVITY_RESOURCES } from '../constants/activity.js'
import { ROLES } from '../constants/roles.js'
import { User } from '../models/User.js'
import { RefreshToken } from '../models/RefreshToken.js'
import { logActivity } from '../utils/activityLog.js'
import { hashToken, parseDurationToMs } from '../utils/cookies.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js'
import { comparePassword, hashPassword } from '../utils/password.js'
import { sanitizeUser } from '../utils/sanitize.js'
import { env } from '../config/env.js'

async function createRefreshSession(user) {
  const expiresAt = new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN))
  const record = await RefreshToken.create({
    userId: user._id,
    tokenHash: 'pending',
    expiresAt,
  })

  const refreshToken = signRefreshToken(user, record._id)
  record.tokenHash = hashToken(refreshToken)
  await record.save()

  return refreshToken
}

async function findValidRefreshSession(rawToken) {
  let payload

  try {
    payload = verifyRefreshToken(rawToken)
  } catch {
    throw new AppError('Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED)
  }

  const session = await RefreshToken.findById(payload.jti)

  if (!session || session.revokedAt || session.expiresAt.getTime() <= Date.now()) {
    throw new AppError('Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED)
  }

  if (session.tokenHash !== hashToken(rawToken)) {
    throw new AppError('Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED)
  }

  if (String(session.userId) !== String(payload.sub)) {
    throw new AppError('Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED)
  }

  return { payload, session }
}

export const authService = {
  async register({ name, email, password }, context = {}) {
    const existing = await User.findOne({ email: email.toLowerCase() })

    if (existing) {
      throw new AppError('Email is already registered', HTTP_STATUS.CONFLICT)
    }

    const passwordHash = await hashPassword(password)
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: ROLES.USER,
    })

    await logActivity({
      userId: user._id,
      action: ACTIVITY_ACTIONS.REGISTER,
      resourceType: ACTIVITY_RESOURCES.USER,
      resourceId: user._id,
      ipAddress: context.ipAddress,
    })

    return sanitizeUser(user)
  },

  async login({ email, password }, context = {}) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash')

    if (!user || !user.passwordHash) {
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED)
    }

    const matches = await comparePassword(password, user.passwordHash)

    if (!matches) {
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED)
    }

    const accessToken = signAccessToken(user)
    const refreshToken = await createRefreshSession(user)

    await logActivity({
      userId: user._id,
      action: ACTIVITY_ACTIONS.LOGIN,
      resourceType: ACTIVITY_RESOURCES.AUTH,
      resourceId: user._id,
      ipAddress: context.ipAddress,
    })

    return {
      accessToken,
      refreshToken,
      user: sanitizeUser(user),
    }
  },

  async logout({ user, refreshToken }, context = {}) {
    if (refreshToken) {
      try {
        const { session } = await findValidRefreshSession(refreshToken)
        session.revokedAt = new Date()
        await session.save()
      } catch {
        // Logout stays idempotent if the cookie is already invalid.
      }
    }

    await logActivity({
      userId: user.id,
      action: ACTIVITY_ACTIONS.LOGOUT,
      resourceType: ACTIVITY_RESOURCES.AUTH,
      resourceId: user.id,
      ipAddress: context.ipAddress,
    })

    return null
  },

  async refresh(rawRefreshToken) {
    if (!rawRefreshToken) {
      throw new AppError('Refresh token required', HTTP_STATUS.UNAUTHORIZED)
    }

    const { payload, session } = await findValidRefreshSession(rawRefreshToken)
    const user = await User.findById(payload.sub)

    if (!user) {
      session.revokedAt = new Date()
      await session.save()
      throw new AppError('Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED)
    }

    return {
      accessToken: signAccessToken(user),
      user: sanitizeUser(user),
    }
  },

  async getCurrentUser(authUser) {
    const user = await User.findById(authUser.id)

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND)
    }

    return sanitizeUser(user)
  },

  async handleGoogleLogin(profile, context = {}) {
    
    // 📌 pull the fields from google profile
    const googleId = profile?.id
    const email = profile?.emails?.[0]?.value?.toLowerCase()?.trim()
    const name = profile?.displayName?.trim() || email?.split('@')[0] || 'Inkly User'
    const avatar = profile?.photos?.[0]?.value || ''

    if (!googleId || !email) {
      throw new AppError('Google account did not provide required profile data', HTTP_STATUS.BAD_REQUEST)
    }
    // 📌 find the user by googleId
    let user = await User.findOne({ googleId })

    if (!user) {
      // 📌 find the user by email
      user = await User.findOne({ email })

      if (user) {
        if (user.googleId && user.googleId !== googleId) {
          throw new AppError('This email is already linked to another Google account', HTTP_STATUS.CONFLICT)
        }
        // 📌 if the user already exists, update the googleId and avatar
        user.googleId = googleId
        if (!user.avatar && avatar) {
          user.avatar = avatar
        }
        await user.save()
      } else {
        user = await User.create({
          name,
          email,
          googleId,
          avatar,
          role: ROLES.USER,
        })
      }
    } else if (avatar && user.avatar !== avatar) {
      user.avatar = avatar
      await user.save()
    }

    const accessToken = signAccessToken(user)
    const refreshToken = await createRefreshSession(user)

    await logActivity({
      userId: user._id,
      action: ACTIVITY_ACTIONS.LOGIN,
      resourceType: ACTIVITY_RESOURCES.AUTH,
      resourceId: user._id,
      metadata: { provider: 'google' },
      ipAddress: context.ipAddress,
    })

    return {
      accessToken,
      refreshToken,
      user: sanitizeUser(user),
    }
  },

  handleFacebookLogin() {
    throw new AppError('Facebook login is not implemented yet', HTTP_STATUS.NOT_IMPLEMENTED)
  },
}
