import { CHANNELS } from './homeContent'
import { Button } from '../common/Button'

export function InterestChannels() {
  return (
    <section className="bg-[#f7f6f4]" id="categories">
      <div className="mx-auto max-w-[1120px] px-6 py-16 text-center">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-text-muted uppercase">Curated channels</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">Explore by interest</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-text-muted">
          Dive into domains cultivated by specialist writers and devoted thinkers.
        </p>
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2.5">
          {CHANNELS.map((channel) => (
            <Button appearance="chip" key={channel.label}>
              <span className="material-symbols-outlined text-[16px] text-text-muted">{channel.icon}</span>
              {channel.label}
              <span className="text-text-muted">{channel.count}</span>
            </Button>
          ))}
          <Button appearance="text">
            View all topics
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
