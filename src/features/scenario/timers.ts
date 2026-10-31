import { voiceAudible } from '@lib/voice'
import type { CueStep, StepApi } from '@features/scenario/types'

const pending = new Set<ReturnType<typeof setTimeout>>()

export function schedule(ms: number, fn: () => void) {
  const id = setTimeout(() => {
    pending.delete(id)
    fn()
  }, ms)
  pending.add(id)
}

/** Stop everything that is scheduled: used by Reset and when changing scenes. */
export function cancelAll() {
  pending.forEach(clearTimeout)
  pending.clear()
}

/**
 * Play steps one after another, then call `onDone` once the last one has had time to animate.
 * Delays are divided by `rate`, except voice steps while the voice is audible.
 */
export function runSteps(steps: CueStep[], api: StepApi, onDone: () => void, rate = 1, settleMs = 500) {
  let at = 0
  for (const step of steps) {
    at += step.voice && voiceAudible(rate) ? step.after : step.after / rate
    schedule(at, () => step.run(api))
  }
  schedule(at + settleMs / rate, onDone)
}
