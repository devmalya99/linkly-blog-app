function DistributionRow({ label, count, percent, tone }) {
  const barTone = {
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    danger: 'bg-status-error',
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="font-label-md text-label-md text-text-primary">{label}</span>
        <span className="font-meta-sm text-meta-sm text-text-muted">
          {count} · {percent}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
        <div
          className={`h-full rounded-full ${barTone[tone] || 'bg-primary-container'}`}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  )
}

export function AdminDistribution({ distribution }) {
  const total = distribution?.total ?? 0

  return (
    <section className="rounded-xl border border-border-subtle bg-surface-white p-5 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="font-title-md text-title-md text-text-primary">Content Distribution</h2>
        <span className="rounded-full bg-surface-container-low px-2.5 py-0.5 font-label-tag text-label-tag text-text-muted">
          {total} articles
        </span>
      </div>
      <p className="mb-6 font-body-sm text-body-sm text-text-muted">
        Published, draft, and deleted share of every article on the platform.
      </p>

      <div className="flex flex-col gap-5">
        <DistributionRow
          count={distribution?.published?.count ?? 0}
          label="Published"
          percent={distribution?.published?.percent ?? 0}
          tone="success"
        />
        <DistributionRow
          count={distribution?.draft?.count ?? 0}
          label="Draft"
          percent={distribution?.draft?.percent ?? 0}
          tone="warning"
        />
        <DistributionRow
          count={distribution?.deleted?.count ?? 0}
          label="Deleted"
          percent={distribution?.deleted?.percent ?? 0}
          tone="danger"
        />
      </div>
    </section>
  )
}
