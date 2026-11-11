import { afterEach, expect, test, vi } from 'vitest'
import { arcPoints, prefersReducedMotion } from './motion'

afterEach(() => vi.unstubAllGlobals())

test('el arco empieza en el origen, acaba en el destino y tiene los puntos pedidos', () => {
  const pts = arcPoints({ x: 100, y: 800 }, { x: 400, y: 300 }, 20)
  expect(pts).toHaveLength(20)
  expect(pts[0].x).toBeCloseTo(100)
  expect(pts[0].y).toBeCloseTo(800)
  expect(pts[19].x).toBeCloseTo(400)
  expect(pts[19].y).toBeCloseTo(300)
  for (const p of pts) expect(Number.isFinite(p.angle)).toBe(true)
})

test('el arco se abomba: el punto medio no está en la línea recta', () => {
  const [a, b] = [{ x: 0, y: 0 }, { x: 0, y: -400 }]
  const pts = arcPoints(a, b, 21)
  expect(Math.abs(pts[10].x)).toBeGreaterThan(20)
  expect(arcPoints(a, b, 21, 0)[10].x).toBeCloseTo(0)
})

test('un cohete que sube en línea recta no gira (0°)', () => {
  const pts = arcPoints({ x: 0, y: 0 }, { x: 0, y: -400 }, 5, 0)
  expect(pts[2].angle).toBeCloseTo(0)
})

test('prefersReducedMotion lee la preferencia y tolera entornos sin matchMedia', () => {
  vi.stubGlobal('matchMedia', undefined)
  expect(prefersReducedMotion()).toBe(false)
  vi.stubGlobal('matchMedia', () => ({ matches: true }))
  expect(prefersReducedMotion()).toBe(true)
})
