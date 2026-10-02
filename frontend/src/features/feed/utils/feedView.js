import { FEED_SEED_STORAGE_KEY, FEED_TABS } from '../constants/feedContent'
import { POST_CATEGORIES } from '../../posts'

export function getOrCreateFeedSeed() {
  if (typeof window === 'undefined') {
    return 'server'
  }

  const existing = window.sessionStorage.getItem(FEED_SEED_STORAGE_KEY)
  if (existing) return existing

  const seed =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `seed-${Date.now()}-${Math.random().toString(36).slice(2)}`

  window.sessionStorage.setItem(FEED_SEED_STORAGE_KEY, seed)
  return seed
}

export function parseFeedSearchParams(searchParams) {
  const tab = searchParams.get('tab') || FEED_TABS.FOR_YOU
  const category = searchParams.get('category') || ''
  const page = Math.max(1, Number(searchParams.get('page') || 1) || 1)

  if (tab === FEED_TABS.CATEGORY || (category && POST_CATEGORIES.includes(category))) {
    const resolvedCategory =
      category && POST_CATEGORIES.includes(category) ? category : POST_CATEGORIES[0]
    return {
      tab: FEED_TABS.CATEGORY,
      category: resolvedCategory,
      page,
    }
  }

  if (tab === FEED_TABS.FOLLOWING || tab === FEED_TABS.TRENDING) {
    return { tab, category: '', page }
  }

  return { tab: FEED_TABS.FOR_YOU, category: '', page }
}

export function buildFeedSearchParams({ tab, category, page }) {
  const params = new URLSearchParams()

  if (tab === FEED_TABS.CATEGORY) {
    params.set('tab', FEED_TABS.CATEGORY)
    params.set('category', category)
  } else {
    params.set('tab', tab)
  }

  if (page > 1) {
    params.set('page', String(page))
  }

  return params
}

export function buildFeedQueryParams({ tab, category, page, limit, seed }) {
  const params = {
    tab,
    page,
    limit,
  }

  if (tab === FEED_TABS.FOR_YOU) {
    params.seed = seed
  }

  if (tab === FEED_TABS.CATEGORY) {
    params.category = category
  }

  return params
}

export function emptyMessageForTab(tab, copy) {
  if (tab === FEED_TABS.FOLLOWING) return copy.emptyFollowing
  if (tab === FEED_TABS.TRENDING) return copy.emptyTrending
  if (tab === FEED_TABS.CATEGORY) return copy.emptyCategory
  return copy.emptyForYou
}

export function authorInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?'
}
