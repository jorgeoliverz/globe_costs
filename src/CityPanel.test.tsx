import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import CityPanel from './CityPanel'
import { citiesOf } from './lib/cities'

const madrid = citiesOf('ESP').find((c) => c.name === 'Madrid')!
const norm = (s: string | null) => (s ?? '').replace(/\s/g, ' ')

test('muestra los importes propios de la ciudad y su total', () => {
  render(<CityPanel city={madrid} countryName="España" onBack={() => {}} onClose={() => {}} />)
  expect(screen.getByRole('heading', { name: 'Madrid' })).toBeTruthy()
  expect(norm(screen.getByText('Alquiler mensual').nextElementSibling!.textContent)).toBe('1.080 €')
  expect(norm(screen.getByText('Presupuesto total').nextElementSibling!.textContent)).toBe('1.400 €')
})

test('el botón de volver y la X llaman a sus callbacks', () => {
  const onBack = vi.fn()
  const onClose = vi.fn()
  render(<CityPanel city={madrid} countryName="España" onBack={onBack} onClose={onClose} />)
  fireEvent.click(screen.getByRole('button', { name: /España/ }))
  expect(onBack).toHaveBeenCalledTimes(1)
  fireEvent.click(screen.getByRole('button', { name: 'Cerrar panel' }))
  expect(onClose).toHaveBeenCalledTimes(1)
})
