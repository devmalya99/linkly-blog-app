import { loginUser, logoutUser, registerUser } from '../api/authApi'
import { authKeys } from './authKeys'

export function registerMutationOptions() {
  return {
    mutationFn: (payload) => registerUser(payload),
  }
}

export function loginMutationOptions(queryClient, onSession) {
  return {
    mutationFn: (payload) => loginUser(payload),
    onSuccess: (response) => {
      onSession?.({
        accessToken: response.data.accessToken,
        user: response.data.user,
      })
      queryClient.setQueryData(authKeys.me(), { data: response.data.user })
    },
  }
}

export function logoutMutationOptions(queryClient, onSessionCleared) {
  return {
    mutationFn: () => logoutUser(),
    onSettled: () => {
      queryClient.removeQueries({ queryKey: authKeys.all })
      onSessionCleared?.()
    },
  }
}
