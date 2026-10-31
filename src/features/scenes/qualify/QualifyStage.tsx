import { IPhoneFrame } from '@components/devices/IPhoneFrame'
import { revealChat } from '@components/whatsapp/revealChat'
import { WaChat } from '@components/whatsapp/WaChat'
import { useSim } from '@features/scenario/store'
import { BUSINESS_CONTACT } from '@features/scenes/lead-arrives/leadArrivesData'
import { AgentQualifyPhone } from '@features/scenes/qualify/AgentQualifyPhone'
import { LeadProfile } from '@features/scenes/qualify/LeadProfile'
import { QUALIFY_CHAT } from '@features/scenes/qualify/qualifyData'

const PHONE_SCALE = 0.66

export function QualifyStage() {
  const chat = Number(useSim((s) => s.vars.chat ?? 0))
  const typing = useSim((s) => s.vars.typing === true)

  return (
    <div className="flex h-full items-start justify-center gap-6">
      <figure className="m-0 flex flex-col items-center gap-2">
        <IPhoneFrame time="10:04" statusBar="dark" scale={PHONE_SCALE}>
          <WaChat contact={BUSINESS_CONTACT} messages={revealChat(QUALIFY_CHAT, chat)} typing={typing} />
        </IPhoneFrame>
        <figcaption className="text-xs text-ink-3">
          <b className="text-ink">Sana</b> · WhatsApp · Simulated
        </figcaption>
      </figure>
      <LeadProfile />
      <AgentQualifyPhone scale={PHONE_SCALE} />
    </div>
  )
}
