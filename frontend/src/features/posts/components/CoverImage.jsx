import { useEffect, useState } from 'react'

const SIZE_CLASS = {
  hero: 'aspect-[2/1] w-full',
  card: 'h-20 w-28 shrink-0 sm:h-24 sm:w-36',
  thumb: 'h-12 w-16 shrink-0',
}

function CoverPlaceholder({ className, title }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center bg-surface-container-low text-text-muted ${className}`}
      title={title}
    >
      <svg
        className="h-1/3 w-1/3 max-h-12 max-w-12 opacity-60"
        fill="none"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect height="32" rx="4" stroke="currentColor" strokeWidth="2" width="40" x="4" y="8" />
        <circle cx="16" cy="18" fill="currentColor" r="3" />
        <path d="M8 34l10-10 6 6 8-10 8 14H8z" fill="currentColor" opacity="0.45" />
      </svg>
    </div>
  )
}

export function CoverImage({
  src,
  alt = '',
  size = 'card',
  className = '',
  rounded = 'rounded-lg',
}) {
  const [failed, setFailed] = useState(false)
  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS.card
  const frameClass = `overflow-hidden bg-surface-container-low ${rounded} ${sizeClass} ${className}`

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return <CoverPlaceholder className={frameClass} title={failed ? 'Cover image failed to load' : 'No cover image'} />
  }

  return (
    <div className={frameClass}>
      <img
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => setFailed(true)}
        src={src}
      />
    </div>
  )
}
