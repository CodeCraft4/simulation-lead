import { AgentPhone } from '@features/scenes/lead-arrives/AgentPhone'
import { CustomerPhone } from '@features/scenes/lead-arrives/CustomerPhone'
import { LeadInbox } from '@features/scenes/lead-arrives/LeadInbox'

const PHONE_SCALE = 0.66

export function LeadArrivesStage() {
  return (
    <div className="flex h-full items-start justify-center gap-7">
      <CustomerPhone scale={PHONE_SCALE} />
      <LeadInbox />
      <AgentPhone scale={PHONE_SCALE} />
    </div>
  )
}
