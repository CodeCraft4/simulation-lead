import { at, botTypes, customerSays, settle } from '@features/scenario/stepHelpers'
import type { CueStep, SceneModule } from '@features/scenario/types'
import { BroadcastStage } from '@features/scenes/broadcast/BroadcastStage'
import { FILTERS, SALES } from '@features/scenes/broadcast/broadcastData'

const applyFilters: CueStep[] = FILTERS.map((_, i) => ({ after: i === 0 ? 300 : 900, run: (api) => api.setVar('filters', i + 1) }))
const sendBack: CueStep[] = SALES.map((_, i) => ({ after: i === 0 ? 300 : 230, run: (api) => api.setVar('fed', i + 1) }))

export const broadcastScene: SceneModule = {
  startTime: at(27, 11, 18),
  initialVars: { filters: 0, sent: false, chat: 1, typing: false, fed: 0, learn: false, lookalike: false },
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
  },
  cueSteps: {
    segment: [...applyFilters, settle(900)],
    send: [
      { after: 0, run: (api) => { api.setVar('sent', true); api.setClock(at(27, 11, 20)) } },
      { after: 900, run: (api) => api.setVar('chat', 2) },
      { after: 1600, run: (api) => api.setClock(at(27, 11, 24)) },
      customerSays(3, 300),
      ...botTypes(4, { typeMs: 900 }),
      settle(),
    ],
    feedback: [
      { after: 0, run: (api) => api.setFlow('feedback', 'active') },
      ...sendBack,
      settle(900),
    ],
    learn: [
      { after: 0, run: (api) => api.setVar('learn', true) },
      { after: 2200, run: (api) => { api.setVar('lookalike', true); api.setFlow('feedback', 'done'); api.setFlow('ad', 'active') } },
      settle(900),
    ],
  },
  Stage: BroadcastStage,
  design: { width: 1060, height: 610 },
}
