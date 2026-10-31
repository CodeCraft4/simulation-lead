import { AnimatePresence, motion } from 'framer-motion'
import { IPhoneFrame } from '@components/devices/IPhoneFrame'
import { revealChat } from '@components/whatsapp/revealChat'
import { WaCallScreen } from '@components/whatsapp/WaCallScreen'
import { WaChat } from '@components/whatsapp/WaChat'
import { useSim } from '@features/scenario/store'
import { AgentCallPhone } from '@features/scenes/calls/AgentCallPhone'
import { CallLog } from '@features/scenes/calls/CallLog'
import { AFTER_CALL_CHAT, ALI_CHAT, type CustomerCallScreen } from '@features/scenes/calls/callsData'
import { useCallSeconds } from '@features/scenes/calls/useCallSeconds'
import { BUSINESS_CONTACT } from '@features/scenes/lead-arrives/leadArrivesData'
import { QUALIFY_CHAT } from '@features/scenes/qualify/qualifyData'

const PHONE_SCALE = 0.66
const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 } }

export function CallsStage() {
  return (
    <div className="flex h-full items-start justify-center gap-6">
      <AgentCallPhone scale={PHONE_SCALE} />
      <CallLog />
      <CustomerCallPhone />
    </div>
  )
}

function CustomerCallPhone() {
  const vars = useSim((s) => s.vars)
  const screen = (vars.customer ?? 'chat') as CustomerCallScreen
  const seconds = useCallSeconds()
  const ali = screen === 'ali'
  const onCall = screen === 'incoming' || screen === 'ongoing'

  return (
    <figure className="m-0 flex flex-col items-center gap-2">
      <IPhoneFrame time={ali ? '9:41' : '10:09'} statusBar={onCall ? 'light' : 'dark'} scale={PHONE_SCALE}>
        <AnimatePresence mode="wait">
          <motion.div key={screen} {...fade} className="h-full">
            {screen === 'chat' && <WaChat contact={BUSINESS_CONTACT} messages={QUALIFY_CHAT.slice(-4)} />}
            {onCall && <WaCallScreen contact={BUSINESS_CONTACT} state={screen === 'incoming' ? 'incoming' : 'ongoing'} seconds={seconds} />}
            {screen === 'chatAfter' && <WaChat contact={BUSINESS_CONTACT} messages={AFTER_CALL_CHAT} />}
            {ali && <WaChat contact={BUSINESS_CONTACT} messages={revealChat(ALI_CHAT, Number(vars.aliChat ?? 0))} typing={vars.typing === true} />}
          </motion.div>
        </AnimatePresence>
      </IPhoneFrame>
      <figcaption className="text-xs text-ink-3">
        <b className="text-ink">{ali ? 'Ali' : 'Sana'}</b> · WhatsApp · Simulated
      </figcaption>
    </figure>
  )
}
