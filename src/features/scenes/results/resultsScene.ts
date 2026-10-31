import { at, botTypes, customerSays, settle } from '@features/scenario/stepHelpers'
import type { CueStep, SceneModule } from '@features/scenario/types'
import { CAMPAIGN_ROWS, TILES } from '@features/scenes/results/resultsData'
import { ResultsStage } from '@features/scenes/results/ResultsStage'

const showTiles: CueStep[] = TILES.map((_, i) => ({ after: i === 0 ? 300 : 800, run: (api) => api.setVar('tiles', i + 1) }))
const showRows: CueStep[] = CAMPAIGN_ROWS.map((_, i) => ({ after: i === 0 ? 200 : 450, run: (api) => api.setVar('rows', i + 1) }))

export const resultsScene: SceneModule = {
  startTime: at(30, 8, 55),
  initialVars: { tiles: 0, rows: 0, best: false, bars: false, chat: 0, typing: false },
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
    'before-after': [...showTiles, settle(900)],
    campaigns: [
      ...showRows,
      { after: 600, run: (api) => api.setVar('bars', true) },
      { after: 900, run: (api) => api.setVar('best', true) },
      settle(900),
    ],
    summary: [
      { after: 0, run: (api) => { api.setClock(at(30, 9)); api.setVar('chat', 1) } },
      ...botTypes(2, { typeMs: 1200 }),
      { after: 1800, run: (api) => api.setClock(at(30, 9, 2)) },
      customerSays(3, 200),
      ...botTypes(4, { typeMs: 900 }),
      settle(),
    ],
  },
  Stage: ResultsStage,
  design: { width: 1040, height: 610 },
}
