import { at, settle } from '@features/scenario/stepHelpers'
import type { CueStep, SceneModule } from '@features/scenario/types'
import { INTEGRATIONS, NEEDS, PHASES } from '@features/scenes/next/nextData'
import { NextStage } from '@features/scenes/next/NextStage'

/** Reveal `count` items of a list one after another under `key`. */
const reveal = (key: string, count: number, gap: number): CueStep[] =>
  Array.from({ length: count }, (_, i) => ({ after: i === 0 ? 200 : gap, run: (api) => api.setVar(key, i + 1) }))

export const nextScene: SceneModule = {
  startTime: at(30, 9, 5),
  initialVars: { connect: 0, phases: 0, needs: 0, cta: false },
  initialFlow: {
    ad: 'done',
    click: 'done',
    lead: 'done',
    whatsapp: 'done',
    qualify: 'done',
    call: 'done',
    assign: 'done',
    followUp: 'done',
    sale: 'done',
    feedback: 'done',
  },
  cueSteps: {
    connect: [...reveal('connect', INTEGRATIONS.length, 380), settle()],
    rollout: [...reveal('phases', PHASES.length, 550), settle()],
    needs: [...reveal('needs', NEEDS.length, 350), { after: 600, run: (api) => api.setVar('cta', true) }, settle()],
  },
  Stage: NextStage,
  design: { width: 1020, height: 640 },
}
