import type { ReactNode } from 'react'
import { cn } from '@lib/cn'

interface IPhoneFrameProps {
  children: ReactNode
  /** Simulated clock shown in the status bar. */
  time?: string
  /** Status bar text colour: light on dark headers, dark on light screens. */
  statusBar?: 'light' | 'dark'
  /** Scales the whole device; layout space shrinks with it. */
  scale?: number
  className?: string
}

const SCREEN_W = 393
const SCREEN_H = 852
const BEZEL = 10

/** iPhone-style device frame. The screen inside is a fixed 393 × 852, like a real iPhone 15. */
export function IPhoneFrame({ children, time = '9:41', statusBar = 'light', scale = 1, className }: IPhoneFrameProps) {
  const outerW = SCREEN_W + BEZEL * 2
  const outerH = SCREEN_H + BEZEL * 2

  return (
    <div className={cn('shrink-0', className)} style={{ width: outerW * scale, height: outerH * scale }}>
      <div
        className="origin-top-left rounded-[62px] bg-[#0a0a0f] shadow-[0_0_0_2px_#2a2d36,0_18px_36px_rgba(11,31,77,.22)]"
        style={{ width: outerW, height: outerH, padding: BEZEL, transform: `scale(${scale})` }}
      >
        <div
          className="relative flex flex-col overflow-hidden rounded-[52px] bg-[#f4f6fb] text-navy"
          style={{ width: SCREEN_W, height: SCREEN_H }}
        >
          {/* Dynamic island */}
          <div className="absolute left-1/2 top-[11px] z-20 h-9 w-[125px] -translate-x-1/2 rounded-[20px] bg-black" aria-hidden />
          {/* Status bar overlays the top of the screen; screens leave 54px for it. */}
          <div
            className={cn(
              'absolute inset-x-0 top-0 z-10 flex h-[54px] items-center justify-between pl-11 pr-8 pt-2 text-base font-semibold',
              statusBar === 'light' ? 'text-white' : 'text-navy',
            )}
          >
            <span className="tabular">{time}</span>
            <span className="text-[10px] font-semibold opacity-70">Simulated</span>
          </div>
          {children}
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 z-20 h-[5px] w-[135px] -translate-x-1/2 rounded-full bg-navy" aria-hidden />
        </div>
      </div>
    </div>
  )
}
