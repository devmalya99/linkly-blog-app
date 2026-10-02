import multer from 'multer'
import { AppError, HTTP_STATUS } from '../constants/errors.js'
import { COVER_UPLOAD } from '../constants/uploads.js'

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: {
    fileSize: COVER_UPLOAD.MAX_BYTES,
    files: 1,
  },
  fileFilter(req, file, cb) {
    if (!COVER_UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new AppError('Cover image must be JPEG, PNG, or WebP', HTTP_STATUS.UNPROCESSABLE))
      return
    }
    cb(null, true)
  },
})

export const coverImageUpload = upload.single(COVER_UPLOAD.FIELD_NAME)

export function handleMulterError(error, req, res, next) {
  if (!error) {
    next()
    return
  }

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      next(new AppError('Cover image must be 2 MB or smaller', HTTP_STATUS.UNPROCESSABLE))
      return
    }
    next(new AppError(error.message || 'Invalid upload', HTTP_STATUS.BAD_REQUEST))
    return
  }

  next(error)
}
