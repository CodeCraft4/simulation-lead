import { AnimatePresence, motion } from 'framer-motion'
import { Camera, ChevronLeft, Mic, Phone, Plus, Reply, Video } from 'lucide-react'
import { BuildingsArt } from '@components/illustrations/BuildingsArt'
import { useEffect, useRef } from 'react'
import { cn } from '@lib/cn'
import { playSound } from '@lib/sfx'

export type WaMessage =
  | { id: string; kind: 'pill'; text: string; tone?: 'danger' }
  | {
      id: string
      kind: 'in'
      text: string
      time: string
      buttons?: string[]
      /** The button the customer tapped, shown filled. */
      chosen?: string
      doc?: { name: string; meta: string }
      image?: boolean
    }
  | {
      id: string
      kind: 'out'
      text: string
      time: string
      /** 1 sent, 2 delivered, 3 read. */
      ticks: 1 | 2 | 3
      ad?: { title: string; body: string }
    }

interface WaChatProps {
  contact: { name: string; initials: string; subtitle: string }
  messages: WaMessage[]
  typing?: boolean
}

const enter = { initial: { opacity: 0, y: 10, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.25 } }

/**
 * Customer-side WhatsApp-style chat (simulated). Familiar layout and colours,
 * without WhatsApp's logo, wallpaper or wording. Fills an IPhoneFrame screen.
 */
export function WaChat({ contact, messages, typing }: WaChatProps) {
  useMessageSounds(messages)

  return (
    <div className="flex h-full flex-col bg-[#efe7dd] text-[#111b21]">
      <header className="flex shrink-0 items-center gap-2 border-b border-[#dadada] bg-[#f6f6f6] px-3 pb-2 pt-[54px]">
        <ChevronLeft className="size-6 text-[#008069]" strokeWidth={2.6} aria-hidden />
        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-navy text-[13px] font-bold text-white">
          {contact.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold">{contact.name}</p>
          <p className="text-xs text-[#667781]">{contact.subtitle}</p>
        </div>
        <Video className="size-6 text-[#008069]" aria-hidden />
        <Phone className="ml-3 size-5 text-[#008069]" aria-hidden />
      </header>

      <div className="flex min-h-0 flex-1 flex-col justify-end gap-1 overflow-hidden px-3 py-2.5">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div key={m.id} layout {...enter} className="flex flex-col">
              <Message message={m} />
            </motion.div>
          ))}
          {typing && (
            <motion.div key="typing" layout {...enter} exit={{ opacity: 0 }} className="mt-1 self-start rounded-[0_10px_10px_10px] bg-white px-3.5 py-3 shadow-[0_1px_.5px_rgba(11,20,26,.13)]">
              <span className="flex gap-1" aria-label="Typing">
                {[0, 1, 2].map((i) => (
                  <motion.i
                    key={i}
                    className="block size-2 rounded-full bg-[#8696a0]"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex shrink-0 items-center gap-2.5 border-t border-[#dadada] bg-[#f6f6f6] px-3 pb-[34px] pt-2 text-[#54656f]">
        <Plus className="size-6" aria-hidden />
        <span className="flex h-9 flex-1 items-center rounded-full border border-[#dadada] bg-white px-3.5 text-[15px] text-[#8696a0]">Message</span>
        <Camera className="size-6" aria-hidden />
        <Mic className="size-[22px]" aria-hidden />
      </div>
    </div>
  )
}

function Message({ message: m }: { message: WaMessage }) {
  if (m.kind === 'pill') {
    return (
      <span
        className={cn(
          'my-1.5 self-center rounded-lg bg-white px-3 py-1 text-xs shadow-[0_1px_.5px_rgba(11,20,26,.13)]',
          m.tone === 'danger' ? 'text-[#c0392b]' : 'text-[#54656f]',
        )}
      >
        {m.text}
      </span>
    )
  }

  if (m.kind === 'out') {
    return (
      <div className="mt-1 max-w-[82%] self-end rounded-[10px_0_10px_10px] bg-[#d9fdd3] px-2.5 pb-1 pt-1.5 text-[15px] leading-snug shadow-[0_1px_.5px_rgba(11,20,26,.13)]">
        {m.ad && (
          <div className="-mx-1 mb-1.5 flex gap-2 rounded-md bg-[#c9f1c1] p-1.5">
            <BuildingsArt className="size-12 shrink-0 rounded" />
            <span className="text-xs leading-tight">
              <b className="block">{m.ad.title}</b>
              {m.ad.body}
            </span>
          </div>
        )}
        {m.text}
        <span className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-[#667781]">
          {m.time}
          <Ticks ticks={m.ticks} />
        </span>
      </div>
    )
  }

  return (
    <>
      <div className="mt-1 max-w-[82%] self-start rounded-[0_10px_10px_10px] bg-white px-2.5 pb-1 pt-1.5 text-[15px] leading-snug shadow-[0_1px_.5px_rgba(11,20,26,.13)]">
        {m.image && <BuildingsArt className="-mx-1 -mt-0.5 mb-1.5 h-32 rounded-md" />}
        {m.doc && (
          <div className="mb-1 flex items-center gap-2.5 rounded-md bg-[#f5f6f6] p-2.5">
            <span className="flex h-10 w-8 items-center justify-center rounded bg-[#e5484d] text-[10px] font-bold text-white">PDF</span>
            <span>
              <span className="block text-sm font-semibold">{m.doc.name}</span>
              <span className="block text-xs text-[#667781]">{m.doc.meta}</span>
            </span>
          </div>
        )}
        <span className="whitespace-pre-line">{m.text}</span>
        <span className="mt-0.5 block text-right text-[11px] text-[#667781]">{m.time}</span>
      </div>
      {m.buttons && (
        <div className="mt-0.5 flex w-[82%] flex-col gap-0.5 self-start">
          {m.buttons.map((b) => (
            <span
              key={b}
              className={cn(
                'flex h-[38px] items-center justify-center gap-1.5 rounded-lg text-[15px] font-medium shadow-[0_1px_.5px_rgba(11,20,26,.13)] transition-colors duration-300',
                m.chosen === b ? 'bg-[#008069] text-white' : 'bg-white text-[#008069]',
              )}
            >
              <Reply className="size-3.5" aria-hidden />
              {b}
            </span>
          ))}
        </div>
      )}
    </>
  )
}

function Ticks({ ticks }: { ticks: 1 | 2 | 3 }) {
  const color = ticks === 3 ? '#53bdeb' : '#8696a0'
  const label = ticks === 1 ? 'Sent' : ticks === 2 ? 'Delivered' : 'Read'
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label={label}>
      <path d="M1 6l3 3 6-7" />
      {ticks > 1 && <path d="M7 8l1 1 6-7" />}
    </svg>
  )
}

/** Pop when the customer sends, ding when a reply arrives. Silent for the messages already there. */
function useMessageSounds(messages: WaMessage[]) {
  const count = useRef(messages.length)
  useEffect(() => {
    const added = messages.length > count.current
    count.current = messages.length
    const last = messages[messages.length - 1]
    if (!added || !last) return
    if (last.kind === 'out') playSound('sent')
    else if (last.kind === 'in') playSound('received')
  }, [messages])
}
