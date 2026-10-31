import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert } from 'lucide-react'
import { CountUp } from '@components/motion/CountUp'
import { useSim } from '@features/scenario/store'
import { COST_PER_SALE, LEAK_GROUPS, MONTHLY_SPEND, SALES } from '@features/scenes/problem/leakGroups'
import { cn } from '@lib/cn'

const NEUTRAL_DOT = 'rgba(148, 163, 184, 0.28)'
const lakh = (v: number) => `PKR ${Number(v.toFixed(1))} lakh`

/** One dot per lead, in group order, remembering its position inside the group for the stagger. */
const DOTS = LEAK_GROUPS.flatMap((group, groupIndex) =>
  Array.from({ length: group.count }, (_, i) => ({ groupIndex, color: group.color, i })),
)
const LARGEST_GROUP = Math.max(...LEAK_GROUPS.map((g) => g.count))

export function ProblemStage() {
  const spend = useSim((s) => s.vars.spend === true)
  const revealed = useSim((s) => Number(s.vars.revealed ?? 0))
  const cost = useSim((s) => s.vars.cost === true)
  const unknown = useSim((s) => s.vars.unknown === true)

  return (
    <section className="flex h-full flex-wrap gap-10 rounded-3xl border border-line bg-surface p-8 shadow-[0_1px_2px_rgba(11,31,77,.06),0_8px_24px_rgba(11,31,77,.06)]">
      {/* Left: money */}
      <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-7">
        <div>
          <p className="text-sm font-semibold text-ink-3">Spent on ads every month</p>
          <p className="mt-1.5 text-5xl font-bold tracking-tight">
            {spend ? <CountUp to={MONTHLY_SPEND.total / 1e5} duration={1.2} format={lakh} /> : <span className="text-ink-3/40">PKR —</span>}
          </p>
          <div className="mt-4 flex h-3 gap-[3px] overflow-hidden rounded-full bg-surface-2">
            <motion.div
              className="h-full bg-navy-2 dark:bg-brand-2"
              initial={false}
              animate={{ width: spend ? `${(MONTHLY_SPEND.meta / MONTHLY_SPEND.total) * 100}%` : '0%' }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
            <motion.div
              className="h-full bg-[#60A5FA]"
              initial={false}
              animate={{ width: spend ? `${(MONTHLY_SPEND.google / MONTHLY_SPEND.total) * 100}%` : '0%' }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
          <motion.div
            className="mt-2.5 flex justify-between text-sm text-ink-2"
            initial={false}
            animate={{ opacity: spend ? 1 : 0 }}
            transition={{ delay: 0.6 }}
          >
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-navy-2 dark:bg-brand-2" />
              Meta · {lakh(MONTHLY_SPEND.meta / 1e5)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-[#60A5FA]" />
              Google · {lakh(MONTHLY_SPEND.google / 1e5)}
            </span>
          </motion.div>
        </div>

        <div className="border-t border-line pt-6">
          <p className="text-sm font-semibold text-ink-3">What each sale costs today</p>
          <p className="mt-1.5 text-5xl font-bold tracking-tight text-danger">
            {cost ? (
              <CountUp to={COST_PER_SALE / 1e5} duration={1.2} format={lakh} />
            ) : (
              <span className="text-ink-3/40">PKR —</span>
            )}
          </p>
          <p className={cn('mt-1 text-sm text-ink-3 transition-opacity', cost ? 'opacity-100' : 'opacity-0')}>
            {lakh(MONTHLY_SPEND.total / 1e5)} spent ÷ {SALES} sales from 100 leads
          </p>
        </div>

        <AnimatePresence>
          {cost && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.9 }}
              className="rounded-2xl bg-surface-2 p-4 text-[15px] leading-relaxed text-ink"
            >
              Replying within 5 minutes and following up on every lead could <b>nearly double</b> the sales from the same budget.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Right: 100 leads */}
      <div className="flex min-w-0 flex-[1.4_1_420px] flex-col gap-6">
        <div>
          <p className="text-sm font-semibold text-ink-3">Follow 100 leads from one month</p>
          <div
            role="img"
            aria-label={LEAK_GROUPS.map((g) => `${g.count} ${g.label}`).join(', ')}
            className="mt-4 grid max-w-[460px] grid-cols-[repeat(20,minmax(0,1fr))] gap-[7px]"
          >
            {DOTS.map((dot, index) => {
              const on = dot.groupIndex < revealed
              return (
                <motion.span
                  key={index}
                  className="aspect-square rounded-full"
                  initial={false}
                  animate={{ backgroundColor: on ? dot.color : NEUTRAL_DOT, scale: on ? [1, 1.35, 1] : 1 }}
                  transition={{ duration: 0.35, delay: on ? dot.i * 0.012 : 0 }}
                />
              )
            })}
          </div>
        </div>

        <ul className="flex flex-col gap-3">
          {LEAK_GROUPS.map((group, i) => {
            const on = i < revealed
            return (
              <motion.li
                key={group.id}
                className="grid grid-cols-[14px_1fr_minmax(80px,160px)_40px] items-center gap-3"
                initial={false}
                animate={{ opacity: on ? 1 : 0.25, x: on ? 0 : -6 }}
                transition={{ duration: 0.35 }}
              >
                <span className="size-3 rounded-full" style={{ backgroundColor: group.color }} />
                <span className="text-[15px] text-ink">{group.label}</span>
                <span className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <motion.span
                    className="block h-full rounded-full"
                    style={{ backgroundColor: group.color }}
                    initial={false}
                    animate={{ width: on ? `${(group.count / LARGEST_GROUP) * 100}%` : '0%' }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                </span>
                <span className="text-right font-mono text-base font-semibold">
                  {on ? <CountUp to={group.count} duration={0.7} /> : '–'}
                </span>
              </motion.li>
            )
          })}
        </ul>

        <AnimatePresence>
          {unknown && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 rounded-2xl bg-danger/10 p-4"
            >
              <CircleAlert className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden />
              <p className="text-sm leading-relaxed text-ink">
                <b>Unknown source:</b> none of the {SALES} sales can be traced back to the ad that brought them, so the budget cannot
                be moved to what works.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
