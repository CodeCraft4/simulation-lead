import type { HTMLAttributes } from 'react'
import { cn } from '@lib/cn'

type Tone = 'neutral' | 'brand' | 'success' | 'warning'

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-ink-2',
  brand: 'bg-brand-soft text-brand-2',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
}

export function Badge({ tone = 'neutral', className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn('inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold', tones[tone], className)}
      {...props}
    />
  )
}
