import { deleteAdminPost, deleteAdminUser, updateAdminUser } from '../api/adminApi'
import { adminKeys } from './adminKeys'

export function deleteAdminPostMutationOptions(queryClient) {
  return {
    mutationFn: (id) => deleteAdminPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all })
    },
  }
}

export function updateAdminUserMutationOptions(queryClient) {
  return {
    mutationFn: ({ id, body }) => updateAdminUser(id, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: adminKeys.userDetail(variables.id) })
      }
    },
  }
}

export function deleteAdminUserMutationOptions(queryClient) {
  return {
    mutationFn: (id) => deleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all })
    },
  }
}
