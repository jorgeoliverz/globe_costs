import { expect, test } from 'vitest'
import geo from '../../public/data/countries.geojson?raw'
import {
  COLOR_ALPHA,
  COLOR_STOPS,
  COSTS,
  NO_DATA_COLOR,
  costColor,
  costRange,
  findCost,
  formatEuro,
  totalCost,
} from './cost'

const rgba = ([r, g, b]: number[]) => `rgba(${r}, ${g}, ${b}, ${COLOR_ALPHA})`

test('España: 900 + 250 + 45 = 1.195 €', () => {
  const es = findCost('ESP')!
  expect(es.rent).toBe(900)
  expect(es.food).toBe(250)
  expect(es.transport).toBe(45)
  expect(totalCost(es)).toBe(1195)
})

test('un país sin datos devuelve null', () => {
  expect(findCost('XXX')).toBeNull()
})

test('costRange devuelve el mínimo y el máximo de los totales', () => {
  const { min, max } = costRange()
  const totals = COSTS.map(totalCost)
  expect(min).toBe(Math.min(...totals))
  expect(max).toBe(Math.max(...totals))
  expect(min).toBeLessThan(max)
})

test('costColor: verde en el mínimo, rojo en el máximo, gris sin datos', () => {
  expect(costColor(100, 100, 500)).toBe(rgba(COLOR_STOPS[0]))
  expect(costColor(500, 100, 500)).toBe(rgba(COLOR_STOPS[2]))
  expect(costColor(300, 100, 500)).toBe(rgba(COLOR_STOPS[1]))
  expect(costColor(null, 100, 500)).toBe(NO_DATA_COLOR)
})

test('costColor no se sale de la escala y tolera rango vacío', () => {
  expect(costColor(50, 100, 500)).toBe(rgba(COLOR_STOPS[0]))
  expect(costColor(900, 100, 500)).toBe(rgba(COLOR_STOPS[2]))
  expect(costColor(100, 100, 100)).toBe(rgba(COLOR_STOPS[0]))
})

test('formatEuro agrupa los miles con punto', () => {
  expect(formatEuro(1195).replace(/\s/g, ' ')).toBe('1.195 €')
  expect(formatEuro(45).replace(/\s/g, ' ')).toBe('45 €')
})

test('los datos son válidos: 35 países, códigos únicos, importes positivos', () => {
  expect(COSTS).toHaveLength(35)
  expect(new Set(COSTS.map((c) => c.iso)).size).toBe(35)
  for (const c of COSTS) {
    expect(c.rent).toBeGreaterThan(0)
    expect(c.food).toBeGreaterThan(0)
    expect(c.transport).toBeGreaterThan(0)
  }
})

test('todos los códigos de costs.json existen en el GeoJSON', () => {
  const codes = new Set(
    (JSON.parse(geo) as { features: { properties: { ADM0_A3: string } }[] }).features.map(
      (f) => f.properties.ADM0_A3,
    ),
  )
  for (const c of COSTS) expect(codes.has(c.iso), c.iso).toBe(true)
})
