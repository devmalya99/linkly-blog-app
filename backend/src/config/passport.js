import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { env } from './env.js'
import { AppError, HTTP_STATUS } from '../constants/errors.js'

// 📌 Authorises passport to use the Google and Facebook strategies.
export function configurePassport() {
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          callbackURL: env.GOOGLE_CALLBACK_URL,
        },
        (accessToken, refreshToken, profile, done) => {
          done(null, profile)
        },
      ),
    )
  }

  if (env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: env.FACEBOOK_CLIENT_ID,
          clientSecret: env.FACEBOOK_CLIENT_SECRET,
          callbackURL: env.FACEBOOK_CALLBACK_URL,
          profileFields: ['id', 'displayName', 'emails', 'photos'],
        },
        (accessToken, refreshToken, profile, done) => {
          done(null, profile)
        },
      ),
    )
  }

  return passport
}

// 📌 Starts the Google OAuth flow.
export function googleAuth(req, res, next) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return next(new AppError('Google OAuth is not configured', HTTP_STATUS.NOT_IMPLEMENTED))
  }

  return passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next)
}

//📌 authenticates the user and returns the user object.
export function googleCallback(req, res, next) {
  return passport.authenticate('google', { session: false }, (error, profile) => {
    if (error || !profile) {
      const redirectUrl = new URL('/login', env.FRONTEND_URL)
      redirectUrl.searchParams.set('error', 'google_auth_failed')
      return res.redirect(redirectUrl.toString())
    }

    req.user = profile
    return next()
  })(req, res, next)
}

export function facebookAuth(req, res, next) {
  if (!env.FACEBOOK_CLIENT_ID || !env.FACEBOOK_CLIENT_SECRET) {
    return next(new AppError('Facebook OAuth is not configured', HTTP_STATUS.NOT_IMPLEMENTED))
  }

  return passport.authenticate('facebook', { scope: ['email'], session: false })(req, res, next)
}

export function facebookCallback(req, res, next) {
  return passport.authenticate('facebook', { session: false }, (error, profile) => {
    if (error || !profile) {
      return next(error || new AppError('Facebook authentication failed', HTTP_STATUS.UNAUTHORIZED))
    }

    req.user = profile
    return next()
  })(req, res, next)
}
