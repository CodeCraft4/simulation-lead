import { ChevronLeft } from 'lucide-react'
import { createContext, useContext, type ReactNode } from 'react'
import type { AppTabId } from '@config/navigation'

/** Every screen of the app. Tabs are roots; the others are pushed on top. */
export type AppRoute =
  | { name: AppTabId }
  | { name: 'lead'; id: string }
  | { name: 'chat'; id: string }
  | { name: 'call'; id: string }
  | { name: 'broadcast' }

export interface AppNav {
  push: (route: AppRoute) => void
  back: () => void
}

export const NavContext = createContext<AppNav | null>(null)

export function useAppNav() {
  const nav = useContext(NavContext)
  if (!nav) throw new Error('useAppNav must be used inside <MobileApp>')
  return nav
}

/** Dark blue header used by every app screen, with an optional back link. */
export function ScreenHeader({
  title,
  eyebrow,
  back,
  action,
  children,
}: {
  title: ReactNode
  eyebrow?: string
  back?: string
  action?: ReactNode
  children?: ReactNode
}) {
  const nav = useAppNav()
  return (
    <header className="shrink-0 bg-navy px-5 pb-4 pt-[60px] text-white">
      {back && (
        <button type="button" onClick={nav.back} className="-ml-1 mb-1 flex items-center gap-0.5 text-[15px] font-semibold text-navy-soft">
          <ChevronLeft className="size-[18px]" aria-hidden /> {back}
        </button>
      )}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && <p className="text-sm text-navy-soft">{eyebrow}</p>}
          <h2 className="truncate text-[26px] font-extrabold tracking-tight">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </header>
  )
}
