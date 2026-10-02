import { apiRequest } from '../../../services/api/client'

export function uploadCoverImage(file) {
  const formData = new FormData()
  formData.append('cover', file)

  return apiRequest('/uploads/cover', {
    method: 'POST',
    body: formData,
  })
}
