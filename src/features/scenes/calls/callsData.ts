import type { WaMessage } from '@components/whatsapp/WaChat'
import { CALL_SCRIPTS } from '@data/callScripts'
import { QUALIFY_CHAT } from '@features/scenes/qualify/qualifyData'

/** Call length shown when the call ends: 4 min 12 s. The live timer runs fast to reach it as the last line ends. */
export const CALL_SECONDS = 252

/** Usman (agent, male voice) and Sana (female voice), in Urdu. */
export const CAPTIONS = CALL_SCRIPTS.sana

export const OUTCOMES = ['Wants a site visit', 'Call again', 'Not interested']

export const SUMMARY = ['Wants a 3 bed, budget about 2 crore', 'Asked for the 3-year payment plan', 'Site visit: Sat 7 Nov, 11:00 am']

/** Sana's chat after the call: the call shows in the chat, then the visit confirmation. */
export const AFTER_CALL_CHAT: WaMessage[] = [
  ...QUALIFY_CHAT.slice(-3),
  { id: 'call', kind: 'pill', text: 'Voice call · 4:12' },
  {
    id: 'visit',
    kind: 'in',
    text: 'Thank you for the call, Sana! Your site visit is booked for Sat 7 Nov at 11:00 am.',
    time: '10:13 am',
    buttons: ['Add to calendar', 'Send location'],
  },
]

/** Ali calls after office hours and nobody can answer. */
export const ALI_CHAT: WaMessage[] = [
  { id: 'today', kind: 'pill', text: 'Today' },
  { id: 'missed', kind: 'pill', text: 'Voice call · No answer · 9:40 pm', tone: 'danger' },
  {
    id: 'sorry',
    kind: 'in',
    text: 'Sorry we missed your call, Ali! Our team is available 10 am to 8 pm. Pick a time for a call back:',
    time: '9:40 pm',
    buttons: ['Tomorrow 10 am', 'Tomorrow 12 pm', 'Tomorrow 4 pm'],
    chosen: 'Tomorrow 10 am',
  },
  { id: 'pick', kind: 'out', text: 'Tomorrow 10 am', time: '9:41 pm', ticks: 3 },
  { id: 'done', kind: 'in', text: 'Done! Usman will call you tomorrow at 10:00 am.', time: '9:41 pm' },
]

export const MISSED_STEPS = ['Sorry message sent in 1 second', 'Ali picked tomorrow 10 am', 'Call-back task created for Usman']

export type AgentCallScreen = 'lead' | 'calling' | 'ongoing' | 'ended' | 'missed'
export type CustomerCallScreen = 'chat' | 'incoming' | 'ongoing' | 'chatAfter' | 'ali'
