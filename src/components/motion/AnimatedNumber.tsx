import { animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  duration?: number
  delay?: number
  format?: (value: number) => string
  className?: string
}

/** A number that animates from its previous value to the new one (CountUp always starts at 0). */
export function AnimatedNumber({ value, duration = 0.8, delay = 0, format = (v) => Math.round(v).toLocaleString('en-US'), className }: AnimatedNumberProps) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)

  useEffect(() => {
    const c = animate(from.current, value, {
      duration,
      delay,
      ease: 'easeOut',
      onUpdate: (v) => {
        from.current = v
        setShown(v)
      },
    })
    return () => c.stop()
  }, [value, duration, delay])

  return <span className={className ? `tabular ${className}` : 'tabular'}>{format(shown)}</span>
}
