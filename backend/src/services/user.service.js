import { AppError, HTTP_STATUS } from '../constants/errors.js'

function pending(action) {
  throw new AppError(`${action} is not implemented yet`, HTTP_STATUS.NOT_IMPLEMENTED)
}

export const userService = {
  getProfile() {
    pending('getProfile')
  },
  updateProfile() {
    pending('updateProfile')
  },
}
