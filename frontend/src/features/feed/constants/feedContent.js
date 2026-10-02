export const FEED_PAGE_SIZE = 5

export const FEED_TABS = {
  FOR_YOU: 'for-you',
  FOLLOWING: 'following',
  TRENDING: 'trending',
  CATEGORY: 'category',
}

export const FEED_SEED_STORAGE_KEY = 'inkly.feed.seed'

export const FEED_COPY = {
  title: 'Home',
  subtitle: 'Stories curated for how you read on Inkly.',
  emptyForYou: 'No published posts yet.',
  emptyTrending: 'Nothing trending in the last 7 days.',
  emptyFollowing: 'You are not following anyone yet. Follow authors from the suggestions on the right.',
  emptyCategory: 'No posts in this category yet.',
  authorsTitle: 'Authors to follow',
  authorsEmpty: 'No author suggestions right now.',
  follow: 'Follow',
  following: 'Following',
  loading: 'Loading feed…',
  error: 'Unable to load feed.',
}

export const FIXED_FEED_TABS = [
  { id: FEED_TABS.FOR_YOU, label: 'For You', tab: FEED_TABS.FOR_YOU },
  { id: FEED_TABS.FOLLOWING, label: 'Following', tab: FEED_TABS.FOLLOWING },
  { id: FEED_TABS.TRENDING, label: 'Trending', tab: FEED_TABS.TRENDING },
]
