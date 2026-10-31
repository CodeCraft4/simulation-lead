import type { WaMessage } from '@components/whatsapp/WaChat'
import { BUSINESS } from '@data/business'

/** Sana's WhatsApp chat in scene 4. The first 4 messages are where scene 3 ended. */
export const QUALIFY_CHAT: WaMessage[] = [
  { id: 'today', kind: 'pill', text: 'Today' },
  {
    id: 'first',
    kind: 'out',
    text: 'Hi, I want details about the 3 bed apartment',
    time: '10:02 am',
    ticks: 3,
    ad: { title: `${BUSINESS.name} · Ad`, body: BUSINESS.offer },
  },
  {
    id: 'hello',
    kind: 'in',
    text: 'Assalam o Alaikum Sana! May I ask 3 quick questions so we can send the right details?',
    time: '10:02 am',
    buttons: ['Yes, go ahead', 'Call me instead'],
    chosen: 'Yes, go ahead',
  },
  { id: 'yes', kind: 'out', text: 'Yes, go ahead', time: '10:03 am', ticks: 3 },
  {
    id: 'q-budget',
    kind: 'in',
    text: 'What is your budget?',
    time: '10:03 am',
    buttons: ['Under 1.5 crore', '1.5 – 2.5 crore', 'Above 2.5 crore'],
    chosen: '1.5 – 2.5 crore',
  },
  { id: 'a-budget', kind: 'out', text: '1.5 – 2.5 crore', time: '10:03 am', ticks: 3 },
  {
    id: 'q-when',
    kind: 'in',
    text: 'When are you planning to buy?',
    time: '10:03 am',
    buttons: ['Within 3 months', '3 – 12 months', 'Just looking'],
    chosen: 'Within 3 months',
  },
  { id: 'a-when', kind: 'out', text: 'Within 3 months', time: '10:04 am', ticks: 3 },
  { id: 'q-area', kind: 'in', text: 'Which area do you prefer?', time: '10:04 am' },
  { id: 'a-area', kind: 'out', text: 'DHA ya Bahria ke paas ho to behtar', time: '10:04 am', ticks: 3 },
  {
    id: 'brochure',
    kind: 'in',
    text: 'Here is our brochure with floor plans and the payment plan.',
    time: '10:05 am',
    doc: { name: 'Crescent Heights brochure.pdf', meta: '12 pages · 4.2 MB · PDF' },
  },
  { id: 'tour', kind: 'in', text: 'And a short tour of the 3 bed show apartment.', time: '10:05 am', image: true },
  { id: 'handover', kind: 'in', text: 'Thank you Sana! Usman from our sales team will call you within 10 minutes.', time: '10:05 am' },
]

/** Message counts at which each part of the story is on screen. */
export const CHAT_AT = { start: 4, budgetQ: 5, budgetA: 6, whenQ: 7, whenA: 8, areaQ: 9, areaA: 10, brochure: 11, tour: 12, handover: 13 }

export const PROFILE_FIELDS = [
  { label: 'Budget', value: '1.5 – 2.5 crore' },
  { label: 'Timeline', value: 'Within 3 months' },
  { label: 'Area', value: 'Near DHA or Bahria' },
]

/** Score after each answer is filled into the profile. */
export const SCORE_STEPS = [0, 45, 70, 82]

export const TAGS = ['3 bed', 'instalments', 'buy within 3 months', 'Lahore']

export const TIMELINE: [string, string][] = [
  ['10:02:11', 'First message from a Meta ad'],
  ['10:02:15', 'Auto-reply sent in 4 seconds'],
  ['10:04:40', 'Answered 3 questions · score 82'],
  ['10:05:02', 'Brochure and show-apartment video sent'],
  ['10:05:03', 'Assigned to Usman · notified on his phone'],
]
