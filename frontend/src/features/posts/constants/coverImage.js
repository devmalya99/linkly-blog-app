export const COVER_UPLOAD = {
  MAX_BYTES: 2 * 1024 * 1024,
  ACCEPT: 'image/jpeg,image/png,image/webp',
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
}

export const COVER_UPLOAD_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
}

export function validateCoverFile(file) {
  if (!file) return 'Choose an image file.'
  if (!COVER_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
    return 'Cover image must be JPEG, PNG, or WebP.'
  }
  if (file.size > COVER_UPLOAD.MAX_BYTES) {
    return 'Cover image must be 2 MB or smaller.'
  }
  return ''
}
