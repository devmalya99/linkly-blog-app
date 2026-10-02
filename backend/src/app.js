import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import { env } from './config/env.js'
import { configurePassport } from './config/passport.js'
import { openApiDocument } from '../docs/openapi.js'
import { activityLogger } from './middleware/activityLogger.js'
import { apiRateLimiter } from './middleware/rateLimiter.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import routes from './routes/index.js'

// 📌 Configures the passport middleware. And initializes the passport strategies.
configurePassport()

const app = express()

// Needed so express-rate-limit keys by the real client IP behind a reverse proxy.
if (env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
}

app.use(helmet())
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(activityLogger)
app.use('/api', apiRateLimiter)

if (env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument))
}

app.use('/api/v1', routes)
app.use(notFound)
app.use(errorHandler)

export default app
