import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Check, PhoneIncoming, PhoneMissed, PhoneOutgoing } from 'lucide-react'
import { AppWindow } from '@components/devices/BrowserWindow'
import { useSim } from '@features/scenario/store'
import { MISSED_STEPS, OUTCOMES, SUMMARY, type AgentCallScreen } from '@features/scenes/calls/callsData'
import { useCallSeconds } from '@features/scenes/calls/useCallSeconds'
import { cn } from '@lib/cn'
import { formatDuration } from '@lib/format'

const enter = { initial: { opacity: 0, y: -12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.35 } }

export function CallLog() {
  const vars = useSim((s) => s.vars)
  const agent = (vars.agent ?? 'lead') as AgentCallScreen
  const logged = vars.logged === true
  const missed = vars.missed === true
  const missedSteps = Number(vars.missedSteps ?? 0)
  const live = agent === 'calling' || agent === 'ongoing'

  const calls = 12 + Number(logged) + Number(missed)
  const booked = 1 + Number(missedSteps >= MISSED_STEPS.length)

  return (
    <AppWindow
      title={<>Lead Inbox <span className="font-normal text-[#64748b]">› Calls</span></>}
      className="h-[576px] w-[380px]"
      caption={<><b className="text-ink">Sales team</b> · Call log · Simulated</>}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3.5">
        <AnimatePresence initial={false} mode="popLayout">
          {missed && (
            <motion.section key="missed" layout {...enter} className="rounded-xl border border-[#fecaca] bg-[#fff7f7] p-3">
              <Row icon={<PhoneMissed className="size-4 text-[#b91c1c]" aria-hidden />} badge="Missed" badgeCls="bg-[#fee2e2] text-[#991b1b]" name="Ali Raza" right="9:40 pm" />
              <p className="mt-0.5 text-[11px] text-[#475569]">Incoming WhatsApp call · after office hours</p>
              <ol className="mt-2 flex flex-col gap-1">
                {MISSED_STEPS.map((step, i) => {
                  const done = i < missedSteps
                  return (
                    <li key={step} className={cn('flex items-center gap-2 text-xs transition-colors', done ? 'text-[#0f172a]' : 'text-[#94a3b8]')}>
                      <span className={cn('flex size-4 items-center justify-center rounded-full transition-colors', done ? 'bg-[#16a34a] text-white' : 'border border-[#cbd5e1]')}>
                        {done && <Check className="size-2.5" aria-hidden />}
                      </span>
                      {step}
                    </li>
                  )
                })}
              </ol>
            </motion.section>
          )}

          {live && (
            <motion.section key="live" layout {...enter} className="rounded-xl border border-[#c7d2fe] bg-[#eef2ff] p-3">
              <Row
                icon={<PhoneOutgoing className="size-4 text-[#1e3a8a]" aria-hidden />}
                badge={agent === 'calling' ? 'Ringing' : 'On call'}
                badgeCls="bg-[#1e3a8a] text-white"
                name="Sana Malik"
                right={agent === 'ongoing' ? <LiveTimer /> : '…'}
              />
              <p className="mt-0.5 text-[11px] text-[#475569]">Outgoing WhatsApp call by Usman · recording notes</p>
            </motion.section>
          )}

          {logged && (
            <motion.section key="answered" layout {...enter} className="rounded-xl border border-[#e2e8f0] p-3">
              <Row icon={<PhoneOutgoing className="size-4 text-[#15803d]" aria-hidden />} badge="Answered" badgeCls="bg-[#dcfce7] text-[#166534]" name="Sana Malik" right="4 min 12 s" />
              <p className="mt-0.5 text-[11px] text-[#475569]">Outgoing WhatsApp call by Usman · 10:09 am</p>
              <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">Outcome</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {OUTCOMES.map((o, i) => (
                  <span
                    key={o}
                    className={cn(
                      'inline-flex h-[22px] items-center rounded-full px-2 text-[11px] font-semibold transition-colors duration-500',
                      vars.outcome === true && i === 0 ? 'bg-[#0b1f4d] text-white' : 'bg-[#eef2f8] text-[#334155]',
                    )}
                  >
                    {vars.outcome === true && i === 0 && '✓ '}
                    {o}
                  </span>
                ))}
              </div>
              <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">Summary</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs">
                {SUMMARY.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </motion.section>
          )}

          <motion.section key="earlier" layout className="rounded-xl border border-[#e2e8f0] p-3">
            <Row icon={<PhoneIncoming className="size-4 text-[#15803d]" aria-hidden />} badge="Answered" badgeCls="bg-[#dcfce7] text-[#166534]" name="Zainab Hussain" right="6 min 40 s" />
            <p className="mt-0.5 text-[11px] text-[#475569]">Incoming WhatsApp call · 9:12 am · visit booked</p>
          </motion.section>
        </AnimatePresence>

        <div className="mt-auto grid grid-cols-3 gap-2">
          <Stat label="Calls today" value={String(calls)} />
          <Stat label="Answered" value={String(11 + Number(logged))} />
          <Stat label="Missed, booked" value={`${booked} / ${1 + Number(missed)}`} />
        </div>
      </div>
    </AppWindow>
  )
}

function Row({ icon, badge, badgeCls, name, right }: { icon: ReactNode; badge: string; badgeCls: string; name: string; right: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', badgeCls)}>{badge}</span>
      <span className="text-sm font-bold">{name}</span>
      <span className="ml-auto font-mono text-[11px] text-[#475569]">{right}</span>
    </div>
  )
}

function LiveTimer() {
  return <span className="text-[#1e3a8a]">{formatDuration(useCallSeconds())}</span>
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#f8fafc] px-2.5 py-1.5">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-[#64748b]">{label}</p>
      <p className="font-mono text-base font-semibold tabular">{value}</p>
    </div>
  )
}
