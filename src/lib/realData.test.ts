import { expect, test } from 'vitest'
import {
  REAL_DATA,
  REAL_DATA_SOURCE,
  describePriceLevel,
  findRealData,
  formatDecimal,
  formatDollar,
} from './realData'

test('España tiene los tres indicadores reales con año', () => {
  const d = findRealData('ESP')!
  for (const key of ['priceLevel', 'inflation', 'gdpPpp'] as const) {
    expect(Number.isFinite(d[key]!.value)).toBe(true)
    expect(d[key]!.year).toBeGreaterThan(2015)
  }
})

test('EE. UU. es la referencia: nivel de precios 100', () => {
  expect(findRealData('USA')!.priceLevel!.value).toBe(100)
})

test('los códigos del GeoJSON que difieren del Banco Mundial (Kosovo, Sudán del Sur, Palestina) encuentran sus datos', () => {
  expect(findRealData('KOS')).toEqual(REAL_DATA.XKX)
  expect(findRealData('SDS')).toEqual(REAL_DATA.SSD)
  expect(findRealData('PSX')).toEqual(REAL_DATA.PSE)
  for (const iso of ['KOS', 'SDS', 'PSX']) expect(findRealData(iso)).not.toBeNull()
})

test('un país inexistente devuelve null (sin datos)', () => {
  expect(findRealData('XXX')).toBeNull()
})

test('un país con el registro vacío devuelve null', () => {
  expect(findRealData('AAA', { AAA: {} })).toBeNull()
})

test('un país con solo algunos indicadores los devuelve sin inventar el resto', () => {
  const d = findRealData('AAA', { AAA: { inflation: { value: 3, year: 2024 } } })!
  expect(d.inflation!.value).toBe(3)
  expect(d.priceLevel).toBeUndefined()
})

test('el conjunto cubre más de 150 países y cita su fuente', () => {
  expect(Object.keys(REAL_DATA).length).toBeGreaterThan(150)
  expect(REAL_DATA_SOURCE).toContain('World Bank')
})

test('formatea con coma decimal y miles con punto', () => {
  expect(formatDecimal(68.7)).toBe('68,7')
  expect(formatDecimal(2, 1)).toBe('2,0')
  expect(formatDollar(59868).replace(/\s/g, ' ')).toBe('59.868 $')
  expect(formatDollar(950).replace(/\s/g, ' ')).toBe('950 $')
})

test('describePriceLevel compara con EE. UU.', () => {
  expect(describePriceLevel(68.7)).toBe('31 % más barato que EE. UU.')
  expect(describePriceLevel(128.2)).toBe('28 % más caro que EE. UU.')
  expect(describePriceLevel(100)).toBe('Igual que EE. UU.')
})
