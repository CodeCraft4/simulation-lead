import { at, botTypes, customerSays, settle } from '@features/scenario/stepHelpers'
import { useSim } from '@features/scenario/store'
import type { CueStep, SceneModule } from '@features/scenario/types'
import { CAPTIONS } from '@features/scenes/calls/callsData'
import { CallsStage } from '@features/scenes/calls/CallsStage'
import { playVoice, voiceAudible } from '@lib/voice'

/** Ring before the first line, and the pause between lines. */
const FIRST_LINE_MS = 900
const LINE_GAP_MS = 450

// Each line shows its caption and plays its voice; the next one waits for it to finish.
const captions: CueStep[] = CAPTIONS.map((line, i) => ({
  after: i === 0 ? FIRST_LINE_MS : CAPTIONS[i - 1].ms + LINE_GAP_MS,
  voice: i > 0,
  run: (api) => {
    api.setVar('captions', i + 1)
    playVoice(line.src, useSim.getState().rate)
  },
}))
const lastLine: CueStep = { after: CAPTIONS[CAPTIONS.length - 1].ms, voice: true, run: () => {} }

/** Real length of the conversation at this rate, so the call timer ends with the last line. */
function callLength(rate: number) {
  const talk = CAPTIONS.reduce((sum, line) => sum + line.ms + LINE_GAP_MS, 0)
  return FIRST_LINE_MS / rate + (voiceAudible(rate) ? talk : talk / rate)
}

export const callsScene: SceneModule = {
  startTime: at('oct31', 10, 9),
  initialVars: {
    agent: 'lead',
    customer: 'chat',
    callStart: 0,
    callMs: 6000,
    callEnded: false,
    captions: 0,
    logged: false,
    outcome: false,
    missed: false,
    missedSteps: 0,
    aliChat: 0,
    typing: false,
    agentNotif: false,
  },
  initialFlow: { ad: 'done', click: 'done', lead: 'done', whatsapp: 'done', qualify: 'done', assign: 'active' },
  cueSteps: {
    dial: [
      { after: 0, run: (api) => { api.setVar('agent', 'calling'); api.setFlow('assign', 'done'); api.setFlow('call', 'active') } },
      { after: 900, run: (api) => api.setVar('customer', 'incoming') },
      settle(1500),
    ],
    answer: [
      {
        after: 0,
        run: (api) => {
          api.setVar('customer', 'ongoing')
          api.setVar('agent', 'ongoing')
          api.setVar('callMs', callLength(useSim.getState().rate))
          api.setVar('callStart', Date.now())
        },
      },
      ...captions,
      lastLine,
      settle(1600),
    ],
    log: [
      { after: 0, run: (api) => { api.setVar('callEnded', true); api.setVar('agent', 'ended'); api.setVar('customer', 'chatAfter') } },
      { after: 700, run: (api) => api.setVar('logged', true) },
      { after: 1000, run: (api) => { api.setVar('outcome', true); api.setClock(at('oct31', 10, 13)) } },
      settle(900),
    ],
    missed: [
      {
        after: 0,
        run: (api) => {
          api.setClock(at('oct31', 21, 40))
          api.setVar('agent', 'missed')
          api.setVar('customer', 'ali')
          api.setVar('aliChat', 2)
          api.setVar('missed', true)
        },
      },
      ...botTypes(3, { chatKey: 'aliChat', wait: 700, typeMs: 800 }),
      { after: 100, run: (api) => api.setVar('missedSteps', 1) },
      customerSays(4, 1100, 'aliChat'),
      { after: 100, run: (api) => api.setVar('missedSteps', 2) },
      ...botTypes(5, { chatKey: 'aliChat', typeMs: 800 }),
      { after: 200, run: (api) => { api.setVar('missedSteps', 3); api.setVar('agentNotif', true); api.setFlow('call', 'done') } },
      { after: 3200, run: (api) => api.setVar('agentNotif', false) },
      settle(300),
    ],
  },
  Stage: CallsStage,
  design: { width: 1000, height: 610 },
}
