import type { WaMessage } from '@components/whatsapp/WaChat'

/** Each filter narrows the audience; counts after each one is applied. */
export const FILTERS = ['Score: warm', 'No reply for 14+ days', 'Opted in: yes']
export const AUDIENCE = [3420, 2106, 1284]

export const FUNNEL = [
  { label: 'Sent', n: 1284, color: '#0b1f4d' },
  { label: 'Delivered', n: 1251, color: '#1e3a8a' },
  { label: 'Read', n: 973, color: '#3b5bdb' },
  { label: 'Replied', n: 146, color: '#15803d' },
]

export const KAMRAN_CHAT: WaMessage[] = [
  { id: 'old', kind: 'pill', text: '14 Oct' },
  {
    id: 'open-house',
    kind: 'in',
    text: 'Open house this Sunday, 11 am to 5 pm. See the 3 bed show apartment and the new payment plan.',
    time: '11:20 am',
    image: true,
    buttons: ['I will come', 'Send me the location'],
    chosen: 'I will come',
  },
  { id: 'reply', kind: 'out', text: 'Sunday 12 baje aa jayenge, 2 log', time: '11:24 am', ticks: 3 },
  { id: 'thanks', kind: 'in', text: 'Great, see you on Sunday, Kamran! The location is on its way.', time: '11:24 am' },
]

/** The 11 sales of the month, by the platform that brought them. */
export const SALES: ('meta' | 'google')[] = ['meta', 'google', 'meta', 'meta', 'google', 'meta', 'google', 'meta', 'meta', 'google', 'meta']

/** Cost per qualified lead over the 4 weeks after sales are sent back (PKR). */
export const CPQL = {
  meta: [41000, 36000, 30500, 27000],
  google: [44000, 40000, 35500, 32000],
}
