import type { WaMessage } from '@components/whatsapp/WaChat'

export const COLUMNS = ['New', 'Qualified', 'Visit booked', 'Sale'] as const

export type Owner = 'UT' | 'MA' | 'HS' | 'NR'

export interface BoardCard {
  id: string
  name: string
  source: string
  column: number
  owner: Owner
  tag: { text: string; tone: 'neutral' | 'hot' | 'quiet' | 'won' }
  next: string
}

/** Board before the scene starts. Sana and Bilal change as the cues play. */
export const BASE_CARDS: BoardCard[] = [
  { id: 'hassan', name: 'Hassan J.', source: 'Google · Search', column: 0, owner: 'UT', tag: { text: 'Warm', tone: 'neutral' }, next: 'Waiting 18 min for a call' },
  { id: 'mehwish', name: 'Mehwish A.', source: 'Meta · Instant form', column: 0, owner: 'UT', tag: { text: 'Warm', tone: 'neutral' }, next: 'Waiting 16 min for a call' },
  { id: 'sana', name: 'Sana Malik', source: 'Meta · WhatsApp', column: 1, owner: 'UT', tag: { text: 'Hot 82', tone: 'hot' }, next: 'Called · wants a visit' },
  { id: 'bilal', name: 'Bilal Khan', source: 'Google · Call ad', column: 1, owner: 'UT', tag: { text: 'Warm', tone: 'neutral' }, next: 'Sent payment plan' },
  { id: 'fatima', name: 'Fatima N.', source: 'Meta · Instant form', column: 1, owner: 'UT', tag: { text: 'Warm', tone: 'neutral' }, next: 'Waiting 21 min for a call' },
  { id: 'zainab', name: 'Zainab H.', source: 'Meta · WhatsApp', column: 2, owner: 'NR', tag: { text: 'Hot', tone: 'hot' }, next: 'Visit today 3:00 pm' },
  { id: 'omar', name: 'Omar F.', source: 'Google · Search', column: 3, owner: 'HS', tag: { text: 'Sold', tone: 'won' }, next: 'PKR 1.70 crore · 2 bed' },
]

/** Leads the manager moves from Usman to Maryam. */
export const REASSIGNED = ['hassan', 'mehwish', 'fatima']

export const SEQUENCE = [
  { day: 'Day 1', when: 'Mon 2 Nov', text: '“Any questions about the 3 bed plan?”', result: 'Read, no reply' },
  { day: 'Day 3', when: 'Wed 4 Nov', text: 'New photos of the show apartment', result: 'Read, no reply' },
  { day: 'Day 7', when: 'Sat 7 Nov', text: '0% for 6 months offer (template)', result: '“Interested, call me”' },
]

export const AGENTS = [
  { initials: 'UT', name: 'Usman', status: 'waiting' as const },
  { initials: 'MA', name: 'Maryam', status: 'free' as const },
  { initials: 'HS', name: 'Hamza', status: 'call' as const },
  { initials: 'NR', name: 'Nida', status: 'visit' as const },
]

/** Sana's WhatsApp from booking the visit to buying. */
export const FOLLOW_CHAT: WaMessage[] = [
  { id: 'today', kind: 'pill', text: 'Sat 31 Oct' },
  {
    id: 'book',
    kind: 'in',
    text: 'Your site visit: Sat 7 Nov at 11:00 am, Crescent Heights sales office. Shall we confirm?',
    time: '10:15 am',
    buttons: ['Confirm', 'Reschedule'],
    chosen: 'Confirm',
  },
  { id: 'confirm', kind: 'out', text: 'Confirm', time: '10:16 am', ticks: 3 },
  { id: 'booked', kind: 'in', text: 'Confirmed! See you on Saturday, Sana.', time: '10:16 am' },
  { id: 'fri', kind: 'pill', text: 'Fri 6 Nov' },
  { id: 'remind', kind: 'in', text: 'Reminder: your visit is tomorrow at 11:00 am. Reply 1 to change the time.', time: '6:00 pm' },
  { id: 'sat', kind: 'pill', text: 'Sat 7 Nov' },
  { id: 'ready', kind: 'in', text: 'We are ready for you! Here is the location of the sales office.', time: '10:00 am', image: true },
  { id: 'otw', kind: 'out', text: 'On the way, 15 minutes', time: '10:41 am', ticks: 3 },
  { id: 'mon', kind: 'pill', text: 'Mon 9 Nov' },
  { id: 'welcome', kind: 'in', text: 'Congratulations Sana! Apartment 3B-12 is booked in your name. Welcome to Crescent Heights.', time: '4:05 pm' },
]

export const CHAT_AT = { start: 1, booked: 4, reminder: 6, ready: 8, otw: 9, welcome: 11 }
