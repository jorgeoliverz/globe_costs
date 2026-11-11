import { expect, test } from 'vitest'
import geo from '../../public/data/countries.geojson?raw'
import type { Country } from '../types'
import { MAX_RESULTS, normalize, searchPlaces } from './search'

const countries = (JSON.parse(geo) as { features: Country[] }).features

test('normalize quita acentos y mayúsculas', () => {
  expect(normalize('  Zúrich ')).toBe('zurich')
  expect(normalize('MÁLAGA')).toBe('malaga')
})

test('"espa" devuelve España el primero', () => {
  const [first] = searchPlaces('espa', countries)
  expect(first.kind).toBe('country')
  expect(first.label).toBe('España')
})

test('"madrid" devuelve la ciudad Madrid de España', () => {
  const [first] = searchPlaces('madrid', countries)
  expect(first.kind).toBe('city')
  expect(first.label).toBe('Madrid')
  expect(first.sub).toBe('España')
})

test('ignora acentos y mayúsculas: "ZURICH" encuentra Zúrich', () => {
  const results = searchPlaces('ZURICH', countries)
  expect(results.some((r) => r.kind === 'city' && r.label === 'Zúrich')).toBe(true)
})

test('encuentra países sin datos por su nombre en inglés', () => {
  const [first] = searchPlaces('russia', countries)
  expect(first.kind).toBe('country')
  expect(first.label).toBe('Russia')
})

test('una búsqueda vacía o sin coincidencias devuelve lista vacía', () => {
  expect(searchPlaces('', countries)).toEqual([])
  expect(searchPlaces('   ', countries)).toEqual([])
  expect(searchPlaces('qqqqzzzz', countries)).toEqual([])
})

test(`nunca devuelve más de ${MAX_RESULTS} resultados`, () => {
  expect(searchPlaces('a', countries)).toHaveLength(MAX_RESULTS)
})

test('van antes los que empiezan por lo escrito, luego una palabra y luego los que lo contienen', () => {
  const fake = (iso: string, name: string): Country => ({
    properties: { NAME: name, ISO_A3: iso, ADM0_A3: iso },
    geometry: { type: 'Polygon', coordinates: [] },
  })
  const fixtures = [fake('ZZ1', 'Overland'), fake('ZZ2', 'Cabo Verde'), fake('ZZ3', 'Vermont')]
  expect(searchPlaces('ver', fixtures).map((r) => r.label)).toEqual(['Vermont', 'Cabo Verde', 'Overland'])
})
