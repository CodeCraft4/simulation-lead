import type { ComponentType } from 'react'

/** Steps of the lead pipeline shown in the presenter flow map. */
export type FlowStep =
  | 'ad'
  | 'click'
  | 'lead'
  | 'whatsapp'
  | 'qualify'
  | 'call'
  | 'assign'
  | 'followUp'
  | 'sale'
  | 'feedback'

export type FlowState = 'idle' | 'active' | 'done' | 'leak'

export interface Cue {
  id: string
  label: string
  /** Talking points shown to the presenter while this cue is next. */
  notes?: string
}

export interface Scene {
  id: string
  number: number
  title: string
  /** Short name for the scene tabs. */
  tab: string
  headline: string
  minutes: number
  takeaway: string
  cues: Cue[]
}

/** Free-form per-scene state that cue steps change and the stage reads. */
export type SimVars = Record<string, number | boolean | string>

/** What a cue step is allowed to do. */
export interface StepApi {
  setVar: (key: string, value: SimVars[string]) => void
  setFlow: (step: FlowStep, state: FlowState) => void
  /** Start the simulated clock, optionally at a new speed. */
  startClock: (speed?: 1 | 60 | 300) => void
  /** Current simulated time in seconds. */
  now: () => number
  /** Jump the simulated clock, e.g. to 9:40 pm or to the next day. */
  setClock: (simSeconds: number) => void
}

export interface CueStep {
  /** Real milliseconds after the previous step. */
  after: number
  run: (api: StepApi) => void
  /** Waits for a recorded voice line, so it is not sped up while the voice plays. */
  voice?: boolean
}

/** The code side of a scene: its stage and what each cue does. */
export interface SceneModule {
  /** Simulated clock at the start of the scene, in seconds since Sat 31 Oct 00:00. */
  startTime: number
  initialVars: SimVars
  initialFlow?: Partial<Record<FlowStep, FlowState>>
  cueSteps: Record<string, CueStep[]>
  Stage: ComponentType
  /** Size the stage is designed at; it is scaled to fit the screen. */
  design: { width: number; height: number }
}
