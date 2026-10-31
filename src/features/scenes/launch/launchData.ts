/** Simulated campaign setup for scene 2. */

export interface CampaignField {
  label: string
  /** One value, or several shown as chips. */
  value: string | string[]
  wide?: boolean
  accent?: boolean
}

export interface CampaignConfig {
  id: 'meta' | 'google'
  letter: string
  tint: string
  ink: string
  url: string
  name: string
  platform: string
  fields: CampaignField[]
  /** Live numbers after publishing: [label, per simulated minute, prefix]. */
  stats: [string, number, string?][]
}

export const META: CampaignConfig = {
  id: 'meta',
  letter: 'M',
  tint: '#E7F0FE',
  ink: '#1659C7',
  url: 'ads.simulated/meta/new-campaign',
  name: 'Lahore Apartments · Leads',
  platform: 'Meta Ads',
  fields: [
    { label: 'Objective', value: 'Leads' },
    { label: 'Daily budget', value: 'PKR 30,000' },
    { label: 'Audience', value: ['Lahore + 25 km', 'Age 28–55', 'Interest: property'], wide: true },
    { label: 'Ad formats', value: ['✓ Click to WhatsApp', '✓ Instant form'], wide: true, accent: true },
  ],
  stats: [
    ['Spend today', 20.8, 'PKR '],
    ['Reach', 31],
    ['Clicks', 0.75],
  ],
}

export const GOOGLE: CampaignConfig = {
  id: 'google',
  letter: 'G',
  tint: '#E8F0FE',
  ink: '#1A56C4',
  url: 'ads.simulated/google/new-campaign',
  name: 'Apartments · Search',
  platform: 'Google Ads',
  fields: [
    { label: 'Campaign type', value: 'Search' },
    { label: 'Daily budget', value: 'PKR 20,000' },
    {
      label: 'Keywords',
      value: ['apartments for sale lahore', '3 bed flat lahore installments', 'flats near dha lahore', '+9 more'],
      wide: true,
    },
    { label: 'Extras', value: ['✓ Lead form', '✓ Call button', '✓ WhatsApp link'], wide: true, accent: true },
  ],
  stats: [
    ['Spend today', 13.9, 'PKR '],
    ['Impressions', 7.2],
    ['Clicks', 0.45],
  ],
}

export const CONNECTIONS = ['Meta leads → Lead Inbox', 'Google leads → Lead Inbox', 'WhatsApp number +92 3xx xxxxxx0']

/** Publish state shared by both campaigns. */
export const PUBLISH = { draft: 0, review: 1, active: 2 } as const
