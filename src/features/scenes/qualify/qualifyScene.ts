import { at, botTypes, customerSays, settle } from '@features/scenario/stepHelpers'
import type { CueStep, SceneModule } from '@features/scenario/types'
import { CHAT_AT, PROFILE_FIELDS } from '@features/scenes/qualify/qualifyData'
import { QualifyStage } from '@features/scenes/qualify/QualifyStage'

const fillFields: CueStep[] = PROFILE_FIELDS.map((_, i) => ({ after: i === 0 ? 300 : 1100, run: (api) => api.setVar('fields', i + 1) }))

export const qualifyScene: SceneModule = {
  startTime: at('oct31', 10, 3),
  initialVars: { chat: CHAT_AT.start, typing: false, fields: 0, tags: false, timeline: 2, assigned: false, notif: false },
  initialFlow: { ad: 'done', click: 'done', lead: 'done', whatsapp: 'active' },
  cueSteps: {
    answers: [
      { after: 0, run: (api) => { api.setFlow('whatsapp', 'done'); api.setFlow('qualify', 'active') } },
      ...botTypes(CHAT_AT.budgetQ, { wait: 200 }),
      customerSays(CHAT_AT.budgetA),
      ...botTypes(CHAT_AT.whenQ),
      customerSays(CHAT_AT.whenA),
      ...botTypes(CHAT_AT.areaQ),
      customerSays(CHAT_AT.areaA, 1300),
      settle(),
    ],
    profile: [
      ...fillFields,
      { after: 900, run: (api) => api.setVar('tags', true) },
      { after: 600, run: (api) => api.setVar('timeline', 3) },
      settle(900),
    ],
    brochure: [
      ...botTypes(CHAT_AT.brochure, { wait: 200 }),
      ...botTypes(CHAT_AT.tour, { typeMs: 900 }),
      { after: 400, run: (api) => api.setVar('timeline', 4) },
      settle(),
    ],
    handover: [
      ...botTypes(CHAT_AT.handover, { wait: 200 }),
      { after: 700, run: (api) => { api.setVar('assigned', true); api.setVar('timeline', 5); api.setFlow('qualify', 'done'); api.setFlow('assign', 'active') } },
      { after: 500, run: (api) => api.setVar('notif', true) },
      { after: 3200, run: (api) => api.setVar('notif', false) },
      settle(300),
    ],
  },
  Stage: QualifyStage,
  design: { width: 1000, height: 610 },
}
