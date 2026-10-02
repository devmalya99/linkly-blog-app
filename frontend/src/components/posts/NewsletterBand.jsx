import { useState } from 'react'
import { Button } from '../common/Button'

export function NewsletterBand() {
  const [email, setEmail] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <section className="bg-[#f3f1ec]">
      <div className="mx-auto max-w-[640px] px-6 py-16 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-surface-white text-primary-container">
          <span className="material-symbols-outlined text-[20px]">mail</span>
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary">Stay curious.</h2>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          Get the best new stories from Inkly delivered to your inbox every Sunday morning. No algorithms, zero
          clickbait, no spam — ever.
        </p>
        <form className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            className="h-11 flex-1 rounded-lg border border-border-subtle bg-surface-white px-4 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary-container"
            id="newsletter-email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
            type="email"
            value={email}
          />
          <Button appearance="compact" className="h-11" type="submit">
            Subscribe
          </Button>
        </form>
        <p className="mt-3 text-xs text-text-muted">
          <span className="text-status-success">●</span> Join 14,000+ weekly readers · Unsubscribe anytime
        </p>
      </div>
    </section>
  )
}
