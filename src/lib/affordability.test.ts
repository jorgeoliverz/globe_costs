import { expect, test } from 'vitest'
import { COLOR_ALPHA, COLOR_STOPS, COSTS, findCost } from './cost'
import { citiesOf } from './cities'
import { describeLeft, leftColor, monthlyLeft, rankCountries } from './affordability'

const rgba = ([r, g, b]: number[]) => `rgba(${r}, ${g}, ${b}, ${COLOR_ALPHA})`

test('todos los países tienen un sueldo medio positivo', () => {
  for (const c of COSTS) expect(c.salary, c.iso).toBeGreaterThan(0)
})

test('con 2.000 € en España te sobran 805 € (2.000 − 1.195)', () => {
  expect(monthlyLeft(2000, findCost('ESP')!)).toBe(805)
})

test('con 500 € en España te faltan 695 €', () => {
  expect(monthlyLeft(500, findCost('ESP')!)).toBe(-695)
  expect(describeLeft(-695)).toEqual({ label: 'Te faltan', amount: 695 })
  expect(describeLeft(805)).toEqual({ label: 'Te sobran', amount: 805 })
  expect(describeLeft(0)).toEqual({ label: 'Te sobran', amount: 0 })
})

test('también sirve para una ciudad', () => {
  const madrid = citiesOf('ESP').find((c) => c.name === 'Madrid')!
  expect(monthlyLeft(2000, madrid)).toBe(600) // 2.000 − 1.400
})

test('rankCountries devuelve los 35 países, de más a menos sobrante', () => {
  const ranked = rankCountries(2000)
  expect(ranked).toHaveLength(COSTS.length)
  for (let i = 1; i < ranked.length; i++) expect(ranked[i - 1].left).toBeGreaterThanOrEqual(ranked[i].left)
  // El más barato es el que más sobra y el más caro el que menos.
  expect(ranked[0].cost.iso).toBe('EGY')
  expect(ranked.at(-1)!.cost.iso).toBe('CHE')
})

test('leftColor: rojo si no llega, amarillo a medias, verde si sobra el 60 %', () => {
  expect(leftColor(1000, 1500)).toBe(rgba(COLOR_STOPS[2])) // no llega
  expect(leftColor(1000, 1000)).toBe(rgba(COLOR_STOPS[2])) // justo
  expect(leftColor(1000, 700)).toBe(rgba(COLOR_STOPS[1])) // sobra el 30 %
  expect(leftColor(1000, 400)).toBe(rgba(COLOR_STOPS[0])) // sobra el 60 %
  expect(leftColor(1000, 100)).toBe(rgba(COLOR_STOPS[0])) // no se sale de la escala
})
