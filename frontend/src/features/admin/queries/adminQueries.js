import { queryOptions } from '@tanstack/react-query'
import { getAdminDashboard, getAdminPosts, getAdminUser, getAdminUsers } from '../api/adminApi'
import { adminKeys } from './adminKeys'

export function adminDashboardQueryOptions() {
  return queryOptions({
    queryKey: adminKeys.dashboard(),
    queryFn: () => getAdminDashboard(),
  })
}

export function adminPostsQueryOptions(params = {}) {
  return queryOptions({
    queryKey: adminKeys.postsList(params),
    queryFn: () => getAdminPosts(params),
  })
}

export function adminUsersQueryOptions(params = {}) {
  return queryOptions({
    queryKey: adminKeys.usersList(params),
    queryFn: () => getAdminUsers(params),
  })
}

export function adminUserQueryOptions(id) {
  return queryOptions({
    queryKey: adminKeys.userDetail(id),
    queryFn: () => getAdminUser(id),
    enabled: Boolean(id),
  })
}
