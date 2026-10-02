import { useQuery } from '@tanstack/react-query'
import { feedQueryOptions } from '../queries'
import { FEED_PAGE_SIZE, FEED_TABS } from '../constants/feedContent'
import { buildFeedQueryParams, getOrCreateFeedSeed } from '../utils/feedView'

function toListData(response) {
  return {
    posts: Array.isArray(response?.data) ? response.data : [],
    pagination: response?.pagination || null,
  }
}

export function useFeed({ tab, category, page }) {
  const seed = tab === FEED_TABS.FOR_YOU ? getOrCreateFeedSeed() : undefined
  const params = buildFeedQueryParams({
    tab,
    category,
    page,
    limit: FEED_PAGE_SIZE,
    seed,
  })

  const query = useQuery({
    ...feedQueryOptions(params),
    select: toListData,
  })

  return {
    posts: query.data?.posts ?? [],
    pagination: query.data?.pagination ?? null,
    isLoading: query.isLoading,
    error: query.error?.message || (query.isError ? 'Unable to load feed.' : ''),
    reload: () => query.refetch(),
  }
}
