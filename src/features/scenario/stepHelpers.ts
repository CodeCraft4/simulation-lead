import type { CueStep } from '@features/scenario/types'

/** Simulated time helper: day 0 = Sat 31 Oct. `at(7, 11)` = Sat 7 Nov, 11:00 am. */
export const at = (dayOfNov: number | 'oct31', hour: number, minute = 0) => {
  const day = dayOfNov === 'oct31' ? 0 : dayOfNov
  return day * 86400 + hour * 3600 + minute * 60
}

/** Show the typing dots, then reveal chat message number `count`. */
export function botTypes(count: number, opts: { chatKey?: string; typingKey?: string; wait?: number; typeMs?: number } = {}): CueStep[] {
  const { chatKey = 'chat', typingKey = 'typing', wait = 400, typeMs = 1100 } = opts
  return [
    { after: wait, run: (api) => api.setVar(typingKey, true) },
    {
      after: typeMs,
      run: (api) => {
        api.setVar(typingKey, false)
        api.setVar(chatKey, count)
      },
    },
  ]
}

/** Reveal chat message number `count` straight away (the customer's own messages). */
export const customerSays = (count: number, wait = 900, chatKey = 'chat'): CueStep => ({
  after: wait,
  run: (api) => api.setVar(chatKey, count),
})

/** A pause at the end of a cue so the last animation can settle. */
export const settle = (ms = 700): CueStep => ({ after: ms, run: () => {} })
