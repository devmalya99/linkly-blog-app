import request from 'supertest'
import app from '../../../src/app.js'
import { Post } from '../../../src/models/Post.js'
import { clearTestDatabase, connectTestDatabase, disconnectTestDatabase } from '../setup.js'

const strongPassword = 'SecurePass1!'

async function registerAndLogin(email = 'author@example.com') {
  await request(app).post('/api/v1/auth/register').send({
    name: 'Debmalya',
    email,
    password: strongPassword,
  })

  const login = await request(app).post('/api/v1/auth/login').send({
    email,
    password: strongPassword,
  })

  return login.body.data.accessToken
}

describe('Share Post API', () => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterEach(async () => {
    await clearTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  it('returns a draft post publicly without auth', async () => {
    const accessToken = await registerAndLogin()

    const created = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Secret draft shared',
        content: '<p>Draft for a friend</p>',
        category: 'Essays',
        tags: ['Minimal'],
        status: 'draft',
      })

    const postId = created.body.data.id

    const response = await request(app).get(`/api/v1/share/posts/${postId}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data).toMatchObject({
      id: postId,
      title: 'Secret draft shared',
      content: '<p>Draft for a friend</p>',
      category: 'Essays',
      tags: ['Minimal'],
      publishedAt: null,
      author: { name: 'Debmalya' },
    })
    expect(response.body.data.author.email).toBeUndefined()
    expect(response.body.data.author.role).toBeUndefined()
    expect(response.body.data.status).toBeUndefined()
    expect(response.body.data.slug).toBeUndefined()
  })

  it('returns a published post publicly without auth', async () => {
    const accessToken = await registerAndLogin()

    const created = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Published shared',
        content: '<p>Public body</p>',
        category: 'Engineering',
        tags: ['React'],
        status: 'published',
      })

    const response = await request(app).get(`/api/v1/share/posts/${created.body.data.id}`)

    expect(response.status).toBe(200)
    expect(response.body.data.title).toBe('Published shared')
    expect(response.body.data.publishedAt).toEqual(expect.any(String))
  })

  it('returns 404 for soft-deleted posts', async () => {
    const accessToken = await registerAndLogin()

    const created = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Soon deleted',
        content: '<p>Gone</p>',
        category: 'Engineering',
        status: 'published',
      })

    const postId = created.body.data.id

    await request(app)
      .delete(`/api/v1/posts/${postId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    const response = await request(app).get(`/api/v1/share/posts/${postId}`)
    expect(response.status).toBe(404)

    const stillInDb = await Post.findById(postId)
    expect(stillInDb.isDeleted).toBe(true)
  })
})
