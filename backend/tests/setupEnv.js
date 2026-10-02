import dotenv from 'dotenv'

dotenv.config()

const REQUIRED_ENV = [
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRES_IN',
  'JWT_REFRESH_EXPIRES_IN',
  'FRONTEND_URL',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'AWS_S3_BUCKET_NAME',
]

process.env.NODE_ENV = 'test'

const missing = REQUIRED_ENV.filter((key) => {
  const value = process.env[key]
  return value === undefined || value === null || String(value).trim() === ''
})

if (missing.length > 0) {
  console.error('[tests/setupEnv] Missing required environment variables:')
  for (const key of missing) {
    console.error(`  - ${key}`)
  }
  console.error(
    '[tests/setupEnv] Set them in backend/.env (or the process environment) before running tests.',
  )
  throw new Error(`Missing required test environment variables: ${missing.join(', ')}`)
}
