export const COVER_UPLOAD = {
  FIELD_NAME: 'cover',
  MAX_BYTES: 2 * 1024 * 1024,
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  S3_MAX_ATTEMPTS: 3,
  S3_RETRY_DELAY_MS: 400,
  MAX_WIDTH: 1920,
  TEMP_DIR: 'uploads/tmp',
  KEY_PREFIX: 'covers',
}

export const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}
