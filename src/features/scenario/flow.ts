import type { FlowState, FlowStep } from '@features/scenario/types'

export const FLOW_STEPS: { id: FlowStep; label: string }[] = [
  { id: 'ad', label: 'Ad' },
  { id: 'click', label: 'Click' },
  { id: 'lead', label: 'Lead' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'qualify', label: 'Qualify' },
  { id: 'call', label: 'Call' },
  { id: 'assign', label: 'Assign' },
  { id: 'followUp', label: 'Follow-up' },
  { id: 'sale', label: 'Sale' },
  { id: 'feedback', label: 'Feedback to ads' },
]

export function buildFlow(overrides: Partial<Record<FlowStep, FlowState>> = {}) {
  const flow = {} as Record<FlowStep, FlowState>
  for (const { id } of FLOW_STEPS) flow[id] = overrides[id] ?? 'idle'
  return flow
}
