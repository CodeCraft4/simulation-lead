import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2, RotateCcw } from 'lucide-react'
import { playNextCue, resetScene } from '@features/scenario/director'
import { useSim } from '@features/scenario/store'
import type { Scene } from '@features/scenario/types'
import { cn } from '@lib/cn'

const SHORTCUTS = [
  ['→', 'next cue'],
  ['Space', 'clock'],
  ['R', 'reset'],
  ['1–9', 'scene'],
]

export function CuePanel({ scene }: { scene: Scene }) {
  const done = useSim((s) => s.done)
  const playing = useSim((s) => s.playing)
  const status = useSim((s) => s.status)
  const mode = useSim((s) => s.mode)
  const finished = done >= scene.cues.length
  const noteCue = scene.cues[Math.min(done, scene.cues.length - 1)]

  return (
    <aside
      aria-label="Presenter cues"
      className="flex flex-col gap-3.5 rounded-2xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(11,31,77,.06),0_8px_24px_rgba(11,31,77,.06)]"
    >
      <div>
        <p className="text-[11px] font-semibold text-ink-3">
          Scene {scene.number} · about {scene.minutes} min
        </p>
        <h2 className="mt-0.5 text-base font-bold tracking-tight">{scene.title}</h2>
      </div>

      <ol className="flex flex-col gap-1.5">
        {scene.cues.map((cue, i) => {
          const isDone = i < done
          const isNext = i === done
          const isPlaying = isNext && playing
          return (
            <li key={cue.id}>
              <button
                type="button"
                onClick={playNextCue}
                disabled={!isNext || playing || mode === 'auto'}
                className={cn(
                  'flex min-h-9 w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[13px] font-semibold transition-colors',
                  isNext && 'border-navy bg-navy text-white enabled:hover:bg-navy-2 dark:border-brand dark:bg-brand dark:text-brand-fg',
                  isDone && 'border-line bg-surface-2/60 text-ink-3',
                  !isNext && !isDone && 'border-line text-ink',
                  'disabled:cursor-default',
                )}
              >
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px]',
                    isNext ? 'bg-white text-navy' : isDone ? 'bg-success/15 text-success' : 'bg-surface-2 text-ink-3',
                  )}
                >
                  {isPlaying ? <Loader2 className="size-3 animate-spin" aria-hidden /> : isDone ? <Check className="size-3" aria-hidden /> : i + 1}
                </span>
                <span className="flex-1">{cue.label}</span>
                {isNext && !playing && <kbd className="font-mono text-[10px] opacity-70">→</kbd>}
              </button>
            </li>
          )
        })}
      </ol>

      <p className="flex min-h-4 items-center gap-2 text-xs text-ink-2" aria-live="polite">
        <span className={cn('size-1.5 shrink-0 rounded-full', playing ? 'animate-pulse bg-accent' : 'bg-success')} />
        {status || (mode === 'auto' ? 'Auto-play is on' : 'Click the highlighted cue to start')}
      </p>

      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-accent/12 p-3"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-accent">Takeaway</p>
            <p className="mt-0.5 text-[13px] font-semibold leading-snug">{scene.takeaway}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {noteCue?.notes && (
        <div className="border-t border-line pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Presenter notes</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-2">{noteCue.notes}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
        <ul className="flex flex-wrap gap-x-2.5 gap-y-1 text-[10px] text-ink-3">
          {SHORTCUTS.map(([key, label]) => (
            <li key={key}>
              <kbd className="font-mono font-semibold text-ink-2">{key}</kbd> {label}
            </li>
          ))}
        </ul>
        {finished && (
          <button type="button" onClick={resetScene} className="flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-2 hover:underline">
            <RotateCcw className="size-3" aria-hidden /> Replay
          </button>
        )}
      </div>
    </aside>
  )
}
