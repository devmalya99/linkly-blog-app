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
      title: overrides.title || 'Published for recent comments',
      content: '<p>Body</p>',
      category: 'Engineering',
      status: 'published',
      ...overrides,
    })

  return response.body.data
}

describe('Recent comments API', () => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterEach(async () => {
    await clearTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  it('returns recent comments on the author posts only', async () => {
    const author = await registerAndLogin('author@example.com', 'Author')
    const reader = await registerAndLogin('reader@example.com', 'Reader')
    const other = await registerAndLogin('other@example.com', 'Other')

    const mine = await createPublishedPost(author.accessToken, { title: 'My article' })
    const theirs = await createPublishedPost(other.accessToken, { title: 'Other article' })

    await request(app)
      .post(`/api/v1/posts/${mine.id}/comments`)
      .set('Authorization', `Bearer ${reader.accessToken}`)
      .send({ content: 'Nice write-up' })

    await request(app)
      .post(`/api/v1/posts/${theirs.id}/comments`)
      .set('Authorization', `Bearer ${reader.accessToken}`)
      .send({ content: 'Should not appear for author' })

    const response = await request(app)
      .get('/api/v1/comments/recent?limit=5')
      .set('Authorization', `Bearer ${author.accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.data.items).toHaveLength(1)
    expect(response.body.data.items[0].content).toBe('Nice write-up')
    expect(response.body.data.items[0].post.title).toBe('My article')
    expect(response.body.data.total).toBe(1)
    expect(response.body.data.newCount).toBe(1)
  })
})
