import { create } from 'zustand'
import { buildFlow } from '@features/scenario/flow'
import { readStorage, writeStorage } from '@lib/storage'
import type { FlowState, FlowStep, SimVars } from '@features/scenario/types'

export const SPEEDS = [1, 60, 300] as const
export type Speed = (typeof SPEEDS)[number]
export type Mode = 'manual' | 'auto'
/** Presentation speed: scales cue timing, auto-play pauses and the clock. */
export const RATES = [1, 2, 5] as const
export type Rate = (typeof RATES)[number]

const RATE_KEY = 'lead-engine:rate'
const savedRate = Number(readStorage(RATE_KEY))
const initialRate: Rate = RATES.find((r) => r === savedRate) ?? 2

export interface SimState {
  sceneId: string
  /** Number of cues of the current scene that have finished. */
  done: number
  /** A cue is playing its steps right now. */
  playing: boolean
  mode: Mode
  rate: Rate
  clock: { now: number; running: boolean; speed: Speed }
  flow: Record<FlowStep, FlowState>
  vars: SimVars
  /** Short line for the presenter, e.g. "Reset at 9:00 am". */
  status: string
}

export const useSim = create<SimState>(() => ({
  sceneId: '',
  done: 0,
  playing: false,
  mode: 'manual',
  rate: initialRate,
  clock: { now: 9 * 3600, running: false, speed: 60 },
  flow: buildFlow(),
  vars: {},
  status: '',
}))

// Small setters that need nothing outside the store. Scene orchestration lives in director.ts.
export const simActions = {
  toggleClock: () => useSim.setState((s) => ({ clock: { ...s.clock, running: !s.clock.running } })),
  startClock: () => useSim.setState((s) => ({ clock: { ...s.clock, running: true } })),
  setSpeed: (speed: Speed) => useSim.setState((s) => ({ clock: { ...s.clock, speed } })),
  setRate: (rate: Rate) => {
    writeStorage(RATE_KEY, String(rate))
    useSim.setState({ rate })
  },
  /** Advance the simulated clock by `ms` real milliseconds at the current speed and rate. */
  tick: (ms: number) =>
    useSim.setState((s) => (s.clock.running ? { clock: { ...s.clock, now: s.clock.now + (ms / 1000) * s.clock.speed * s.rate } } : s)),
}
