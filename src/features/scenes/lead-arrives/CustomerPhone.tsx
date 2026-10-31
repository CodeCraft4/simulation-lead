import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Heart, MessageCircle, Search, Send } from 'lucide-react'
import { IPhoneFrame } from '@components/devices/IPhoneFrame'
import { BuildingsArt } from '@components/illustrations/BuildingsArt'
import { WaChat, type WaMessage } from '@components/whatsapp/WaChat'
import { BUSINESS } from '@data/business'
import { useSim } from '@features/scenario/store'
import { ALI, AUTO_REPLY, BUSINESS_CONTACT, SANA, type CustomerScreen } from '@features/scenes/lead-arrives/leadArrivesData'
import { cn } from '@lib/cn'

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 } }

export function CustomerPhone({ scale }: { scale: number }) {
  const vars = useSim((s) => s.vars)
  const screen = (vars.screen ?? 'feed') as CustomerScreen
  const isAli = screen === 'search' || screen === 'form' || screen === 'formDone'

  return (
    <figure className="m-0 flex flex-col items-center gap-2">
      <IPhoneFrame time={isAli ? '10:20' : '10:02'} statusBar="dark" scale={scale}>
        <AnimatePresence mode="wait">
          <motion.div key={screen} {...fade} className="h-full">
            {screen === 'feed' && <FeedScreen stopped={vars.feedStop === true} tapped={vars.tap === true} />}
            {screen === 'wa' && <WaChat contact={BUSINESS_CONTACT} messages={sanaMessages(vars)} typing={vars.typing === true} />}
            {screen === 'search' && <SearchScreen tapped={vars.searchTap === true} />}
            {(screen === 'form' || screen === 'formDone') && <LeadForm filled={Number(vars.formFill ?? 0)} sent={screen === 'formDone'} />}
          </motion.div>
        </AnimatePresence>
      </IPhoneFrame>
      <figcaption className="text-xs text-ink-3">
        <b className="text-ink">{isAli ? 'Ali' : 'Sana'}</b> · Customer phone · Simulated
      </figcaption>
    </figure>
  )
}

function sanaMessages(vars: Record<string, unknown>): WaMessage[] {
  const ticks = Number(vars.waOut ?? 0)
  const list: WaMessage[] = [{ id: 'today', kind: 'pill', text: 'Today' }]
  if (ticks > 0) {
    list.push({
      id: 'first',
      kind: 'out',
      text: SANA.firstMessage,
      time: '10:02 am',
      ticks: Math.min(ticks, 3) as 1 | 2 | 3,
      ad: { title: `${BUSINESS.name} · Ad`, body: BUSINESS.offer },
    })
  }
  if (vars.reply === true) {
    list.push({ id: 'reply', kind: 'in', text: AUTO_REPLY, time: '10:02 am', buttons: ['Yes, go ahead', 'Call me instead'] })
  }
  return list
}

/** Generic social feed (not any real app) that scrolls to the sponsored post. */
function FeedScreen({ stopped, tapped }: { stopped: boolean; tapped: boolean }) {
  return (
    <div className="flex h-full flex-col bg-white text-[#0f172a]">
      <header className="flex shrink-0 items-center justify-between border-b border-[#eef2f8] px-4 pb-2.5 pt-[58px]">
        <span className="text-xl font-bold tracking-tight">Feed</span>
        <span className="flex gap-4 text-[#334155]">
          <Heart className="size-5" aria-hidden />
          <Send className="size-5" aria-hidden />
        </span>
      </header>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <motion.div initial={false} animate={{ y: stopped ? -300 : 0 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}>
          <Post name="Lahore Food Diaries" color="#f59e0b" tint="#fef3c7" />
          <article className="border-b border-[#eef2f8] pb-3">
            <PostHeader name={BUSINESS.name} sub="Sponsored" initials={BUSINESS.initials} />
            <BuildingsArt className="h-[230px]" />
            <div className="relative mx-3 mt-2.5 overflow-hidden rounded-lg">
              <div className={cn('flex h-10 items-center justify-between px-3 text-sm font-semibold transition-colors', tapped ? 'bg-[#c9f1c1]' : 'bg-[#eef2f8]')}>
                <span className="text-[#166534]">Send WhatsApp message</span>
                <MessageCircle className="size-4 text-[#166534]" aria-hidden />
              </div>
              {tapped && (
                <motion.span
                  className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#166534]/30"
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 6, opacity: 0 }}
                  transition={{ duration: 0.7 }}
                />
              )}
            </div>
            <p className="px-3 pt-2 text-[13px] leading-snug">
              <b>{BUSINESS.name}</b> {BUSINESS.offer}. 3-year instalments, near DHA and Bahria.
            </p>
          </article>
          <Post name="Cricket Updates PK" color="#16a34a" tint="#dcfce7" />
        </motion.div>
      </div>
    </div>
  )
}

function PostHeader({ name, sub, initials, color = '#0b1f4d' }: { name: string; sub?: string; initials: string; color?: string }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5">
      <span className="flex size-8 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: color }}>
        {initials}
      </span>
      <span className="leading-tight">
        <span className="block text-[13px] font-semibold">{name}</span>
        {sub && <span className="block text-[11px] text-[#64748b]">{sub}</span>}
      </span>
    </div>
  )
}

function Post({ name, color, tint }: { name: string; color: string; tint: string }) {
  return (
    <article className="border-b border-[#eef2f8] pb-3">
      <PostHeader name={name} initials={name.slice(0, 2).toUpperCase()} color={color} />
      <div className="h-[200px]" style={{ background: tint }} aria-hidden />
      <div className="mx-3 mt-2 h-2.5 w-3/4 rounded bg-[#f1f5f9]" aria-hidden />
    </article>
  )
}

/** Generic search results page (not any real search engine). */
function SearchScreen({ tapped }: { tapped: boolean }) {
  return (
    <div className="flex h-full flex-col bg-white px-4 pt-[62px] text-[#0f172a]">
      <div className="flex h-11 items-center gap-2.5 rounded-full border border-[#e2e8f0] px-4 text-[15px] shadow-sm">
        <Search className="size-4 text-[#64748b]" aria-hidden />3 bed flat lahore installments
      </div>
      <motion.article
        animate={tapped ? { boxShadow: '0 0 0 3px rgba(26,86,196,.35)' } : { boxShadow: '0 0 0 0 rgba(26,86,196,0)' }}
        className="mt-5 rounded-xl p-2"
      >
        <p className="text-xs text-[#334155]">
          <b>Sponsored</b> · crescentheights.simulated
        </p>
        <p className="mt-1 text-lg leading-snug text-[#1a56c4]">2 &amp; 3 Bed Apartments in Lahore | 3-Year Instalments</p>
        <p className="mt-1 text-[13px] leading-snug text-[#374151]">From PKR 1.85 crore. Near DHA and Bahria. Get the price list.</p>
        <span className={cn('mt-2.5 inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold transition-colors', tapped ? 'bg-[#1a56c4] text-white' : 'bg-[#e8f0fe] text-[#1a56c4]')}>
          Get price list
        </span>
      </motion.article>
      {[0, 1, 2].map((i) => (
        <div key={i} className="mt-6 space-y-2 px-2" aria-hidden>
          <div className="h-2.5 w-1/3 rounded bg-[#f1f5f9]" />
          <div className="h-3.5 w-5/6 rounded bg-[#e2e8f0]" />
          <div className="h-2.5 w-full rounded bg-[#f1f5f9]" />
        </div>
      ))}
    </div>
  )
}

function LeadForm({ filled, sent }: { filled: number; sent: boolean }) {
  return (
    <div className="flex h-full flex-col bg-[#f1f5f9] pt-[70px] text-[#0f172a]">
      <div className="mx-3 flex flex-1 flex-col rounded-t-3xl bg-white p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">{BUSINESS.initials}</span>
          <div>
            <p className="text-[15px] font-bold">{BUSINESS.name}</p>
            <p className="text-xs text-[#64748b]">Get the price list on WhatsApp</p>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="done" {...fade} className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
                <CheckCircle2 className="size-16 text-[#16a34a]" aria-hidden />
              </motion.span>
              <p className="text-lg font-bold">Thanks, Ali!</p>
              <p className="text-sm leading-relaxed text-[#475569]">We are sending the price list to your WhatsApp now.</p>
            </motion.div>
          ) : (
            <motion.div key="form" {...fade} className="mt-6 flex flex-1 flex-col gap-4">
              {ALI.form.map(([label, value], i) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-[#64748b]">{label}</span>
                  <span
                    className={cn(
                      'flex h-11 items-center rounded-xl border px-3.5 text-[15px] transition-colors',
                      i < filled ? 'border-[#1a56c4] bg-white' : 'border-[#e2e8f0] bg-[#f8fafc] text-[#94a3b8]',
                    )}
                  >
                    {i < filled ? value : '…'}
                  </span>
                </div>
              ))}
              <span
                className={cn(
                  'mt-auto mb-10 flex h-12 items-center justify-center rounded-xl text-[15px] font-bold transition-colors',
                  filled >= ALI.form.length ? 'bg-[#1a56c4] text-white' : 'bg-[#e2e8f0] text-[#94a3b8]',
                )}
              >
                Send
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
