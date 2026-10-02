import { followService } from '../services/follow.service.js'
import { HTTP_STATUS } from '../constants/errors.js'
import { sendSuccess } from '../utils/response.js'

export async function followUser(req, res, next) {
  try {
    const data = await followService.followUser(req.user, req.validated.params.userId)
    sendSuccess(res, data, 'Author followed successfully', HTTP_STATUS.CREATED)
  } catch (error) {
    next(error)
  }
}

export async function unfollowUser(req, res, next) {
  try {
    await followService.unfollowUser(req.user, req.validated.params.userId)
    sendSuccess(res, null, 'Author unfollowed successfully')
  } catch (error) {
    next(error)
  }
}

export async function listMyFollows(req, res, next) {
  try {
    const data = await followService.listMyFollows(req.user)
    sendSuccess(res, data, 'Following list fetched successfully')
  } catch (error) {
    next(error)
  }
}

export async function getSuggestions(req, res, next) {
  try {
    const data = await followService.getSuggestions(req.user, req.validated.query)
    sendSuccess(res, data, 'Author suggestions fetched successfully')
  } catch (error) {
    next(error)
  }
}
