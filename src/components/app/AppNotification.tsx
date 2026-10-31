import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { playSound } from '@lib/sfx'

interface AppNotificationProps {
  /** Changing the key replays the slide-in. Nothing shows while it is null. */
  id: string | number | null
  title: string
  body: ReactNode
  actions?: ReactNode
}

/** iPhone-style push notification from the Lead Engine app, sliding in under the status bar. */
export function AppNotification({ id, title, body, actions }: AppNotificationProps) {
  useEffect(() => {
    if (id !== null) playSound('notify')
  }, [id])

  return (
    <AnimatePresence>
      {id !== null && (
        <motion.div
          key={id}
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          className="absolute inset-x-2.5 top-[50px] z-30 rounded-2xl bg-white/95 px-3.5 py-3 text-navy shadow-[0_10px_30px_rgba(11,31,77,.25)] backdrop-blur"
        >
          <p className="flex justify-between text-[11px] text-[#5b6b8c]">
            <span>Lead Engine · now</span>
            <span>Simulated</span>
          </p>
          <p className="mt-1 text-sm font-bold">{title}</p>
          <div className="text-[13px] leading-snug text-[#334366]">{body}</div>
          {actions && <div className="mt-2.5 flex gap-2">{actions}</div>}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
