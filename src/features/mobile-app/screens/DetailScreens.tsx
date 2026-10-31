import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Check, ChevronLeft, Lock, MessageCircle, Mic, Phone, PhoneOff, Send, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ScoreRing } from '@components/app/ScoreRing'
import { CALL_SCRIPTS } from '@data/callScripts'
import { APP_CHATS, AUTO_ANSWERS, QUICK_REPLIES, findLead, type AppChatMessage } from '@features/mobile-app/appData'
import { ScreenHeader, useAppNav } from '@features/mobile-app/appNav'
import { cn } from '@lib/cn'
import { formatDuration } from '@lib/format'
import { playSound, startLoop } from '@lib/sfx'
import { playVoice, stopVoice } from '@lib/voice'

const card = 'rounded-2xl bg-white shadow-[0_1px_2px_rgba(11,31,77,.06),0_4px_14px_rgba(11,31,77,.05)]'

export function LeadDetail({ id }: { id: string }) {
  const nav = useAppNav()
  const lead = findLead(id)
  const [visit, setVisit] = useState(false)
  const actions = [
    { icon: Phone, label: 'Call', onClick: () => nav.push({ name: 'call', id }), main: true },
    { icon: MessageCircle, label: 'WhatsApp', onClick: () => nav.push({ name: 'chat', id }) },
    { icon: CalendarDays, label: visit ? 'Booked' : 'Book visit', onClick: () => setVisit(true) },
  ]

  return (
    <>
      <ScreenHeader back="Back" title={lead.name}>
        <div className="mt-3 flex items-center gap-3">
          <ScoreRing score={lead.score} size={66} onDark />
          <div className="text-[13px]">
            <p className="font-mono text-navy-soft">+92 3xx xxxxxx4</p>
            <p className="mt-1 rounded-full bg-white/14 px-2 py-0.5 text-xs font-semibold">{lead.source}</p>
          </div>
        </div>
        <div className="mt-4 flex">
          {actions.map(({ icon: Icon, label, onClick, main }) => (
            <button key={label} type="button" onClick={onClick} className="flex flex-1 flex-col items-center gap-1.5 text-xs font-semibold">
              <span className={cn('flex size-12 items-center justify-center rounded-full', main ? 'bg-[#16a34a] text-white' : 'bg-white text-navy', label === 'Booked' && 'bg-[#16a34a] text-white')}>
                {label === 'Booked' ? <Check className="size-5" aria-hidden /> : <Icon className="size-5" aria-hidden />}
              </span>
              {label}
            </button>
          ))}
        </div>
      </ScreenHeader>
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-4 text-navy">
        <div className={cn(card, 'p-3.5')}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#5b6b8c]">Answers from WhatsApp</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {[
              ['Budget', lead.budget],
              ['Buying', lead.buying],
              ['Area', lead.area],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-[#f4f6fb] px-2 py-1.5">
                <p className="text-[11px] text-[#5b6b8c]">{k}</p>
                <p className="text-[13px] font-bold leading-tight">{v}</p>
              </div>
            ))}
          </div>
        </div>
        <AnimatePresence>
          {visit && (
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cn(card, 'flex items-center gap-2 p-3 text-sm font-semibold text-[#15803d]')}>
              <Check className="size-4" aria-hidden /> Visit booked: Sat 7 Nov, 11:00 am. Confirmation sent on WhatsApp.
            </motion.p>
          )}
        </AnimatePresence>
        <div className={cn(card, 'p-3.5')}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#5b6b8c]">Next step</p>
          <p className="mt-1 text-sm font-semibold">{lead.next}</p>
        </div>
      </div>
    </>
  )
}

export function ChatView({ id }: { id: string }) {
  const nav = useAppNav()
  const lead = findLead(id)
  const [messages, setMessages] = useState<AppChatMessage[]>(APP_CHATS[id] ?? [])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const answers = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const send = (text: string) => {
    const clean = text.trim()
    if (!clean) return
    setMessages((m) => [...m, { from: 'me', text: clean, time: 'now' }])
    playSound('sent')
    setDraft('')
    setTyping(true)
    // The customer answers after a moment, so the chat feels alive in a demo.
    timer.current = setTimeout(() => {
      // Pick the answer outside the state updater: React may run updaters twice.
      const answer = AUTO_ANSWERS[answers.current % AUTO_ANSWERS.length]
      answers.current += 1
      setTyping(false)
      setMessages((m) => [...m, { from: 'lead', text: answer, time: 'now' }])
      playSound('received')
    }, 1600)
  }

  return (
    <>
      <header className="shrink-0 bg-navy px-3.5 pb-3 pt-[60px] text-white">
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={nav.back} aria-label="Back">
            <ChevronLeft className="size-6" aria-hidden />
          </button>
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-sm font-bold text-navy">{lead.initials}</span>
          <div className="min-w-0 flex-1">
            <p className="font-bold">{lead.name}</p>
            <p className="text-xs font-semibold text-[#fdba74]">{typing ? 'typing…' : `${lead.source} · online`}</p>
          </div>
          <button type="button" onClick={() => nav.push({ name: 'call', id })} aria-label="WhatsApp call" className="flex size-10 items-center justify-center rounded-full bg-white/12">
            <Phone className="size-[18px]" aria-hidden />
          </button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden bg-[#eef1f7] px-3.5 py-3 text-navy">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-snug',
                m.from === 'lead' && 'self-start rounded-bl-[5px] bg-white',
                m.from === 'bot' && 'self-end rounded-br-[5px] bg-[#e3e9f7]',
                m.from === 'me' && 'self-end rounded-br-[5px] bg-navy text-white',
              )}
            >
              {m.from !== 'lead' && <p className={cn('text-[11px] font-bold', m.from === 'bot' ? 'text-[#5b21b6]' : 'text-navy-soft')}>{m.from === 'bot' ? 'Bot' : 'You'}</p>}
              {m.text}
              <p className={cn('mt-0.5 text-right font-mono text-[10px]', m.from === 'me' ? 'text-navy-soft' : 'text-[#5b6b8c]')}>
                {m.time}
                {m.from === 'me' && ' ✓✓'}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex shrink-0 gap-1.5 overflow-x-auto bg-[#eef1f7] px-3.5 pb-2">
        {QUICK_REPLIES.map((q) => (
          <button key={q} type="button" onClick={() => send(q)} className="h-8 shrink-0 rounded-full border border-[#c9d3ea] bg-white px-3 text-[13px] font-semibold text-navy">
            {q}
          </button>
        ))}
      </div>
      <form
        className="flex shrink-0 items-center gap-2 border-t border-[#e3e8f2] bg-white px-3 pb-8 pt-2"
        onSubmit={(e) => {
          e.preventDefault()
          send(draft)
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message"
          aria-label="Message"
          className="h-10 min-w-0 flex-1 rounded-full border border-[#e3e8f2] bg-[#f4f6fb] px-4 text-[15px] text-navy outline-none focus:border-navy"
        />
        <button type="submit" aria-label="Send" className="flex size-10 items-center justify-center rounded-full bg-navy text-white">
          <Send className="size-4" aria-hidden />
        </button>
      </form>
    </>
  )
}

type CallStage = 'calling' | 'live' | 'outcome' | 'saved'
const OUTCOMES = ['Wants a site visit', 'Call again', 'Not interested']

const NO_LINES: never[] = []

export function CallView({ id }: { id: string }) {
  const nav = useAppNav()
  const lead = findLead(id)
  const [stage, setStage] = useState<CallStage>('calling')
  const [seconds, setSeconds] = useState(0)
  const [outcome, setOutcome] = useState<string | null>(null)
  const [line, setLine] = useState(-1)
  const script = CALL_SCRIPTS[lead.id] ?? NO_LINES

  // The lead picks up after a short ring; ending the call beeps.
  useEffect(() => {
    if (stage === 'outcome') playSound('end')
    if (stage !== 'calling') return
    const stopRing = startLoop('ringback')
    const t = setTimeout(() => setStage('live'), 1800)
    return () => {
      clearTimeout(t)
      stopRing()
    }
  }, [stage])

  useEffect(() => {
    if (stage !== 'live') return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [stage])

  // The conversation plays line by line in Urdu; ending the call stops it.
  useEffect(() => {
    if (stage !== 'live') return
    const timers: ReturnType<typeof setTimeout>[] = []
    let at = 500
    script.forEach((l, i) => {
      timers.push(
        setTimeout(() => {
          setLine(i)
          playVoice(l.src)
        }, at),
      )
      at += l.ms + 450
    })
    return () => {
      timers.forEach(clearTimeout)
      stopVoice()
    }
  }, [stage, script])

  if (stage === 'outcome' || stage === 'saved') {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-navy">
        <div className="flex flex-col items-center gap-1 px-6 pb-5 pt-[64px] text-center text-white">
          <span className="flex size-14 items-center justify-center rounded-full bg-white text-lg font-extrabold text-navy">{lead.initials}</span>
          <p className="mt-1 text-lg font-bold">{lead.name}</p>
          <p className="text-sm text-navy-soft">Call ended · {formatDuration(seconds)}</p>
        </div>
        <div className="flex flex-1 flex-col gap-3 rounded-t-[28px] bg-[#f4f6fb] px-4 pb-9 pt-5 text-navy">
          <p className="text-lg font-extrabold">How did it go?</p>
          <div className="flex flex-wrap gap-2">
            {OUTCOMES.map((o) => (
              <button
                key={o}
                type="button"
                aria-pressed={outcome === o}
                onClick={() => setOutcome(o)}
                disabled={stage === 'saved'}
                className={cn('h-9 rounded-xl border px-3 text-[13px] font-semibold', outcome === o ? 'border-navy bg-navy text-white' : 'border-[#d5ddee] bg-white')}
              >
                {o}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#5b6b8c]">The call, its length and your note are saved to the lead automatically.</p>
          {stage === 'saved' ? (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-auto flex flex-col gap-2">
              <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-[#15803d]">
                <Check className="size-4" aria-hidden /> Saved to {lead.name}
              </p>
              <button type="button" onClick={() => nav.back()} className="h-12 rounded-xl bg-[#edf1f9] text-[15px] font-bold">
                Done
              </button>
            </motion.div>
          ) : (
            <button
              type="button"
              disabled={!outcome}
              onClick={() => setStage('saved')}
              className="mt-auto h-12 rounded-xl bg-navy text-[15px] font-bold text-white disabled:bg-[#cbd5e1]"
            >
              Save
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center bg-navy px-6 pt-[78px] text-center text-white">
      <p className="flex items-center gap-1.5 text-xs text-navy-soft">
        <Lock className="size-3" aria-hidden /> WhatsApp call via Lead Engine
      </p>
      <div className="relative mt-8">
        {stage === 'calling' &&
          [0, 1].map((i) => (
            <motion.span
              key={i}
              className="absolute inset-0 rounded-full border-2 border-white/30"
              animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.8 }}
            />
          ))}
        <span className="relative flex size-24 items-center justify-center rounded-full bg-white text-3xl font-extrabold text-navy">{lead.initials}</span>
      </div>
      <p className="mt-4 text-2xl font-bold">{lead.name}</p>
      <p className={cn('mt-1 font-mono text-lg', stage === 'live' ? 'text-[#86efac]' : 'text-navy-soft')}>{stage === 'live' ? formatDuration(seconds) : 'Calling…'}</p>
      <AnimatePresence mode="wait">
        {stage === 'live' && script[line] && (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn('mt-6 max-w-[90%] rounded-xl px-3 py-2 text-left text-[13px] leading-snug', script[line].agent ? 'bg-white/14 text-white' : 'bg-white text-navy')}
          >
            <b className="block text-[10px] uppercase tracking-wider opacity-60">{script[line].agent ? 'You' : script[line].who}</b>
            {script[line].text}
          </motion.p>
        )}
      </AnimatePresence>
      <div className="mb-11 mt-auto flex w-full justify-between rounded-[26px] bg-white/8 px-4 py-3.5">
        {[Mic, Volume2].map((Icon, i) => (
          <span key={i} className="flex size-14 items-center justify-center rounded-full bg-white/12">
            <Icon className="size-[22px]" aria-hidden />
          </span>
        ))}
        <button type="button" onClick={() => setStage('outcome')} aria-label="End call" className="flex size-14 items-center justify-center rounded-full bg-[#dc2626]">
          <PhoneOff className="size-6" aria-hidden />
        </button>
      </div>
    </div>
  )
}

const FUNNEL = [
  { label: 'Sent', n: 1284, color: '#0b1f4d' },
  { label: 'Delivered', n: 1251, color: '#1e3a8a' },
  { label: 'Read', n: 973, color: '#3b5bdb' },
  { label: 'Replied', n: 146, color: '#15803d' },
]

export function BroadcastView() {
  const [progress, setProgress] = useState(0) // 0 not sent, 0–1 sending

  useEffect(() => {
    if (progress === 0 || progress >= 1) return
    const t = setTimeout(() => setProgress((p) => Math.min(1, p + 0.08)), 120)
    return () => clearTimeout(t)
  }, [progress])

  return (
    <>
      <ScreenHeader back="Campaigns" title="Open house broadcast" />
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-4 text-navy">
        <div className={cn(card, 'p-3.5')}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#5b6b8c]">Who gets it</p>
          <p className="mt-2 flex flex-wrap gap-1.5">
            {['Warm leads', 'No reply 14+ days', 'Opted in'].map((c) => (
              <span key={c} className="rounded-full bg-[#edf1f9] px-2.5 py-1 text-xs font-semibold text-[#1e3a8a]">
                {c}
              </span>
            ))}
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold">
            1,284 <span className="font-sans text-sm font-normal text-[#5b6b8c]">leads</span>
          </p>
        </div>
        <div className={cn(card, 'bg-[#eef1f7] p-3.5')}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#5b6b8c]">Message · approved template</p>
          <p className="mt-2 rounded-2xl rounded-bl-[5px] bg-white p-3 text-sm leading-snug">
            <b>Open house this Sunday</b>, 11 am to 5 pm. See the 3 bed show apartment and the new payment plan.
          </p>
        </div>
        {progress > 0 && (
          <div className={cn(card, 'p-3.5')}>
            {FUNNEL.map((f, i) => {
              // Later stages fill a little behind the earlier ones.
              const share = Math.max(0, Math.min(1, progress * 1.4 - i * 0.12))
              return (
                <div key={f.label} className="mb-2 grid grid-cols-[70px_1fr_48px] items-center gap-2 text-sm">
                  <span>{f.label}</span>
                  <span className="h-2.5 overflow-hidden rounded-full bg-[#edf1f9]">
                    <span className="block h-full rounded-full" style={{ width: `${(f.n / 1284) * share * 100}%`, background: f.color }} />
                  </span>
                  <span className="text-right font-mono text-[13px] font-semibold">{Math.round(f.n * share).toLocaleString('en-US')}</span>
                </div>
              )
            })}
          </div>
        )}
        <button
          type="button"
          disabled={progress > 0}
          onClick={() => setProgress(0.04)}
          className={cn('mt-auto h-12 rounded-xl text-[15px] font-bold text-white', progress >= 1 ? 'bg-[#16a34a]' : 'bg-navy disabled:opacity-80')}
        >
          {progress === 0 ? 'Send to 1,284 leads' : progress < 1 ? 'Sending…' : '✓ Sent · replies coming in'}
        </button>
      </div>
    </>
  )
}
