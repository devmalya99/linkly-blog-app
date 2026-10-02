import { queryOptions } from '@tanstack/react-query'
import { fetchCurrentUser } from '../api/authApi'
import { authKeys } from './authKeys'

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: authKeys.me(),
    queryFn: fetchCurrentUser,
  })
}
