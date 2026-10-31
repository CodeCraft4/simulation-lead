import { animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface ScoreRingProps {
  score: number
  size?: number
  /** Ring track colour; default suits white backgrounds. */
  track?: string
  /** Show on a dark header. */
  onDark?: boolean
}

const label = (score: number) => (score >= 75 ? 'HOT' : score >= 50 ? 'WARM' : score > 0 ? 'NEW' : '—')

/** Lead score from 0 to 100 that animates when the score changes. */
export function ScoreRing({ score, size = 96, track, onDark }: ScoreRingProps) {
  const [shown, setShown] = useState(score)
  const from = useRef(score)

  useEffect(() => {
    const c = animate(from.current, score, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => {
        from.current = v
        setShown(v)
      },
    })
    return () => c.stop()
  }, [score])

  const r = 42
  const circumference = 2 * Math.PI * r
  const hot = shown >= 75
  const color = onDark ? '#fdba74' : hot ? '#c2410c' : '#1e3a8a'

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`Lead score ${Math.round(score)} of 100`}>
        <circle cx="50" cy="50" r={r} fill="none" stroke={track ?? (onDark ? 'rgba(255,255,255,.15)' : '#eef2f8')} strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${(shown / 100) * circumference} ${circumference}`}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono font-semibold tabular" style={{ fontSize: size * 0.27 }}>
          {Math.round(shown)}
        </span>
        <span className="font-bold" style={{ fontSize: size * 0.11, color }}>
          {label(shown)}
        </span>
      </div>
    </div>
  )
}
