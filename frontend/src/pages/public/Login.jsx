import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Alert } from '@ninna-ui/feedback'
import { Button } from '../../components/common/Button'
import { GoogleIcon } from '../../components/common/GoogleIcon'
import { AuthFooter } from '../../components/layout/AuthFooter'
import { getGoogleAuthUrl, useAuth } from '../../features/auth'
import { ApiError } from '../../services/api/client'
import { ROUTES } from '../../utils/constants'

const fieldClassName =
  'h-11 w-full rounded-lg border border-border-subtle bg-surface-white px-3.5 font-body-sm text-body-sm text-text-primary placeholder:text-text-muted focus:bg-surface-white focus:shadow-[0_0_0_3px_rgba(91,91,214,0.12)] focus:outline-none'

function SignMark({ size = 18 }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="4" fill="#5B5BD6" r="2.5" />
      <path
        d="M4 19V11C4 9.34315 5.34315 8 7 8H8.5C9.60457 8 10.5 8.89543 10.5 10V14.5C10.5 15.3284 11.1716 16 12 16C12.8284 16 13.5 15.3284 13.5 14.5V10C13.5 8.89543 14.3954 8 15.5 8H17C18.6569 8 20 9.34315 20 11V19"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </svg>
  )
}

const OAUTH_ERRORS = {
  google_auth_failed: 'Google sign-in failed. Please try again.',
}

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [email, setEmail] = useState(location.state?.email || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const successMessage = location.state?.registered
    ? 'Account created. Please sign in to continue.'
    : ''

  const oauthError = useMemo(() => {
    const code = searchParams.get('error')
    return code ? OAUTH_ERRORS[code] || 'Social sign-in failed. Please try again.' : ''
  }, [searchParams])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login({ email: email.trim(), password })
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Unable to sign in. Please try again.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // 📌 The browser leaves the SPA and navigates to your backend’s Google OAuth start route.
  function handleGoogleLogin() {
    window.location.assign(getGoogleAuthUrl())
  }

  const alertMessage = error || oauthError

  return (
    <main className="flex min-h-screen flex-col bg-background-warm font-body-md text-body-md text-text-primary antialiased selection:bg-primary-container selection:text-on-primary">
      <header className="sticky top-0 z-50 flex w-full justify-center bg-background-warm/90 px-4 py-6 backdrop-blur-md">
        <div className="flex w-full max-w-[1200px] items-center justify-between">
          <Link className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80" to={ROUTES.HOME}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-text-primary text-surface-white">
              <SignMark />
            </span>
            <span className="font-headline-sm text-headline-sm tracking-tight text-text-primary">Inkly</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden font-meta-sm text-meta-sm text-text-muted sm:inline-block">Need assistance?</span>
            <a
              className="rounded-lg px-3 py-2 font-label-md text-label-md text-primary-container transition-colors hover:bg-surface-container hover:text-brand-ink"
              href="#help"
            >
              Help Center
            </a>
          </div>
        </div>
      </header>

      <section className="flex flex-1 flex-col items-center px-4 py-8 md:py-12">
        <div className="my-auto flex w-full max-w-[420px] flex-col items-center">
          <div className="relative flex w-full flex-col rounded-xl bg-surface-white p-8 shadow-sm sm:p-10">
            <div className="flex flex-col items-center text-center">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-text-primary shadow-sm">
                <SignMark size={26} />
              </span>
              <h1 className="font-headline-md text-headline-md font-bold tracking-tight text-text-primary">
                Welcome back
              </h1>
              <p className="mt-2 max-w-[320px] font-body-sm text-body-sm text-text-muted">
                Sign in to continue to your Inkly reading list.
              </p>
            </div>

            {successMessage ? (
              <Alert className="mt-6" color="success" description={successMessage} />
            ) : null}

            {alertMessage ? (
              <Alert className="mt-6" color="danger" description={alertMessage} />
            ) : null}

            <form className="mt-8 flex flex-col gap-4.5" onSubmit={handleSubmit}>
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
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={email}
                />
              </div>

              <div className="mt-1 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-text-primary" htmlFor="password">
                    Password
                  </label>
                  <a
                    className="font-label-tag text-label-tag text-primary-container uppercase transition-colors hover:underline"
                    href="#forgot-password"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <input
                    autoComplete="current-password"
                    className={`${fieldClassName} pr-11 placeholder:tracking-normal ${passwordVisible ? '' : 'tracking-widest'}`}
                    id="password"
                    name="password"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                    type={passwordVisible ? 'text' : 'password'}
                    value={password}
                  />
                  <Button
                    appearance="icon"
                    aria-label="Toggle password visibility"
                    className="absolute right-3"
                    onClick={() => setPasswordVisible((visible) => !visible)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {passwordVisible ? 'visibility_off' : 'visibility'}
                    </span>
                  </Button>
                </div>
              </div>

              <Button
                appearance="primary"
                className="mt-2.5"
                disabled={isSubmitting}
                fullWidth
                rightIcon={<span className="material-symbols-outlined text-base">arrow_forward</span>}
                type="submit"
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="h-px w-full bg-secondary-container" />
              </div>
              <span className="relative bg-surface-white px-3 font-label-tag text-label-tag tracking-wider text-text-muted uppercase">
                OR
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                appearance="social"
                fullWidth
                leftIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                type="button"
              >
                Continue with Google
              </Button>
            </div>

            <p className="mt-8 text-center font-body-sm text-body-sm text-text-muted">
              Don&apos;t have an account?
              <Link
                className="ml-1 font-label-md text-label-md font-semibold text-primary-container transition-colors hover:text-brand-ink hover:underline"
                to={ROUTES.REGISTER}
              >
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center gap-4 font-meta-sm text-meta-sm text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-status-success">lock</span>
              256-bit SSL encrypted
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              Ad-free reading
            </span>
          </div>
        </div>
      </section>

      <AuthFooter />
    </main>
  )
}
