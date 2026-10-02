import request from 'supertest'
import app from '../../../src/app.js'
import { Comment } from '../../../src/models/Comment.js'
import { Post } from '../../../src/models/Post.js'
import { User } from '../../../src/models/User.js'
import { ROLES } from '../../../src/constants/roles.js'
import { clearTestDatabase, connectTestDatabase, disconnectTestDatabase } from '../setup.js'

const strongPassword = 'SecurePass1!'

async function registerAndLogin(email, name = 'Commenter') {
  await request(app).post('/api/v1/auth/register').send({
    name,
    email,
    password: strongPassword,
  })

  const login = await request(app).post('/api/v1/auth/login').send({
    email,
    password: strongPassword,
  })

  return login.body.data.accessToken
}

async function createPublishedPost(accessToken, overrides = {}) {
  const response = await request(app)
    .post('/api/v1/posts')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      title: 'Published for comments',
      content: '<p>Body</p>',
      category: 'Engineering',
      status: 'published',
      ...overrides,
    })

  return response.body.data
}

describe('Comments API', () => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterEach(async () => {
    await clearTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  it('requires authentication to list and create comments', async () => {
    const authorToken = await registerAndLogin('author@example.com', 'Author')
    const post = await createPublishedPost(authorToken)

    const list = await request(app).get(`/api/v1/posts/${post.id}/comments`)
    expect(list.status).toBe(401)

    const create = await request(app)
      .post(`/api/v1/posts/${post.id}/comments`)
      .send({ content: 'Hello' })
    expect(create.status).toBe(401)
  })

  it('creates, lists with pagination, and deletes own comment', async () => {
    const authorToken = await registerAndLogin('author@example.com', 'Author')
    const commenterToken = await registerAndLogin('reader@example.com', 'Reader')
    const post = await createPublishedPost(authorToken)

    const created = await request(app)
      .post(`/api/v1/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${commenterToken}`)
      .send({ content: 'First comment' })

    expect(created.status).toBe(201)
    expect(created.body.data.content).toBe('First comment')
    expect(created.body.data.author.name).toBe('Reader')

    await request(app)
      .post(`/api/v1/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${commenterToken}`)
      .send({ content: 'Second comment' })

    const page1 = await request(app)
      .get(`/api/v1/posts/${post.id}/comments?page=1&limit=1`)
      .set('Authorization', `Bearer ${commenterToken}`)

    expect(page1.status).toBe(200)
    expect(page1.body.data).toHaveLength(1)
    expect(page1.body.pagination).toMatchObject({
      page: 1,
      limit: 1,
      total: 2,
      totalPages: 2,
    })

    const commentId = created.body.data.id
    const deleted = await request(app)
      .delete(`/api/v1/comments/${commentId}`)
      .set('Authorization', `Bearer ${commenterToken}`)

    expect(deleted.status).toBe(200)
    expect(await Comment.countDocuments()).toBe(1)
  })

  it('allows post author to delete any comment on their post', async () => {
    const authorToken = await registerAndLogin('author@example.com', 'Author')
    const commenterToken = await registerAndLogin('reader@example.com', 'Reader')
    const strangerToken = await registerAndLogin('stranger@example.com', 'Stranger')
    const post = await createPublishedPost(authorToken)

    const created = await request(app)
      .post(`/api/v1/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${commenterToken}`)
      .send({ content: 'Removable by author' })

    const forbidden = await request(app)
      .delete(`/api/v1/comments/${created.body.data.id}`)
      .set('Authorization', `Bearer ${strangerToken}`)
    expect(forbidden.status).toBe(403)

    const deleted = await request(app)
      .delete(`/api/v1/comments/${created.body.data.id}`)
      .set('Authorization', `Bearer ${authorToken}`)
    expect(deleted.status).toBe(200)
    expect(await Comment.countDocuments()).toBe(0)
  })

  it('allows admin to delete any comment', async () => {
    const authorToken = await registerAndLogin('author@example.com', 'Author')
    const commenterToken = await registerAndLogin('reader@example.com', 'Reader')
    await registerAndLogin('admin@example.com', 'Admin')
    await User.updateOne({ email: 'admin@example.com' }, { role: ROLES.ADMIN })

    const post = await createPublishedPost(authorToken)
    const created = await request(app)
      .post(`/api/v1/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${commenterToken}`)
      .send({ content: 'Admin can remove this' })

    const adminLogin = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@example.com',
      password: strongPassword,
    })

    const deleted = await request(app)
      .delete(`/api/v1/comments/${created.body.data.id}`)
      .set('Authorization', `Bearer ${adminLogin.body.data.accessToken}`)

    expect(deleted.status).toBe(200)
    expect(await Comment.countDocuments()).toBe(0)
  })

  it('rejects comments on drafts and soft-deleted posts but keeps existing comments after soft-delete', async () => {
    const authorToken = await registerAndLogin('author@example.com', 'Author')
    const commenterToken = await registerAndLogin('reader@example.com', 'Reader')

    const draft = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({
        title: 'Draft post',
        content: '<p>Draft</p>',
        category: 'Engineering',
        status: 'draft',
      })

    const draftComment = await request(app)
      .post(`/api/v1/posts/${draft.body.data.id}/comments`)
      .set('Authorization', `Bearer ${commenterToken}`)
      .send({ content: 'Nope' })
    expect(draftComment.status).toBe(400)

    const post = await createPublishedPost(authorToken)
    await request(app)
      .post(`/api/v1/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${commenterToken}`)
      .send({ content: 'Kept after soft delete' })

    await request(app)
      .delete(`/api/v1/posts/${post.id}`)
      .set('Authorization', `Bearer ${authorToken}`)

    expect(await Comment.countDocuments({ post: post.id })).toBe(1)

    const createOnDeleted = await request(app)
      .post(`/api/v1/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${commenterToken}`)
      .send({ content: 'Blocked' })
    expect(createOnDeleted.status).toBe(404)

    const listDeleted = await request(app)
      .get(`/api/v1/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${commenterToken}`)
    expect(listDeleted.status).toBe(404)

    const softDeleted = await Post.findById(post.id)
    expect(softDeleted.isDeleted).toBe(true)
  })

  it('rejects comments longer than 3000 characters', async () => {
    const authorToken = await registerAndLogin('author@example.com', 'Author')
    const commenterToken = await registerAndLogin('reader@example.com', 'Reader')
    const post = await createPublishedPost(authorToken)

    const tooLong = await request(app)
      .post(`/api/v1/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${commenterToken}`)
      .send({ content: 'a'.repeat(3001) })

    expect(tooLong.status).toBe(422)
  })
})
