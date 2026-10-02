import request from 'supertest'
import app from '../../../src/app.js'
import { clearTestDatabase, connectTestDatabase, disconnectTestDatabase } from '../setup.js'

const strongPassword = 'SecurePass1!'

async function registerAndLogin(email, name = 'User') {
  await request(app).post('/api/v1/auth/register').send({
    name,
    email,
    password: strongPassword,
  })

  const login = await request(app).post('/api/v1/auth/login').send({
    email,
    password: strongPassword,
  })

  return {
    accessToken: login.body.data.accessToken,
    user: login.body.data.user,
  }
}

async function createPublishedPost(accessToken, overrides = {}) {
  const response = await request(app)
    .post('/api/v1/posts')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      title: 'Published for follows',
      content: '<p>Body</p>',
      category: 'Engineering',
      status: 'published',
      ...overrides,
    })

  return response.body.data
}

describe('Follows API', () => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterEach(async () => {
    await clearTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  it('requires authentication', async () => {
    const response = await request(app).get('/api/v1/follows/me')
    expect(response.status).toBe(401)
  })

  it('follows and unfollows an author, rejects self-follow', async () => {
    const reader = await registerAndLogin('reader@example.com', 'Reader')
    const author = await registerAndLogin('author@example.com', 'Author')
    await createPublishedPost(author.accessToken)

    const selfFollow = await request(app)
      .post(`/api/v1/follows/${reader.user.id}`)
      .set('Authorization', `Bearer ${reader.accessToken}`)

    expect(selfFollow.status).toBe(400)

    const followed = await request(app)
      .post(`/api/v1/follows/${author.user.id}`)
      .set('Authorization', `Bearer ${reader.accessToken}`)

    expect(followed.status).toBe(201)
    expect(followed.body.data.id).toBe(author.user.id)

    const list = await request(app)
      .get('/api/v1/follows/me')
      .set('Authorization', `Bearer ${reader.accessToken}`)

    expect(list.status).toBe(200)
    expect(list.body.data).toHaveLength(1)
    expect(list.body.data[0].id).toBe(author.user.id)

    const duplicate = await request(app)
      .post(`/api/v1/follows/${author.user.id}`)
      .set('Authorization', `Bearer ${reader.accessToken}`)

    expect(duplicate.status).toBe(409)

    const suggestions = await request(app)
      .get('/api/v1/follows/suggestions?limit=3')
      .set('Authorization', `Bearer ${reader.accessToken}`)

    expect(suggestions.status).toBe(200)
    expect(suggestions.body.data.every((user) => user.id !== author.user.id)).toBe(true)
    expect(suggestions.body.data.every((user) => user.id !== reader.user.id)).toBe(true)

    const unfollowed = await request(app)
      .delete(`/api/v1/follows/${author.user.id}`)
      .set('Authorization', `Bearer ${reader.accessToken}`)

    expect(unfollowed.status).toBe(200)

    const after = await request(app)
      .get('/api/v1/follows/me')
      .set('Authorization', `Bearer ${reader.accessToken}`)

    expect(after.body.data).toHaveLength(0)
  })
})
