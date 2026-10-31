import { LayoutGrid, Pause, Play, RotateCcw, Share2, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { ThemeToggle } from '@components/common/ThemeToggle'
import { ROUTES } from '@config/routes'
import { SCENES } from '@data/scenes'
import { resetScene, setMode } from '@features/scenario/director'
import { RATES, simActions, useSim, type Mode } from '@features/scenario/store'
import { cn } from '@lib/cn'
import { formatSimDate, formatSimTime } from '@lib/format'
import { playSound } from '@lib/sfx'
import { setVoiceMuted, useSound } from '@lib/voice'

const CHANNELS = ['WhatsApp', 'Meta Ads', 'Google Ads', 'Lead Inbox']
const MODES: { id: Mode; label: string }[] = [
  { id: 'manual', label: 'Manual' },
  { id: 'auto', label: 'Auto-play' },
]

const segment = (on: boolean) =>
  cn('h-6 rounded-md px-2.5 text-[11px] font-semibold transition-colors', on ? 'bg-surface text-ink shadow-sm' : 'text-ink-3 hover:text-ink')
const ghostBtn = 'flex h-8 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 text-xs font-semibold hover:bg-surface-2'

export function TopBar() {
  const clock = useSim((s) => s.clock)
  const mode = useSim((s) => s.mode)
  const rate = useSim((s) => s.rate)
  const sound = useSound()
  const status = clock.running ? 'Running' : 'Paused'

  return (
    <header className="shrink-0 border-b border-line bg-surface">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2">
        <Link to={ROUTES.home} className="flex shrink-0 items-center gap-2" aria-label="Lead Engine, all scenes">
          <span className="flex size-7 items-center justify-center rounded-lg bg-navy text-white">
            <Share2 className="size-3.5" aria-hidden />
          </span>
          <span className="text-sm font-bold tracking-tight">Lead Engine</span>
        </Link>

        <nav aria-label="Scenes" className="flex flex-1 flex-wrap justify-center gap-1">
          {SCENES.map((scene) => (
            <NavLink
              key={scene.id}
              to={ROUTES.scene(scene.id)}
              className={({ isActive }) =>
                cn(
                  'flex h-7 items-center gap-1.5 rounded-md border px-2 text-xs font-semibold transition-colors',
                  isActive
                    ? 'border-navy bg-navy text-white dark:border-brand dark:bg-brand dark:text-brand-fg'
                    : 'border-line bg-surface text-ink-2 hover:border-ink-3',
                )
              }
              title={scene.title}
            >
              {({ isActive }) => (
                <>
                  <span className={cn('font-mono text-[10px]', isActive ? 'opacity-70' : 'text-ink-3')}>{scene.number}</span>
                  {scene.tab}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <div role="group" aria-label="Mode" className="flex rounded-lg bg-surface-2 p-[3px]">
            {MODES.map((m) => (
              <button key={m.id} type="button" aria-pressed={mode === m.id} className={segment(mode === m.id)} onClick={() => setMode(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={resetScene} className={ghostBtn}>
            <RotateCcw className="size-3.5" aria-hidden /> Reset
          </button>
          <Link to={ROUTES.home} aria-label="All scenes" className={cn(ghostBtn, 'w-8 justify-center px-0')}>
            <LayoutGrid className="size-3.5" aria-hidden />
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line bg-bg/60 px-4 py-1.5">
        <button
          type="button"
          aria-label={clock.running ? 'Pause clock' : 'Start clock'}
          onClick={simActions.toggleClock}
          className="flex size-7 items-center justify-center rounded-md bg-navy text-white dark:bg-brand dark:text-brand-fg"
        >
          {clock.running ? <Pause className="size-3.5" fill="currentColor" aria-hidden /> : <Play className="size-3.5" fill="currentColor" aria-hidden />}
        </button>

        <div role="group" aria-label="Speed" className="flex items-center rounded-lg bg-surface-2 p-[3px]">
          <span className="px-1.5 text-[11px] font-semibold text-ink-3">Speed</span>
          {RATES.map((r) => (
            <button key={r} type="button" aria-pressed={rate === r} className={cn(segment(rate === r), 'min-w-9 font-mono')} onClick={() => simActions.setRate(r)}>
              {r}×
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-pressed={!sound.muted}
          onClick={() => {
            setVoiceMuted(!sound.muted)
            // A short ding confirms the speakers work.
            if (sound.muted) setTimeout(() => playSound('received'), 50)
          }}
          title="Chat, call and Urdu voice sounds. Voices play at 1× and 2×."
          className={cn(ghostBtn, 'h-7', sound.blocked && !sound.muted && 'border-warning bg-warning/15 text-ink')}
        >
          {sound.muted ? <VolumeX className="size-3.5" aria-hidden /> : <Volume2 className="size-3.5" aria-hidden />}
          {sound.muted ? 'Sound off' : sound.blocked ? 'Click to enable sound' : rate > 2 ? 'Sound on · voice at 1×/2×' : 'Sound on'}
        </button>

        <button type="button" disabled title="This scene has no timed events" className={cn(ghostBtn, 'h-7 disabled:opacity-50')}>
          <SkipForward className="size-3" aria-hidden /> Jump to next event
        </button>

        <div className="flex items-baseline gap-2">
          <span className="text-xs text-ink-3">{formatSimDate(clock.now)}</span>
          <span className="font-mono text-sm font-semibold tabular">{formatSimTime(clock.now)}</span>
          <span className="flex items-center gap-1.5 text-[11px] text-ink-3">
            <span className={cn('size-1.5 rounded-full', clock.running ? 'bg-success' : 'bg-ink-3/50')} />
            {status}
          </span>
        </div>

        <ul aria-label="Channels" className="ml-auto hidden flex-wrap gap-3 text-[11px] text-ink-2 md:flex">
          {CHANNELS.map((c) => (
            <li key={c} className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success" />
              {c}
            </li>
          ))}
          <li className="text-ink-3">simulated, ready</li>
        </ul>
      </div>
    </header>
  )
}
