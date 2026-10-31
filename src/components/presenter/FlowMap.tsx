import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { FLOW_STEPS } from '@features/scenario/flow'
import { useSim } from '@features/scenario/store'
import type { FlowState } from '@features/scenario/types'
import { cn } from '@lib/cn'

const PILL: Record<FlowState, string> = {
  idle: 'border-line bg-surface text-ink-3',
  done: 'border-success/35 bg-success/10 text-success',
  active: 'border-accent bg-surface text-accent shadow-[0_0_0_3px_rgba(124,92,255,.16)]',
  leak: 'border-danger/30 bg-danger/10 text-danger',
}
const DOT: Record<FlowState, string> = {
  idle: 'bg-line',
  done: 'bg-success dark:text-bg',
  active: 'bg-accent',
  leak: 'bg-danger',
}

export function FlowMap() {
  const flow = useSim((s) => s.flow)

  return (
    <footer className="flex shrink-0 items-center gap-4 border-t border-line bg-surface px-4 py-2">
      <p className="hidden shrink-0 text-[11px] font-bold uppercase tracking-wider text-ink-3 md:block">Pipeline</p>
      <div className="min-w-0 flex-1 overflow-x-auto">
        <ol aria-label="Pipeline steps" className="flex min-w-[820px] items-center py-1">
          {FLOW_STEPS.map((step, i) => {
            const state = flow[step.id]
            const last = i === FLOW_STEPS.length - 1
            const next = flow[FLOW_STEPS[i + 1]?.id]
            const lineOn = state === 'done' && (next === 'done' || next === 'active')
            return (
              <li key={step.id} className={cn('flex items-center', !last && 'flex-1')}>
                <motion.span
                  animate={state === 'leak' ? { x: [0, -3, 3, -2, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                  className={cn(
                    'inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-xs font-semibold transition-colors duration-500',
                    PILL[state],
                  )}
                >
                  <span className={cn('flex size-4 items-center justify-center rounded-full text-[9px] font-bold text-white', DOT[state])}>
                    {state === 'done' ? <Check className="size-2.5" aria-hidden /> : state === 'leak' ? '!' : null}
                  </span>
                  {step.label}
                  <span className="sr-only"> ({state})</span>
                </motion.span>
                {!last && <span aria-hidden className={cn('mx-1 h-0.5 min-w-2 flex-1 transition-colors duration-500', lineOn ? 'bg-success' : 'bg-line')} />}
              </li>
            )
          })}
        </ol>
      </div>
    </footer>
  )
}
