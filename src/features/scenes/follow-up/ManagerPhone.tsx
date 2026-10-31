import { AnimatePresence, motion } from 'framer-motion'
import { AppNotification } from '@components/app/AppNotification'
import { AppTabBar } from '@components/app/AppTabBar'
import { IPhoneFrame } from '@components/devices/IPhoneFrame'
import { useSim } from '@features/scenario/store'
import { AGENTS } from '@features/scenes/follow-up/followUpData'
import { cn } from '@lib/cn'

const STATUS: Record<string, { text: string; cls: string }> = {
  waiting: { text: '3 waiting', cls: 'bg-[#fee2e2] text-[#991b1b]' },
  free: { text: 'free', cls: 'bg-[#dcfce7] text-[#166534]' },
  call: { text: 'on a call', cls: 'bg-[#eef2f8] text-[#334155]' },
  visit: { text: 'site visit', cls: 'bg-[#eef2f8] text-[#334155]' },
  cleared: { text: '0 waiting', cls: 'bg-[#dcfce7] text-[#166534]' },
  busy: { text: 'calling 3 leads', cls: 'bg-[#ede9fe] text-[#5b21b6]' },
}

/** Hira, the sales manager, sees who is waiting and reassigns leads in one tap. */
export function ManagerPhone({ scale }: { scale: number }) {
  const vars = useSim((s) => s.vars)
  const reassigned = vars.reassigned === true
  const tapped = vars.tapReassign === true
  const sold = Number(vars.sana ?? 0) === 2

  return (
    <figure className="m-0 flex flex-col items-center gap-2">
      <IPhoneFrame time="11:42" scale={scale}>
        <AppNotification
          id={vars.managerNotif === true ? 'waiting' : null}
          title="3 leads are waiting for Usman"
          body="Each has waited more than 15 minutes for a call."
          actions={
            <>
              <span
                className={cn(
                  'relative flex h-8 flex-1 items-center justify-center overflow-hidden rounded-lg text-xs font-semibold text-white transition-colors',
                  tapped ? 'bg-[#1e3a8a]' : 'bg-navy',
                )}
              >
                Reassign
                {tapped && (
                  <motion.span
                    className="absolute size-8 rounded-full bg-white/40"
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 5, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </span>
              <span className="flex h-8 flex-1 items-center justify-center rounded-lg border border-[#e2e8f0] text-xs font-semibold">Open</span>
            </>
          }
        />
        <header className="shrink-0 bg-navy px-5 pb-5 pt-[62px] text-white">
          <p className="text-sm text-navy-soft">Team today</p>
          <p className="text-2xl font-extrabold tracking-tight">Hira Ahmed</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/10 px-3 py-2.5">
              <p className="font-mono text-2xl font-semibold">4</p>
              <p className="text-xs text-navy-soft">Visits today</p>
            </div>
            <motion.div
              key={String(sold)}
              initial={sold ? { backgroundColor: 'rgba(134,239,172,.35)', scale: 1.06 } : false}
              animate={{ backgroundColor: 'rgba(255,255,255,.1)', scale: 1 }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl px-3 py-2.5"
            >
              <p className="font-mono text-2xl font-semibold">{sold ? 3 : 2}</p>
              <p className="text-xs text-navy-soft">Sales this week</p>
            </motion.div>
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-2.5 p-4 text-navy">
          <p className="text-xs font-bold uppercase tracking-wider text-[#5b6b8c]">Agents</p>
          <ul className="rounded-2xl bg-white px-3.5 shadow-[0_1px_2px_rgba(11,31,77,.06)]">
            {AGENTS.map((a, i) => {
              const status = reassigned && a.initials === 'UT' ? 'cleared' : reassigned && a.initials === 'MA' ? 'busy' : a.status
              return (
                <li key={a.initials} className={cn('flex items-center gap-2.5 py-2.5', i < AGENTS.length - 1 && 'border-b border-[#edf1f9]')}>
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#e3e9f7] text-[11px] font-bold">{a.initials}</span>
                  <span className="flex-1 text-sm font-semibold">{a.name}</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={status}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', STATUS[status].cls)}
                    >
                      {STATUS[status].text}
                    </motion.span>
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
          <p className="text-xs text-[#5b6b8c]">Leads waiting more than 15 minutes raise an alert here.</p>
        </div>
        <AppTabBar active="home" />
      </IPhoneFrame>
      <figcaption className="text-xs text-ink-3">
        <b className="text-ink">Hira</b> · Manager app · Simulated
      </figcaption>
    </figure>
  )
}
