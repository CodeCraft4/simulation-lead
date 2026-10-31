import { useEffect, useState } from 'react'
import { useSim } from '@features/scenario/store'
import { CALL_SECONDS } from '@features/scenes/calls/callsData'

/**
 * Seconds on the call, shared by both phones. Runs fast from the moment the call is answered
 * and reaches the final call length when the conversation (`callMs` real ms) ends.
 */
export function useCallSeconds() {
  const start = Number(useSim((s) => s.vars.callStart ?? 0))
  const callMs = Number(useSim((s) => s.vars.callMs ?? 6000))
  const ended = useSim((s) => s.vars.callEnded === true)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!start || ended) return
    const tick = () => setSeconds(Math.min(CALL_SECONDS, ((Date.now() - start) / callMs) * CALL_SECONDS))
    tick()
    const id = setInterval(tick, 200)
    return () => clearInterval(id)
  }, [start, callMs, ended])

  return ended ? CALL_SECONDS : seconds
}
