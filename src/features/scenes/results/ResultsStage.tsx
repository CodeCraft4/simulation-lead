import { AnimatePresence, motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { AppWindow } from '@components/devices/BrowserWindow'
import { IPhoneFrame } from '@components/devices/IPhoneFrame'
import { revealChat } from '@components/whatsapp/revealChat'
import { WaChat } from '@components/whatsapp/WaChat'
import { useSim } from '@features/scenario/store'
import { CAMPAIGN_ROWS, CHANNEL_SALES, SUMMARY_CHAT, SUMMARY_CONTACT, TILES } from '@features/scenes/results/resultsData'
import { cn } from '@lib/cn'

const th = 'px-2 py-1.5 text-right text-[10px] font-semibold uppercase tracking-wider text-[#64748b] first:text-left'
const td = 'px-2 py-1.5 text-right font-mono text-xs first:text-left first:font-sans'

export function ResultsStage() {
  const vars = useSim((s) => s.vars)
  const tiles = Number(vars.tiles ?? 0)
  const rows = Number(vars.rows ?? 0)
  const best = vars.best === true

  return (
    <div className="flex h-full items-start justify-center gap-6 px-6">
      <AppWindow
        title={<>Results <span className="font-normal text-[#64748b]">· November, all campaigns</span></>}
        className="h-[576px] w-[640px]"
        caption={<><b className="text-ink">Owner</b> · Results dashboard · Simulated</>}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-3.5 p-4">
          <div className="grid grid-cols-5 gap-2">
            {TILES.map((t, i) => {
              const on = i < tiles
              return (
                <motion.div
                  key={t.label}
                  initial={false}
                  animate={{ borderColor: on ? '#86efac' : '#e2e8f0', backgroundColor: on ? '#f0fdf4' : '#ffffff' }}
                  className="rounded-xl border px-2.5 py-2"
                >
                  <p className="min-h-7 text-[11px] leading-tight text-[#475569]">{t.label}</p>
                  <p className="mt-1 font-mono text-[11px] text-[#64748b] line-through">{t.before}</p>
                  <AnimatePresence mode="wait">
                    {on ? (
                      <motion.p key="after" initial={{ opacity: 0, y: 6, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="font-mono text-base font-bold text-[#15803d]">
                        {t.after}
                      </motion.p>
                    ) : (
                      <p key="wait" className="font-mono text-base font-bold text-[#cbd5e1]">
                        ?
                      </p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          <div>
            <p className="mb-1 flex items-baseline gap-2">
              <span className="text-sm font-bold">Which ads bring buyers</span>
              <span className="text-[11px] text-[#475569]">100 leads · 11 sales · PKR 15 lakh spent</span>
            </p>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  {['Campaign', 'Spend', 'Leads', 'Qualified', 'Visits', 'Sales', 'Cost per sale'].map((h) => (
                    <th key={h} scope="col" className={th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CAMPAIGN_ROWS.map((r, i) => (
                  <motion.tr
                    key={r.type}
                    initial={false}
                    animate={{ opacity: i < rows ? 1 : 0.15, backgroundColor: best && i === 0 ? '#f0fdf4' : 'rgba(255,255,255,0)' }}
                    transition={{ duration: 0.4 }}
                    className="border-b border-[#eef2f8]"
                  >
                    <td className={td}>
                      <b>{r.name}</b> <span className="text-[11px] text-[#475569]">{r.type}</span>
                    </td>
                    <td className={td}>{r.spend}</td>
                    <td className={td}>{r.leads}</td>
                    <td className={td}>{r.qualified}</td>
                    <td className={td}>{r.visits}</td>
                    <td className={cn(td, 'font-bold')}>{r.sales}</td>
                    <td className={cn(td, 'font-bold', best && i === 0 && 'text-[#15803d]')}>
                      {r.perSale}
                      {best && i === 0 && ' ★'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-[1fr_1.3fr] gap-3">
            <div className="rounded-xl border border-[#e2e8f0] p-3">
              <p className="text-xs font-bold">Sales by channel</p>
              {CHANNEL_SALES.map((c) => (
                <div key={c.name} className="mt-2 grid grid-cols-[48px_1fr_18px] items-center gap-2 text-xs">
                  <span className="font-semibold">{c.name}</span>
                  <span className="h-3 overflow-hidden rounded bg-[#eef2f8]">
                    <motion.span
                      className="block h-full rounded"
                      style={{ background: c.color }}
                      initial={false}
                      animate={{ width: vars.bars === true ? `${(c.sales / 7) * 100}%` : '0%' }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                  </span>
                  <span className="font-mono font-semibold">{vars.bars === true ? c.sales : '–'}</span>
                </div>
              ))}
            </div>
            <AnimatePresence>
              {best && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2.5 rounded-xl bg-[#f3f0ff] p-3">
                  <TrendingUp className="mt-0.5 size-4 shrink-0 text-[#5b3fd6]" aria-hidden />
                  <p className="text-xs leading-relaxed text-[#2e1a73]">
                    <b>Suggested:</b> move PKR 5,000 a day from Meta Instant form to Meta Click to WhatsApp. It brings buyers at PKR 1.08 lakh each.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </AppWindow>

      <figure className="m-0 flex flex-col items-center gap-2">
        <IPhoneFrame time="9:02" statusBar="dark" scale={0.66}>
          <WaChat contact={SUMMARY_CONTACT} messages={revealChat(SUMMARY_CHAT, Number(vars.chat ?? 0))} typing={vars.typing === true} />
        </IPhoneFrame>
        <figcaption className="text-xs text-ink-3">
          <b className="text-ink">Owner</b> · WhatsApp · Simulated
        </figcaption>
      </figure>
    </div>
  )
}
