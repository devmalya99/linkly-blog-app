import request from 'supertest'
import app from '../../../src/app.js'
import { ActivityLog } from '../../../src/models/ActivityLog.js'
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

async function createSamplePost(accessToken, overrides = {}) {
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

  return response
}

describe('Posts API', () => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterEach(async () => {
    await clearTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  it('lists published posts and recent posts only', async () => {
    const accessToken = await registerAndLogin()

    await createSamplePost(accessToken, { title: 'Published one', status: 'published' })
    await createSamplePost(accessToken, {
      title: 'Draft one',
      status: 'draft',
      content: '<p>Draft</p>',
    })
    await createSamplePost(accessToken, { title: 'Published two', status: 'published' })

    const all = await request(app).get('/api/v1/posts')
    expect(all.status).toBe(200)
    expect(all.body.data).toHaveLength(2)
    expect(all.body.pagination.total).toBe(2)
    expect(all.body.data.every((post) => post.status === 'published')).toBe(true)

    const recent = await request(app).get('/api/v1/posts/recent?limit=1')
    expect(recent.status).toBe(200)
    expect(recent.body.data).toHaveLength(1)
  })

  it('returns my posts including drafts and supports edit/delete', async () => {
    const accessToken = await registerAndLogin()
    const otherToken = await registerAndLogin('other@example.com')

    const created = await createSamplePost(accessToken, {
      title: 'Editable post',
      status: 'draft',
      content: '<p>Draft body</p>',
    })

    const mine = await request(app)
      .get('/api/v1/posts/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(mine.status).toBe(200)
    expect(mine.body.data).toHaveLength(1)
    expect(mine.body.data[0].status).toBe('draft')

    const postId = created.body.data.id

    const updated = await request(app)
      .patch(`/api/v1/posts/${postId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Editable post updated',
        status: 'published',
        content: '<p>Now published</p>',
      })

    expect(updated.status).toBe(200)
    expect(updated.body.data).toMatchObject({
      title: 'Editable post updated',
      status: 'published',
    })
    expect(updated.body.data.publishedAt).toEqual(expect.any(String))

    const forbidden = await request(app)
      .patch(`/api/v1/posts/${postId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Hijack' })

    expect(forbidden.status).toBe(403)

    const deleted = await request(app)
      .delete(`/api/v1/posts/${postId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(deleted.status).toBe(200)

    const posts = await Post.find({})
    expect(posts).toHaveLength(1)
    expect(posts[0].isDeleted).toBe(true)
    expect(posts[0].deletedAt).toEqual(expect.any(Date))
    expect(posts[0].slug).toContain('-deleted-')

    const mineAfterDelete = await request(app)
      .get('/api/v1/posts/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(mineAfterDelete.status).toBe(200)
    expect(mineAfterDelete.body.data).toHaveLength(0)

    const publicList = await request(app).get('/api/v1/posts')
    expect(publicList.body.data).toHaveLength(0)

    const updateLogs = await ActivityLog.find({ action: 'UPDATE_POST' })
    const deleteLogs = await ActivityLog.find({ action: 'DELETE_POST' })
    expect(updateLogs).toHaveLength(1)
    expect(deleteLogs).toHaveLength(1)
  })

  it('hides drafts from public get-by-id but allows the author', async () => {
    const accessToken = await registerAndLogin()
    const created = await createSamplePost(accessToken, {
      title: 'Secret draft',
      status: 'draft',
      content: '<p>Private</p>',
    })

    const postId = created.body.data.id

    const anonymous = await request(app).get(`/api/v1/posts/${postId}`)
    expect(anonymous.status).toBe(404)

    const owner = await request(app)
      .get(`/api/v1/posts/${postId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(owner.status).toBe(200)
    expect(owner.body.data.title).toBe('Secret draft')
  })

  it('returns a published post by id without auth', async () => {
    const accessToken = await registerAndLogin()
    const created = await createSamplePost(accessToken, {
      title: 'Public by id',
      status: 'published',
      content: '<p>Anyone can read this</p>',
    })

    const postId = created.body.data.id

    const response = await request(app).get(`/api/v1/posts/${postId}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data).toMatchObject({
      id: postId,
      title: 'Public by id',
      status: 'published',
    })
    expect(response.body.data.slug).toEqual(expect.any(String))
  })

  it('replaces slug on update and serves published posts by slug publicly', async () => {
    const accessToken = await registerAndLogin()
    const created = await createSamplePost(accessToken, {
      title: 'Shareable post',
      status: 'published',
      content: '<p>Public body</p>',
      slug: 'shareable-post',
    })

    const postId = created.body.data.id
    expect(created.body.data.slug).toBe('shareable-post')

    const renamed = await request(app)
      .patch(`/api/v1/posts/${postId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ slug: 'new-public-slug' })

    expect(renamed.status).toBe(200)
    expect(renamed.body.data.slug).toBe('new-public-slug')

    const oldSlug = await request(app).get('/api/v1/posts/slug/shareable-post')
    expect(oldSlug.status).toBe(404)

    const byNewSlug = await request(app).get('/api/v1/posts/slug/new-public-slug')
    expect(byNewSlug.status).toBe(200)
    expect(byNewSlug.body.data.title).toBe('Shareable post')
  })
})
