import { cn } from '@lib/cn'

/** Simple apartment-block artwork used as the ad image. Decorative only; scales to any box. */
export function BuildingsArt({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('overflow-hidden bg-[#dbe4f3]', className)}>
      <svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMax meet" className="block h-full w-full">
        <rect x="18" y="26" width="20" height="44" rx="1.5" fill="#1e3a8a" />
        <rect x="41" y="12" width="24" height="58" rx="1.5" fill="#3b5bdb" />
        <rect x="68" y="36" width="16" height="34" rx="1.5" fill="#60a5fa" />
        {[18, 26, 34, 42, 50, 58].map((y) => (
          <g key={y} fill="#dbe4f3" opacity=".55">
            <rect x="45" y={y} width="5" height="3.5" rx=".5" />
            <rect x="56" y={y} width="5" height="3.5" rx=".5" />
            {y > 28 && <rect x="23" y={y + 2} width="4" height="3" rx=".5" />}
            {y > 28 && <rect x="30" y={y + 2} width="4" height="3" rx=".5" />}
          </g>
        ))}
      </svg>
    </div>
  )
}
