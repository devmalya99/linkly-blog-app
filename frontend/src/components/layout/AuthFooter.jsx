export function AuthFooter() {
  return (
    <footer className="mt-auto w-full py-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 font-meta-sm text-meta-sm text-text-muted sm:flex-row">
        <div className="flex items-center gap-6">
          <span>© 2025 Inkly Publishing Corp.</span>
          <span className="hidden sm:inline">·</span>
          <a className="transition-colors hover:text-text-primary" href="#privacy">
            Privacy
          </a>
          <a className="transition-colors hover:text-text-primary" href="#terms">
            Terms
          </a>
          <a className="transition-colors hover:text-text-primary" href="#security">
            Security
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-status-success" />
          <span>All systems operational</span>
        </div>
      </div>
    </footer>
  )
}
