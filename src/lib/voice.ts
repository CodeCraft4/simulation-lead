import { useSyncExternalStore } from 'react'
import { readStorage, writeStorage } from '@lib/storage'

// All sound in the demo: the recorded Urdu call voices (one line at a time) and the chat and
// call effects in sfx.ts. One switch turns everything on or off.

const STORAGE_KEY = 'lead-engine:voice'
let current: HTMLAudioElement | null = null
let state = { muted: readStorage(STORAGE_KEY) === 'off', blocked: false }
const listeners = new Set<() => void>()

const update = (patch: Partial<typeof state>) => {
  state = { ...state, ...patch }
  listeners.forEach((fn) => fn())
}

/** Above this presentation rate the voice is skipped and only the captions run. */
const MAX_VOICE_RATE = 2

export const soundOn = () => !state.muted

/** True when a line played at this presentation rate would be heard. */
export const voiceAudible = (rate = 1) => soundOn() && rate <= MAX_VOICE_RATE

/** Play one line at natural speed. Stops whatever was playing. Silent while muted or above 2×. */
export function playVoice(src: string, rate = 1) {
  stopVoice()
  if (!voiceAudible(rate)) return
  const audio = new Audio(src)
  current = audio
  audio
    .play()
    .then(() => state.blocked && update({ blocked: false }))
    .catch((error: unknown) => {
      // The browser refuses sound until the page is clicked once; the captions still show.
      if (error instanceof DOMException && error.name === 'NotAllowedError') update({ blocked: true })
    })
}

export function stopVoice() {
  current?.pause()
  current = null
}

export function setVoiceMuted(value: boolean) {
  writeStorage(STORAGE_KEY, value ? 'off' : 'on')
  if (value) stopVoice()
  update({ muted: value })
  muteListeners.forEach((fn) => fn(value))
}

/** Lets sfx.ts stop its loops on mute without a circular import. */
const muteListeners = new Set<(muted: boolean) => void>()
export const onMuteChange = (fn: (muted: boolean) => void) => muteListeners.add(fn)

/** Any click or key press counts as permission to play sound from then on. */
export function unlockSound() {
  if (state.blocked) update({ blocked: false })
}

const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useSound() {
  return useSyncExternalStore(subscribe, () => state)
}
