import { useEffect, useMemo, useRef } from 'react'
import { arcPoints, type Point } from './lib/motion'

export const FLIGHT_MS = 1900
const ARRIVAL_MS = 650 // pulso de llegada antes de dar el vuelo por terminado
const STEPS = 28
const TRAIL_DOTS = 14

interface Props {
  from: Point
  onDone: () => void
}

export default function Rocket({ from, onDone }: Props) {
  const rocketRef = useRef<HTMLDivElement>(null)
  const to = useMemo<Point>(() => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 }), [])
  const points = useMemo(() => arcPoints(from, to, STEPS), [from, to])
  const trail = useMemo(() => arcPoints(from, to, TRAIL_DOTS + 2).slice(1, -1), [from, to])

  useEffect(() => {
    const el = rocketRef.current
    if (el && typeof el.animate === 'function') {
      el.animate(
        points.map((p, i) => {
          const t = i / (STEPS - 1)
          return {
            offset: t,
            opacity: t > 0.9 ? (1 - t) * 10 : 1,
            transform: `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${p.angle}deg) scale(${1 - 0.65 * t * t})`,
          }
        }),
        { duration: FLIGHT_MS, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' },
      )
    }
    const timer = window.setTimeout(onDone, FLIGHT_MS + ARRIVAL_MS)
    return () => window.clearTimeout(timer)
  }, [points, onDone])

  return (
    <div className="pointer-events-none fixed inset-0" data-testid="rocket" aria-hidden="true">
      {trail.map((p, i) => (
        <span
          key={i}
          className="trail-dot absolute size-2 rounded-full bg-accent"
          style={{
            left: p.x,
            top: p.y,
            animationDelay: `${((i + 1) / (TRAIL_DOTS + 1)) * FLIGHT_MS * 0.92}ms`,
          }}
        />
      ))}
      <span
        className="arrival-ring absolute size-24 rounded-full border-2 border-accent"
        style={{ left: to.x, top: to.y, animationDelay: `${FLIGHT_MS * 0.9}ms` }}
      />
      <div
        ref={rocketRef}
        className="absolute left-0 top-0 w-10"
        style={{ transform: `translate(${from.x}px, ${from.y}px) translate(-50%, -50%)` }}
      >
        <svg viewBox="0 0 40 84" className="block w-full overflow-visible">
          <path className="flame" d="M14 56 Q20 90 26 56 Z" fill="#fbbf24" />
          <path className="flame" d="M17 56 Q20 78 23 56 Z" fill="#fff7d6" />
          <path d="M12 42 L2 62 L12 56 Z" fill="#5eead4" />
          <path d="M28 42 L38 62 L28 56 Z" fill="#5eead4" />
          <path d="M20 2 C29 14 31 32 28 56 L12 56 C9 32 11 14 20 2 Z" fill="#e6edf7" />
          <circle cx="20" cy="28" r="5.5" fill="#0a1226" stroke="#5eead4" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}
