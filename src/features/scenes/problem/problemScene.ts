import type { CueStep, SceneModule } from '@features/scenario/types'
import { LEAK_GROUPS } from '@features/scenes/problem/leakGroups'
import { ProblemStage } from '@features/scenes/problem/ProblemStage'

/** How long each leak group stays in focus before the next one colours in. */
const GROUP_MS = 1100

const revealGroups: CueStep[] = LEAK_GROUPS.map((group, i) => ({
  after: i === 0 ? 0 : GROUP_MS,
  run: (api) => {
    api.setVar('revealed', i + 1)
    if (group.flow) api.setFlow(group.flow, 'leak')
  },
}))

export const problemScene: SceneModule = {
  startTime: 9 * 3600,
  initialVars: { spend: false, revealed: 0, cost: false, unknown: false },
  cueSteps: {
    spend: [
      { after: 0, run: (api) => api.setVar('spend', true) },
      { after: 1400, run: () => {} },
    ],
    leads: [...revealGroups, { after: GROUP_MS, run: () => {} }],
    cost: [
      { after: 0, run: (api) => api.setVar('cost', true) },
      { after: 1300, run: (api) => api.setVar('unknown', true) },
      { after: 500, run: (api) => api.setFlow('feedback', 'leak') },
    ],
  },
  Stage: ProblemStage,
  design: { width: 1040, height: 600 },
}
