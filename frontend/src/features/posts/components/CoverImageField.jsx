import { useEffect, useRef, useState } from 'react'
import { CoverImage } from './CoverImage'
import { COVER_UPLOAD, COVER_UPLOAD_STATUS } from '../constants/coverImage'
import { useCoverImageUpload } from '../hooks/useCoverImageUpload'

export function CoverImageField({
  coverImage,
  onChange,
  disabled = false,
}) {
  const inputRef = useRef(null)
  const localPreviewRef = useRef(null)
  const [localPreview, setLocalPreview] = useState(null)
  const { upload, status, error, isPending } = useCoverImageUpload()

  useEffect(() => {
    return () => {
      if (localPreviewRef.current) {
        URL.revokeObjectURL(localPreviewRef.current)
      }
    }
  }, [])

  function clearLocalPreview() {
    if (localPreviewRef.current) {
      URL.revokeObjectURL(localPreviewRef.current)
      localPreviewRef.current = null
    }
    setLocalPreview(null)
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || disabled || isPending) return

    clearLocalPreview()
    const previewUrl = URL.createObjectURL(file)
    localPreviewRef.current = previewUrl
    setLocalPreview(previewUrl)

    try {
      const url = await upload(file)
      onChange(url)
    } catch {
      clearLocalPreview()
    }
  }

  function handleRemove() {
    if (disabled || isPending) return
    clearLocalPreview()
    onChange(null)
  }

  const statusLabel =
    status === COVER_UPLOAD_STATUS.PENDING
      ? 'Uploading…'
      : status === COVER_UPLOAD_STATUS.SUCCESS
        ? 'Uploaded'
        : status === COVER_UPLOAD_STATUS.FAILED
          ? 'Upload failed'
          : null

  const previewSrc = localPreview || coverImage

  return (
    <div className="mb-4">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-label-md text-label-md text-text-primary">Cover image</span>
        <span className="font-meta-sm text-meta-sm text-text-muted">Optional · max 2 MB</span>
      </div>

      <CoverImage
        alt="Post cover preview"
        className="mb-3 border border-border-subtle"
        rounded="rounded-lg"
        size="card"
        src={previewSrc}
      />

      <input
        accept={COVER_UPLOAD.ACCEPT}
        className="sr-only"
        disabled={disabled || isPending}
        onChange={handleFileChange}
        ref={inputRef}
        type="file"
      />

      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-white px-3 py-2 font-label-md text-label-md text-text-primary transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled || isPending}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">
            {coverImage || localPreview ? 'sync' : 'upload'}
          </span>
          {isPending ? 'Uploading…' : coverImage || localPreview ? 'Replace' : 'Upload'}
        </button>

        {coverImage || localPreview ? (
          <button
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-white px-3 py-2 font-label-md text-label-md text-status-error transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={disabled || isPending}
            onClick={handleRemove}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            Remove
          </button>
        ) : null}
      </div>

      {statusLabel && status !== COVER_UPLOAD_STATUS.SUCCESS ? (
        <p
          className={`mt-2 font-meta-sm text-meta-sm ${
            status === COVER_UPLOAD_STATUS.FAILED ? 'text-status-error' : 'text-text-muted'
          }`}
          role={status === COVER_UPLOAD_STATUS.FAILED ? 'alert' : undefined}
        >
          {status === COVER_UPLOAD_STATUS.FAILED ? error || statusLabel : statusLabel}
        </p>
      ) : null}

      <p className="mt-2 font-meta-sm text-meta-sm text-text-muted">
        JPEG, PNG, or WebP. Compressed on the server before storage.
      </p>
    </div>
  )
}
