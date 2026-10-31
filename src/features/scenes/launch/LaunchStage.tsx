import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { BuildingsArt } from '@components/illustrations/BuildingsArt'
import { BUSINESS } from '@data/business'
import { useSim } from '@features/scenario/store'
import { CampaignPanel } from '@features/scenes/launch/CampaignPanel'
import { CONNECTIONS, GOOGLE, META } from '@features/scenes/launch/launchData'
import { cn } from '@lib/cn'

export function LaunchStage() {
  const vars = useSim((s) => s.vars)
  const metaStep = Number(vars.metaStep ?? 0)
  const googleStep = Number(vars.googleStep ?? 0)
  const connected = Number(vars.connected ?? 0)
  const publish = Number(vars.publish ?? 0)
  const publishedAt = Number(vars.publishedAt ?? 0)

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-2 gap-5">
        <CampaignPanel config={META} step={metaStep} publish={publish} publishedAt={publishedAt} preview={<MetaAdPreview />} />
        <CampaignPanel config={GOOGLE} step={googleStep} publish={publish} publishedAt={publishedAt} preview={<GoogleAdPreview />} />
      </div>

      <section
        aria-label="Connections"
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-xl border border-line bg-surface px-4 py-2.5"
      >
        <span className="text-[13px] font-bold">Connected to Lead Inbox</span>
        {CONNECTIONS.map((label, i) => {
          const on = i < connected
          return (
            <motion.span
              key={label}
              animate={on ? { scale: [1, 1.06, 1] } : {}}
              className={cn(
                'inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold transition-colors duration-300',
                on ? 'bg-success/15 text-success' : 'bg-surface-2 text-ink-3',
              )}
            >
              <span className={cn('flex size-3.5 items-center justify-center rounded-full', on ? 'bg-success text-white' : 'border border-ink-3/40')}>
                {on && <Check className="size-2.5" aria-hidden />}
              </span>
              {label}
            </motion.span>
          )
        })}
        <span className="text-[11px] text-ink-3">Every lead keeps its campaign, ad and keyword.</span>
      </section>
    </div>
  )
}

function MetaAdPreview() {
  return (
    <article aria-label="Meta ad preview" className="flex h-[104px] overflow-hidden rounded-xl border border-[#e2e8f0]">
      <BuildingsArt className="w-[118px] shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col p-2.5">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold">
          <span className="flex size-4 items-center justify-center rounded-full bg-[#1e3a8a] text-[7px] font-bold text-white">{BUSINESS.initials}</span>
          {BUSINESS.name} <span className="font-normal text-[#64748b]">· Sponsored</span>
        </p>
        <p className="mt-1 text-xs font-semibold leading-snug">{BUSINESS.offer}</p>
        <span className="mt-auto flex h-6 items-center justify-center rounded-md bg-[#eef2f8] text-[11px] font-semibold text-[#166534]">
          Send WhatsApp message
        </span>
      </div>
    </article>
  )
}

function GoogleAdPreview() {
  return (
    <article aria-label="Google search ad preview" className="h-[104px] rounded-xl border border-[#e2e8f0] px-3 py-2.5">
      <p className="text-[10px] text-[#334155]">
        <b>Sponsored</b> · crescentheights.simulated
      </p>
      <p className="mt-0.5 text-sm font-medium text-[#1a56c4]">2 &amp; 3 Bed Apartments in Lahore | 3-Year Instalments</p>
      <p className="mt-0.5 text-[11px] leading-snug text-[#374151]">From PKR 1.85 crore. Near DHA and Bahria. Book a site visit today.</p>
      <p className="mt-1 flex gap-3 text-[11px] text-[#1a56c4]">
        <span>Floor plans</span>
        <span>Payment plan</span>
        <span>Call now</span>
      </p>
    </article>
  )
}
