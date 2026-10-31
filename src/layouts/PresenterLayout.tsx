import { NavLink, Outlet } from 'react-router'
import { BrandMark } from '@components/common/BrandMark'
import { ThemeToggle } from '@components/common/ThemeToggle'
import { Badge } from '@components/ui/Badge'
import { ROUTES } from '@config/routes'
import { cn } from '@lib/cn'

const NAV = [
  { to: ROUTES.home, label: 'Scenes', end: true },
  { to: ROUTES.app, label: 'Mobile app', end: false },
]

/** Shell for the home and app pages: top bar + content, one screen high. Only the content scrolls, on small screens. */
export function PresenterLayout() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="shrink-0 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
          <BrandMark />
          <nav aria-label="Sections" className="flex gap-1 rounded-xl bg-surface-2 p-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors',
                    isActive ? 'bg-surface text-ink shadow-sm' : 'text-ink-3 hover:text-ink',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Badge tone="brand">Simulated data</Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto min-h-0 w-full max-w-[1440px] flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:py-6">
        <Outlet />
      </main>
    </div>
  )
}
