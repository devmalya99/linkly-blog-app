import { feedService } from '../services/feed.service.js'
import { sendSuccess } from '../utils/response.js'

export async function getFeed(req, res, next) {
  try {
    const data = await feedService.getFeed(req.user, req.validated.query)
    sendSuccess(res, data?.items ?? [], 'Feed fetched successfully', 200, data?.pagination)
  } catch (error) {
    next(error)
  }
}
