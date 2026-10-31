import { BarChart3, Home, Megaphone, MessageCircle, Users, type LucideIcon } from 'lucide-react'

export type AppTabId = 'home' | 'leads' | 'chats' | 'campaigns' | 'reports'

export interface AppTab {
  id: AppTabId
  label: string
  icon: LucideIcon
}

/** Bottom tab bar of the Lead Engine mobile app. */
export const APP_TABS: AppTab[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'chats', label: 'Chats', icon: MessageCircle },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
]
