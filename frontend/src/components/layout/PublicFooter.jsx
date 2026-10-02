import { Link } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Discover', href: '#stories' },
      { label: 'Topics & Categories', href: '#categories' },
      { label: 'Writing Studio', href: '#write' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#about' },
      { label: 'Press', href: '#about' },
    ],
  },
  {
    title: 'Legal & Connect',
    links: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
    ],
  },
]

export function PublicFooter() {
  return (
    <footer className="border-t border-border-subtle bg-[#f6f5f2]">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link className="text-[17px] font-semibold tracking-tight text-text-primary" to={ROUTES.HOME}>
            Inkly
          </Link>
          <p className="mt-3 max-w-[200px] text-sm leading-6 text-text-muted">
            Ideas worth reading. Stories worth sharing.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-text-muted uppercase">{column.title}</p>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a className="text-sm text-text-primary/80 hover:text-text-primary" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1120px] flex-col gap-3 border-t border-border-subtle px-6 py-5 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2024 Inkly, Inc. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </div>
      </div>
    </footer>
  )
}
