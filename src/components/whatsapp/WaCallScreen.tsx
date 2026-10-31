import { motion } from 'framer-motion'
import { Lock, MessageCircle, Mic, Phone, PhoneOff, AlarmClock, Video, Volume2 } from 'lucide-react'
import { useEffect } from 'react'
import { formatDuration } from '@lib/format'
import { startLoop } from '@lib/sfx'

export type CallState = 'incoming' | 'ongoing' | 'ended'

interface WaCallScreenProps {
  contact: { name: string; initials: string }
  state: CallState
  seconds?: number
}

/** Customer-side WhatsApp-style voice call (simulated). Fills an IPhoneFrame screen. */
export function WaCallScreen({ contact, state, seconds = 0 }: WaCallScreenProps) {
  useEffect(() => (state === 'incoming' ? startLoop('ringtone') : undefined), [state])
  const status = state === 'incoming' ? 'WhatsApp voice call…' : state === 'ongoing' ? formatDuration(seconds) : `Call ended · ${formatDuration(seconds)}`

  return (
    <div className="flex h-full flex-col bg-[#1f2c33] text-white">
      <div className="flex flex-1 flex-col items-center px-7 pt-[84px] text-center">
        <p className="flex items-center gap-1.5 text-[13px] text-[#aebac1]">
          <Lock className="size-3" aria-hidden /> End-to-end encrypted
        </p>
        <p className="mt-6 text-[30px] font-semibold">{contact.name}</p>
        <p className="mt-1.5 font-mono text-base text-[#aebac1] tabular">{status}</p>
        <div className="relative mt-11">
          {state === 'incoming' &&
            [0, 1].map((i) => (
              <motion.span
                key={i}
                className="absolute inset-0 rounded-full border-2 border-white/25"
                animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.8 }}
              />
            ))}
          <span className="relative flex size-[136px] items-center justify-center rounded-full bg-navy text-[46px] font-bold">{contact.initials}</span>
        </div>
        {state === 'ongoing' && <Wave />}
        <p className="mt-auto pb-5 text-xs text-[#8696a0]">Business account · Simulated</p>
      </div>

      {state === 'incoming' ? (
        <div className="px-11 pb-14">
          <div className="mb-8 flex justify-between text-[13px] text-[#d1d7db]">
            <span className="flex flex-col items-center gap-2"><AlarmClock className="size-6" aria-hidden />Remind me</span>
            <span className="flex flex-col items-center gap-2"><MessageCircle className="size-6" aria-hidden />Message</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="flex flex-col items-center gap-2.5">
              <span className="flex size-16 items-center justify-center rounded-full bg-[#ea0038]"><PhoneOff className="size-7" aria-hidden /></span>Decline
            </span>
            <span className="flex flex-col items-center gap-2.5">
              <motion.span
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex size-16 items-center justify-center rounded-full bg-[#1daa61]"
              >
                <Phone className="size-7" fill="currentColor" aria-hidden />
              </motion.span>
              Accept
            </span>
          </div>
        </div>
      ) : (
        <div className="mx-4 mb-11 flex justify-between rounded-[28px] bg-white/8 px-[18px] py-4">
          {[Volume2, Video, Mic].map((Icon, i) => (
            <span key={i} className="flex size-14 items-center justify-center rounded-full bg-white/12"><Icon className="size-[22px]" aria-hidden /></span>
          ))}
          <span className="flex size-14 items-center justify-center rounded-full bg-[#ea0038]"><PhoneOff className="size-6" aria-hidden /></span>
        </div>
      )}
    </div>
  )
}

function Wave() {
  return (
    <div className="mt-8 flex h-9 items-center gap-1" aria-hidden>
      {[10, 22, 30, 16, 26, 12, 24, 32, 14, 22, 8].map((h, i) => (
        <motion.i
          key={i}
          className="block w-1 rounded-sm bg-[#86efac]"
          animate={{ height: [h * 0.4, h, h * 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.07 }}
        />
      ))}
    </div>
  )
}
