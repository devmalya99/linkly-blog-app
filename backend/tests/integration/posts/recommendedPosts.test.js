import request from 'supertest'
import app from '../../../src/app.js'
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

async function createPost(accessToken, overrides = {}) {
  const response = await request(app)
    .post('/api/v1/posts')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      title: 'Sample post',
      content: '<p>Hello world</p>',
      category: 'Engineering',
      tags: ['React'],
      status: 'published',
      ...overrides,
    })

  expect(response.status).toBe(201)
  return response.body.data
}

describe('Recommended Posts API', () => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterEach(async () => {
    await clearTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  it('returns 404 for a missing post id', async () => {
    const response = await request(app).get(
      '/api/v1/posts/66f1a2b3c4d5e6f7a8b9c0d1/recommended',
    )

    expect(response.status).toBe(404)
  })

  it('excludes the source post and returns at most 5 recommendations', async () => {
    const accessToken = await registerAndLogin()

    const source = await createPost(accessToken, {
      title: 'Source post',
      category: 'Engineering',
      tags: ['React'],
    })

    for (let i = 0; i < 6; i += 1) {
      await createPost(accessToken, {
        title: `Peer ${i}`,
        category: 'Engineering',
        tags: ['React'],
        content: `<p>Peer ${i}</p>`,
      })
    }

    const response = await request(app).get(`/api/v1/posts/${source.id}/recommended`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data).toHaveLength(5)
    expect(response.body.data.every((post) => post.id !== source.id)).toBe(true)
    expect(response.body.data.every((post) => post.status === 'published')).toBe(true)
  })

  it('prefers same category with overlapping tags over other stages', async () => {
    const accessToken = await registerAndLogin()

    const source = await createPost(accessToken, {
      title: 'Unique Source Title XYZ',
      category: 'Engineering',
      tags: ['React'],
      content: '<p>Source body</p>',
    })

    const tagMatch = await createPost(accessToken, {
      title: 'Tag match peer',
      category: 'Engineering',
      tags: ['react'],
      content: '<p>Tags</p>',
    })

    const categoryOnly = await createPost(accessToken, {
      title: 'Category only peer',
      category: 'Engineering',
      tags: ['Vue'],
      content: '<p>Category</p>',
    })

    const titleMatch = await createPost(accessToken, {
      title: 'Other category',
      category: 'Essays',
      tags: [],
      content: '<p>Mentions Unique Source Title XYZ in body</p>',
    })

    const randomPeer = await createPost(accessToken, {
      title: 'Random peer',
      category: 'Architecture',
      tags: ['Go'],
      content: '<p>Unrelated</p>',
    })

    const response = await request(app).get(`/api/v1/posts/${source.id}/recommended`)

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveLength(4)

    const ids = response.body.data.map((post) => post.id)
    expect(ids[0]).toBe(tagMatch.id)
    expect(ids).toContain(categoryOnly.id)
    expect(ids).toContain(titleMatch.id)
    expect(ids).toContain(randomPeer.id)
  })

  it('fills with same category when tag matches are insufficient', async () => {
    const accessToken = await registerAndLogin()

    const source = await createPost(accessToken, {
      title: 'Fill category source',
      category: 'Design Systems',
      tags: ['Tokens'],
    })

    const tagMatch = await createPost(accessToken, {
      title: 'One tag match',
      category: 'Design Systems',
      tags: ['tokens'],
    })

    const categoryA = await createPost(accessToken, {
      title: 'Same category A',
      category: 'Design Systems',
      tags: ['Figma'],
    })

    const categoryB = await createPost(accessToken, {
      title: 'Same category B',
      category: 'Design Systems',
      tags: [],
    })

    const response = await request(app).get(`/api/v1/posts/${source.id}/recommended`)

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveLength(3)

    const ids = response.body.data.map((post) => post.id)
    expect(ids[0]).toBe(tagMatch.id)
    expect(ids).toEqual(expect.arrayContaining([categoryA.id, categoryB.id]))
  })

  it('falls back to title/content match then random published posts', async () => {
    const accessToken = await registerAndLogin()

    const source = await createPost(accessToken, {
      title: 'Moonlit Algorithms',
      category: 'AI Interfaces',
      tags: ['UniqueTagNeverShared'],
      content: '<p>Source</p>',
    })

    const titleHit = await createPost(accessToken, {
      title: 'Essay about Moonlit Algorithms elsewhere',
      category: 'Essays',
      tags: [],
      content: '<p>No shared tags or category</p>',
    })

    const contentHit = await createPost(accessToken, {
      title: 'Body mention peer',
      category: 'Product Craft',
      tags: [],
      content: '<p>Discussing Moonlit Algorithms in depth</p>',
    })

    const randomPeer = await createPost(accessToken, {
      title: 'Completely unrelated',
      category: 'Architecture',
      tags: ['Infra'],
      content: '<p>Nothing related</p>',
    })

    const response = await request(app).get(`/api/v1/posts/${source.id}/recommended`)

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveLength(3)

    const ids = response.body.data.map((post) => post.id)
    expect(ids).toEqual(expect.arrayContaining([titleHit.id, contentHit.id, randomPeer.id]))
    // Title/content matches come before pure random
    const titleStageIds = ids.slice(0, 2)
    expect(titleStageIds).toEqual(expect.arrayContaining([titleHit.id, contentHit.id]))
    expect(ids[2]).toBe(randomPeer.id)
  })

  it('excludes drafts and soft-deleted posts from recommendations', async () => {
    const accessToken = await registerAndLogin()

    const source = await createPost(accessToken, {
      title: 'Published source',
      category: 'Engineering',
      tags: ['React'],
    })

    const draft = await createPost(accessToken, {
      title: 'Draft peer',
      category: 'Engineering',
      tags: ['React'],
      status: 'draft',
      content: '<p>Draft</p>',
    })

    const published = await createPost(accessToken, {
      title: 'Published peer',
      category: 'Engineering',
      tags: ['React'],
    })

    const toDelete = await createPost(accessToken, {
      title: 'Deleted peer',
      category: 'Engineering',
      tags: ['React'],
    })

    await request(app)
      .delete(`/api/v1/posts/${toDelete.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    const response = await request(app).get(`/api/v1/posts/${source.id}/recommended`)

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveLength(1)
    expect(response.body.data[0].id).toBe(published.id)
    expect(response.body.data.map((p) => p.id)).not.toContain(draft.id)
    expect(response.body.data.map((p) => p.id)).not.toContain(toDelete.id)
  })
})
