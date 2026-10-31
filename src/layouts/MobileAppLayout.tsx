import { IPhoneFrame } from '@components/devices/IPhoneFrame'
import { MobileApp } from '@features/mobile-app/MobileApp'
import { useFitScale } from '@hooks/useFitScale'

/** Space taken by the page header, title and padding above and below the phone. */
const RESERVED_HEIGHT = 230

/** The clickable Lead Engine app in an iPhone frame, kept small enough to fit one screen. */
export function MobileAppLayout() {
  const scale = useFitScale(413, { height: 892, reserveY: RESERVED_HEIGHT, max: 0.8 })

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Lead Engine app</h1>
        <p className="mt-1 text-sm text-ink-3">What the sales team uses. Everything is clickable: open a lead, chat, call, send a broadcast.</p>
      </div>
      <IPhoneFrame time="10:02" scale={scale}>
        <MobileApp />
      </IPhoneFrame>
    </div>
  )
}
