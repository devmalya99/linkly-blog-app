import { adminService } from '../services/admin.service.js'
import { sendSuccess } from '../utils/response.js'

function requestIp(req) {
  return req.ip || req.socket?.remoteAddress
}

export async function getDashboard(req, res, next) {
  try {
    const data = await adminService.getDashboard()
    sendSuccess(res, data, 'Dashboard fetched successfully')
  } catch (error) {
    next(error)
  }
}

export async function listUsers(req, res, next) {
  try {
    const data = await adminService.listUsers(req.validated.query)
    sendSuccess(res, data?.items ?? [], 'Users fetched successfully', 200, data?.pagination)
  } catch (error) {
    next(error)
  }
}

export async function getUser(req, res, next) {
  try {
    const data = await adminService.getUser(req.validated.params.id)
    sendSuccess(res, data, 'User fetched successfully')
  } catch (error) {
    next(error)
  }
}

export async function updateUser(req, res, next) {
  try {
    const data = await adminService.updateUser(
      req.user,
      req.validated.params.id,
      req.validated.body,
    )
    sendSuccess(res, data, 'User updated successfully')
  } catch (error) {
    next(error)
  }
}

export async function deleteUser(req, res, next) {
  try {
    await adminService.deleteUser(req.user, req.validated.params.id, {
      ipAddress: requestIp(req),
    })
    sendSuccess(res, null, 'User deleted successfully')
  } catch (error) {
    next(error)
  }
}

export async function listPosts(req, res, next) {
  try {
    const data = await adminService.listPosts(req.validated.query)
    sendSuccess(res, data?.items ?? [], 'Posts fetched successfully', 200, data?.pagination)
  } catch (error) {
    next(error)
  }
}

export async function updatePost(req, res, next) {
  try {
    const data = await adminService.updatePost(req.validated.params.id, req.validated.body)
    sendSuccess(res, data, 'Post updated successfully')
  } catch (error) {
    next(error)
  }
}

export async function deletePost(req, res, next) {
  try {
    await adminService.deletePost(req.user, req.validated.params.id, {
      ipAddress: requestIp(req),
    })
    sendSuccess(res, null, 'Post deleted successfully')
  } catch (error) {
    next(error)
  }
}

export async function listComments(req, res, next) {
  try {
    const data = await adminService.listComments(req.validated.query)
    sendSuccess(res, data?.items ?? [], 'Comments fetched successfully', 200, data?.pagination)
  } catch (error) {
    next(error)
  }
}

export async function updateComment(req, res, next) {
  try {
    const data = await adminService.updateComment(req.validated.params.id, req.validated.body)
    sendSuccess(res, data, 'Comment updated successfully')
  } catch (error) {
    next(error)
  }
}

export async function deleteComment(req, res, next) {
  try {
    await adminService.deleteComment(req.validated.params.id)
    sendSuccess(res, null, 'Comment deleted successfully')
  } catch (error) {
    next(error)
  }
}
