import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { IPhoneFrame } from '@components/devices/IPhoneFrame'
import { useSim } from '@features/scenario/store'
import { MobileApp } from '@features/mobile-app/MobileApp'
import { INTEGRATIONS, NEEDS, PHASES } from '@features/scenes/next/nextData'
import { cn } from '@lib/cn'

const appear = (on: boolean, i: number) => ({
  initial: false as const,
  animate: { opacity: on ? 1 : 0.18, x: on ? 0 : -6 },
  transition: { duration: 0.35, delay: on ? i * 0.05 : 0 },
})

export function NextStage() {
  const vars = useSim((s) => s.vars)
  const connect = Number(vars.connect ?? 0)
  const phases = Number(vars.phases ?? 0)
  const needs = Number(vars.needs ?? 0)

  return (
    <div className="flex h-full items-start justify-center gap-7 px-6">
      <section className="flex h-[600px] w-[640px] flex-col gap-4 rounded-3xl border border-line bg-surface p-5 text-ink shadow-[0_1px_2px_rgba(11,31,77,.06),0_8px_24px_rgba(11,31,77,.06)]">
        <div className="grid grid-cols-2 gap-5">
          <Block title="What we connect">
            <ul className="flex flex-col gap-2.5">
              {INTEGRATIONS.map(({ icon: Icon, name, what }, i) => (
                <motion.li key={name} {...appear(i < connect, i)} className="flex gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-2">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span>
                    <b className="block text-[13px]">{name}</b>
                    <span className="text-xs text-ink-3">{what}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </Block>
          <Block title="Rollout plan">
            <ol className="flex flex-col">
              {PHASES.map((p, i) => (
                <motion.li key={p.title} {...appear(i < phases, i)} className="grid grid-cols-[28px_1fr] gap-2.5">
                  <span className="flex flex-col items-center">
                    <span className={cn('flex size-7 items-center justify-center rounded-full font-mono text-xs font-semibold', i === 0 ? 'bg-navy text-white dark:bg-brand dark:text-brand-fg' : 'bg-surface-2 text-ink-2')}>
                      {i + 1}
                    </span>
                    {i < PHASES.length - 1 && <span className="min-h-3 w-0.5 flex-1 bg-line" />}
                  </span>
                  <span className="pb-3">
                    <b className="block text-[13px]">Phase {i + 1} · {p.title}</b>
                    <span className="block text-xs text-ink-3">{p.what}</span>
                    <span className="block text-[11px] text-ink-3/80">Duration: [after review]</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </Block>
        </div>

        <Block title="What we need from you">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {NEEDS.map((n, i) => (
              <motion.li key={n} {...appear(i < needs, i)} className="flex items-start gap-2 text-[13px] leading-snug">
                <span className={cn('mt-px flex size-4 shrink-0 items-center justify-center rounded border-2', i < needs ? 'border-success bg-success text-white' : 'border-ink-3/50')}>
                  {i < needs && <Check className="size-2.5" aria-hidden />}
                </span>
                {n}
              </motion.li>
            ))}
          </ul>
        </Block>

        <AnimatePresence>
          {vars.cta === true && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-auto rounded-2xl bg-navy px-5 py-4 text-white dark:bg-brand-soft"
            >
              <p className="text-lg font-bold tracking-tight">Approve the flow, and we start Phase 1.</p>
              <p className="mt-0.5 text-[13px] text-navy-soft">Everything you saw today was simulated. The real build follows the same steps.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <figure className="m-0 flex flex-col items-center gap-2">
        <IPhoneFrame time="10:02" scale={0.62}>
          <MobileApp />
        </IPhoneFrame>
      </figure>
    </div>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="mb-2.5 text-[15px] font-bold">{title}</h2>
      {children}
    </div>
  )
}
