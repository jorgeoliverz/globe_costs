import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import App from './App'

// jsdom no tiene WebGL: el globo real se comprueba en e2e.
vi.mock('./GlobeView', () => ({ default: () => <div data-testid="globe" /> }))

test('muestra el nombre, el globo, la leyenda y el aviso de datos ilustrativos', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: 'CLG' })).toBeTruthy()
  expect(screen.getByTestId('globe')).toBeTruthy()
  expect(screen.getByLabelText('Leyenda de coste mensual')).toBeTruthy()
  expect(screen.getByText(/Datos ilustrativos/)).toBeTruthy()
})
