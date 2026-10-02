import { postService } from '../services/post.service.js'
import { sendSuccess } from '../utils/response.js'

export async function getSharedPost(req, res, next) {
  try {
    const data = await postService.getSharedPostById(req.validated.params.id)
    sendSuccess(res, data, 'Shared post fetched successfully')
  } catch (error) {
    next(error)
  }
}
