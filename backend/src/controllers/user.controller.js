import { userService } from '../services/user.service.js'
import { sendSuccess } from '../utils/response.js'

export async function getProfile(req, res, next) {
  try {
    const data = await userService.getProfile(req.user)
    sendSuccess(res, data, 'Profile fetched successfully')
  } catch (error) {
    next(error)
  }
}

export async function updateProfile(req, res, next) {
  try {
    const data = await userService.updateProfile(req.user, req.validated.body)
    sendSuccess(res, data, 'Profile updated successfully')
  } catch (error) {
    next(error)
  }
}
