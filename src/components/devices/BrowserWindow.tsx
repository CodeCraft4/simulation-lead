import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@lib/cn'

interface WindowProps {
  children: ReactNode
  className?: string
  /** Who is looking at it, shown under the window: "Marketing · Meta Ads". */
  caption?: ReactNode
}

function WindowShell({ bar, children, className, caption }: WindowProps & { bar: ReactNode }) {
  return (
    <figure className="m-0 flex flex-col items-center gap-2">
      <div
        className={cn(
          'flex w-full flex-col overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white text-[#0f172a] shadow-[0_1px_2px_rgba(15,23,42,.06),0_12px_32px_rgba(15,23,42,.08)]',
          className,
        )}
      >
        <div className="flex h-9 shrink-0 items-center gap-2.5 border-b border-[#e2e8f0] bg-[#f8fafc] px-3 text-[11px] text-[#475569]">
          {/* Close, minimise, full screen: makes it read as a desktop browser at a glance. */}
          <span className="flex shrink-0 gap-1.5" aria-hidden>
            {['#ff5f57', '#febc2e', '#28c840'].map((color) => (
              <i key={color} className="block size-2.5 rounded-full shadow-[inset_0_0_0_.5px_rgba(0,0,0,.18)]" style={{ background: color }} />
            ))}
          </span>
          <span className="flex shrink-0 text-[#94a3b8]" aria-hidden>
            <ChevronLeft className="size-3.5" />
            <ChevronRight className="size-3.5" />
          </span>
          {bar}
        </div>
        {children}
      </div>
      {caption && <figcaption className="text-xs text-ink-3">{caption}</figcaption>}
    </figure>
  )
}

/** Browser window with a fake, clearly non-real address. */
export function BrowserWindow({ url, ...props }: WindowProps & { url: string }) {
  return (
    <WindowShell
      {...props}
      bar={
        <span className="flex h-6 min-w-0 flex-1 items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-2.5 font-mono text-[10.5px] text-[#475569]">
          <Lock className="size-2.5 shrink-0" aria-hidden />
          <span className="truncate">{url}</span>
        </span>
      }
    />
  )
}

/** Our web app (Lead Inbox) in a browser: page title plus a made-up address. */
export function AppWindow({ title, url = 'leadengine.local', ...props }: WindowProps & { title: ReactNode; url?: string }) {
  return (
    <WindowShell
      {...props}
      bar={
        <>
          <span className="min-w-0 truncate font-semibold text-[#0f172a]">{title}</span>
          <span className="ml-auto flex h-6 max-w-[45%] shrink-0 items-center gap-1.5 rounded-md border border-[#e2e8f0] bg-white px-2 font-mono text-[10px] text-[#64748b]">
            <Lock className="size-2.5 shrink-0" aria-hidden />
            <span className="truncate">{url}</span>
          </span>
        </>
      }
    />
  )
}
