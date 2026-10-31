import {
  ArrowUpRight,
  BarChart3,
  BellRing,
  CheckCircle2,
  Clock,
  Flag,
  ListChecks,
  Megaphone,
  MessageCircle,
  Phone,
  Play,
  Rocket,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { ROUTES } from '@config/routes'
import { SCENES } from '@data/scenes'
import { setMode } from '@features/scenario/director'
import { RATES, simActions, useSim } from '@features/scenario/store'
import { cn } from '@lib/cn'

const totalMinutes = Math.round(SCENES.reduce((sum, s) => sum + s.minutes, 0))
const FIRST = SCENES[0]

const ICONS: Record<string, LucideIcon> = {
  problem: TrendingDown,
  launch: Rocket,
  'lead-arrives': MessageCircle,
  qualify: ListChecks,
  calls: Phone,
  'follow-up': BellRing,
  broadcast: Megaphone,
  results: BarChart3,
  next: Flag,
}

const CHANNELS = ['WhatsApp', 'Meta Ads', 'Google Ads']

/** Home: the story in one screen. A short intro, how to start, and one card per scene. */
export function ScenesPage() {
  const navigate = useNavigate()
  const rate = useSim((s) => s.rate)

  const start = (auto: boolean) => {
    setMode(auto ? 'auto' : 'manual')
    navigate(ROUTES.scene(FIRST.id))
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <section className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="max-w-2xl">
          <p className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-ink-3">
            {CHANNELS.map((c) => (
              <span key={c} className="rounded-full border border-line bg-surface px-2 py-0.5">
                {c}
              </span>
            ))}
            <span className="ml-1">Simulation · all data is made up</span>
          </p>
          <h1 className="mt-2.5 text-2xl font-bold tracking-tight lg:text-[32px] lg:leading-tight">
            Every ad lead answered in seconds, followed up until they buy.
          </h1>
          <p className="mt-1.5 text-sm text-ink-2">
            From the first ad click to the sale in {SCENES.length} scenes, about {totalMinutes} minutes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Speed" className="flex h-10 items-center rounded-xl bg-surface-2 p-1">
            <span className="px-2 text-xs font-semibold text-ink-3">Speed</span>
            {RATES.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={rate === r}
                onClick={() => simActions.setRate(r)}
                className={cn(
                  'h-8 min-w-10 rounded-lg font-mono text-xs font-semibold transition-colors',
                  rate === r ? 'bg-surface text-ink shadow-sm' : 'text-ink-3 hover:text-ink',
                )}
              >
                {r}×
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => start(false)}
            className="h-10 rounded-xl border border-line bg-surface px-4 text-sm font-semibold hover:bg-surface-2"
          >
            Present step by step
          </button>
          <button
            type="button"
            onClick={() => start(true)}
            className="flex h-10 items-center gap-2 rounded-xl bg-navy px-4 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(11,31,77,.25)] hover:bg-navy-2 dark:bg-brand dark:text-brand-fg"
          >
            <Play className="size-4" fill="currentColor" aria-hidden /> Auto-play
          </button>
        </div>
      </section>

      <ol className="grid min-h-0 flex-1 auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SCENES.map((scene) => {
          const Icon = ICONS[scene.id] ?? Flag
          return (
            <li key={scene.id} className="min-h-0">
              <Link
                to={ROUTES.scene(scene.id)}
                className="group relative flex h-full min-h-[112px] flex-col overflow-hidden rounded-2xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(11,31,77,.05)] transition hover:-translate-y-0.5 hover:border-brand-2 hover:shadow-[0_12px_28px_rgba(11,31,77,.10)] lg:p-5"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-5 right-1 font-mono text-[96px] font-bold leading-none text-ink/[.04] transition group-hover:text-brand-2/10"
                >
                  {scene.number}
                </span>
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy text-white dark:bg-brand dark:text-brand-fg">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-3">
                      <span className="font-mono">Scene {scene.number}</span>
                      <span aria-hidden>·</span>
                      <Clock className="size-3" aria-hidden /> {scene.minutes} min
                    </p>
                    <h2 className="truncate text-base font-bold leading-tight">{scene.title}</h2>
                  </div>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-ink-3 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-2"
                    aria-hidden
                  />
                </div>
                <p className="mt-2.5 text-sm leading-snug text-ink-2">{scene.headline}</p>
                {/* Only where the cards are tall enough: the one thing to remember from the scene. */}
                <p className="relative mt-auto hidden items-start gap-1.5 rounded-lg bg-brand-soft px-2.5 py-2 text-xs font-medium leading-snug text-brand-2 [@media(min-height:860px)]:flex">
                  <CheckCircle2 className="mt-px size-3.5 shrink-0" aria-hidden />
                  {scene.takeaway}
                </p>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
