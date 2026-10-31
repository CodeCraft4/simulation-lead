import { Share2 } from 'lucide-react'
import { BUSINESS } from '@data/business'

export function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-[10px] bg-navy text-white">
        <Share2 className="size-[18px]" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-bold tracking-tight">Lead Engine</span>
        <span className="block text-[11px] text-ink-3">{BUSINESS.name} · Simulated data</span>
      </span>
    </div>
  )
}
