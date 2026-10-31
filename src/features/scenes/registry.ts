import type { SceneModule } from '@features/scenario/types'
import { PlaceholderStage } from '@features/scenes/PlaceholderStage'
import { broadcastScene } from '@features/scenes/broadcast/broadcastScene'
import { callsScene } from '@features/scenes/calls/callsScene'
import { followUpScene } from '@features/scenes/follow-up/followUpScene'
import { launchScene } from '@features/scenes/launch/launchScene'
import { leadArrivesScene } from '@features/scenes/lead-arrives/leadArrivesScene'
import { nextScene } from '@features/scenes/next/nextScene'
import { problemScene } from '@features/scenes/problem/problemScene'
import { qualifyScene } from '@features/scenes/qualify/qualifyScene'
import { resultsScene } from '@features/scenes/results/resultsScene'

/** Every scene's code. A scene missing here falls back to the placeholder stage. */
const MODULES: Partial<Record<string, SceneModule>> = {
  problem: problemScene,
  launch: launchScene,
  'lead-arrives': leadArrivesScene,
  qualify: qualifyScene,
  calls: callsScene,
  'follow-up': followUpScene,
  broadcast: broadcastScene,
  results: resultsScene,
  next: nextScene,
}

const placeholder: SceneModule = {
  startTime: 9 * 3600,
  initialVars: {},
  cueSteps: {},
  Stage: PlaceholderStage,
  design: { width: 960, height: 560 },
}

export const getSceneModule = (sceneId: string) => MODULES[sceneId] ?? placeholder

export const isSceneBuilt = (sceneId: string) => sceneId in MODULES
