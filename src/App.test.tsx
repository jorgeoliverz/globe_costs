import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import App from './App'

// jsdom no tiene WebGL: el globo real se comprueba en e2e.
vi.mock('./GlobeView', () => ({ default: () => <div data-testid="globe" /> }))

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ features: [] }) }))
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

const motion = (reduce: boolean) => vi.stubGlobal('matchMedia', () => ({ matches: reduce }))

test('al cargar se ve la portada y la interfaz aún no', () => {
  motion(false)
  render(<App />)
  expect(screen.getByTestId('globe')).toBeTruthy()
  expect(screen.getByRole('dialog')).toBeTruthy()
  expect(screen.queryByRole('combobox')).toBeNull()
  expect(screen.queryByLabelText('Leyenda de coste mensual')).toBeNull()
})

test('con movimiento reducido, «Empezar» deja ver nombre, buscador, leyenda y aviso', () => {
  motion(true)
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'Empezar a explorar' }))
  expect(screen.queryByRole('dialog')).toBeNull()
  expect(screen.getByRole('heading', { name: 'CLG' })).toBeTruthy()
  expect(screen.getByRole('combobox', { name: 'Buscar país o ciudad' })).toBeTruthy()
  expect(screen.getByLabelText('Leyenda de coste mensual')).toBeTruthy()
  expect(screen.getByText(/Datos ilustrativos, no estadísticas actuales/)).toBeTruthy()
})

test('con movimiento normal: cohete en vuelo y, al aterrizar, la interfaz', () => {
  vi.useFakeTimers()
  motion(false)
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'Empezar a explorar' }))
  expect(screen.getByTestId('rocket')).toBeTruthy()
  expect(screen.queryByRole('combobox')).toBeNull()
  act(() => {
    vi.advanceTimersByTime(3000)
  })
  expect(screen.queryByRole('dialog')).toBeNull()
  expect(screen.queryByTestId('rocket')).toBeNull()
  expect(screen.getByRole('combobox', { name: 'Buscar país o ciudad' })).toBeTruthy()
})
