import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Check, PartyPopper } from 'lucide-react'
import { AppWindow } from '@components/devices/BrowserWindow'
import { useSim } from '@features/scenario/store'
import type { SimVars } from '@features/scenario/types'
import { BASE_CARDS, COLUMNS, REASSIGNED, SEQUENCE, type BoardCard } from '@features/scenes/follow-up/followUpData'
import { cn } from '@lib/cn'

const TAG_CLS: Record<BoardCard['tag']['tone'], string> = {
  neutral: 'bg-[#eef2f8] text-[#334155]',
  hot: 'bg-[#ffedd5] text-[#9a3412]',
  quiet: 'bg-[#f1f5f9] text-[#64748b]',
  won: 'bg-[#16a34a] text-white',
}

const OWNER_CLS: Record<string, string> = {
  UT: 'bg-[#0b1f4d] text-white',
  MA: 'bg-[#7c5cff] text-white',
  HS: 'bg-[#e3e9f7] text-[#0b1f4d]',
  NR: 'bg-[#e3e9f7] text-[#0b1f4d]',
}

/** Apply the scene's progress to the starting board. */
function boardFrom(vars: SimVars): BoardCard[] {
  const sanaStage = Number(vars.sana ?? 0) // 0 qualified, 1 visit booked, 2 sold
  const bilal = Number(vars.bilal ?? 0) // 0 normal, 1 quiet, 2 back to hot
  const reassigned = vars.reassigned === true

  const cards = BASE_CARDS.map((card): BoardCard => {
    if (card.id === 'sana') {
      if (sanaStage === 1) return { ...card, column: 2, tag: { text: 'Hot 82', tone: 'hot' }, next: 'Visit Sat 7 Nov, 11:00 am' }
      if (sanaStage === 2) return { ...card, column: 3, tag: { text: 'Sold', tone: 'won' }, next: 'PKR 1.95 crore · 3 bed' }
    }
    if (card.id === 'bilal' && bilal === 1) return { ...card, tag: { text: 'Quiet 3 days', tone: 'quiet' }, next: 'Follow-up sequence running' }
    if (card.id === 'bilal' && bilal === 2) return { ...card, tag: { text: 'Hot again', tone: 'hot' }, next: 'Replied on day 7 · call now' }
    if (reassigned && REASSIGNED.includes(card.id)) return { ...card, owner: 'MA', next: 'Moved to Maryam · calling now' }
    return card
  })
  // A lead that comes back to life jumps to the top of its column.
  return bilal === 2 ? [...cards.filter((c) => c.id === 'bilal'), ...cards.filter((c) => c.id !== 'bilal')] : cards
}

export function PipelineBoard() {
  const vars = useSim((s) => s.vars)
  const cards = boardFrom(vars)
  const sequence = Number(vars.sequence ?? 0)

  return (
    <AppWindow
      title={<>Lead Inbox <span className="font-normal text-[#64748b]">› Pipeline</span></>}
      className="h-[540px] w-[580px]"
      caption={<><b className="text-ink">Sales team</b> · Pipeline · Simulated</>}
    >
      <div className="relative flex min-h-0 flex-1 flex-col gap-3 p-3">
        <LayoutGroup>
          <div className="grid grid-cols-4 gap-2">
            {COLUMNS.map((title, col) => {
              const inColumn = cards.filter((c) => c.column === col)
              return (
                <section key={title} className="flex min-h-[250px] flex-col gap-1.5 rounded-xl bg-[#f8fafc] p-2">
                  <p className="flex items-center justify-between px-0.5 text-xs font-bold">
                    {title}
                    <span className="font-mono text-[11px] text-[#475569]">{inColumn.length}</span>
                  </p>
                  {inColumn.map((card) => (
                    <Card key={card.id} card={card} />
                  ))}
                </section>
              )
            })}
          </div>
        </LayoutGroup>

        <AnimatePresence>
          {sequence > 0 && (
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-[#e2e8f0] p-2.5">
              <p className="flex items-center justify-between text-xs font-bold">
                Follow-up sequence · Bilal Khan
                <span className="text-[10px] font-semibold text-[#64748b]">runs on its own · stops when he replies</span>
              </p>
              <ol className="mt-2 grid grid-cols-3 gap-2">
                {SEQUENCE.map((s, i) => {
                  const sent = i < sequence
                  const replied = i === 2 && sequence > 3
                  return (
                    <li
                      key={s.day}
                      className={cn(
                        'rounded-lg p-2 transition-colors duration-500',
                        replied ? 'bg-[#ecfdf3] shadow-[inset_0_0_0_1px_#86efac]' : sent ? 'bg-[#f8fafc]' : 'bg-[#f8fafc] opacity-40',
                      )}
                    >
                      <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                        {sent && <Check className="size-3 text-[#16a34a]" aria-hidden />}
                        {s.day} · {s.when}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-snug">{s.text}</p>
                      <p className={cn('mt-0.5 text-[10px]', replied ? 'font-bold text-[#166534]' : 'text-[#64748b]')}>
                        {sent ? (i === 2 ? (replied ? s.result : 'Delivered') : s.result) : 'Scheduled'}
                      </p>
                    </li>
                  )
                })}
              </ol>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {vars.toast === true && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0b1f4d] px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg"
            >
              3 leads moved from Usman to Maryam
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </AppWindow>
  )
}

function Card({ card }: { card: BoardCard }) {
  const won = card.tag.tone === 'won'
  return (
    <motion.article
      layout
      layoutId={card.id}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className={cn(
        'relative rounded-lg border bg-white px-2 py-1.5',
        won && card.id === 'sana' ? 'border-[#86efac] bg-[#f0fdf4] shadow-[0_0_0_3px_rgba(22,163,74,.15)]' : 'border-[#e2e8f0]',
      )}
    >
      <p className="flex items-center gap-1">
        <span className="truncate text-xs font-bold">{card.name}</span>
        <motion.span layout="position" key={card.owner} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className={cn('ml-auto flex size-[18px] shrink-0 items-center justify-center rounded-full text-[8px] font-bold', OWNER_CLS[card.owner])}>
          {card.owner}
        </motion.span>
      </p>
      <p className="truncate text-[10px] text-[#64748b]">{card.source}</p>
      <span className={cn('mt-1 inline-flex h-[18px] items-center rounded-full px-1.5 text-[10px] font-bold transition-colors duration-500', TAG_CLS[card.tag.tone])}>
        {won && card.id === 'sana' && <PartyPopper className="mr-1 size-3" aria-hidden />}
        {card.tag.text}
      </span>
      <p className="mt-0.5 text-[10px] leading-snug text-[#1e293b]">{card.next}</p>
    </motion.article>
  )
}
