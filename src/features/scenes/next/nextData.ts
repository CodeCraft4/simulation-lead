import { BarChart3, LayoutList, Megaphone, MessageCircle, Search, type LucideIcon } from 'lucide-react'

export const INTEGRATIONS: { icon: LucideIcon; name: string; what: string }[] = [
  { icon: MessageCircle, name: 'WhatsApp Business Platform', what: 'Messages, templates, broadcasts and calls' },
  { icon: Megaphone, name: 'Meta Ads', what: 'Lead forms, Click to WhatsApp, sales sent back' },
  { icon: Search, name: 'Google Ads', what: 'Search leads, call ads, offline conversions' },
  { icon: LayoutList, name: 'Lead Inbox', what: 'Or your existing CRM, if you have one' },
  { icon: BarChart3, name: 'Results dashboard', what: 'Daily summary on WhatsApp' },
]

export const PHASES = [
  { title: 'WhatsApp and Lead Inbox', what: 'Instant reply, questions, hand-over to agents' },
  { title: 'Meta and Google lead sync', what: 'Every ad lead lands in the inbox with its source' },
  { title: 'Calls, broadcasts, sales back to ads', what: 'WhatsApp calls, follow-ups, conversion feedback' },
  { title: 'Dashboard and reports', what: 'Results, morning summary, budget suggestions' },
]

export const NEEDS = [
  'WhatsApp Business number and Meta Business verification',
  'Access to the Meta and Google ad accounts',
  'Wording for the message templates',
  'Sales team list and who handles which leads',
  'Office hours for calls',
]

