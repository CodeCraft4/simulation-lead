import { findScene, SCENES } from '@data/scenes'
import { getSceneModule } from '@features/scenes/registry'
import { buildFlow } from '@features/scenario/flow'
import { simActions, useSim, type Mode } from '@features/scenario/store'
import { cancelAll, runSteps, schedule } from '@features/scenario/timers'
import type { CueStep, StepApi } from '@features/scenario/types'
import { formatSimTime } from '@lib/format'
import { stopVoice } from '@lib/voice'

/** Pause between cues (and before moving to the next scene) in auto-play. */
const AUTO_GAP_MS = 2500
/** Cues of scenes that are not built yet just tick over. */
const DEFAULT_STEPS: CueStep[] = [{ after: 600, run: () => {} }]
const autoGap = () => AUTO_GAP_MS / useSim.getState().rate

const api: StepApi = {
  setVar: (key, value) => useSim.setState((s) => ({ vars: { ...s.vars, [key]: value } })),
  setFlow: (step, state) => useSim.setState((s) => ({ flow: { ...s.flow, [step]: state } })),
  startClock: (speed) => {
    if (speed) simActions.setSpeed(speed)
    simActions.startClock()
  },
  now: () => useSim.getState().clock.now,
  setClock: (now) => useSim.setState((s) => ({ clock: { ...s.clock, now } })),
}

// The router lives in React; the page hands us a way to change scenes.
let goToScene: (sceneId: string) => void = () => {}
export function setSceneNavigator(fn: (sceneId: string) => void) {
  goToScene = fn
}

/** Put a scene in its starting state. Called on every scene change and by Reset. */
export function loadScene(sceneId: string, status = '') {
  cancelAll()
  stopVoice()
  const mod = getSceneModule(sceneId)
  useSim.setState((s) => ({
    sceneId,
    done: 0,
    playing: false,
    vars: { ...mod.initialVars },
    flow: buildFlow(mod.initialFlow),
    // Scenes may speed the clock up (e.g. after publishing); every scene starts at 60×.
    clock: { now: mod.startTime, running: s.mode === 'auto', speed: 60 },
    status,
  }))
  if (useSim.getState().mode === 'auto') schedule(autoGap(), playNextCue)
}

export function resetScene() {
  const { sceneId } = useSim.getState()
  loadScene(sceneId, `Reset at ${formatSimTime(getSceneModule(sceneId).startTime)}`)
}

export function playNextCue() {
  const { sceneId, done, playing, rate } = useSim.getState()
  const scene = findScene(sceneId)
  const cue = scene?.cues[done]
  if (!scene || !cue || playing) return

  const steps = getSceneModule(sceneId).cueSteps[cue.id] ?? DEFAULT_STEPS
  useSim.setState({ playing: true, status: `Playing: ${cue.label}` })
  runSteps(
    steps,
    api,
    () => {
      useSim.setState((s) => ({ playing: false, done: s.done + 1, status: `Done: ${cue.label}` }))
      if (useSim.getState().mode === 'auto') schedule(autoGap(), advanceAuto)
    },
    rate,
  )
}

function advanceAuto() {
  const { sceneId, done } = useSim.getState()
  const scene = findScene(sceneId)
  if (!scene) return
  if (done < scene.cues.length) return playNextCue()
  const next = SCENES[scene.number]
  if (next) goToScene(next.id)
  else setMode('manual')
}

export function setMode(mode: Mode) {
  useSim.setState({ mode })
  if (mode === 'auto') {
    simActions.startClock()
    if (!useSim.getState().playing) advanceAuto()
  }
}
