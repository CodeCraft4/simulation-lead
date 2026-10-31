import { Bell, ChevronRight, Megaphone, MessageCircle, Phone, Search } from 'lucide-react'
import { useState } from 'react'
import { BUSINESS } from '@data/business'
import { APP_CAMPAIGNS, APP_CHATS, APP_LEADS, BEFORE_AFTER, TODAY_TASKS, findLead } from '@features/mobile-app/appData'
import { ScreenHeader, useAppNav } from '@features/mobile-app/appNav'
import { cn } from '@lib/cn'

const card = 'rounded-2xl bg-white shadow-[0_1px_2px_rgba(11,31,77,.06),0_4px_14px_rgba(11,31,77,.05)]'
const body = 'flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-4 text-navy'

const tagOf = (score: number) =>
  score >= 75 ? { text: `Hot ${score}`, cls: 'bg-[#ffedd5] text-[#9a3412]' } : { text: `Warm ${score}`, cls: 'bg-[#edf1f9] text-[#1e3a8a]' }

export function HomeTab() {
  const nav = useAppNav()
  const hot = findLead('sana')
  return (
    <>
      <ScreenHeader
        eyebrow="Good morning"
        title={BUSINESS.agent.name}
        action={
          <span className="relative flex size-[42px] items-center justify-center rounded-full bg-white/12">
            <Bell className="size-5" aria-hidden />
            <span className="absolute right-2.5 top-2.5 size-2.5 rounded-full bg-[#f97316] ring-2 ring-navy" />
          </span>
        }
      >
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ['6', 'New leads'],
            ['3', 'Calls due'],
            ['2', 'Site visits'],
          ].map(([v, l]) => (
            <button key={l} type="button" onClick={() => nav.push({ name: 'leads' })} className="rounded-2xl bg-white/10 px-3 py-2.5 text-left">
              <p className="font-mono text-2xl font-semibold">{v}</p>
              <p className="text-xs text-navy-soft">{l}</p>
            </button>
          ))}
        </div>
      </ScreenHeader>
      <div className={body}>
        <div className={cn(card, 'p-3.5 shadow-[0_0_0_2px_#1e3a8a]')}>
          <p className="flex items-center gap-1.5 text-xs">
            <span className="rounded-full bg-navy px-2 py-0.5 font-bold text-white">New lead</span>
            <span className="rounded-full bg-[#ffedd5] px-2 py-0.5 font-bold text-[#9a3412]">Hot · {hot.score}</span>
            <span className="ml-auto font-mono text-[#5b6b8c]">just now</span>
          </p>
          <button type="button" onClick={() => nav.push({ name: 'lead', id: hot.id })} className="mt-2.5 flex w-full items-center gap-3 text-left">
            <span className="flex size-10 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{hot.initials}</span>
            <span className="flex-1">
              <span className="block font-bold">{hot.name}</span>
              <span className="block text-xs text-[#5b6b8c]">{hot.source}</span>
            </span>
            <ChevronRight className="size-4 text-[#5b6b8c]" aria-hidden />
          </button>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => nav.push({ name: 'call', id: hot.id })} className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-navy text-sm font-bold text-white">
              <Phone className="size-4" aria-hidden /> Call
            </button>
            <button type="button" onClick={() => nav.push({ name: 'chat', id: hot.id })} className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#edf1f9] text-sm font-bold">
              <MessageCircle className="size-4" aria-hidden /> Chat
            </button>
          </div>
        </div>
        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#5b6b8c]">Today</p>
        <div className={cn(card, 'px-3.5')}>
          {TODAY_TASKS.map((t, i) => (
            <button
              key={t.time}
              type="button"
              onClick={() => nav.push({ name: 'lead', id: t.lead })}
              className={cn('flex w-full items-center gap-3 py-3 text-left text-sm', i < TODAY_TASKS.length - 1 && 'border-b border-[#edf1f9]')}
            >
              <span className="w-16 font-mono text-xs font-semibold">{t.time}</span>
              <span className="flex-1">
                {t.text} <b>{t.who}</b>
              </span>
              <ChevronRight className="size-4 text-[#94a3b8]" aria-hidden />
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

export function LeadsTab() {
  const nav = useAppNav()
  const [filter, setFilter] = useState<'all' | 'hot'>('all')
  const leads = filter === 'hot' ? APP_LEADS.filter((l) => l.score >= 75) : APP_LEADS
  return (
    <>
      <ScreenHeader title="Leads" action={<span className="font-mono text-xs text-navy-soft">128 total</span>}>
        <p className="mt-3 flex h-10 items-center gap-2 rounded-xl bg-white/12 px-3.5 text-sm text-navy-soft">
          <Search className="size-4" aria-hidden /> Search name, phone or campaign
        </p>
        <div className="mt-3 flex gap-1.5">
          {(['all', 'hot'] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn('h-8 rounded-full px-3.5 text-[13px] font-semibold', filter === f ? 'bg-white text-navy' : 'bg-white/12 text-white')}
            >
              {f === 'all' ? 'All' : 'Hot only'}
            </button>
          ))}
        </div>
      </ScreenHeader>
      <div className={body}>
        {leads.map((l) => {
          const tag = tagOf(l.score)
          return (
            <button key={l.id} type="button" onClick={() => nav.push({ name: 'lead', id: l.id })} className={cn(card, 'flex items-center gap-3 p-3 text-left')}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e3e9f7] text-sm font-bold">{l.initials}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <b className="text-[15px]">{l.name}</b>
                  <span className={cn('rounded-full px-1.5 py-px text-[10px] font-bold', tag.cls)}>{tag.text}</span>
                </span>
                <span className="block truncate text-xs text-[#5b6b8c]">{l.source}</span>
                <span className="block truncate text-xs font-semibold text-[#334366]">{l.next}</span>
              </span>
              <span className="self-start font-mono text-[11px] text-[#5b6b8c]">{l.time}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}

export function ChatsTab() {
  const nav = useAppNav()
  return (
    <>
      <ScreenHeader title="Chats" action={<span className="flex items-center gap-1.5 text-xs text-navy-soft"><span className="size-2 rounded-full bg-[#4ade80]" />WhatsApp</span>} />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white text-navy">
        {APP_LEADS.map((l) => {
          const last = APP_CHATS[l.id]?.at(-1)
          return (
            <button key={l.id} type="button" onClick={() => nav.push({ name: 'chat', id: l.id })} className="flex items-center gap-3 border-b border-[#edf1f9] px-4 py-3 text-left">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e3e9f7] text-sm font-bold">{l.initials}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <b className="text-[15px]">{l.name}</b>
                  {last?.from === 'bot' && <span className="rounded-full bg-[#ede9fe] px-1.5 text-[10px] font-bold text-[#5b21b6]">Bot</span>}
                </span>
                <span className="block truncate text-[13px] text-[#5b6b8c]">{last?.text}</span>
              </span>
              <span className="self-start font-mono text-[11px] text-[#5b6b8c]">{last?.time}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}

export function CampaignsTab() {
  const nav = useAppNav()
  return (
    <>
      <ScreenHeader title="Campaigns">
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ['15 lakh', 'Spent · Nov'],
            ['100', 'Leads'],
            ['11', 'Sales'],
          ].map(([v, l]) => (
            <div key={l} className="rounded-2xl bg-white/10 px-3 py-2">
              <p className="font-mono text-lg font-semibold">{v}</p>
              <p className="text-xs text-navy-soft">{l}</p>
            </div>
          ))}
        </div>
      </ScreenHeader>
      <div className={body}>
        {APP_CAMPAIGNS.map((c) => (
          <div key={c.sub} className={cn(card, 'p-3', c.best && 'shadow-[0_0_0_2px_#1e3a8a]')}>
            <p className="flex items-center gap-2.5">
              <span className={cn('flex size-8 items-center justify-center rounded-lg text-sm font-extrabold', c.platform === 'M' ? 'bg-[#e7f0fe] text-[#1659c7]' : 'bg-[#e8f0fe] text-[#1a56c4]')}>
                {c.platform}
              </span>
              <span className="flex-1">
                <b className="block text-sm">{c.name}</b>
                <span className="text-[11px] text-[#5b6b8c]">{c.sub}</span>
              </span>
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', c.best ? 'bg-navy text-white' : 'bg-[#dcfce7] text-[#166534]')}>{c.best ? 'Best' : 'Active'}</span>
            </p>
            <div className="mt-2 grid grid-cols-4 text-[10px] font-bold uppercase text-[#5b6b8c]">
              {(['Spend', 'Leads', 'Sales', 'Per sale'] as const).map((h, i) => (
                <div key={h}>
                  {h}
                  <p className={cn('font-mono text-sm normal-case text-navy', i === 3 && c.best && 'text-[#15803d]')}>{[c.spend, c.leads, c.sales, c.perSale][i]}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={() => nav.push({ name: 'broadcast' })} className={cn(card, 'flex items-center gap-3 bg-navy p-3 text-left text-white')}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-white/14"><Megaphone className="size-[18px]" aria-hidden /></span>
          <span className="flex-1">
            <b className="block text-sm">WhatsApp broadcast</b>
            <span className="text-xs text-navy-soft">Reach 1,284 warm leads again</span>
          </span>
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </>
  )
}

export function ReportsTab() {
  const [approved, setApproved] = useState(false)
  return (
    <>
      <ScreenHeader title="Reports" action={<span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold">November</span>}>
        <div className="mt-3 flex items-end gap-4">
          <div>
            <p className="font-mono text-[40px] font-semibold leading-none">11</p>
            <p className="mt-1 text-xs text-navy-soft">sales from 100 leads</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-navy-soft">Cost per sale</p>
            <p className="font-mono text-xl font-semibold">PKR 1.36 lakh</p>
            <p className="font-mono text-[11px] text-[#93a3cc] line-through">was 2.5 lakh</p>
          </div>
        </div>
      </ScreenHeader>
      <div className={body}>
        <div className={cn(card, 'px-3.5')}>
          {BEFORE_AFTER.map((r, i) => (
            <p key={r.label} className={cn('flex items-center gap-2 py-2.5 text-sm', i < BEFORE_AFTER.length - 1 && 'border-b border-[#edf1f9]')}>
              <span className="flex-1">{r.label}</span>
              <span className="font-mono text-xs text-[#5b6b8c] line-through">{r.before}</span>
              <b className="w-14 text-right font-mono text-[#15803d]">{r.after}</b>
            </p>
          ))}
        </div>
        <div className={cn(card, 'bg-navy p-3.5 text-white')}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#93a3cc]">Suggested action</p>
          <p className="mt-1 text-sm leading-snug">
            Move <b>PKR 5,000 a day</b> from Meta Instant form to Meta Click to WhatsApp.
          </p>
          <button
            type="button"
            onClick={() => setApproved(true)}
            disabled={approved}
            className={cn('mt-3 h-10 w-full rounded-xl text-sm font-bold transition-colors', approved ? 'bg-[#16a34a] text-white' : 'bg-white text-navy')}
          >
            {approved ? '✓ Approved · budget moved' : 'Approve'}
          </button>
        </div>
      </div>
    </>
  )
}
