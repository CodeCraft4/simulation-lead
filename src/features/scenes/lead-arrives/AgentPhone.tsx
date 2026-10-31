import { AnimatePresence, motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import { AppTabBar } from '@components/app/AppTabBar'
import { IPhoneFrame } from '@components/devices/IPhoneFrame'
import { BUSINESS } from '@data/business'
import { useSim } from '@features/scenario/store'
import { ALI, SANA } from '@features/scenes/lead-arrives/leadArrivesData'

const NOTIFICATIONS = [
  null,
  { title: `New lead: ${SANA.name}`, body: `${SANA.source}. The bot is asking her 3 questions.` },
  { title: `New lead: ${ALI.name}`, body: 'Google · Search lead form. Price list sent on WhatsApp.' },
]

const TODAY = [
  ['12:00 pm', 'Call back', 'Bilal Khan'],
  ['3:00 pm', 'Site visit,', 'Zainab H.'],
  ['5:30 pm', 'Follow up', 'Fatima N.'],
]

/** Usman's phone running the Lead Engine app. */
export function AgentPhone({ scale }: { scale: number }) {
  const notif = Number(useSim((s) => s.vars.notif ?? 0))
  const newLeads = 6 + Math.min(notif, 2)
  const current = NOTIFICATIONS[notif]

  return (
    <figure className="m-0 flex flex-col items-center gap-2">
      <IPhoneFrame time={notif === 2 ? '10:20' : '10:02'} scale={scale}>
        <AnimatePresence>
          {current && (
            <motion.div
              key={notif}
              initial={{ y: -90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -90, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="absolute inset-x-2.5 top-[50px] z-30 rounded-2xl bg-white/95 px-3.5 py-3 text-navy shadow-[0_10px_30px_rgba(11,31,77,.25)] backdrop-blur"
            >
              <p className="flex justify-between text-[11px] text-[#5b6b8c]">
                <span>Lead Engine · now</span>
                <span>Simulated</span>
              </p>
              <p className="mt-1 text-sm font-bold">{current.title}</p>
              <p className="text-[13px] leading-snug text-[#334366]">{current.body}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="shrink-0 bg-navy px-5 pb-5 pt-[62px] text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-navy-soft">Good morning</p>
              <p className="text-2xl font-extrabold tracking-tight">{BUSINESS.agent.name}</p>
            </div>
            <span className="relative flex size-[42px] items-center justify-center rounded-full bg-white/12">
              <Bell className="size-5" aria-hidden />
              {notif > 0 && <span className="absolute right-2.5 top-2.5 size-2.5 rounded-full bg-[#f97316] ring-2 ring-navy" />}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat value={newLeads} label="New leads" pulse={notif > 0} key={newLeads} />
            <Stat value={3} label="Calls due" />
            <Stat value={2} label="Site visits" />
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-2.5 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#5b6b8c]">Today</p>
          {TODAY.map(([time, what, who]) => (
            <div key={time} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm shadow-[0_1px_2px_rgba(11,31,77,.06)]">
              <span className="w-16 font-mono text-[13px] font-semibold">{time}</span>
              <span>
                {what} <b>{who}</b>
              </span>
            </div>
          ))}
        </div>
        <AppTabBar active="home" />
      </IPhoneFrame>
      <figcaption className="text-xs text-ink-3">
        <b className="text-ink">Usman</b> · Lead Engine app · Simulated
      </figcaption>
    </figure>
  )
}

function Stat({ value, label, pulse }: { value: number; label: string; pulse?: boolean }) {
  return (
    <motion.div
      initial={pulse ? { scale: 1.12, backgroundColor: 'rgba(253,186,116,.35)' } : false}
      animate={{ scale: 1, backgroundColor: 'rgba(255,255,255,.1)' }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl px-3 py-2.5"
    >
      <p className="font-mono text-2xl font-semibold">{value}</p>
      <p className="text-xs text-navy-soft">{label}</p>
    </motion.div>
  )
}
