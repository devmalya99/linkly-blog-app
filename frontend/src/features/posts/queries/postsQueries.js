import { queryOptions } from '@tanstack/react-query'
import {
  getMyPosts,
  getPostById,
  getPostBySlug,
  getPosts,
  getRecentPosts,
  getRecommendedPosts,
  getSharedPost,
} from '../api/postsApi'
import { postsKeys } from './postsKeys'

export function myPostsQueryOptions(params = {}) {
  return queryOptions({
    queryKey: postsKeys.myList(params),
    queryFn: () => getMyPosts(params),
  })
}

export function publicPostsQueryOptions(params = {}) {
  return queryOptions({
    queryKey: postsKeys.list(params),
    queryFn: () => getPosts(params),
  })
}

export function recentPostsQueryOptions(limit = 5) {
  return queryOptions({
    queryKey: postsKeys.recent(limit),
    queryFn: () => getRecentPosts({ limit }),
  })
}

export function recommendedPostsQueryOptions(id) {
  return queryOptions({
    queryKey: postsKeys.recommended(id),
    queryFn: () => getRecommendedPosts(id),
    enabled: Boolean(id),
  })
}

export function postByIdQueryOptions(id) {
  return queryOptions({
    queryKey: postsKeys.detail(id),
    queryFn: () => getPostById(id),
    enabled: Boolean(id),
  })
}

export function postBySlugQueryOptions(slug) {
  return queryOptions({
    queryKey: postsKeys.bySlug(slug),
    queryFn: () => getPostBySlug(slug),
    enabled: Boolean(slug),
  })
}

export function sharedPostQueryOptions(id) {
  return queryOptions({
    queryKey: postsKeys.shared(id),
    queryFn: () => getSharedPost(id),
    enabled: Boolean(id),
  })
}
