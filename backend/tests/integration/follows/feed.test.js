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
      title: overrides.title || 'Feed post',
      content: '<p>Body</p>',
      category: overrides.category || 'Engineering',
      status: 'published',
      ...overrides,
    })

  return response.body.data
}

describe('Feed API', () => {
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
    const response = await request(app).get('/api/v1/feed?tab=for-you&seed=abc')
    expect(response.status).toBe(401)
  })

  it('returns for-you, category, following, and trending tabs', async () => {
    const reader = await registerAndLogin('reader@example.com', 'Reader')
    const author = await registerAndLogin('author@example.com', 'Author')
    const other = await registerAndLogin('other@example.com', 'Other')

    const postA = await createPublishedPost(author.accessToken, {
      title: 'Engineering one',
      category: 'Engineering',
    })
    await createPublishedPost(author.accessToken, {
      title: 'Essays one',
      category: 'Essays',
    })
    await createPublishedPost(other.accessToken, {
      title: 'Other engineering',
      category: 'Engineering',
    })

    await request(app)
      .post(`/api/v1/posts/${postA.id}/comments`)
      .set('Authorization', `Bearer ${reader.accessToken}`)
      .send({ content: 'Great read' })

    await request(app)
      .post(`/api/v1/posts/${postA.id}/comments`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .send({ content: 'Agree' })

    await request(app)
      .post(`/api/v1/follows/${author.user.id}`)
      .set('Authorization', `Bearer ${reader.accessToken}`)

    const forYou = await request(app)
      .get('/api/v1/feed?tab=for-you&seed=session-1&page=1&limit=5')
      .set('Authorization', `Bearer ${reader.accessToken}`)

    expect(forYou.status).toBe(200)
    expect(forYou.body.data.length).toBeGreaterThan(0)
    expect(forYou.body.pagination.limit).toBe(5)

    const forYouAgain = await request(app)
      .get('/api/v1/feed?tab=for-you&seed=session-1&page=1&limit=5')
      .set('Authorization', `Bearer ${reader.accessToken}`)

    expect(forYouAgain.body.data.map((post) => post.id)).toEqual(
      forYou.body.data.map((post) => post.id),
    )

    const category = await request(app)
      .get('/api/v1/feed?tab=category&category=Essays&page=1&limit=5')
      .set('Authorization', `Bearer ${reader.accessToken}`)

    expect(category.status).toBe(200)
    expect(category.body.data.every((post) => post.category === 'Essays')).toBe(true)

    const following = await request(app)
      .get('/api/v1/feed?tab=following&page=1&limit=5')
      .set('Authorization', `Bearer ${reader.accessToken}`)

    expect(following.status).toBe(200)
    expect(following.body.data.every((post) => post.author.id === author.user.id)).toBe(true)
    expect(following.body.data.length).toBe(2)

    const trending = await request(app)
      .get('/api/v1/feed?tab=trending&page=1&limit=5')
      .set('Authorization', `Bearer ${reader.accessToken}`)

    expect(trending.status).toBe(200)
    expect(trending.body.data[0].id).toBe(postA.id)
    expect(trending.body.data[0].commentCount).toBe(2)
  })
})
