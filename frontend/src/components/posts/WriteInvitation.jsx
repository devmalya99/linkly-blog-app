import { useNavigate } from 'react-router-dom'
import { Button } from '../common/Button'
import { ROUTES } from '../../utils/constants'

export function WriteInvitation() {
  const navigate = useNavigate()

  return (
    <section className="bg-surface-white" id="write">
      <div className="mx-auto max-w-[1120px] px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-[#161616] px-8 py-12 text-white sm:px-12">
          <div className="pointer-events-none absolute top-8 right-8 hidden text-white/10 sm:block" aria-hidden="true">
            <span className="material-symbols-outlined text-[140px]">north_east</span>
          </div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase">Invitation to write</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">
            You have a story.
            <span className="mt-1 block text-primary-container">Ink it.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
            Turn your ideas into something people can read, remember, and share. Join thousands of independent
            thinkers, engineers, designers, and essayists.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button appearance="compact" onClick={() => navigate(ROUTES.REGISTER)}>
              Start Writing Today
            </Button>
            <Button appearance="text" className="text-white hover:text-white" onClick={() => {
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Learn about publishing on Inkly
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
