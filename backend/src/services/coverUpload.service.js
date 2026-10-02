import { randomUUID } from 'node:crypto'
import { mkdir, unlink, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { AppError, HTTP_STATUS } from '../constants/errors.js'
import { COVER_UPLOAD, MIME_TO_EXT } from '../constants/uploads.js'
import { uploadObject } from './s3.service.js'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function ensureTempDir() {
  const dir = path.resolve(process.cwd(), COVER_UPLOAD.TEMP_DIR)
  await mkdir(dir, { recursive: true })
  return dir
}

async function safeUnlink(filePath) {
  if (!filePath) return
  try {
    await unlink(filePath)
  } catch {
    // Ignore missing/already-removed temp files.
  }
}

/**
 * Compress toward ~50% of the original file size while staying within allowed formats.
 */
async function compressCoverImage(tempPath, mimeType) {
  const originalSize = (await stat(tempPath)).size
  const targetSize = Math.max(1, Math.floor(originalSize / 2))
  const metadata = await sharp(tempPath).metadata()

  const resize =
    metadata.width && metadata.width > COVER_UPLOAD.MAX_WIDTH
      ? { width: COVER_UPLOAD.MAX_WIDTH, withoutEnlargement: true }
      : null

  let best = null

  for (const quality of [80, 70, 60, 50, 40]) {
    let pipeline = sharp(tempPath).rotate()
    if (resize) {
      pipeline = pipeline.resize(resize)
    }

    let buffer
    let contentType = mimeType
    let ext = MIME_TO_EXT[mimeType] || 'jpg'

    if (mimeType === 'image/png') {
      // PNG rarely halves with lossless settings — convert to WebP for the size target.
      buffer = await pipeline.webp({ quality }).toBuffer()
      contentType = 'image/webp'
      ext = 'webp'
    } else if (mimeType === 'image/webp') {
      buffer = await pipeline.webp({ quality }).toBuffer()
      contentType = 'image/webp'
      ext = 'webp'
    } else {
      buffer = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer()
      contentType = 'image/jpeg'
      ext = 'jpg'
    }

    best = { buffer, contentType, ext }

    if (buffer.length <= targetSize) {
      break
    }
  }

  if (!best) {
    throw new AppError('Unable to compress cover image', HTTP_STATUS.UNPROCESSABLE)
  }

  return best
}

async function uploadWithRetry({ key, body, contentType }) {
  let lastError

  for (let attempt = 1; attempt <= COVER_UPLOAD.S3_MAX_ATTEMPTS; attempt += 1) {
    try {
      return await uploadObject({ key, body, contentType })
    } catch (error) {
      lastError = error
      if (attempt < COVER_UPLOAD.S3_MAX_ATTEMPTS) {
        await sleep(COVER_UPLOAD.S3_RETRY_DELAY_MS * attempt)
      }
    }
  }

  throw lastError instanceof AppError
    ? lastError
    : new AppError('Failed to upload cover image to storage', HTTP_STATUS.INTERNAL)
}

export const coverUploadService = {
  /**
   * Transactional cover upload:
   * 1. Persist multer file to local temp storage
   * 2. Compress toward half size
   * 3. Upload to S3 with retries (local file kept until success)
   * 4. Remove local temp files
   * 5. Return public URL (success) or throw (failure)
   */
  async uploadCoverImage({ file, userId }) {
    if (!file) {
      throw new AppError('Cover image is required', HTTP_STATUS.BAD_REQUEST)
    }

    if (!COVER_UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new AppError('Cover image must be JPEG, PNG, or WebP', HTTP_STATUS.UNPROCESSABLE)
    }

    if (file.size > COVER_UPLOAD.MAX_BYTES) {
      throw new AppError('Cover image must be 2 MB or smaller', HTTP_STATUS.UNPROCESSABLE)
    }

    const tempDir = await ensureTempDir()
    const tempId = randomUUID()
    const incomingExt = MIME_TO_EXT[file.mimetype] || 'bin'
    const tempPath = path.join(tempDir, `${tempId}-raw.${incomingExt}`)
    const compressedPath = path.join(tempDir, `${tempId}-compressed.bin`)

    try {
      await writeFile(tempPath, file.buffer)

      const compressed = await compressCoverImage(tempPath, file.mimetype)
      await writeFile(compressedPath, compressed.buffer)

      const key = `${COVER_UPLOAD.KEY_PREFIX}/${userId}/${tempId}.${compressed.ext}`
      const url = await uploadWithRetry({
        key,
        body: compressed.buffer,
        contentType: compressed.contentType,
      })

      return { url, key }
    } finally {
      await safeUnlink(tempPath)
      await safeUnlink(compressedPath)
    }
  },
}
