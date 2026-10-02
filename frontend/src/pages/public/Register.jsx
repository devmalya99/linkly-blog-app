import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from '@ninna-ui/feedback'
import { Button } from '../../components/common/Button'
import { FacebookIcon } from '../../components/common/FacebookIcon'
import { GoogleIcon } from '../../components/common/GoogleIcon'
import { AuthFooter } from '../../components/layout/AuthFooter'
import { getGoogleAuthUrl, useAuth } from '../../features/auth'
import { ApiError } from '../../services/api/client'
import { PASSWORD_HINT, ROUTES } from '../../utils/constants'

const fieldClassName =
  'h-11 w-full rounded-lg bg-surface-container-low px-3.5 font-body-sm text-body-sm text-text-primary placeholder:text-text-muted transition-all focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container/20'

function BookMark({ className }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path d="M4 19V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13" />
      <path d="M4 10l8 6 8-6" />
    </svg>
  )
}

function PasswordField({ id, label, placeholder, autoComplete, value, onChange }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-label-md text-label-md text-text-primary" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          autoComplete={autoComplete}
          className={`${fieldClassName} pr-10`}
          id={id}
          name={id}
          onChange={onChange}
          placeholder={placeholder}
          required
          type={visible ? 'text' : 'password'}
          value={value}
        />
        <Button
          appearance="icon"
          aria-label={`Toggle ${label.toLowerCase()} visibility`}
          className="absolute top-1/2 right-3 -translate-y-1/2"
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">
            {visible ? 'visibility_off' : 'visibility'}
          </span>
        </Button>
      </div>
    </div>
  )
}

export function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!acceptedTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      })
      navigate(ROUTES.LOGIN, {
        replace: true,
        state: { registered: true, email: email.trim() },
      })
    } catch (err) {
      const details = err instanceof ApiError ? err.data?.errors : null
      const detailMessage = Array.isArray(details)
        ? details.map((item) => item.message || item).join(' ')
        : null
      setError(detailMessage || (err instanceof ApiError ? err.message : 'Unable to create account.'))
    } finally {
      setIsSubmitting(false)
    }
  }
 // 📌 The browser leaves the SPA and navigates to your backend’s Google OAuth start route.
  function handleGoogleLogin() {
    window.location.assign(getGoogleAuthUrl())
  }

  return (
    <main className="flex min-h-screen flex-col bg-background-warm font-body-md text-body-md text-text-primary antialiased selection:bg-primary-container selection:text-on-primary">
      <header className="sticky top-0 z-50 w-full bg-surface-container-lowest/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link className="group flex items-center gap-3" to={ROUTES.HOME}>
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-text-primary shadow-sm transition-transform duration-200 group-hover:scale-105">
              <span className="absolute top-1.5 h-1.5 w-1.5 rounded-full bg-primary-container" />
              <BookMark className="mt-1 h-5 w-5 text-surface-container-lowest" />
            </span>
            <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-text-primary">
              Inkly
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden font-body-sm text-body-sm text-text-muted sm:inline-block">
              Already have an account?
            </span>
            <Link
              className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label-md text-label-md text-text-primary transition-colors duration-200 hover:bg-surface-container"
              to={ROUTES.LOGIN}
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <section className="flex w-full flex-1 flex-col items-center px-4 py-12 md:py-16">
        <div className="relative my-auto w-full max-w-[420px] rounded-xl bg-surface-container-lowest p-8 shadow-sm sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-text-primary shadow-sm">
              <span className="absolute top-2 h-2 w-2 rounded-full bg-primary-container" />
              <BookMark className="mt-1.5 h-8 w-8 text-surface-container-lowest" />
            </span>
            <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-text-primary">
              Create your account
            </h1>
            <p className="mt-2 max-w-[280px] font-body-sm text-body-sm text-text-muted">
              Join Inkly and start publishing thoughts that matter.
            </p>
          </div>

          {error ? (
            <Alert className="mb-4" color="danger" description={error} />
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-text-primary" htmlFor="name">
                Full Name
              </label>
              <input
                autoComplete="name"
                className={fieldClassName}
                id="name"
                name="name"
                onChange={(event) => setName(event.target.value)}
                placeholder="Elena Rostova"
                required
                type="text"
                value={name}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-text-primary" htmlFor="email">
                Email address
              </label>
              <input
                autoComplete="email"
                className={fieldClassName}
                id="email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="elena@example.com"
                required
                type="email"
                value={email}
              />
            </div>

            <PasswordField
              autoComplete="new-password"
              id="password"
              label="Password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              value={password}
            />
            <p className="-mt-2 font-meta-sm text-meta-sm text-text-muted">{PASSWORD_HINT}</p>

            <PasswordField
              autoComplete="new-password"
              id="confirm-password"
              label="Confirm Password"
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter your password"
              value={confirmPassword}
            />

            <div className="pt-1.5 pb-2">
              <label className="flex cursor-pointer items-start gap-3 select-none" htmlFor="terms">
                <span className="relative mt-0.5 flex items-center justify-center">
                  <input
                    checked={acceptedTerms}
                    className="peer sr-only"
                    id="terms"
                    name="terms"
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                    type="checkbox"
                  />
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-surface-container-low transition-colors peer-checked:bg-primary-container peer-checked:[&_svg]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-container/30">
                    <svg
                      aria-hidden="true"
                      className="h-3 w-3 text-on-primary opacity-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
                <span className="font-body-sm text-body-sm leading-tight text-text-muted">
                  I agree to the{' '}
                  <a
                    className="text-text-primary underline underline-offset-2 transition-colors hover:text-primary-container"
                    href="#terms"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    className="text-text-primary underline underline-offset-2 transition-colors hover:text-primary-container"
                    href="#privacy"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
            </div>

            <Button appearance="primary" disabled={isSubmitting} fullWidth type="submit">
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-7 flex items-center justify-center">
            <div className="absolute h-px w-full bg-surface-container-high" />
            <span className="relative bg-surface-container-lowest px-3 font-label-tag text-label-tag tracking-wider text-text-muted uppercase">
              OR
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <Button
              appearance="soft"
              fullWidth
              leftIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              type="button"
            >
              Continue with Google
            </Button>
            <Button appearance="soft" disabled fullWidth leftIcon={<FacebookIcon />}>
              Continue with Facebook
            </Button>
          </div>

          <p className="mt-8 pt-2 text-center font-body-sm text-body-sm text-text-muted">
            Already have an account?
            <Link
              className="ml-1 font-label-md text-label-md text-primary-container transition-colors hover:text-primary-container/80"
              to={ROUTES.LOGIN}
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <AuthFooter />
    </main>
  )
}
