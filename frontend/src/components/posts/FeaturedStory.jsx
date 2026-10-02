import { FEATURED_SIDES, FEATURED_STORY } from './homeContent'
import { Button } from '../common/Button'

function SideCard({ story, side }) {
  return (
    <article
      className={`absolute top-16 hidden w-[240px] rounded-2xl border border-border-subtle bg-surface-white p-5 text-left shadow-sm lg:block ${
        side === 'left' ? 'left-0 -translate-x-2' : 'right-0 translate-x-2'
      }`}
    >
      <p className="text-[11px] font-semibold tracking-[0.12em] text-text-muted uppercase">{story.category}</p>
      <h3 className="mt-3 text-base font-semibold leading-snug text-text-primary">{story.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-text-muted">{story.excerpt}</p>
      <p className="mt-4 text-sm text-text-primary">{story.author || story.readTime}</p>
    </article>
  )
}

export function FeaturedStory() {
  const story = FEATURED_STORY

  return (
    <section className="relative mx-auto max-w-[1120px] px-6 pb-20">
      <div className="relative mx-auto max-w-[640px]">
        <SideCard side="left" story={FEATURED_SIDES[0]} />
        <SideCard side="right" story={FEATURED_SIDES[1]} />
        <article className="relative z-10 overflow-hidden rounded-2xl border border-border-subtle bg-surface-white shadow-[0_20px_50px_rgba(23,23,23,0.08)]">
          <div className="relative">
            <img alt={story.imageAlt} className="h-[280px] w-full object-cover sm:h-[320px]" src={story.image} />
            <span className="absolute bottom-4 left-4 rounded-md bg-primary-container px-2.5 py-1 text-[11px] font-semibold tracking-wide text-on-primary uppercase">
              {story.category}
            </span>
            <span className="absolute right-4 bottom-4 rounded-md bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white">
              {story.badge}
            </span>
          </div>
          <div className="px-6 py-6 sm:px-8">
            <h2 className="text-[28px] leading-tight font-semibold tracking-tight text-text-primary">{story.title}</h2>
            <p className="mt-3 text-[15px] leading-7 text-text-muted">{story.excerpt}</p>
            <div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-4">
              <div className="flex items-center gap-3">
                <img alt="" className="h-9 w-9 rounded-full object-cover" src={story.avatar} />
                <div>
                  <p className="text-sm font-medium text-text-primary">{story.author}</p>
                  <p className="text-xs text-text-muted">{story.meta}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button appearance="icon" aria-label="Save story">
                  <span className="material-symbols-outlined text-[20px]">bookmark</span>
                </Button>
                <Button appearance="icon" aria-label="Share story">
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
