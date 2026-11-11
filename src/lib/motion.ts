export interface Point {
  x: number
  y: number
}

export interface ArcPoint extends Point {
  /** Giro en grados para que la proa (arriba a 0°) siga la trayectoria. */
  angle: number
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

/** Puntos de una curva cuadrática de `from` a `to` que se abomba hacia un lado. */
export function arcPoints(from: Point, to: Point, count: number, bulge = 0.3): ArcPoint[] {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const control = {
    x: (from.x + to.x) / 2 - dy * bulge,
    y: (from.y + to.y) / 2 + dx * bulge,
  }
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 1 : i / (count - 1)
    const u = 1 - t
    const x = u * u * from.x + 2 * u * t * control.x + t * t * to.x
    const y = u * u * from.y + 2 * u * t * control.y + t * t * to.y
    const tx = 2 * u * (control.x - from.x) + 2 * t * (to.x - control.x)
    const ty = 2 * u * (control.y - from.y) + 2 * t * (to.y - control.y)
    return { x, y, angle: (Math.atan2(ty, tx) * 180) / Math.PI + 90 }
  })
}
