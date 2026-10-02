import { HTTP_STATUS } from '../constants/errors.js'
import { postService } from '../services/post.service.js'
import { sendSuccess } from '../utils/response.js'

function requestIp(req) {
  return req.ip || req.socket?.remoteAddress
}

export async function createPost(req, res, next) {
  try {
    const data = await postService.createPost(req.user, req.validated.body, {
      ipAddress: requestIp(req),
    })
    sendSuccess(res, data, 'Post created successfully', HTTP_STATUS.CREATED)
  } catch (error) {
    next(error)
  }
}

export async function getPosts(req, res, next) {
  try {
    const data = await postService.getPosts(req.validated.query)
    sendSuccess(res, data?.items ?? [], 'Posts fetched successfully', HTTP_STATUS.OK, data?.pagination)
  } catch (error) {
    next(error)
  }
}

export async function getRecentPosts(req, res, next) {
  try {
    const data = await postService.getRecentPosts(req.validated.query)
    sendSuccess(res, data, 'Recent posts fetched successfully')
  } catch (error) {
    next(error)
  }
}

export async function getRecommendedPosts(req, res, next) {
  try {
    const data = await postService.getRecommendedPosts(req.validated.params.id)
    sendSuccess(res, data, 'Recommended posts fetched successfully')
  } catch (error) {
    next(error)
  }
}

export async function getPostById(req, res, next) {
  try {
    const data = await postService.getPostById(req.validated.params.id, req.user)
    sendSuccess(res, data, 'Post fetched successfully')
  } catch (error) {
    next(error)
  }
}

export async function getPostBySlug(req, res, next) {
  try {
    const data = await postService.getPostBySlug(req.validated.params.slug, req.user)
    sendSuccess(res, data, 'Post fetched successfully')
  } catch (error) {
    next(error)
  }
}

export async function getMyPosts(req, res, next) {
  try {
    const data = await postService.getMyPosts(req.user, req.validated.query)
    sendSuccess(res, data?.items ?? [], 'Posts fetched successfully', HTTP_STATUS.OK, data?.pagination)
  } catch (error) {
    next(error)
  }
}

export async function updatePost(req, res, next) {
  try {
    const data = await postService.updatePost(req.user, req.validated.params.id, req.validated.body, {
      ipAddress: requestIp(req),
    })
    sendSuccess(res, data, 'Post updated successfully')
  } catch (error) {
    next(error)
  }
}

export async function deletePost(req, res, next) {
  try {
    await postService.softDeletePost(req.user, req.validated.params.id, {
      ipAddress: requestIp(req),
    })
    sendSuccess(res, null, 'Post deleted successfully')
  } catch (error) {
    next(error)
  }
}
