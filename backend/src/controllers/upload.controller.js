import { HTTP_STATUS } from '../constants/errors.js'
import { coverUploadService } from '../services/coverUpload.service.js'
import { sendSuccess } from '../utils/response.js'

export async function uploadCoverImage(req, res, next) {
  try {
    const data = await coverUploadService.uploadCoverImage({
      file: req.file,
      userId: req.user.id,
    })
    sendSuccess(res, data, 'Cover image uploaded successfully', HTTP_STATUS.CREATED)
  } catch (error) {
    next(error)
  }
}
