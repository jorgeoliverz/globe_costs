import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Legend from './Legend'
import { COSTS, costRange, formatEuro } from './lib/cost'

test('la leyenda muestra el mínimo y el máximo de los datos', () => {
  render(<Legend />)
  const { min, max } = costRange(COSTS)
  expect(screen.getByTestId('legend-min').textContent).toBe(formatEuro(min))
  expect(screen.getByTestId('legend-max').textContent).toBe(formatEuro(max))
  expect(screen.getByText(/sin datos/)).toBeTruthy()
})
