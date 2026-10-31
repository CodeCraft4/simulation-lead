import { APP_TABS, type AppTab, type AppTabId } from '@config/navigation'
import { cn } from '@lib/cn'

const itemCls = (active: boolean) =>
  cn('flex flex-1 flex-col items-center gap-[3px] text-[11px] font-semibold', active ? 'text-navy' : 'text-[#5b6b8c]')

function TabContent({ tab, active }: { tab: AppTab; active: boolean }) {
  const Icon = tab.icon
  return (
    <>
      <span className={cn('flex h-[30px] w-[54px] items-center justify-center rounded-full transition-colors', active && 'bg-[#e3e9f7]')}>
        <Icon className="size-[22px]" strokeWidth={2} aria-hidden />
      </span>
      {tab.label}
    </>
  )
}

interface AppTabBarProps {
  active: AppTabId
  /** Without it the bar is a picture (inside presenter scenes); with it the tabs are buttons. */
  onSelect?: (tab: AppTabId) => void
}

/** Bottom tab bar of the Lead Engine mobile app. */
export function AppTabBar({ active, onSelect }: AppTabBarProps) {
  return (
    <nav aria-label="App sections" className="flex shrink-0 border-t border-[#e3e8f2] bg-white px-1.5 pb-7 pt-2">
      {APP_TABS.map((tab) =>
        onSelect ? (
          <button
            key={tab.id}
            type="button"
            aria-current={tab.id === active ? 'page' : undefined}
            onClick={() => onSelect(tab.id)}
            className={cn(itemCls(tab.id === active), 'cursor-pointer')}
          >
            <TabContent tab={tab} active={tab.id === active} />
          </button>
        ) : (
          <span key={tab.id} className={itemCls(tab.id === active)}>
            <TabContent tab={tab} active={tab.id === active} />
          </span>
        ),
      )}
    </nav>
  )
}
