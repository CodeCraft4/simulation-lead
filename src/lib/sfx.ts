import { onMuteChange, soundOn } from '@lib/voice'

// Chat and call sounds, made with Web Audio (no sound files): sent, received, notification,
// call end, and two loops for ringing.

let ctx: AudioContext | null = null
const audio = () => {
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

interface ToneOptions {
  type?: OscillatorType
  gain?: number
  /** Glide to this frequency over the tone. */
  to?: number
}

function tone(freq: number, start: number, length: number, { type = 'sine', gain = 0.16, to }: ToneOptions = {}) {
  const ac = audio()
  const t = ac.currentTime + start
  const osc = ac.createOscillator()
  const env = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + length)
  env.gain.setValueAtTime(0, t)
  env.gain.linearRampToValueAtTime(gain, t + 0.01)
  env.gain.exponentialRampToValueAtTime(0.0001, t + length)
  osc.connect(env).connect(ac.destination)
  osc.start(t)
  osc.stop(t + length + 0.02)
}

const SOUNDS = {
  sent: () => tone(900, 0, 0.08, { to: 1500, gain: 0.12 }),
  received: () => {
    tone(1046, 0, 0.14)
    tone(1568, 0.1, 0.22)
  },
  notify: () => {
    tone(1318, 0, 0.12, { type: 'triangle', gain: 0.2 })
    tone(1760, 0.1, 0.12, { type: 'triangle', gain: 0.2 })
    tone(2093, 0.2, 0.3, { type: 'triangle', gain: 0.2 })
  },
  end: () => {
    tone(620, 0, 0.16, { gain: 0.14 })
    tone(440, 0.18, 0.28, { gain: 0.14 })
  },
}
export type Sound = keyof typeof SOUNDS

// Two phones often show the same message at once; play it once.
const lastPlayed = new Map<Sound, number>()

export function playSound(name: Sound) {
  if (!soundOn()) return
  const now = performance.now()
  if (now - (lastPlayed.get(name) ?? 0) < 200) return
  lastPlayed.set(name, now)
  try {
    SOUNDS[name]()
  } catch {
    // No audio device or Web Audio unavailable: the demo works without sound.
  }
}

const LOOPS = {
  /** Incoming call on the customer's phone: a short marimba-like phrase. */
  ringtone: { every: 2200, play: () => [659, 784, 988, 1319, 988].forEach((f, i) => tone(f, i * 0.13, 0.32, { type: 'triangle', gain: 0.18 })) },
  /** The caller hears a ringback tone: 425 Hz, one second on. */
  ringback: { every: 3000, play: () => tone(425, 0, 1, { gain: 0.08 }) },
}
export type Loop = keyof typeof LOOPS

let loopTimer: ReturnType<typeof setInterval> | null = null

/** Ring until the returned function is called. Use from an effect. */
export function startLoop(name: Loop) {
  stopLoop()
  if (!soundOn()) return stopLoop
  const loop = LOOPS[name]
  const play = () => {
    try {
      loop.play()
    } catch {
      stopLoop()
    }
  }
  play()
  loopTimer = setInterval(play, loop.every)
  return stopLoop
}

export function stopLoop() {
  if (loopTimer) clearInterval(loopTimer)
  loopTimer = null
}

onMuteChange((muted) => muted && stopLoop())

/** Browsers start Web Audio suspended until a click or key press; resume it on the first one. */
export function primeAudio() {
  try {
    audio()
  } catch {
    // Ignore: no sound.
  }
}
