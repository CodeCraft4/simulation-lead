import type { WaMessage } from '@components/whatsapp/WaChat'

export const TILES = [
  { label: 'First reply', before: '3 h 20 min', after: '6 s' },
  { label: 'Leads followed up', before: '41%', after: '100%' },
  { label: 'Missed calls returned', before: '20%', after: '96%' },
  { label: 'Sales from 100 leads', before: '6', after: '11' },
  { label: 'Cost per sale', before: 'PKR 2.5 lakh', after: 'PKR 1.36 lakh' },
]

/** One month: 100 leads, 11 sales, PKR 15 lakh. Ordered best first. */
export const CAMPAIGN_ROWS = [
  { name: 'Meta', type: 'Click to WhatsApp', spend: '5.4 lakh', leads: 38, qualified: 22, visits: 9, sales: 5, perSale: '1.08 lakh' },
  { name: 'Google', type: 'Search', spend: '4.2 lakh', leads: 25, qualified: 14, visits: 6, sales: 3, perSale: '1.40 lakh' },
  { name: 'Meta', type: 'Instant form', spend: '3.6 lakh', leads: 27, qualified: 11, visits: 4, sales: 2, perSale: '1.80 lakh' },
  { name: 'Google', type: 'Call ads', spend: '1.8 lakh', leads: 10, qualified: 5, visits: 2, sales: 1, perSale: '1.80 lakh' },
]

export const CHANNEL_SALES = [
  { name: 'Meta', sales: 7, color: '#1e3a8a' },
  { name: 'Google', sales: 4, color: '#60a5fa' },
]

export const SUMMARY_CONTACT = { name: 'Lead Engine', initials: 'LE', subtitle: 'Morning summary · Simulated' }

export const SUMMARY_CHAT: WaMessage[] = [
  { id: 'today', kind: 'pill', text: 'Today' },
  {
    id: 'summary',
    kind: 'in',
    text:
      'Good morning! Yesterday, Sun 29 Nov:\n• 4 new leads, all replied within 10 s\n• 9 calls (1 missed, called back)\n• 2 site visits · 1 sale, PKR 1.95 crore\n• Ad spend PKR 50,000\n\nTop action: move PKR 5,000 a day from Meta Instant form to Meta Click to WhatsApp.',
    time: '9:00 am',
    buttons: ['Approve', 'Open dashboard'],
    chosen: 'Approve',
  },
  { id: 'approve', kind: 'out', text: 'Approve', time: '9:02 am', ticks: 3 },
  { id: 'done', kind: 'in', text: 'Done. The budget moves from tomorrow. I will report the effect next Monday.', time: '9:02 am' },
]
