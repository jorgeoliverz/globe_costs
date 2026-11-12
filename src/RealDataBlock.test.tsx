import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import RealDataBlock from './RealDataBlock'
import { findRealData } from './lib/realData'

const norm = (s: string | null) => (s ?? '').replace(/\s/g, ' ')

test('España muestra nivel de precios, inflación y PIB con su año, y la fuente', () => {
  render(<RealDataBlock iso="ESP" />)
  const d = findRealData('ESP')!
  const block = norm(screen.getByTestId('real-data').textContent)
  expect(block).toContain('Datos reales (Banco Mundial)')
  expect(block).toContain(`${d.priceLevel!.value.toFixed(1).replace('.', ',')} · ${d.priceLevel!.year}`)
  expect(block).toContain('más barato que EE. UU.')
  expect(block).toContain(`${d.inflation!.year}`)
  expect(block).toContain(`${d.gdpPpp!.year}`)
  expect(block).toContain('$')
  expect(block).toContain('Fuente: World Bank Open Data (CC BY 4.0)')
})

test('un país sin ningún dato real lo indica y mantiene la fuente', () => {
  render(<RealDataBlock iso="XXX" />)
  expect(screen.getByText('Sin datos reales para este país.')).toBeTruthy()
  expect(screen.queryByText('Nivel de precios')).toBeNull()
  expect(screen.getByText(/Fuente:/)).toBeTruthy()
})
