import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import CountryPanel from './CountryPanel'
import type { Country } from './types'

const country = (iso: string, name: string): Country => ({
  properties: { NAME: name, ISO_A3: iso, ADM0_A3: iso },
  geometry: { type: 'Polygon', coordinates: [] },
})
const norm = (s: string | null) => (s ?? '').replace(/\s/g, ' ')
const noop = () => {}

test('muestra los importes de España y el total 1.195 €', () => {
  render(<CountryPanel country={country('ESP', 'Spain')} onClose={noop} onSelectCity={noop} />)
  expect(screen.getByRole('heading', { name: 'España' })).toBeTruthy()
  expect(norm(screen.getByText('Alquiler mensual').nextElementSibling!.textContent)).toBe('900 €')
  expect(norm(screen.getByText('Comida mensual').nextElementSibling!.textContent)).toBe('250 €')
  expect(norm(screen.getByText('Transporte').nextElementSibling!.textContent)).toBe('45 €')
  expect(norm(screen.getByText('Presupuesto total').nextElementSibling!.textContent)).toBe('1.195 €')
})

test('un país sin datos muestra su nombre y "Sin datos", sin cifras ni ciudades', () => {
  render(<CountryPanel country={country('RUS', 'Russia')} onClose={noop} onSelectCity={noop} />)
  expect(screen.getByRole('heading', { name: 'Russia' })).toBeTruthy()
  expect(screen.getByText(/Sin datos/)).toBeTruthy()
  expect(screen.queryByText('Presupuesto total')).toBeNull()
  expect(screen.queryByText('Ciudades principales')).toBeNull()
})

test('la X y Escape cierran el panel', () => {
  const onClose = vi.fn()
  render(<CountryPanel country={country('ESP', 'Spain')} onClose={onClose} onSelectCity={noop} />)
  fireEvent.click(screen.getByRole('button', { name: 'Cerrar panel' }))
  expect(onClose).toHaveBeenCalledTimes(1)
  fireEvent.keyDown(window, { key: 'Escape' })
  expect(onClose).toHaveBeenCalledTimes(2)
})

test('lista las 5 ciudades de España y avisa al elegir una', () => {
  const onSelectCity = vi.fn()
  render(<CountryPanel country={country('ESP', 'Spain')} onClose={noop} onSelectCity={onSelectCity} />)
  expect(screen.getAllByRole('listitem')).toHaveLength(5)
  fireEvent.click(screen.getByRole('button', { name: /Madrid/ }))
  expect(onSelectCity).toHaveBeenCalledWith(expect.objectContaining({ name: 'Madrid', iso: 'ESP' }))
})
