
// 📌 supertest lets you call your Express app as if you were a client (like Postman), without starting a real server.
import request from 'supertest'
import app from '../../../src/app.js'
import { ActivityLog } from '../../../src/models/ActivityLog.js'
import { RefreshToken } from '../../../src/models/RefreshToken.js'
import { clearTestDatabase, connectTestDatabase, disconnectTestDatabase } from '../setup.js'

const strongPassword = 'SecurePass1!'

// 📌 describe is a Jest function that groups related tests together.
describe('Auth API', () => {
  // 📌 beforeAll is a Jest function that runs before all tests in the describe block.
  beforeAll(async () => {
    await connectTestDatabase()
  })

  // 📌 afterEach is a Jest function that runs after each test in the describe block.
  afterEach(async () => {
    // 📌 It clears the test database to avoid conflicts between tests.
    await clearTestDatabase()
  })
  
  // 📌 afterAll is a Jest function that runs after all tests in the describe block.
  afterAll(async () => {
    // 📌 It disconnects from the test database to avoid conflicts between tests.
    await disconnectTestDatabase()
  })
  
  // 📌 it is a Jest function that runs a test.
  it('registers a user without issuing tokens', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      name: 'Debmalya',
      email: 'debmalya@example.com',
      password: strongPassword,
    })

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(response.body.data).toMatchObject({
      name: 'Debmalya',
      email: 'debmalya@example.com',
      role: 'user',
    })
    expect(response.body.data.accessToken).toBeUndefined()
    expect(response.headers['set-cookie']).toBeUndefined()

    const logs = await ActivityLog.find({ action: 'REGISTER' })
    expect(logs).toHaveLength(1)
  })

  it('rejects weak passwords and duplicate emails', async () => {
    const weak = await request(app).post('/api/v1/auth/register').send({
      name: 'Debmalya',
      email: 'debmalya@example.com',
      password: 'password',
    })

    expect(weak.status).toBe(422)

    await request(app).post('/api/v1/auth/register').send({
      name: 'Debmalya',
      email: 'debmalya@example.com',
      password: strongPassword,
    })

    const duplicate = await request(app).post('/api/v1/auth/register').send({
      name: 'Other',
      email: 'debmalya@example.com',
      password: strongPassword,
    })

    expect(duplicate.status).toBe(409)
  })

  it('logs in, refreshes access token, and logs out', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Debmalya',
      email: 'debmalya@example.com',
      password: strongPassword,
    })

    const login = await request(app).post('/api/v1/auth/login').send({
      email: 'debmalya@example.com',
      password: strongPassword,
    })

    expect(login.status).toBe(200)
    expect(login.body.data.accessToken).toEqual(expect.any(String))
    expect(login.body.data.user.email).toBe('debmalya@example.com')
    expect(login.headers['set-cookie'][0]).toContain('refreshToken=')

    const cookie = login.headers['set-cookie']
    const accessToken = login.body.data.accessToken

    const me = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(me.status).toBe(200)
    expect(me.body.data.email).toBe('debmalya@example.com')

    const refreshed = await request(app).post('/api/v1/auth/refresh').set('Cookie', cookie)

    expect(refreshed.status).toBe(200)
    expect(refreshed.body.data.accessToken).toEqual(expect.any(String))

    const logout = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .set('Cookie', cookie)

    expect(logout.status).toBe(200)

    const sessions = await RefreshToken.find({})
    expect(sessions[0].revokedAt).not.toBeNull()

    const blocked = await request(app).post('/api/v1/auth/refresh').set('Cookie', cookie)
    expect(blocked.status).toBe(401)

    const loginLogs = await ActivityLog.find({ action: 'LOGIN' })
    const logoutLogs = await ActivityLog.find({ action: 'LOGOUT' })
    expect(loginLogs).toHaveLength(1)
    expect(logoutLogs).toHaveLength(1)
  })

  it('rejects wrong passwords', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Debmalya',
      email: 'debmalya@example.com',
      password: strongPassword,
    })

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'debmalya@example.com',
      password: 'WrongPass1!',
    })

    expect(response.status).toBe(401)
  })
})
