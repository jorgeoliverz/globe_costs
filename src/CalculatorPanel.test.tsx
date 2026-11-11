import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import CalculatorPanel from './CalculatorPanel'

const norm = (s: string | null) => (s ?? '').replace(/\s/g, ' ')
const noop = () => {}

function setup(salary: number, countryIso = '') {
  const handlers = { onSalary: vi.fn(), onCountry: vi.fn(), onPickCountry: vi.fn(), onClose: vi.fn() }
  render(<CalculatorPanel salary={salary} countryIso={countryIso} {...handlers} />)
  return handlers
}

test('sin sueldo pide que lo escribas y no muestra resultados', () => {
  setup(0)
  expect(screen.getByText(/Escribe tu sueldo/)).toBeTruthy()
  expect(screen.queryByTestId('ranking')).toBeNull()
  expect(screen.queryByTestId('calc-result')).toBeNull()
})

test('escribir el sueldo avisa con un número y nunca negativo', () => {
  const { onSalary } = setup(0)
  const input = screen.getByLabelText('Tu sueldo neto mensual (€)')
  fireEvent.change(input, { target: { value: '2000' } })
  expect(onSalary).toHaveBeenLastCalledWith(2000)
  fireEvent.change(input, { target: { value: '-50' } })
  expect(onSalary).toHaveBeenLastCalledWith(0)
})

test('con 2.000 € en España: te sobran 805 € y 5 ciudades con su resta', () => {
  setup(2000, 'ESP')
  expect(norm(screen.getByTestId('calc-result').textContent)).toBe('Te sobran 805 €')
  expect(screen.getByText('Sueldo medio del país').nextElementSibling!.textContent).toMatch(/1\.900/)
  const rows = screen.getAllByRole('listitem')
  expect(rows).toHaveLength(5)
  expect(norm(within(rows[0]).getByText(/Madrid/).parentElement!.textContent)).toBe('Madrid+600 €')
})

test('con 500 € en España: te faltan 695 € y las ciudades salen en negativo', () => {
  setup(500, 'ESP')
  expect(norm(screen.getByTestId('calc-result').textContent)).toBe('Te faltan 695 €')
  expect(norm(screen.getAllByRole('listitem')[0].textContent)).toContain('−')
})

test('sin país elegido muestra el ranking de 10 y un clic elige el país', () => {
  const { onPickCountry } = setup(2000)
  const items = within(screen.getByTestId('ranking')).getAllByRole('listitem')
  expect(items).toHaveLength(10)
  expect(items[0].textContent).toContain('Egipto')
  fireEvent.click(within(items[0]).getByRole('button'))
  expect(onPickCountry).toHaveBeenCalledWith('EGY')
})

test('cambiar el país avisa y la X y Escape cierran', () => {
  const { onCountry, onClose } = setup(2000)
  fireEvent.change(screen.getByLabelText('País'), { target: { value: 'JPN' } })
  expect(onCountry).toHaveBeenCalledWith('JPN')
  fireEvent.click(screen.getByRole('button', { name: 'Cerrar panel' }))
  fireEvent.keyDown(window, { key: 'Escape' })
  expect(onClose).toHaveBeenCalledTimes(2)
})

test('incluye la nota de que es una estimación', () => {
  setup(2000)
  expect(screen.getByText(/No incluye ocio, ahorro ni impuestos/)).toBeTruthy()
  noop()
})
