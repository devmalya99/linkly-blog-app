const ICON_TONE = {
  success: 'bg-status-success/10 text-status-success',
  warning: 'bg-status-warning/10 text-status-warning',
  brand: 'bg-primary-container/10 text-primary-container',
  danger: 'bg-status-error/10 text-status-error',
  default: 'bg-surface-container text-text-muted',
}

function StatCard({ label, value, icon, iconTone = 'default', meta, footer }) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-surface-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="font-label-tag text-label-tag tracking-wider text-text-muted uppercase">
          {label}
        </span>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${ICON_TONE[iconTone] || ICON_TONE.default}`}
        >
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <span className="font-headline-md text-headline-md font-bold text-text-primary">{value}</span>
        {meta ? <span className="font-meta-sm text-meta-sm text-text-muted">{meta}</span> : null}
      </div>

      {footer ? <p className="mt-2 font-meta-sm text-meta-sm text-text-muted">{footer}</p> : null}
    </div>
  )
}

export function AdminStats({ counts, contentRatio }) {
  const ratioMeta =
    contentRatio && (contentRatio.published + contentRatio.draft > 0)
      ? `${contentRatio.publishedPercent}% published`
      : 'No active posts'

  return (
    <div className="grid grid-cols-1 gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        footer="Registered accounts"
        icon="group"
        iconTone="brand"
        label="Total Users"
        value={String(counts?.users ?? 0)}
      />
      <StatCard
        footer="Including deleted"
        icon="article"
        label="Total Posts"
        value={String(counts?.posts ?? 0)}
      />
      <StatCard
        footer="Across the platform"
        icon="chat_bubble_outline"
        iconTone="brand"
        label="Total Comments"
        value={String(counts?.comments ?? 0)}
      />
      <StatCard
        footer={`Draft ${contentRatio?.draftPercent ?? 0}% · Published ${contentRatio?.publishedPercent ?? 0}%`}
        icon="pie_chart"
        iconTone="success"
        label="Content Ratio"
        meta={ratioMeta}
        value={`${contentRatio?.published ?? 0}:${contentRatio?.draft ?? 0}`}
      />
    </div>
  )
}
