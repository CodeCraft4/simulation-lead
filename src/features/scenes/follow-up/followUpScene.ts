import { at, botTypes, customerSays, settle } from '@features/scenario/stepHelpers'
import type { SceneModule } from '@features/scenario/types'
import { CHAT_AT } from '@features/scenes/follow-up/followUpData'
import { FollowUpStage } from '@features/scenes/follow-up/FollowUpStage'

export const followUpScene: SceneModule = {
  startTime: at('oct31', 10, 15),
  initialVars: {
    chat: CHAT_AT.start,
    typing: false,
    sana: 0,
    bilal: 0,
    sequence: 0,
    managerNotif: false,
    tapReassign: false,
    reassigned: false,
    toast: false,
  },
  initialFlow: {
    ad: 'done',
    click: 'done',
    lead: 'done',
    whatsapp: 'done',
    qualify: 'done',
    call: 'done',
    assign: 'done',
    followUp: 'active',
  },
  cueSteps: {
    visit: [
      ...botTypes(2, { wait: 200 }),
      customerSays(3, 1100),
      { after: 300, run: (api) => api.setVar('sana', 1) },
      ...botTypes(CHAT_AT.booked, { typeMs: 800 }),
      settle(),
    ],
    reminders: [
      { after: 200, run: (api) => api.setClock(at(6, 18)) },
      ...botTypes(CHAT_AT.reminder, { wait: 300 }),
      { after: 1300, run: (api) => api.setClock(at(7, 10)) },
      ...botTypes(CHAT_AT.ready, { wait: 300 }),
      { after: 900, run: (api) => api.setClock(at(7, 10, 41)) },
      customerSays(CHAT_AT.otw, 200),
      settle(),
    ],
    quiet: [
      { after: 0, run: (api) => { api.setVar('bilal', 1); api.setVar('sequence', 1) } },
      { after: 1200, run: (api) => api.setVar('sequence', 2) },
      { after: 1200, run: (api) => api.setVar('sequence', 3) },
      { after: 1300, run: (api) => { api.setVar('sequence', 4); api.setVar('bilal', 2) } },
      settle(1200),
    ],
    manager: [
      { after: 0, run: (api) => { api.setClock(at(7, 11, 42)); api.setVar('managerNotif', true) } },
      { after: 1800, run: (api) => api.setVar('tapReassign', true) },
      { after: 600, run: (api) => { api.setVar('managerNotif', false); api.setVar('reassigned', true); api.setVar('toast', true) } },
      { after: 2400, run: (api) => api.setVar('toast', false) },
      settle(300),
    ],
    sold: [
      { after: 0, run: (api) => api.setClock(at(9, 16, 5)) },
      ...botTypes(CHAT_AT.welcome, { wait: 300, chatKey: 'chat' }),
      { after: 200, run: (api) => { api.setVar('sana', 2); api.setFlow('followUp', 'done'); api.setFlow('sale', 'active') } },
      settle(1400),
    ],
  },
  Stage: FollowUpStage,
  design: { width: 1180, height: 610 },
}
