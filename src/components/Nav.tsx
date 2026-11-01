import { profile } from '../data/content'

const links = [
  { href: '#education', label: 'Education' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2 text-sm font-bold text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
            {profile.initials}
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>
        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden text-sm font-medium text-muted transition-colors hover:text-brand sm:inline"
            >
              {link.label}
            </a>
          ))}
          <a
            href={profile.resumeUrl}
            download
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Resume
          </a>
        </nav>
      </div>
    </header>
  )
}
