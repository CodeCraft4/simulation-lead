import { useEffect, useState } from 'react'
import { formatDuration } from '@lib/format'

/** Counts down once a second from `from` seconds while mounted: "09:59", "09:58" … */
export function Countdown({ from, className }: { from: number; className?: string }) {
  const [left, setLeft] = useState(from)

  useEffect(() => {
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  return <span className={className ? `tabular ${className}` : 'tabular'}>{formatDuration(left)}</span>
}
