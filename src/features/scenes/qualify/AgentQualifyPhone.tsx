import { AnimatePresence, motion } from 'framer-motion'
import { Bot, CalendarDays, ChevronLeft, FileText, MessageCircle, Phone, type LucideIcon } from 'lucide-react'
import { AppNotification } from '@components/app/AppNotification'
import { AppTabBar } from '@components/app/AppTabBar'
import { ScoreRing } from '@components/app/ScoreRing'
import { Countdown } from '@components/motion/Countdown'
import { IPhoneFrame } from '@components/devices/IPhoneFrame'
import { revealChat } from '@components/whatsapp/revealChat'
import { useSim } from '@features/scenario/store'
import { PROFILE_FIELDS, QUALIFY_CHAT } from '@features/scenes/qualify/qualifyData'
import { cn } from '@lib/cn'

const LEAD_ACTIONS: { icon: LucideIcon; label: string; main?: boolean }[] = [
  { icon: Phone, label: 'Call', main: true },
  { icon: MessageCircle, label: 'WhatsApp' },
  { icon: CalendarDays, label: 'Book visit' },
]

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 } }

/** Usman's Lead Engine app: watches the bot's chat live, then opens the lead when it is handed over. */
export function AgentQualifyPhone({ scale }: { scale: number }) {
  const vars = useSim((s) => s.vars)
  const assigned = vars.assigned === true

  return (
    <figure className="m-0 flex flex-col items-center gap-2">
      <IPhoneFrame time="10:05" scale={scale}>
        <AppNotification
          id={vars.notif === true ? 'hot' : null}
          title="New hot lead: Sana Malik · 82"
          body="Budget 1.5–2.5 crore, buying within 3 months. Call within 10 minutes."
        />
        <AnimatePresence mode="wait">
          <motion.div key={assigned ? 'lead' : 'chat'} {...fade} className="flex min-h-0 flex-1 flex-col">
            {assigned ? <LeadScreen /> : <MirrorChat count={Number(vars.chat ?? 0)} typing={vars.typing === true} />}
          </motion.div>
        </AnimatePresence>
        <AppTabBar active={assigned ? 'leads' : 'chats'} />
      </IPhoneFrame>
      <figcaption className="text-xs text-ink-3">
        <b className="text-ink">Usman</b> · Lead Engine app · Simulated
      </figcaption>
    </figure>
  )
}

/** The same WhatsApp chat as seen by the team: customer on the left, bot on the right. */
function MirrorChat({ count, typing }: { count: number; typing: boolean }) {
  const messages = revealChat(QUALIFY_CHAT, count).filter((m) => m.kind !== 'pill')

  return (
    <>
      <header className="shrink-0 bg-navy px-3.5 pb-3 pt-[60px] text-white">
        <div className="flex items-center gap-2.5">
          <ChevronLeft className="size-6" aria-hidden />
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-sm font-bold text-navy">SM</span>
          <div className="min-w-0 flex-1">
            <p className="font-bold">Sana Malik</p>
            <p className="flex items-center gap-1 text-xs font-semibold text-[#c4b5fd]">
              <Bot className="size-3.5" aria-hidden /> Bot is handling this chat
            </p>
          </div>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden bg-[#eef1f7] px-3.5 py-3">
        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const fromLead = m.kind === 'out'
            return (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-snug',
                  fromLead ? 'self-start rounded-bl-[5px] bg-white text-navy' : 'self-end rounded-br-[5px] bg-[#e3e9f7] text-navy',
                )}
              >
                {!fromLead && <p className="text-[11px] font-bold text-[#5b21b6]">Bot</p>}
                {m.kind === 'in' && m.doc && (
                  <p className="my-1 flex items-center gap-1.5 rounded-lg bg-white px-2 py-1.5 text-xs font-semibold">
                    <FileText className="size-4 text-[#b91c1c]" aria-hidden /> Brochure.pdf
                  </p>
                )}
                {m.kind === 'in' && m.image && <p className="my-1 rounded-lg bg-white px-2 py-1.5 text-xs font-semibold">Video · show apartment</p>}
                {m.text}
              </motion.div>
            )
          })}
          {typing && (
            <motion.p key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="self-end text-xs font-semibold text-[#5b21b6]">
              Bot is typing…
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export function LeadScreen() {
  return (
    <>
      <header className="shrink-0 bg-navy px-5 pb-5 pt-[60px] text-white">
        <p className="flex items-center gap-1 text-[15px] font-semibold text-navy-soft">
          <ChevronLeft className="size-[18px]" aria-hidden /> Leads
        </p>
        <div className="mt-3 flex items-center gap-3.5">
          <ScoreRing score={82} size={74} onDark />
          <div>
            <p className="text-2xl font-extrabold tracking-tight">Sana Malik</p>
            <p className="font-mono text-[13px] text-navy-soft">+92 3xx xxxxxx4</p>
            <p className="mt-1.5 flex gap-1.5">
              <span className="rounded-full bg-white/14 px-2 py-0.5 text-xs font-semibold">Meta</span>
              <span className="rounded-full bg-white/14 px-2 py-0.5 text-xs font-semibold">Click to WhatsApp</span>
            </p>
          </div>
        </div>
        <div className="mt-4 flex">
          {LEAD_ACTIONS.map(({ icon: Icon, label, main }) => (
            <span key={label} className="flex flex-1 flex-col items-center gap-1.5 text-xs font-semibold">
              <motion.span
                animate={main ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1.2, repeat: Infinity }}
                className={cn('flex size-12 items-center justify-center rounded-full', main ? 'bg-[#16a34a] text-white' : 'bg-white text-navy')}
              >
                <Icon className="size-5" aria-hidden />
              </motion.span>
              {label}
            </span>
          ))}
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 p-4">
        <div className="rounded-2xl bg-white p-3.5 shadow-[0_1px_2px_rgba(11,31,77,.06)]">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#5b6b8c]">Answers from WhatsApp</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {PROFILE_FIELDS.map((f) => (
              <div key={f.label} className="rounded-xl bg-[#f4f6fb] px-2 py-1.5">
                <p className="text-[11px] text-[#5b6b8c]">{f.label}</p>
                <p className="text-[13px] font-bold leading-tight">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_1px_2px_rgba(11,31,77,.06)]">
          <span className="flex size-10 items-center justify-center rounded-full bg-navy text-[13px] font-bold text-white">UT</span>
          <div className="flex-1">
            <p className="text-sm font-bold">Assigned to you</p>
            <p className="text-xs text-[#5b6b8c]">Hot lead · next in turn</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-[#9a3412]">CALL WITHIN</p>
            <Countdown from={600} className="font-mono text-lg font-semibold text-[#9a3412]" />
          </div>
        </div>
      </div>
    </>
  )
}
