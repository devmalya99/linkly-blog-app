import { useCallback, useEffect, useState } from 'react'
import { connectSocket, disconnectSocket } from '../../../services/socket'
import { useAuth } from '../../auth'
import { NotificationLiveToast } from '../components/NotificationLiveToast'

export function NotificationsProvider({ children }) {
  const { isAuthenticated, accessToken, isBootstrapping } = useAuth()
  const [liveToast, setLiveToast] = useState(null)

  const dismissToast = useCallback(() => {
    setLiveToast(null)
  }, [])

  useEffect(() => {
    if (isBootstrapping) return undefined

    if (!isAuthenticated || !accessToken) {
      disconnectSocket()
      return undefined
    }

    connectSocket({
      token: accessToken,
      onCommentNotification: (payload) => {
        setLiveToast(payload)
      },
    })

    return () => {
      disconnectSocket()
    }
  }, [accessToken, isAuthenticated, isBootstrapping])

  return (
    <>
      {children}
      <NotificationLiveToast onDismiss={dismissToast} toast={liveToast} />
    </>
  )
}
