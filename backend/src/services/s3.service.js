import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { env } from '../config/env.js'
import { AppError, HTTP_STATUS } from '../constants/errors.js'

let client

function assertS3Configured() {
  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.AWS_S3_BUCKET_NAME) {
    throw new AppError('Image uploads are not configured', HTTP_STATUS.INTERNAL)
  }
}

function getClient() {
  assertS3Configured()

  if (!client) {
    client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    })
  }

  return client
}

export function buildPublicObjectUrl(key) {
  assertS3Configured()
  return `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`
}

export function extractObjectKeyFromUrl(url) {
  if (!url || typeof url !== 'string') return null

  const marker = `.amazonaws.com/`
  const index = url.indexOf(marker)
  if (index === -1) return null

  const key = decodeURIComponent(url.slice(index + marker.length))
  return key || null
}

export async function uploadObject({ key, body, contentType }) {
  const s3 = getClient()

  const baseInput = {
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }

  try {
    // Prefer object ACL when the bucket still allows ACLs.
    await s3.send(
      new PutObjectCommand({
        ...baseInput,
        ACL: 'public-read',
      }),
    )
  } catch (error) {
    const name = error?.name || ''
    const message = String(error?.message || '')
    const aclUnsupported =
      name === 'AccessControlListNotSupported' ||
      name === 'InvalidRequest' ||
      message.includes('AccessControlListNotSupported') ||
      message.includes('does not allow ACLs')

    if (!aclUnsupported) {
      throw error
    }

    // Bucket has "Bucket owner enforced" — rely on a public-read bucket policy instead.
    await s3.send(new PutObjectCommand(baseInput))
  }

  return buildPublicObjectUrl(key)
}

export async function deleteObject(key) {
  if (!key) return

  try {
    const s3 = getClient()
    await s3.send(
      new DeleteObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key: key,
      }),
    )
  } catch {
    // Best-effort cleanup — do not fail the request if S3 delete fails.
  }
}

export async function deleteObjectByUrl(url) {
  const key = extractObjectKeyFromUrl(url)
  if (!key) return
  await deleteObject(key)
}
