import { AnimatePresence, motion } from 'framer-motion'
import { Check, Users } from 'lucide-react'
import { AppWindow } from '@components/devices/BrowserWindow'
import { IPhoneFrame } from '@components/devices/IPhoneFrame'
import { AnimatedNumber } from '@components/motion/AnimatedNumber'
import { revealChat } from '@components/whatsapp/revealChat'
import { WaChat } from '@components/whatsapp/WaChat'
import { useSim } from '@features/scenario/store'
import { AUDIENCE, CPQL, FILTERS, FUNNEL, KAMRAN_CHAT, SALES } from '@features/scenes/broadcast/broadcastData'
import { BUSINESS_CONTACT } from '@features/scenes/lead-arrives/leadArrivesData'
import { cn } from '@lib/cn'

const label = 'text-[10px] font-semibold uppercase tracking-wider text-[#64748b]'

const PLATFORMS = [
  { id: 'meta', letter: 'M', name: 'Meta', what: 'Conversions received', tint: '#e7f0fe', ink: '#1659c7' },
  { id: 'google', letter: 'G', name: 'Google', what: 'Offline conversions imported', tint: '#e8f0fe', ink: '#1a56c4' },
]

export function BroadcastStage() {
  const vars = useSim((s) => s.vars)
  return (
    <div className="flex h-full items-start justify-center gap-6 px-6">
      <BroadcastWindow filters={Number(vars.filters ?? 0)} sent={vars.sent === true} />
      <figure className="m-0 flex flex-col items-center gap-2">
        <IPhoneFrame time="11:24" statusBar="dark" scale={0.66}>
          <WaChat contact={BUSINESS_CONTACT} messages={revealChat(KAMRAN_CHAT, Number(vars.chat ?? 1))} typing={vars.typing === true} />
        </IPhoneFrame>
        <figcaption className="text-xs text-ink-3">
          <b className="text-ink">Kamran</b> · an old lead · WhatsApp · Simulated
        </figcaption>
      </figure>
      <AdsFeedback fed={Number(vars.fed ?? 0)} learn={vars.learn === true} lookalike={vars.lookalike === true} />
    </div>
  )
}

function BroadcastWindow({ filters, sent }: { filters: number; sent: boolean }) {
  const audience = filters === 0 ? 4812 : AUDIENCE[filters - 1]
  return (
    <AppWindow
      title={<>Lead Inbox <span className="font-normal text-[#64748b]">› Broadcast</span></>}
      className="h-[576px] w-[340px]"
      caption={<><b className="text-ink">Marketing</b> · Broadcast · Simulated</>}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3.5">
        <div>
          <p className={label}>Who gets it</p>
          <div className="mt-1.5 flex min-h-[52px] flex-wrap content-start gap-1.5">
            {FILTERS.map((f, i) => (
              <motion.span
                key={f}
                initial={false}
                animate={{ opacity: i < filters ? 1 : 0.3, scale: i < filters ? 1 : 0.95 }}
                className={cn('inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold', i < filters ? 'bg-[#e7f0fe] text-[#1e3a8a]' : 'bg-[#f1f5f9] text-[#94a3b8]')}
              >
                {i < filters && <Check className="mr-1 size-3" aria-hidden />}
                {f}
              </motion.span>
            ))}
          </div>
          <p className="mt-2 flex items-baseline gap-2">
            <Users className="size-4 self-center text-[#64748b]" aria-hidden />
            <AnimatedNumber value={audience} className="font-mono text-[28px] font-semibold" />
            <span className="text-xs text-[#475569]">{filters === 0 ? 'leads in the inbox' : 'leads match'}</span>
          </p>
        </div>

        <div className="rounded-xl bg-[#f8fafc] p-3">
          <p className="flex items-center gap-1.5">
            <span className={label}>Message</span>
            <span className="rounded-full bg-[#dcfce7] px-1.5 text-[9px] font-bold text-[#166534]">Approved template</span>
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed">
            <b>Open house this Sunday</b>, 11 am to 5 pm. See the 3 bed show apartment and the new payment plan.
          </p>
        </div>

        <div className={cn('flex flex-col gap-2 transition-opacity', sent ? 'opacity-100' : 'opacity-35')}>
          <p className={label}>Results</p>
          {FUNNEL.map((f, i) => (
            <div key={f.label} className="grid grid-cols-[66px_1fr_46px] items-center gap-2 text-xs">
              <span>{f.label}</span>
              <span className="h-2 overflow-hidden rounded-full bg-[#eef2f8]">
                <motion.span
                  className="block h-full rounded-full"
                  style={{ background: f.color }}
                  initial={false}
                  animate={{ width: sent ? `${Math.max(4, (f.n / FUNNEL[0].n) * 100)}%` : '0%' }}
                  transition={{ duration: 1.1, delay: i * 0.6, ease: 'easeOut' }}
                />
              </span>
              <AnimatedNumber value={sent ? f.n : 0} duration={1.1} delay={i * 0.6} className="text-right font-mono font-semibold" />
            </div>
          ))}
        </div>

        <div
          className={cn(
            'mt-auto flex h-9 items-center justify-center rounded-lg text-[13px] font-semibold transition-colors',
            sent ? 'bg-[#0b1f4d] text-white' : filters >= FILTERS.length ? 'bg-[#1e3a8a] text-white' : 'bg-[#f1f5f9] text-[#94a3b8]',
          )}
        >
          {sent ? 'Sent to 1,284 leads' : 'Send to 1,284 leads'}
        </div>
      </div>
    </AppWindow>
  )
}

function AdsFeedback({ fed, learn, lookalike }: { fed: number; learn: boolean; lookalike: boolean }) {
  const meta = SALES.slice(0, fed).filter((s) => s === 'meta').length
  const google = fed - meta
  return (
    <AppWindow title="Ads feedback" className="h-[576px] w-[330px]" caption={<><b className="text-ink">Marketing</b> · Ads feedback · Simulated</>}>
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3.5">
        <div>
          <p className={label}>Sales this month, sent back to the ads</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SALES.map((s, i) => (
              <motion.span
                key={i}
                initial={false}
                animate={i < fed ? { scale: [1, 1.3, 1], opacity: 1 } : { opacity: 0.35 }}
                transition={{ duration: 0.35 }}
                className={cn(
                  'flex size-6 items-center justify-center rounded-full text-[10px] font-bold',
                  i < fed ? (s === 'meta' ? 'bg-[#1659c7] text-white' : 'bg-[#60a5fa] text-white') : 'bg-[#eef2f8] text-[#94a3b8]',
                )}
              >
                {s === 'meta' ? 'M' : 'G'}
              </motion.span>
            ))}
          </div>
        </div>
        {PLATFORMS.map((p) => (
          <div key={p.name} className="flex items-center gap-2.5 rounded-xl border border-[#e2e8f0] px-3 py-2">
            <span className="flex size-7 items-center justify-center rounded-lg text-xs font-bold" style={{ background: p.tint, color: p.ink }}>
              {p.letter}
            </span>
            <span className="flex-1">
              <b className="block text-[13px]">{p.name}</b>
              <span className="text-[11px] text-[#475569]">{p.what}</span>
            </span>
            <AnimatedNumber value={p.id === 'meta' ? meta : google} duration={0.3} className="font-mono text-xl font-semibold" />
          </div>
        ))}

        <div className="border-t border-[#eef2f8] pt-3">
          <p className="text-[13px] font-bold">Cost per qualified lead</p>
          <p className="text-[11px] text-[#475569]">The 4 weeks after the ads learn who buys</p>
          <CpqlChart draw={learn} />
        </div>

        <AnimatePresence>
          {lookalike && (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-auto rounded-xl bg-[#f3f0ff] px-3 py-2.5 text-xs leading-snug text-[#2e1a73]">
              <b>New audience on Meta:</b> people like your 11 buyers in Lahore. Ads now aim at likely buyers, not just clicks.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </AppWindow>
  )
}

const W = 290
const H = 120
const LAST_X = W - 64
const x = (i: number) => 14 + (i * (LAST_X - 14)) / 3
const y = (v: number) => 12 + ((46000 - v) / (46000 - 24000)) * (H - 34)

const LINES = [
  { name: 'Meta', values: CPQL.meta, color: '#1e3a8a' },
  { name: 'Google', values: CPQL.google, color: '#60a5fa' },
]

function CpqlChart({ draw }: { draw: boolean }) {
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Meta falls from PKR 41,000 to 27,000; Google from PKR 44,000 to 32,000" className="mt-1.5">
      <line x1="0" y1={H - 18} x2={W} y2={H - 18} stroke="#e2e8f0" />
      <text x="4" y={H - 4} fontSize="10" fill="#64748b">Week 1</text>
      <text x={LAST_X - 20} y={H - 4} fontSize="10" fill="#64748b">Week 4</text>
      {LINES.map((l, i) => {
        const last = l.values[l.values.length - 1]
        return (
          <g key={l.name}>
            <motion.polyline
              points={l.values.map((v, j) => `${x(j)},${y(v)}`).join(' ')}
              fill="none"
              stroke={l.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ pathLength: draw ? 1 : 0, opacity: draw ? 1 : 0 }}
              transition={{ duration: 1.4, delay: i * 0.3, ease: 'easeInOut' }}
            />
            <motion.text
              x={LAST_X + 6}
              y={y(last) + 4}
              fontSize="10"
              fontWeight="600"
              fill={l.color}
              initial={false}
              animate={{ opacity: draw ? 1 : 0 }}
              transition={{ delay: 1.4 + i * 0.3 }}
            >
              {l.name} {Math.round(last / 1000)}k
            </motion.text>
          </g>
        )
      })}
    </svg>
  )
}
