import { ActivityLog } from '../../../src/models/ActivityLog.js'
import { User } from '../../../src/models/User.js'
import { authService } from '../../../src/services/auth.service.js'
import { clearTestDatabase, connectTestDatabase, disconnectTestDatabase } from '../setup.js'

function googleProfile(overrides = {}) {
  return {
    id: 'google-user-123',
    displayName: 'Debmalya Mazumdar',
    emails: [{ value: 'debmalya@gmail.com', verified: true }],
    photos: [{ value: 'https://example.com/avatar.jpg' }],
    ...overrides,
  }
}

describe('Google auth service', () => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterEach(async () => {
    await clearTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  it('creates a user from a Google profile and issues tokens', async () => {
    const result = await authService.handleGoogleLogin(googleProfile())

    expect(result.accessToken).toEqual(expect.any(String))
    expect(result.refreshToken).toEqual(expect.any(String))
    expect(result.user).toMatchObject({
      name: 'Debmalya Mazumdar',
      email: 'debmalya@gmail.com',
      avatar: 'https://example.com/avatar.jpg',
      role: 'user',
    })

    const users = await User.find({})
    expect(users).toHaveLength(1)
    expect(users[0].googleId).toBe('google-user-123')
    expect(users[0].passwordHash).toBeUndefined()

    const logs = await ActivityLog.find({ action: 'LOGIN' })
    expect(logs).toHaveLength(1)
    expect(logs[0].metadata).toMatchObject({ provider: 'google' })
  })

  it('links Google to an existing email account', async () => {
    await User.create({
      name: 'Existing User',
      email: 'debmalya@gmail.com',
      passwordHash: 'hashed',
    })

    const result = await authService.handleGoogleLogin(googleProfile())
    const user = await User.findOne({ email: 'debmalya@gmail.com' })

    expect(result.user.email).toBe('debmalya@gmail.com')
    expect(user.googleId).toBe('google-user-123')
    expect(await User.countDocuments()).toBe(1)
  })

  it('rejects Google profiles without an email', async () => {
    await expect(
      authService.handleGoogleLogin(
        googleProfile({
          emails: [],
        }),
      ),
    ).rejects.toMatchObject({
      statusCode: 400,
    })
  })
})
