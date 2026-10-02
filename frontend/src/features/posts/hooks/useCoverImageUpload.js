import { useState } from 'react'
import { ApiError } from '../../../services/api/client'
import { uploadCoverImage } from '../api/uploadsApi'
import {
  COVER_UPLOAD_STATUS,
  validateCoverFile,
} from '../constants/coverImage'
import { formatApiError } from '../constants/createPostContent'

export function useCoverImageUpload() {
  const [status, setStatus] = useState(COVER_UPLOAD_STATUS.IDLE)
  const [error, setError] = useState('')

  async function upload(file) {
    const validationError = validateCoverFile(file)
    if (validationError) {
      setStatus(COVER_UPLOAD_STATUS.FAILED)
      setError(validationError)
      throw new Error(validationError)
    }

    setStatus(COVER_UPLOAD_STATUS.PENDING)
    setError('')

    try {
      const response = await uploadCoverImage(file)
      const url = response?.data?.url

      if (!url) {
        throw new Error('Upload succeeded but no image URL was returned.')
      }

      setStatus(COVER_UPLOAD_STATUS.SUCCESS)
      return url
    } catch (err) {
      const message =
        err instanceof ApiError ? formatApiError(err) : err.message || 'Unable to upload cover image.'
      setStatus(COVER_UPLOAD_STATUS.FAILED)
      setError(message)
      throw err instanceof Error ? err : new Error(message)
    }
  }

  function reset() {
    setStatus(COVER_UPLOAD_STATUS.IDLE)
    setError('')
  }

  return {
    upload,
    reset,
    status,
    error,
    isPending: status === COVER_UPLOAD_STATUS.PENDING,
  }
}
