import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { PublicFooter } from '../../components/layout/PublicFooter'
import { PublicHeader } from '../../components/layout/PublicHeader'
import { CuratedStories } from '../../components/posts/CuratedStories'
import { FeaturedStory } from '../../components/posts/FeaturedStory'
import { InterestChannels } from '../../components/posts/InterestChannels'
import { LatestFromInkly } from '../../components/posts/LatestFromInkly'
import { NewsletterBand } from '../../components/posts/NewsletterBand'
import { PhilosophySection } from '../../components/posts/PhilosophySection'
import { WriteInvitation } from '../../components/posts/WriteInvitation'
import { ROUTES } from '../../utils/constants'

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-white text-text-primary antialiased">
      <PublicHeader />
      <main>
        <section className="relative overflow-hidden px-6 pt-16 pb-6 text-center">
          <div className="pointer-events-none absolute inset-x-0 top-8 mx-auto h-72 max-w-3xl rounded-full bg-primary-container/10 blur-3xl" />
          <p className="relative inline-flex items-center gap-2 rounded-full bg-[#f3f1ec] px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-text-muted uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-container" />
            A mindful publishing platform
          </p>
          <h1 className="relative mx-auto mt-6 max-w-3xl text-[44px] leading-[1.05] tracking-tight sm:text-[56px]">
            <span className="block font-semibold text-text-primary">Ideas worth reading.</span>
            <span className="mt-1 block font-newsreader text-[0.96em] font-medium text-[#2c2c2c] italic">
              Stories worth sharing.
            </span>
          </h1>
          <p className="relative mx-auto mt-5 max-w-xl text-[15px] leading-7 text-text-muted">
            Discover thoughtful stories, perspectives, and ideas — or publish something worth remembering in a space
            engineered for clarity.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button appearance="primary" onClick={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Stories
            </Button>
            <Button appearance="secondary" onClick={() => navigate(ROUTES.REGISTER)}>
              Start Writing
            </Button>
            <Button appearance="text" onClick={() => navigate(ROUTES.REGISTER)}>
              Join Inkly
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Button>
          </div>
        </section>
        <FeaturedStory />
        <CuratedStories />
        <InterestChannels />
        <PhilosophySection />
        <WriteInvitation />
        <LatestFromInkly />
        <NewsletterBand />
      </main>
      <PublicFooter />
    </div>
  )
}
