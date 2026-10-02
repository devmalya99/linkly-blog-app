import request from 'supertest'
import app from '../../../src/app.js'
import { ActivityLog } from '../../../src/models/ActivityLog.js'
import { Post } from '../../../src/models/Post.js'
import { clearTestDatabase, connectTestDatabase, disconnectTestDatabase } from '../setup.js'

const strongPassword = 'SecurePass1!'

async function registerAndLogin() {
  await request(app).post('/api/v1/auth/register').send({
    name: 'Debmalya',
    email: 'author@example.com',
    password: strongPassword,
  })

  const login = await request(app).post('/api/v1/auth/login').send({
    email: 'author@example.com',
    password: strongPassword,
  })

  return login.body.data.accessToken
}

describe('Create Post API', () => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterEach(async () => {
    await clearTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  it('creates a draft post with category and tags', async () => {
    const accessToken = await registerAndLogin()

    const response = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Building calm interfaces',
        content: '<p>Draft body</p>',
        category: 'Design Systems',
        tags: ['React', 'Design Systems'],
        excerpt: 'Notes on calm product UI.',
        status: 'draft',
      })

    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(response.body.data).toMatchObject({
      title: 'Building calm interfaces',
      slug: 'building-calm-interfaces',
      category: 'Design Systems',
      tags: ['React', 'Design Systems'],
      excerpt: 'Notes on calm product UI.',
      status: 'draft',
      publishedAt: null,
    })

    const posts = await Post.find({})
    expect(posts).toHaveLength(1)

    const logs = await ActivityLog.find({ action: 'CREATE_POST' })
    expect(logs).toHaveLength(1)
  })

  it('publishes a post and rejects publish without content', async () => {
    const accessToken = await registerAndLogin()

    const published = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Ship notes',
        content: '<p>Ready to publish</p>',
        category: 'Engineering',
        status: 'published',
      })

    expect(published.status).toBe(201)
    expect(published.body.data.status).toBe('published')
    expect(published.body.data.publishedAt).toEqual(expect.any(String))

    const invalid = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Empty publish',
        category: 'Engineering',
        status: 'published',
        content: '   ',
      })

    expect(invalid.status).toBe(422)
  })

  it('requires authentication', async () => {
    const response = await request(app).post('/api/v1/posts').send({
      title: 'No auth',
      category: 'Essays',
      status: 'draft',
    })

    expect(response.status).toBe(401)
  })
})
