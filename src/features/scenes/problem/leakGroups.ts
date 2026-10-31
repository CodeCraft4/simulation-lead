import type { FlowStep } from '@features/scenario/types'

/** Where 100 leads from one month end up today (simulated). Order = order they appear on stage. */
export const LEAK_GROUPS: { id: string; label: string; count: number; color: string; flow?: FlowStep }[] = [
  { id: 'slow', label: 'Slow first reply (over 1 hour)', count: 38, color: '#DC2626', flow: 'whatsapp' },
  { id: 'missed', label: 'Missed calls never returned', count: 17, color: '#F59E0B', flow: 'call' },
  { id: 'noFollow', label: 'No follow-up after the first chat', count: 21, color: '#7C5CFF', flow: 'followUp' },
  { id: 'notReady', label: 'Not ready to buy yet', count: 18, color: '#94A3B8' },
  { id: 'sale', label: 'Became a sale', count: 6, color: '#16A34A' },
]

export const MONTHLY_SPEND = { total: 1_500_000, meta: 900_000, google: 600_000 }
export const SALES = LEAK_GROUPS.find((g) => g.id === 'sale')!.count
export const COST_PER_SALE = MONTHLY_SPEND.total / SALES
