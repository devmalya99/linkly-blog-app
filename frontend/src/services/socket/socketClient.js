import { io } from 'socket.io-client'
import { SOCKET_EVENTS } from './events.js'

/** @type {import('socket.io-client').Socket | null} */
let socket = null

function resolveSocketUrl() {
  const configured = import.meta.env.VITE_SOCKET_URL
  if (configured) return configured

  const apiBase = import.meta.env.VITE_API_BASE_URL || ''
  return apiBase.replace(/\/api\/v1\/?$/, '')
}

export function connectSocket({ token, onCommentNotification }) {
  disconnectSocket()

  if (!token) return null

  socket = io(resolveSocketUrl(), {
    auth: { token },
    withCredentials: true,
    transports: ['websocket', 'polling'],
  })

  if (onCommentNotification) {
    socket.on(SOCKET_EVENTS.COMMENT, onCommentNotification)
  }

  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
}

export function getSocket() {
  return socket
}
