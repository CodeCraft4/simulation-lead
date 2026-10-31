import { animate } from 'framer-motion'
import { useEffect, useState } from 'react'

interface CountUpProps {
  to: number
  /** Seconds. */
  duration?: number
  delay?: number
  format?: (value: number) => string
  className?: string
}

/** Number that counts up from 0 when it mounts or when `to` changes. */
export function CountUp({ to, duration = 1, delay = 0, format = (v) => Math.round(v).toLocaleString('en-US'), className }: CountUpProps) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const controls = animate(0, to, { duration, delay, ease: 'easeOut', onUpdate: setValue })
    return () => controls.stop()
  }, [to, duration, delay])

  return <span className={className ? `tabular ${className}` : 'tabular'}>{format(value)}</span>
}
