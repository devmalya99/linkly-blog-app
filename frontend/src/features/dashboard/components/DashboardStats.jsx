import { useRecentComments } from '../../comments'
import { useMyPosts } from '../../posts'
import { DASHBOARD_STATS } from '../constants/dashboardContent'

const ICON_TONE = {
  success: 'bg-status-success/10 text-status-success',
  warning: 'bg-status-warning/10 text-status-warning',
  brand: 'bg-primary-container/10 text-primary-container',
  default: 'bg-surface-container text-text-muted',
}

const META_TONE = {
  success: 'bg-status-success/10 text-status-success',
  brand: 'bg-primary-container/10 text-primary-container',
  warning: 'text-status-warning',
}

function buildStats(posts, pagination, { commentTotal = 0, newCount = 0 } = {}) {
  const total = pagination?.total ?? posts.length
  const published = posts.filter((post) => post.status === 'published').length
  const drafts = posts.filter((post) => post.status === 'draft').length
  const ratio = total > 0 ? Math.round((published / total) * 100) : 0

  return DASHBOARD_STATS.map((stat) => {
    if (stat.id === 'total') {
      return {
        ...stat,
        value: String(total),
        meta: { type: 'badge', tone: 'success', text: `${posts.length} loaded`, icon: 'article' },
        footer: { type: 'progress', value: Math.min(100, Math.max(8, ratio || 8)) },
      }
    }
    if (stat.id === 'published') {
      return {
        ...stat,
        value: String(published),
        meta: { type: 'text', text: total ? `${ratio}% of loaded` : 'No posts yet' },
      }
    }
    if (stat.id === 'drafts') {
      return {
        ...stat,
        value: String(drafts),
        meta: {
          type: 'text',
          tone: drafts > 0 ? 'warning' : undefined,
          text: drafts > 0 ? 'Needs review' : 'All clear',
        },
      }
    }
    if (stat.id === 'comments') {
      return {
        ...stat,
        value: String(commentTotal),
        meta:
          newCount > 0
            ? { type: 'badge', tone: 'brand', text: `+${newCount} new` }
            : { type: 'text', text: 'No new this week' },
        footer: { type: 'text', text: 'On your posts' },
      }
    }
    return stat
  })
}

export function DashboardStats() {
  const { posts, pagination } = useMyPosts({ page: 1, limit: 50 })
  const { total: commentTotal, newCount } = useRecentComments(1)
  const stats = buildStats(posts, pagination, { commentTotal, newCount })

  return (
    <div className="grid grid-cols-1 gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          className="flex flex-col justify-between rounded-xl bg-surface-white p-5 shadow-sm transition-all hover:shadow-md"
          key={stat.id}
        >
          <div className="flex items-center justify-between">
            <span className="font-label-tag text-label-tag tracking-wider text-text-muted uppercase">
              {stat.label}
            </span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${ICON_TONE[stat.iconTone] || ICON_TONE.default}`}
            >
              <span className="material-symbols-outlined text-[18px]">{stat.icon}</span>
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between gap-2">
            <span className="font-headline-md text-headline-md font-bold text-text-primary">{stat.value}</span>
            {stat.meta?.type === 'badge' ? (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-label-tag text-label-tag ${META_TONE[stat.meta.tone]}`}
              >
                {stat.meta.icon ? (
                  <span className="material-symbols-outlined text-[14px]">{stat.meta.icon}</span>
                ) : null}
                {stat.meta.text}
              </span>
            ) : (
              <span
                className={`font-meta-sm text-meta-sm ${META_TONE[stat.meta?.tone] || 'text-text-muted'} ${stat.meta?.tone === 'warning' ? 'font-medium' : ''}`}
              >
                {stat.meta?.text}
              </span>
            )}
          </div>

          {stat.footer?.type === 'progress' ? (
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-container">
              <div
                className="h-full rounded-full bg-primary-container"
                style={{ width: `${stat.footer.value}%` }}
              />
            </div>
          ) : (
            <p className="mt-2 font-meta-sm text-meta-sm text-text-muted">{stat.footer?.text}</p>
          )}
        </div>
      ))}
    </div>
  )
}
