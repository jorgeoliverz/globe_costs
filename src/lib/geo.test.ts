import { expect, test } from 'vitest'
import geo from '../../public/data/countries.geojson?raw'
import type { Country } from '../types'
import { countryCenter } from './geo'

const countries = (JSON.parse(geo) as { features: Country[] }).features
const byIso = (iso: string) => countries.find((c) => c.properties.ADM0_A3 === iso)!

test('el centro de España cae dentro de su caja geográfica', () => {
  const { lat, lng } = countryCenter(byIso('ESP'))
  expect(lat).toBeGreaterThan(36)
  expect(lat).toBeLessThan(44)
  expect(lng).toBeGreaterThan(-10)
  expect(lng).toBeLessThan(4)
})

test('Francia se centra en la metrópoli y no en la Guayana', () => {
  const { lat, lng } = countryCenter(byIso('FRA'))
  expect(lat).toBeGreaterThan(41)
  expect(lng).toBeGreaterThan(-5)
})

test('usa el polígono más grande de un MultiPolygon', () => {
  const square = (x: number, y: number, size: number) => [
    [[x, y], [x + size, y], [x + size, y + size], [x, y + size], [x, y]],
  ]
  const country: Country = {
    properties: { NAME: 'T', ISO_A3: 'TTT', ADM0_A3: 'TTT' },
    geometry: { type: 'MultiPolygon', coordinates: [square(0, 0, 2), square(100, 50, 10)] },
  }
  expect(countryCenter(country)).toEqual({ lat: 55, lng: 105 })
})

test('una geometría desconocida devuelve 0,0', () => {
  const country: Country = {
    properties: { NAME: 'T', ISO_A3: 'TTT', ADM0_A3: 'TTT' },
    geometry: { type: 'Point', coordinates: [1, 2] },
  }
  expect(countryCenter(country)).toEqual({ lat: 0, lng: 0 })
})
