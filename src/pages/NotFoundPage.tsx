import { Link } from 'react-router'
import { ROUTES } from '@config/routes'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <p className="font-mono text-sm text-ink-3">404</p>
      <h1 className="text-2xl font-bold">This page does not exist</h1>
      <Link to={ROUTES.home} className="text-sm font-semibold text-brand-2 underline-offset-4 hover:underline">
        Back to the scenes
      </Link>
    </div>
  )
}
