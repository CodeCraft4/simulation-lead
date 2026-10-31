import { BUSINESS } from '@data/business'

/** Screens the customer phone moves through in scene 3. */
export type CustomerScreen = 'feed' | 'wa' | 'search' | 'form' | 'formDone'

export const SANA = {
  name: 'Sana Malik',
  initials: 'SM',
  source: 'Meta · Click to WhatsApp',
  firstMessage: 'Hi, I want details about the 3 bed apartment',
  details: [
    ['Campaign', 'Lahore Apartments · Leads'],
    ['Ad', '3-bed image, version B'],
    ['Phone', '+92 3xx xxxxxx4'],
    ['First message', '10:02:11 am'],
    ['Auto-reply', '10:02:15 am'],
  ],
}

export const ALI = {
  name: 'Ali Raza',
  initials: 'AR',
  source: 'Google · Search · “3 bed flat lahore installments”',
  form: [
    ['Name', 'Ali Raza'],
    ['WhatsApp number', '+92 3xx xxxxxx7'],
    ['Budget', '1.5 – 2.5 crore'],
  ],
}

/** Leads already in the inbox before the scene starts. */
export const EXISTING_LEADS = [
  { initials: 'FN', name: 'Fatima Naveed', source: 'Meta · Instant form · Qualified', time: '9:41' },
  { initials: 'BK', name: 'Bilal Khan', source: 'Google · Call ad · Call back 12 pm', time: '9:20' },
  { initials: 'ZH', name: 'Zainab Hussain', source: 'Meta · WhatsApp · Visit booked', time: '9:02' },
  { initials: 'HJ', name: 'Hassan Javed', source: 'Google · Search · Bot is asking', time: '8:47' },
]

export const BUSINESS_CONTACT = { name: BUSINESS.name, initials: BUSINESS.initials, subtitle: 'Business account · Simulated' }

export const AUTO_REPLY = `Assalam o Alaikum Sana! Thank you for your interest in ${BUSINESS.name}.\nMay I ask 3 quick questions so we can send the right details?`

/** Seconds the bot takes to reply, as shown in the inbox. */
export const REPLY_SECONDS = { sana: 4, ali: 3 }
