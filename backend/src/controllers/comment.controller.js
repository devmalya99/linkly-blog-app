import { HTTP_STATUS } from '../constants/errors.js'
import { commentService } from '../services/comment.service.js'
import { sendSuccess } from '../utils/response.js'

export async function getComments(req, res, next) {
  try {
    const data = await commentService.getComments(req.validated.params.postId, req.validated.query)
    sendSuccess(res, data?.items ?? [], 'Comments fetched successfully', HTTP_STATUS.OK, data?.pagination)
  } catch (error) {
    next(error)
  }
}

export async function getRecentComments(req, res, next) {
  try {
    const data = await commentService.getRecentCommentsForAuthor(req.user, req.validated.query)
    sendSuccess(res, data, 'Recent comments fetched successfully')
  } catch (error) {
    next(error)
  }
}

export async function createComment(req, res, next) {
  try {
    const data = await commentService.createComment(req.user, req.validated.params.postId, req.validated.body)
    sendSuccess(res, data, 'Comment created successfully', HTTP_STATUS.CREATED)
  } catch (error) {
    next(error)
  }
}

export async function updateComment(req, res, next) {
  try {
    const data = await commentService.updateComment(req.user, req.validated.params.id, req.validated.body)
    sendSuccess(res, data, 'Comment updated successfully')
  } catch (error) {
    next(error)
  }
}

export async function deleteComment(req, res, next) {
  try {
    await commentService.deleteComment(req.user, req.validated.params.id)
    sendSuccess(res, null, 'Comment deleted successfully')
  } catch (error) {
    next(error)
  }
}
