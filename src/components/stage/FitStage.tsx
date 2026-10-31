import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

interface FitStageProps {
  /** Size the stage is designed at, in px. */
  width: number
  height: number
  children: ReactNode
}

/**
 * Renders children at a fixed design size and scales them down to fit the available box,
 * so a scene never reflows or scrolls during a demo. Never scales above 1.
 */
export function FitStage({ width, height, children }: FitStageProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    const observer = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect
      if (w > 0 && h > 0) setScale(Math.min(w / width, h / height, 1))
    })
    observer.observe(box)
    return () => observer.disconnect()
  }, [width, height])

  return (
    <div ref={boxRef} className="relative h-full min-h-0 w-full overflow-hidden">
      <div
        className="absolute left-1/2 top-0 origin-top"
        style={{ width, height, transform: `translateX(-50%) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}
