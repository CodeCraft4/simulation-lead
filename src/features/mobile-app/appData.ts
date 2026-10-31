/** Simulated data for the clickable Lead Engine app. */

export interface AppLead {
  id: string
  name: string
  initials: string
  source: string
  score: number
  next: string
  time: string
  budget: string
  buying: string
  area: string
}

export const APP_LEADS: AppLead[] = [
  { id: 'sana', name: 'Sana Malik', initials: 'SM', source: 'Meta · Click to WhatsApp', score: 82, next: 'New · bot replied in 4 s', time: '10:02', budget: '1.5–2.5 cr', buying: 'In 3 months', area: 'DHA, Bahria' },
  { id: 'ali', name: 'Ali Raza', initials: 'AR', source: 'Google · Search', score: 64, next: 'Call back booked 10:00 am', time: '9:54', budget: '1.5–2.5 cr', buying: 'In 6 months', area: 'Near DHA' },
  { id: 'bilal', name: 'Bilal Khan', initials: 'BK', source: 'Google · Call ad', score: 78, next: 'Replied on day 7 · call now', time: '9:20', budget: '2–3 cr', buying: 'In 3 months', area: 'Bahria' },
  { id: 'fatima', name: 'Fatima Naveed', initials: 'FN', source: 'Meta · Instant form', score: 58, next: 'Day 3 message tomorrow', time: '9:41', budget: 'Under 1.5 cr', buying: '3–12 months', area: 'Johar Town' },
  { id: 'zainab', name: 'Zainab Hussain', initials: 'ZH', source: 'Meta · Click to WhatsApp', score: 85, next: 'Site visit today 3:00 pm', time: '9:02', budget: '2–3 cr', buying: 'This month', area: 'DHA' },
]

export const findLead = (id: string) => APP_LEADS.find((l) => l.id === id) ?? APP_LEADS[0]

export interface AppChatMessage {
  from: 'lead' | 'bot' | 'me'
  text: string
  time: string
}

export const APP_CHATS: Record<string, AppChatMessage[]> = {
  sana: [
    { from: 'lead', text: 'Hi, I want details about the 3 bed apartment', time: '10:02' },
    { from: 'bot', text: 'Assalam o Alaikum Sana! May I ask 3 quick questions?', time: '10:02' },
    { from: 'lead', text: '1.5 – 2.5 crore · Within 3 months', time: '10:04' },
    { from: 'lead', text: 'DHA ya Bahria ke paas ho to behtar', time: '10:04' },
    { from: 'bot', text: 'Here is our brochure. Usman will call you within 10 minutes.', time: '10:05' },
  ],
  ali: [
    { from: 'bot', text: 'Sorry we missed your call, Ali! Pick a time for a call back.', time: '9:40 pm' },
    { from: 'lead', text: 'Tomorrow 10 am', time: '9:41 pm' },
  ],
  bilal: [
    { from: 'bot', text: '0% for 6 months on 3 bed apartments, this month only.', time: 'Sat' },
    { from: 'lead', text: 'Interested, call me', time: 'Sat' },
  ],
  fatima: [{ from: 'lead', text: 'Thank you, I will check with family', time: 'Fri' }],
  zainab: [{ from: 'me', text: 'See you at 3 pm, location attached', time: '9:12' }],
}

/** What the customer answers when the agent sends a message in the demo app. */
export const AUTO_ANSWERS = ['Ji theek hai, shukriya!', 'Okay, please send the payment plan too.', 'Saturday works for me.']

export const QUICK_REPLIES = ['Payment plan', 'Send location', 'Book visit']

export const TODAY_TASKS = [
  { time: '12:00 pm', text: 'Call back', who: 'Bilal Khan', lead: 'bilal' },
  { time: '3:00 pm', text: 'Site visit,', who: 'Zainab H.', lead: 'zainab' },
  { time: '5:30 pm', text: 'Follow up', who: 'Fatima N.', lead: 'fatima' },
]

export const APP_CAMPAIGNS = [
  { platform: 'M', name: 'Lahore Apartments', sub: 'Meta · Click to WhatsApp', spend: '5.4L', leads: 38, sales: 5, perSale: '1.08L', best: true },
  { platform: 'G', name: 'Apartments Search', sub: 'Google · Search', spend: '4.2L', leads: 25, sales: 3, perSale: '1.40L' },
  { platform: 'M', name: 'Lahore Apartments', sub: 'Meta · Instant form', spend: '3.6L', leads: 27, sales: 2, perSale: '1.80L' },
  { platform: 'G', name: 'Call Now', sub: 'Google · Call ads', spend: '1.8L', leads: 10, sales: 1, perSale: '1.80L' },
]

export const BEFORE_AFTER = [
  { label: 'First reply', before: '3h 20m', after: '6 s' },
  { label: 'Leads followed up', before: '41%', after: '100%' },
  { label: 'Missed calls returned', before: '20%', after: '96%' },
  { label: 'Sales from 100 leads', before: '6', after: '11' },
]
