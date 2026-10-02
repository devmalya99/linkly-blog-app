import { FeedPostCard } from './FeedPostCard'

export function FeedPostList({ posts }) {
  if (!posts.length) return null

  return (
    <ul className="divide-y divide-border-subtle border-y border-border-subtle">
      {posts.map((post) => (
        <FeedPostCard key={post.id} post={post} />
      ))}
    </ul>
  )
}
