export const ACCESS_TOKEN_COOKIE = 'inkly_access_token'
export const USER_COOKIE = 'inkly_user'

/** Matches backend JWT_ACCESS_EXPIRES_IN default (15m). */
export const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60

/** Keep user cookie for the refresh session window (7d). */
export const USER_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60
