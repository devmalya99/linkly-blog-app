import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { notificationPostPath } from '../utils/notificationLinks'

export function NotificationLiveToast({ toast, onDismiss }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(onDismiss, 6000)
    return () => window.clearTimeout(timer)
  }, [toast, onDismiss])

  if (!toast) return null

  function handleClick() {
    const path = notificationPostPath(toast)
    onDismiss()
    if (path) navigate(path)
  }

  return (
    <div className="pointer-events-none fixed top-20 right-4 z-[100] flex max-w-sm flex-col gap-2 sm:right-6">
      <button
        className="pointer-events-auto rounded-xl border border-border-subtle bg-surface-white px-4 py-3 text-left shadow-lg transition hover:border-primary-container/30"
        onClick={handleClick}
        type="button"
      >
        <p className="font-label-md text-label-md font-medium text-text-primary">New comment</p>
        <p className="mt-1 font-body-sm text-body-sm text-text-muted">{toast.message}</p>
      </button>
    </div>
  )
}
