import { render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import App from './App'

// jsdom no tiene WebGL: el globo real se comprueba en e2e.
vi.mock('./GlobeView', () => ({ default: () => <div data-testid="globe" /> }))

afterEach(() => vi.unstubAllGlobals())

test('muestra el nombre, el globo, el buscador, la leyenda y el aviso de datos ilustrativos', () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ features: [] }) }))
  render(<App />)
  expect(screen.getByRole('heading', { name: 'CLG' })).toBeTruthy()
  expect(screen.getByTestId('globe')).toBeTruthy()
  expect(screen.getByRole('combobox', { name: 'Buscar país o ciudad' })).toBeTruthy()
  expect(screen.getByLabelText('Leyenda de coste mensual')).toBeTruthy()
  expect(screen.getByText(/Datos ilustrativos/)).toBeTruthy()
})
