import type { CueStep, SceneModule } from '@features/scenario/types'
import { ALI } from '@features/scenes/lead-arrives/leadArrivesData'
import { LeadArrivesStage } from '@features/scenes/lead-arrives/LeadArrivesStage'

export const leadArrivesScene: SceneModule = {
  startTime: 10 * 3600 + 2 * 60,
  initialVars: {
    screen: 'feed',
    feedStop: false,
    tap: false,
    waOut: 0,
    typing: false,
    reply: false,
    sanaIn: false,
    timer: 'idle',
    notif: 0,
    searchTap: false,
    formFill: 0,
    aliIn: false,
    aliReplied: false,
  },
  cueSteps: {
    'sees-ad': [
      { after: 0, run: (api) => { api.setFlow('ad', 'done'); api.setFlow('click', 'active') } },
      { after: 500, run: (api) => api.setVar('feedStop', true) },
      { after: 1700, run: (api) => api.setVar('tap', true) },
      { after: 700, run: () => {} },
    ],
    sends: [
      { after: 0, run: (api) => api.setVar('screen', 'wa') },
      { after: 600, run: (api) => api.setVar('waOut', 1) },
      { after: 700, run: (api) => api.setVar('waOut', 2) },
      { after: 700, run: (api) => { api.setVar('waOut', 3); api.setFlow('click', 'done'); api.setFlow('lead', 'active') } },
    ],
    inbox: [
      { after: 0, run: (api) => { api.setVar('sanaIn', true); api.setVar('timer', 'running') } },
      { after: 400, run: (api) => { api.setFlow('lead', 'done'); api.setFlow('whatsapp', 'active') } },
      { after: 2800, run: () => {} },
    ],
    reply: [
      { after: 0, run: (api) => api.setVar('typing', true) },
      { after: 1300, run: (api) => { api.setVar('typing', false); api.setVar('reply', true); api.setVar('timer', 'replied') } },
      { after: 700, run: (api) => api.setVar('notif', 1) },
      { after: 900, run: () => {} },
    ],
    google: [
      { after: 0, run: (api) => api.setVar('screen', 'search') },
      { after: 1300, run: (api) => api.setVar('searchTap', true) },
      { after: 700, run: (api) => api.setVar('screen', 'form') },
      ...ALI.form.map((_, i): CueStep => ({ after: i === 0 ? 600 : 550, run: (api) => api.setVar('formFill', i + 1) })),
      { after: 700, run: (api) => { api.setVar('screen', 'formDone'); api.setVar('aliIn', true) } },
      { after: 2200, run: (api) => { api.setVar('aliReplied', true); api.setVar('notif', 2) } },
      { after: 900, run: () => {} },
    ],
  },
  Stage: LeadArrivesStage,
  design: { width: 1000, height: 610 },
}
