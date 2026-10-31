import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { CalendarDays, Check, Lock, Mic, NotebookPen, PhoneOff, Volume2 } from 'lucide-react'
import { AppNotification } from '@components/app/AppNotification'
import { AppTabBar } from '@components/app/AppTabBar'
import { IPhoneFrame } from '@components/devices/IPhoneFrame'
import { useSim } from '@features/scenario/store'
import { CAPTIONS, OUTCOMES, SUMMARY, type AgentCallScreen } from '@features/scenes/calls/callsData'
import { useCallSeconds } from '@features/scenes/calls/useCallSeconds'
import { LeadScreen } from '@features/scenes/qualify/AgentQualifyPhone'
import { cn } from '@lib/cn'
import { formatDuration } from '@lib/format'
import { playSound, startLoop } from '@lib/sfx'

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 } }

/** Usman's Lead Engine app during scene 5: call, in-call, outcome, then the missed-call task. */
export function AgentCallPhone({ scale }: { scale: number }) {
  const vars = useSim((s) => s.vars)
  const screen = (vars.agent ?? 'lead') as AgentCallScreen
  const dark = screen === 'calling' || screen === 'ongoing' || screen === 'ended'

  useEffect(() => {
    if (screen === 'calling') return startLoop('ringback')
    if (screen === 'ended') playSound('end')
  }, [screen])

  return (
    <figure className="m-0 flex flex-col items-center gap-2">
      <IPhoneFrame time={screen === 'missed' ? '9:41' : '10:09'} scale={scale}>
        <AppNotification
          id={vars.agentNotif === true ? 'missed' : null}
          title="Missed WhatsApp call · Ali Raza"
          body="The bot apologised and Ali picked a call back: tomorrow, 10:00 am."
        />
        <AnimatePresence mode="wait">
          <motion.div key={screen} {...fade} className={cn('flex min-h-0 flex-1 flex-col', dark && 'bg-navy')}>
            {screen === 'lead' && <LeadScreen />}
            {screen === 'calling' && <CallingScreen />}
            {screen === 'ongoing' && <OngoingScreen captions={Number(vars.captions ?? 0)} />}
            {screen === 'ended' && <EndedScreen outcome={vars.outcome === true} />}
            {screen === 'missed' && <TasksScreen />}
          </motion.div>
        </AnimatePresence>
        {(screen === 'lead' || screen === 'missed') && <AppTabBar active={screen === 'lead' ? 'leads' : 'home'} />}
      </IPhoneFrame>
      <figcaption className="text-xs text-ink-3">
        <b className="text-ink">Usman</b> · Lead Engine app · Simulated
      </figcaption>
    </figure>
  )
}

function CallerHeader({ status }: { status: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 pt-[78px] text-center text-white">
      <p className="flex items-center gap-1.5 text-xs text-navy-soft">
        <Lock className="size-3" aria-hidden /> WhatsApp call via Lead Engine
      </p>
      <span className="mt-5 flex size-24 items-center justify-center rounded-full bg-white text-3xl font-extrabold text-navy">SM</span>
      <p className="mt-2 text-2xl font-bold">Sana Malik</p>
      <div className="text-[15px] text-navy-soft">{status}</div>
    </div>
  )
}

function CallingScreen() {
  return (
    <>
      <CallerHeader
        status={
          <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
            Calling…
          </motion.span>
        }
      />
      <div className="mt-auto flex justify-center pb-14">
        <span className="flex size-16 items-center justify-center rounded-full bg-[#dc2626] text-white">
          <PhoneOff className="size-7" aria-hidden />
        </span>
      </div>
    </>
  )
}

function OngoingScreen({ captions }: { captions: number }) {
  const seconds = useCallSeconds()
  return (
    <>
      <CallerHeader status={<span className="font-mono text-lg text-[#86efac] tabular">{formatDuration(seconds)}</span>} />
      <div className="mt-4 flex flex-col gap-2 px-5">
        {/* The last three lines, so the captions never overflow the screen. */}
        <AnimatePresence initial={false} mode="popLayout">
          {CAPTIONS.slice(Math.max(0, captions - 3), captions).map((c) => (
            <motion.p
              key={c.src}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn('max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-snug', c.agent ? 'self-end bg-white/14 text-white' : 'self-start bg-white text-navy')}
            >
              <b className="block text-[10px] uppercase tracking-wider opacity-60">{c.who}</b>
              {c.text}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
      <div className="mx-4 mb-11 mt-auto flex justify-between rounded-[26px] bg-white/8 px-4 py-3.5 text-white">
        {[Mic, Volume2, NotebookPen].map((Icon, i) => (
          <span key={i} className="flex size-14 items-center justify-center rounded-full bg-white/12">
            <Icon className="size-[22px]" aria-hidden />
          </span>
        ))}
        <span className="flex size-14 items-center justify-center rounded-full bg-[#dc2626]">
          <PhoneOff className="size-6" aria-hidden />
        </span>
      </div>
    </>
  )
}

function EndedScreen({ outcome }: { outcome: boolean }) {
  return (
    <>
      <div className="flex flex-col items-center gap-1 px-6 pb-6 pt-[66px] text-center text-white">
        <span className="flex size-16 items-center justify-center rounded-full bg-white text-xl font-extrabold text-navy">SM</span>
        <p className="mt-1.5 text-xl font-bold">Sana Malik</p>
        <p className="text-sm text-navy-soft">
          WhatsApp call ended · <span className="font-mono font-semibold text-white">04:12</span>
        </p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3.5 rounded-t-[28px] bg-[#f4f6fb] px-4 pb-9 pt-5 text-navy">
        <p className="flex items-center justify-between">
          <span className="text-lg font-extrabold">How did it go?</span>
          <span className="text-xs font-bold text-[#15803d]">Saved to lead ✓</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {OUTCOMES.map((o, i) => (
            <span
              key={o}
              className={cn(
                'flex h-9 items-center rounded-xl border px-3 text-[13px] font-semibold transition-colors duration-500',
                outcome && i === 0 ? 'border-navy bg-navy text-white' : 'border-[#d5ddee] bg-white',
              )}
            >
              {o}
            </span>
          ))}
        </div>
        <AnimatePresence>
          {outcome && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3 rounded-2xl bg-white p-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#e3e9f7]">
                  <CalendarDays className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-xs text-[#5b6b8c]">Next step</span>
                  <span className="block text-sm font-bold">Site visit · Sat 7 Nov, 11:00 am</span>
                </span>
              </div>
              <div className="rounded-2xl bg-white p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#5b6b8c]">Call summary</p>
                <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[13px]">
                  {SUMMARY.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

function TasksScreen() {
  return (
    <>
      <header className="shrink-0 bg-navy px-5 pb-5 pt-[62px] text-white">
        <p className="text-sm text-navy-soft">Tomorrow · Sun 1 Nov</p>
        <p className="text-2xl font-extrabold tracking-tight">My tasks</p>
      </header>
      <div className="flex flex-col gap-2.5 p-4 text-navy">
        <motion.div
          initial={{ opacity: 0, y: -10, backgroundColor: '#ede9fe' }}
          animate={{ opacity: 1, y: 0, backgroundColor: '#ffffff' }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[0_0_0_2px_#1e3a8a]"
        >
          <span className="w-16 font-mono text-[13px] font-semibold">10:00 am</span>
          <span className="flex-1 text-sm">
            Call back <b>Ali Raza</b>
            <span className="block text-xs text-[#5b6b8c]">Booked by the bot after a missed call</span>
          </span>
          <span className="rounded-full bg-[#ede9fe] px-2 py-0.5 text-[11px] font-bold text-[#5b21b6]">New</span>
        </motion.div>
        {[
          ['11:00 am', 'Follow up', 'Fatima N.'],
          ['3:00 pm', 'Send payment plan', 'Bilal K.'],
        ].map(([t, w, who]) => (
          <div key={t} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm shadow-[0_1px_2px_rgba(11,31,77,.06)]">
            <span className="w-16 font-mono text-[13px] font-semibold">{t}</span>
            {w} <b>{who}</b>
          </div>
        ))}
        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#15803d]">
          <Check className="size-3.5" aria-hidden /> Missed calls today: 2 · both booked
        </p>
      </div>
    </>
  )
}
