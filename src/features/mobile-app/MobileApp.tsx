import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import { AppTabBar } from '@components/app/AppTabBar'
import type { AppTabId } from '@config/navigation'
import { NavContext, type AppRoute } from '@features/mobile-app/appNav'
import { BroadcastView, CallView, ChatView, LeadDetail } from '@features/mobile-app/screens/DetailScreens'
import { CampaignsTab, ChatsTab, HomeTab, LeadsTab, ReportsTab } from '@features/mobile-app/screens/TabScreens'

/** Which tab a pushed screen belongs to, so the tab bar stays highlighted. */
const TAB_OF: Record<AppRoute['name'], AppTabId> = {
  home: 'home',
  leads: 'leads',
  chats: 'chats',
  campaigns: 'campaigns',
  reports: 'reports',
  lead: 'leads',
  chat: 'chats',
  call: 'leads',
  broadcast: 'campaigns',
}

/** Full-screen views hide the tab bar, like a real chat or call screen. */
const FULL_SCREEN = new Set<AppRoute['name']>(['chat', 'call'])

/**
 * The clickable Lead Engine app. Navigation is local state (not the URL) so it can sit
 * inside a presenter scene as well as on its own page. Render it inside an IPhoneFrame.
 */
export function MobileApp() {
  const [stack, setStack] = useState<AppRoute[]>([{ name: 'home' }])
  const route = stack[stack.length - 1]

  const push = useCallback((r: AppRoute) => setStack((s) => [...s, r]), [])
  const back = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), [])
  const nav = useMemo(() => ({ push, back }), [push, back])

  return (
    <NavContext.Provider value={nav}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${stack.length}-${JSON.stringify(route)}`}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <Screen route={route} />
        </motion.div>
      </AnimatePresence>
      {!FULL_SCREEN.has(route.name) && <AppTabBar active={TAB_OF[route.name]} onSelect={(tab) => setStack([{ name: tab }])} />}
    </NavContext.Provider>
  )
}

function Screen({ route }: { route: AppRoute }) {
  switch (route.name) {
    case 'home':
      return <HomeTab />
    case 'leads':
      return <LeadsTab />
    case 'chats':
      return <ChatsTab />
    case 'campaigns':
      return <CampaignsTab />
    case 'reports':
      return <ReportsTab />
    case 'lead':
      return <LeadDetail id={route.id} />
    case 'chat':
      return <ChatView id={route.id} />
    case 'call':
      return <CallView id={route.id} />
    case 'broadcast':
      return <BroadcastView />
  }
}
