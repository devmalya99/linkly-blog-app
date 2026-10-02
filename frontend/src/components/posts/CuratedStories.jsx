import { CURATED_LEAD, CURATED_STACK } from './homeContent'
import { Button } from '../common/Button'

export function CuratedStories() {
  return (
    <section className="border-t border-border-subtle bg-surface-white" id="stories">
      <div className="mx-auto max-w-[1120px] px-6 py-16">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-primary-container uppercase">
              Curated editorial
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">Stories worth your time.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">
              Explore thoughtful writing from curious people across technology, culture, business, creativity, and
              everyday life.
            </p>
          </div>
          <Button appearance="text" className="hidden shrink-0 sm:inline-flex" onClick={() => {
            document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            Browse all stories
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Button>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-white">
            <div className="relative">
              <img alt={CURATED_LEAD.imageAlt} className="h-64 w-full object-cover" src={CURATED_LEAD.image} />
              <span className="absolute top-4 left-4 rounded-md bg-surface-white/95 px-2 py-1 text-[11px] font-semibold tracking-wide text-text-primary uppercase">
                {CURATED_LEAD.category}
              </span>
            </div>
            <div className="p-5">
              <p className="text-xs text-text-muted">{CURATED_LEAD.kicker}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-text-primary">{CURATED_LEAD.title}</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">{CURATED_LEAD.excerpt}</p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">{CURATED_LEAD.author}</p>
                  <p className="text-xs text-text-muted">{CURATED_LEAD.role}</p>
                </div>
                <Button appearance="icon" aria-label="Save story">
                  <span className="material-symbols-outlined text-[20px]">bookmark</span>
                </Button>
              </div>
            </div>
          </article>

          <div className="flex flex-col gap-5">
            {CURATED_STACK.map((story) => (
              <article className="rounded-2xl border border-border-subtle bg-[#fafaf8] p-5" key={story.title}>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-md bg-surface-white px-2 py-1 text-[11px] font-semibold tracking-wide text-text-muted uppercase">
                    {story.category}
                  </span>
                  <span className="text-xs text-text-muted">{story.readTime}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-text-primary">{story.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">{story.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-text-primary">{story.author}</span>
                  <span className="text-text-muted">{story.meta}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
