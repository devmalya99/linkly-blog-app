import { PHILOSOPHY } from './homeContent'

export function PhilosophySection() {
  return (
    <section className="bg-[#f3f1ec]" id="about">
      <div className="mx-auto max-w-[1120px] px-6 py-16">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-primary-container uppercase">Our philosophy</p>
        <h2 className="mt-2 max-w-md text-3xl font-semibold tracking-tight text-text-primary">
          A better place for ideas.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-text-muted">
          Engineered for depth, clarity, and genuine human thought. No algorithmic engagement traps. No banner noise.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PHILOSOPHY.map((item) => (
            <article className="flex flex-col rounded-2xl bg-surface-white p-5" key={item.title}>
              <span className="material-symbols-outlined text-[22px] text-text-primary">{item.icon}</span>
              <h3 className="mt-4 text-base font-semibold text-text-primary">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-text-muted">{item.body}</p>
              <p className="mt-5 border-t border-border-subtle pt-3 text-xs text-text-muted">{item.footer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
