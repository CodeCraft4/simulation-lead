import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { BrowserWindow } from '@components/devices/BrowserWindow'
import { useSim } from '@features/scenario/store'
import { PUBLISH, type CampaignConfig, type CampaignField } from '@features/scenes/launch/launchData'
import { cn } from '@lib/cn'

interface CampaignPanelProps {
  config: CampaignConfig
  /** How many setup steps are done: one per field, then the ad preview. */
  step: number
  publish: number
  publishedAt: number
  preview: ReactNode
}

const STATUS = {
  [PUBLISH.draft]: { label: 'Draft', cls: 'bg-[#f1f5f9] text-[#475569]', dot: 'bg-[#94a3b8]' },
  [PUBLISH.review]: { label: 'In review', cls: 'bg-[#fef3c7] text-[#92400e]', dot: 'bg-[#d97706] animate-pulse' },
  [PUBLISH.active]: { label: 'Active', cls: 'bg-[#dcfce7] text-[#166534]', dot: 'bg-[#16a34a] animate-pulse' },
}

export function CampaignPanel({ config, step, publish, publishedAt, preview }: CampaignPanelProps) {
  const ready = step > config.fields.length
  const status = STATUS[publish as keyof typeof STATUS]

  return (
    <BrowserWindow url={config.url} className="h-[548px]" caption={<><b className="text-ink">Marketing</b> · {config.platform} · Simulated</>}>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg text-xs font-bold" style={{ background: config.tint, color: config.ink }}>
              {config.letter}
            </span>
            <div>
              <p className="text-sm font-bold">{config.name}</p>
              <p className="text-[11px] text-[#64748b]">{config.platform} · Simulated</p>
            </div>
          </div>
          <span className={cn('inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold', status.cls)}>
            <span className={cn('size-1.5 rounded-full', status.dot)} />
            {status.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {config.fields.map((field, i) => (
            <Field key={field.label} field={field} filled={i < step} />
          ))}
        </div>

        <div className="min-h-[104px]">
          <AnimatePresence mode="wait">
            {ready ? (
              <motion.div key="preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                {preview}
              </motion.div>
            ) : (
              <motion.div
                key="skeleton"
                exit={{ opacity: 0 }}
                className="flex h-[104px] items-center justify-center rounded-xl border border-dashed border-[#e2e8f0] text-[11px] text-[#94a3b8]"
              >
                Ad preview appears here
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <LiveStats config={config} active={publish === PUBLISH.active} publishedAt={publishedAt} />

        <div
          className={cn(
            'mt-auto flex h-9 items-center justify-center rounded-lg text-[13px] font-semibold transition-colors',
            publish === PUBLISH.draft && (ready ? 'bg-[#1e3a8a] text-white' : 'bg-[#f1f5f9] text-[#94a3b8]'),
            publish === PUBLISH.review && 'bg-[#1e3a8a]/80 text-white',
            publish === PUBLISH.active && 'bg-[#0b1f4d] text-white',
          )}
        >
          {publish === PUBLISH.draft ? 'Publish' : publish === PUBLISH.review ? 'Publishing…' : 'Published · running'}
        </div>
      </div>
    </BrowserWindow>
  )
}

function Field({ field, filled }: { field: CampaignField; filled: boolean }) {
  const values = Array.isArray(field.value) ? field.value : [field.value]
  return (
    <div className={cn('flex flex-col gap-1', field.wide && 'col-span-2')}>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">{field.label}</span>
      <motion.div
        className="flex min-h-[34px] flex-wrap items-center gap-1.5 rounded-lg border border-[#e2e8f0] px-2.5 py-1.5 text-[13px]"
        animate={filled ? { boxShadow: ['0 0 0 0 rgba(124,92,255,0)', '0 0 0 3px rgba(124,92,255,.35)', '0 0 0 0 rgba(124,92,255,0)'] } : {}}
        transition={{ duration: 0.9 }}
      >
        {filled ? (
          values.map((v, i) =>
            Array.isArray(field.value) ? (
              <motion.span
                key={v}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.12 }}
                className={cn(
                  'inline-flex h-[22px] items-center rounded-full px-2 text-[11px] font-medium',
                  field.accent ? 'bg-[#e7f0fe] text-[#1e3a8a]' : 'bg-[#eef2f8] text-[#334155]',
                )}
              >
                {v}
              </motion.span>
            ) : (
              <motion.span key={v} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium">
                {v}
              </motion.span>
            ),
          )
        ) : (
          <span className="h-2.5 w-2/5 rounded bg-[#f1f5f9]" aria-hidden />
        )}
      </motion.div>
    </div>
  )
}

function LiveStats({ config, active, publishedAt }: { config: CampaignConfig; active: boolean; publishedAt: number }) {
  const now = useSim((s) => s.clock.now)
  const minutes = active ? Math.max(0, (now - publishedAt) / 60) : 0

  return (
    <div className="grid grid-cols-3 gap-2">
      {config.stats.map(([label, perMinute, prefix = '']) => (
        <div key={label} className="rounded-lg border border-[#e2e8f0] px-2.5 py-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">{label}</p>
          <p className={cn('font-mono text-[15px] font-semibold tabular', !active && 'text-[#cbd5e1]')}>
            {prefix}
            {Math.floor(minutes * perMinute).toLocaleString('en-US')}
          </p>
        </div>
      ))}
    </div>
  )
}
