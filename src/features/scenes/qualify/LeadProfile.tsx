import { AnimatePresence, motion } from 'framer-motion'
import { ScoreRing } from '@components/app/ScoreRing'
import { Countdown } from '@components/motion/Countdown'
import { AppWindow } from '@components/devices/BrowserWindow'
import { useSim } from '@features/scenario/store'
import { PROFILE_FIELDS, SCORE_STEPS, TAGS, TIMELINE } from '@features/scenes/qualify/qualifyData'
import { cn } from '@lib/cn'

export function LeadProfile() {
  const vars = useSim((s) => s.vars)
  const fields = Number(vars.fields ?? 0)
  const timeline = Number(vars.timeline ?? 0)
  const assigned = vars.assigned === true

  return (
    <AppWindow
      title={<>Lead Inbox <span className="font-normal text-[#64748b]">› Sana Malik</span></>}
      className="h-[576px] w-[390px]"
      caption={<><b className="text-ink">Sales team</b> · Lead profile · Simulated</>}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3.5 p-4">
        <div className="flex items-center gap-3.5">
          <ScoreRing score={SCORE_STEPS[fields]} size={84} />
          <div className="min-w-0">
            <p className="text-xl font-bold">Sana Malik</p>
            <p className="text-xs text-[#475569]">Meta · Click to WhatsApp · Lahore Apartments</p>
            <div className="mt-1.5 flex min-h-[22px] flex-wrap gap-1">
              <AnimatePresence>
                {vars.tags === true &&
                  TAGS.map((t, i) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.12 }}
                      className="inline-flex h-[22px] items-center rounded-full bg-[#eef2f8] px-2 text-[11px] font-semibold text-[#334155]"
                    >
                      {t}
                    </motion.span>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {PROFILE_FIELDS.map((f, i) => {
            const on = i < fields
            return (
              <motion.div
                key={f.label}
                animate={on ? { boxShadow: ['0 0 0 0 rgba(124,92,255,0)', '0 0 0 3px rgba(124,92,255,.4)', '0 0 0 0 rgba(124,92,255,0)'] } : {}}
                transition={{ duration: 1 }}
                className={cn('rounded-xl border px-2.5 py-2', on ? 'border-[#c7d2fe] bg-[#eef2ff]' : 'border-[#e2e8f0]')}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">{f.label}</p>
                {on ? (
                  <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-0.5 text-[13px] font-semibold leading-snug">
                    {f.value}
                  </motion.p>
                ) : (
                  <span className="mt-1.5 block h-2.5 w-3/4 rounded bg-[#f1f5f9]" aria-hidden />
                )}
                {on && <p className="mt-0.5 text-[9px] font-semibold text-[#7c5cff]">from WhatsApp</p>}
              </motion.div>
            )
          })}
        </div>

        <AnimatePresence>
          {assigned && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex items-center gap-3 rounded-xl bg-[#f3f0ff] px-3 py-2.5"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-[#5b3fd6] text-xs font-bold text-white">UT</span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold">Assigned to Usman Tariq</p>
                <p className="text-[11px] text-[#4c1d95]">Hot lead · Lahore · next in turn</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#5b3fd6]">Call within</p>
                <Countdown from={600} className="font-mono text-base font-semibold text-[#2e1a73]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="min-h-0">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">Timeline</p>
          <ol className="flex flex-col">
            <AnimatePresence initial={false}>
              {TIMELINE.slice(0, timeline).map(([time, text], i) => (
                <motion.li
                  key={time}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-[58px_12px_1fr] items-start gap-2 py-1 text-xs"
                >
                  <span className="font-mono text-[#64748b]">{time}</span>
                  <span className={cn('mt-1 size-2 rounded-full', i === 4 ? 'bg-[#7c5cff]' : 'bg-[#1e3a8a]')} />
                  <span className={cn(i === 4 && 'font-semibold')}>{text}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        </div>
      </div>
    </AppWindow>
  )
}
