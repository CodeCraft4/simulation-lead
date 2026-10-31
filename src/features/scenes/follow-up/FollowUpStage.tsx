import { IPhoneFrame } from '@components/devices/IPhoneFrame'
import { revealChat } from '@components/whatsapp/revealChat'
import { WaChat } from '@components/whatsapp/WaChat'
import { useSim } from '@features/scenario/store'
import { FOLLOW_CHAT } from '@features/scenes/follow-up/followUpData'
import { ManagerPhone } from '@features/scenes/follow-up/ManagerPhone'
import { PipelineBoard } from '@features/scenes/follow-up/PipelineBoard'
import { BUSINESS_CONTACT } from '@features/scenes/lead-arrives/leadArrivesData'
import { formatSimTime } from '@lib/format'

const PHONE_SCALE = 0.6

export function FollowUpStage() {
  const chat = Number(useSim((s) => s.vars.chat ?? 0))
  const typing = useSim((s) => s.vars.typing === true)
  const now = useSim((s) => s.clock.now)

  return (
    // Padding leaves room for the phones' shadows, which would otherwise be cut by the stage edge.
    <div className="flex h-full items-start justify-center gap-6 px-6">
      <figure className="m-0 flex flex-col items-center gap-2">
        <IPhoneFrame time={formatSimTime(now).replace(/ (am|pm)$/, '')} statusBar="dark" scale={PHONE_SCALE}>
          <WaChat contact={BUSINESS_CONTACT} messages={revealChat(FOLLOW_CHAT, chat)} typing={typing} />
        </IPhoneFrame>
        <figcaption className="text-xs text-ink-3">
          <b className="text-ink">Sana</b> · WhatsApp · Simulated
        </figcaption>
      </figure>
      <PipelineBoard />
      <ManagerPhone scale={PHONE_SCALE} />
    </div>
  )
}
