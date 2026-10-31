import { useEffect } from 'react'
import { simActions, useSim } from '@features/scenario/store'

/** Drives the simulated clock with requestAnimationFrame while it is running. */
export function useClockTicker() {
  const running = useSim((s) => s.clock.running)

  useEffect(() => {
    if (!running) return
    let frame = 0
    let last = performance.now()
    const loop = (now: number) => {
      simActions.tick(now - last)
      last = now
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [running])
}
