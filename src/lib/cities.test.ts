import { expect, test } from 'vitest'
import { CITIES_PER_COUNTRY, allCities, citiesOf } from './cities'
import { COSTS } from './cost'

test('cada país de costs.json tiene exactamente 5 ciudades', () => {
  for (const c of COSTS) expect(citiesOf(c.iso), c.iso).toHaveLength(CITIES_PER_COUNTRY)
})

test('no hay ciudades de países que no estén en costs.json', () => {
  const isos = new Set(COSTS.map((c) => c.iso))
  for (const city of allCities()) expect(isos.has(city.iso), city.iso).toBe(true)
  expect(allCities()).toHaveLength(COSTS.length * CITIES_PER_COUNTRY)
})

test('coordenadas válidas, importes positivos y nombres únicos por país', () => {
  for (const c of COSTS) {
    const cities = citiesOf(c.iso)
    expect(new Set(cities.map((x) => x.name)).size, c.iso).toBe(CITIES_PER_COUNTRY)
    for (const x of cities) {
      expect(x.lat).toBeGreaterThanOrEqual(-90)
      expect(x.lat).toBeLessThanOrEqual(90)
      expect(x.lng).toBeGreaterThanOrEqual(-180)
      expect(x.lng).toBeLessThanOrEqual(180)
      expect(x.rent).toBeGreaterThan(0)
      expect(x.food).toBeGreaterThan(0)
      expect(x.transport).toBeGreaterThan(0)
    }
  }
})

test('citiesOf(ESP) incluye Madrid y un país desconocido no tiene ciudades', () => {
  expect(citiesOf('ESP').map((c) => c.name)).toContain('Madrid')
  expect(citiesOf('XXX')).toEqual([])
})
