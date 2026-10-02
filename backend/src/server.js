// 📌 Load the Express app, the Mongo connection helpers, and validated environment values.
import { createServer } from 'node:http'
import app from './app.js'
import { connectDatabase, disconnectDatabase } from './config/database.js'
import { env } from './config/env.js'
import { initSocket } from './socket/index.js'

// 📌 Holds the HTTP server so shutdown can close it after startup finishes.
let server

// 📌 Connect to MongoDB first, then start accepting requests on PORT.
async function start() {
  await connectDatabase()
  server = createServer(app)
  initSocket(server)
  server.listen(env.PORT, () => {
    console.info(`Inkly API listening on port ${env.PORT}`)
  })
}

// 📌 Stop accepting requests, close MongoDB, then exit. Skip the close if listen never started.
function shutdown(signal) {
  console.info(`${signal} received, closing server`)

  if (!server) {
    process.exit(0)
  }

  server.close(async () => {
    await disconnectDatabase()
    process.exit(0)
  })
}

// 📌 Ctrl+C and process managers both run the same shutdown path.
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

// 📌 Boot the API. If MongoDB or listen fails, log the message and exit.
start().catch((error) => {
  console.error('Failed to start Inkly API')
  console.error(error.message)
  process.exit(1)
})
