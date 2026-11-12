import { expect, test } from 'vitest'
import { buildDataset, byCountryYear, countryCodes, latestByCountry, priceLevels } from './worldbank.mjs'

const row = (iso, date, value) => ({ countryiso3code: iso, date: String(date), value })

test('countryCodes descarta agregados como el mundo o la UE', () => {
  const codes = countryCodes([
    { id: 'ESP', region: { id: 'ECS' } },
    { id: 'WLD', region: { id: 'NA' } },
  ])
  expect([...codes]).toEqual(['ESP'])
})

test('byCountryYear ignora nulos, agregados y años no numéricos', () => {
  const out = byCountryYear(
    [row('ESP', 2024, 1), row('ESP', 2025, null), row('WLD', 2025, 5), row('FRA', 'abc', 2), row('FRA', 2025, 3)],
    new Set(['ESP', 'FRA']),
  )
  expect(out).toEqual({ ESP: { 2024: 1 }, FRA: { 2025: 3 } })
})

test('latestByCountry elige el año más reciente', () => {
  expect(latestByCountry({ ESP: { 2023: 1, 2025: 3, 2024: 2 } })).toEqual({ ESP: { value: 3, year: 2025 } })
})

test('priceLevels: PPA ÷ tipo de cambio × 100 con el último año común', () => {
  const ppp = { ESP: { 2024: 0.6, 2025: 0.6079 }, USA: { 2025: 1 }, XXX: { 2025: 2 } }
  const fx = { ESP: { 2024: 0.9, 2025: 0.885 }, USA: { 2025: 1 } }
  const out = priceLevels(ppp, fx)
  expect(out.USA).toEqual({ value: 100, year: 2025 })
  expect(out.ESP.year).toBe(2025)
  expect(out.ESP.value).toBeCloseTo(68.69, 1)
  expect(out.XXX).toBeUndefined() // sin tipo de cambio: sin dato
})

test('priceLevels usa un año anterior si el último no tiene tipo de cambio', () => {
  const out = priceLevels({ ESP: { 2024: 0.6, 2025: 0.7 } }, { ESP: { 2024: 0.8 } })
  expect(out.ESP.year).toBe(2024)
  expect(out.ESP.value).toBeCloseTo(75, 5)
})

test('priceLevels descarta tipos de cambio 0 (evita dividir entre cero)', () => {
  expect(priceLevels({ ESP: { 2025: 0.6 } }, { ESP: { 2025: 0 } })).toEqual({})
})

test('buildDataset une indicadores, redondea y deja huecos sin inventar', () => {
  const data = buildDataset(
    {
      priceLevel: { ESP: { value: 68.6912, year: 2025 } },
      inflation: { ESP: { value: 2.6733, year: 2025 }, FRA: { value: 1.04, year: 2024 } },
      gdpPpp: { ESP: { value: 59867.69, year: 2025 } },
    },
    '2026-11-12',
  )
  expect(data.generated).toBe('2026-11-12')
  expect(data.source).toContain('World Bank')
  expect(data.countries.ESP).toEqual({
    priceLevel: { value: 68.7, year: 2025 },
    inflation: { value: 2.7, year: 2025 },
    gdpPpp: { value: 59868, year: 2025 },
  })
  expect(data.countries.FRA).toEqual({ inflation: { value: 1, year: 2024 } })
  expect(Object.keys(data.countries)).toEqual(['ESP', 'FRA'])
})
