import { Server } from 'socket.io'
import { env } from '../config/env.js'
import { verifyAccessToken } from '../utils/jwt.js'
import { setIO } from './io.js'

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token

    if (!token || typeof token !== 'string') {
      return next(new Error('Authentication required'))
    }

    try {
      const payload = verifyAccessToken(token)
      socket.data.userId = payload.sub
      return next()
    } catch {
      return next(new Error('Invalid or expired access token'))
    }
  })

  io.on('connection', (socket) => {
    const userId = socket.data.userId
    if (userId) {
      socket.join(`user:${userId}`)
    }
  })

  setIO(io)
  return io
}
