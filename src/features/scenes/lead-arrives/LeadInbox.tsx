import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'
import { AppWindow } from '@components/devices/BrowserWindow'
import { useSim } from '@features/scenario/store'
import { ALI, EXISTING_LEADS, REPLY_SECONDS, SANA } from '@features/scenes/lead-arrives/leadArrivesData'
import { cn } from '@lib/cn'

type TimerState = 'idle' | 'running' | 'replied'

export function LeadInbox() {
  const vars = useSim((s) => s.vars)
  const sanaIn = vars.sanaIn === true
  const aliIn = vars.aliIn === true
  const fresh = Number(sanaIn) + Number(aliIn)

  return (
    <AppWindow title="Lead Inbox" className="h-[576px] w-[380px]" caption={<><b className="text-ink">Sales team</b> · Lead Inbox · Simulated</>}>
      <div className="flex flex-wrap gap-1.5 border-b border-[#eef2f8] px-3 py-2.5">
        <Chip on>All {128 + fresh}</Chip>
        <Chip>New {6 + fresh}</Chip>
        <Chip>Hot 14</Chip>
        <Chip>Mine 9</Chip>
      </div>

      <ul className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AnimatePresence initial={false}>
          {aliIn && (
            <NewLeadRow key="ali" initials={ALI.initials} name={ALI.name} source={ALI.source} timer={vars.aliReplied === true ? 'replied' : 'running'} seconds={REPLY_SECONDS.ali} />
          )}
          {sanaIn && (
            <NewLeadRow
              key="sana"
              initials={SANA.initials}
              name={SANA.name}
              source={SANA.source}
              timer={(vars.timer ?? 'idle') as TimerState}
              seconds={REPLY_SECONDS.sana}
              highlight={!aliIn}
            >
              {!aliIn && <SourceDetails />}
            </NewLeadRow>
          )}
        </AnimatePresence>
        {EXISTING_LEADS.map((lead) => (
          <motion.li layout key={lead.name} className="flex items-center gap-2.5 border-b border-[#eef2f8] px-3 py-2.5">
            <Avatar initials={lead.initials} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold">{lead.name}</p>
              <p className="truncate text-[11px] text-[#475569]">{lead.source}</p>
            </div>
            <span className="font-mono text-[11px] text-[#64748b]">{lead.time}</span>
          </motion.li>
        ))}
      </ul>
    </AppWindow>
  )
}

function Chip({ on, children }: { on?: boolean; children: ReactNode }) {
  return (
    <span className={cn('inline-flex h-[22px] items-center rounded-full px-2 text-[11px] font-semibold tabular', on ? 'bg-navy text-white' : 'bg-[#eef2f8] text-[#334155]')}>
      {children}
    </span>
  )
}

function Avatar({ initials, strong }: { initials: string; strong?: boolean }) {
  return (
    <span
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
        strong ? 'bg-navy text-white' : 'bg-[#eef2f8] text-[#334155]',
      )}
    >
      {initials}
    </span>
  )
}

interface NewLeadRowProps {
  initials: string
  name: string
  source: string
  timer: TimerState
  seconds: number
  highlight?: boolean
  children?: ReactNode
}

function NewLeadRow({ initials, name, source, timer, seconds, highlight = true, children }: NewLeadRowProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -16, backgroundColor: 'rgba(124,92,255,0.18)' }}
      animate={{ opacity: 1, y: 0, backgroundColor: highlight ? 'rgba(238,242,255,1)' : 'rgba(255,255,255,1)' }}
      transition={{ duration: 0.45 }}
      className={cn('border-b border-[#eef2f8]', highlight && 'shadow-[inset_0_0_0_2px_#a5b4fc]')}
    >
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <Avatar initials={initials} strong />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-bold">
            {name}
            <span className="rounded-full bg-[#7c5cff] px-1.5 py-px text-[10px] font-bold text-white">New</span>
          </p>
          <p className="truncate text-[11px] text-[#475569]">{source}</p>
        </div>
        <ResponseTimer state={timer} seconds={seconds} />
      </div>
      {children}
    </motion.li>
  )
}

/** Counts the seconds since the lead arrived, up to just before the bot replies. */
function ResponseTimer({ state, seconds }: { state: TimerState; seconds: number }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (state !== 'running') return
    setElapsed(0)
    const id = setInterval(() => setElapsed((e) => Math.min(e + 1, seconds - 1)), 1000)
    return () => clearInterval(id)
  }, [state, seconds])

  if (state === 'replied') {
    return (
      <motion.span
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="inline-flex h-[22px] items-center rounded-full bg-[#dcfce7] px-2 text-[11px] font-semibold text-[#166534]"
      >
        Replied in 0:0{seconds}
      </motion.span>
    )
  }
  if (state === 'running') {
    return (
      <span className="inline-flex h-[22px] items-center gap-1.5 rounded-full bg-[#fef3c7] px-2 font-mono text-[11px] font-semibold text-[#92400e]">
        <span className="size-1.5 animate-pulse rounded-full bg-[#d97706]" />
        0:0{elapsed}
        {elapsed >= seconds - 1 && <span className="font-sans">replying…</span>}
      </span>
    )
  }
  return null
}

function SourceDetails() {
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ delay: 0.3 }} className="overflow-hidden">
      <div className="mx-3 mb-3 rounded-lg bg-white px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">Where this lead came from</p>
        <dl className="mt-1.5 grid grid-cols-[92px_1fr] gap-x-2 gap-y-1 text-[11px]">
          {SANA.details.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-[#64748b]">{k}</dt>
              <dd className={cn('m-0 font-semibold', /\d:\d/.test(v) && 'font-mono font-medium')}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.div>
  )
}
