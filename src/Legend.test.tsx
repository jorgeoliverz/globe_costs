import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Legend from './Legend'
import { COSTS, costRange, formatEuro } from './lib/cost'

test('en modo coste muestra el mínimo y el máximo de los datos', () => {
  render(<Legend mode="cost" salaryReady={false} onMode={() => {}} />)
  const { min, max } = costRange(COSTS)
  expect(screen.getByTestId('legend-min').textContent).toBe(formatEuro(min))
  expect(screen.getByTestId('legend-max').textContent).toBe(formatEuro(max))
  expect(screen.getByText(/sin datos/)).toBeTruthy()
  expect(screen.getByLabelText('Leyenda de coste mensual')).toBeTruthy()
})

test('sin sueldo, «Mi sueldo» está desactivado', () => {
  const onMode = vi.fn()
  render(<Legend mode="cost" salaryReady={false} onMode={onMode} />)
  const btn = screen.getByRole('button', { name: 'Mi sueldo' }) as HTMLButtonElement
  expect(btn.disabled).toBe(true)
  fireEvent.click(btn)
  expect(onMode).not.toHaveBeenCalled()
})

test('con sueldo se puede cambiar de modo y la leyenda cambia a capacidad', () => {
  const onMode = vi.fn()
  const { rerender } = render(<Legend mode="cost" salaryReady onMode={onMode} />)
  fireEvent.click(screen.getByRole('button', { name: 'Mi sueldo' }))
  expect(onMode).toHaveBeenCalledWith('salary')

  rerender(<Legend mode="salary" salaryReady onMode={onMode} />)
  expect(screen.getByLabelText('Leyenda de capacidad')).toBeTruthy()
  expect(screen.getByTestId('legend-min').textContent).toBe('No llega')
  expect(screen.getByRole('button', { name: 'Mi sueldo' }).getAttribute('aria-pressed')).toBe('true')
  fireEvent.click(screen.getByRole('button', { name: 'Coste' }))
  expect(onMode).toHaveBeenCalledWith('cost')
})

test('modo «Mi sueldo» sin sueldo escrito vuelve a la leyenda de coste', () => {
  render(<Legend mode="salary" salaryReady={false} onMode={() => {}} />)
  expect(screen.getByLabelText('Leyenda de coste mensual')).toBeTruthy()
})
