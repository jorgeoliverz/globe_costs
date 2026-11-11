import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import Intro from './Intro'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

const motion = (reduce: boolean) => vi.stubGlobal('matchMedia', () => ({ matches: reduce }))

test('la portada muestra el título, el subtítulo con los datos reales y el botón', () => {
  motion(false)
  render(<Intro phase="cover" onLaunch={() => {}} onDone={() => {}} />)
  expect(screen.getByRole('heading', { name: '¿Dónde vives mejor con tu dinero?' })).toBeTruthy()
  expect(screen.getByText(/35 países y 175 ciudades/)).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Empezar a explorar' })).toBeTruthy()
  expect(screen.getByText('Datos ilustrativos')).toBeTruthy()
  expect(screen.queryByTestId('rocket')).toBeNull()
})

test('pulsar el botón lanza el despegue', () => {
  motion(false)
  const onLaunch = vi.fn()
  const onDone = vi.fn()
  render(<Intro phase="cover" onLaunch={onLaunch} onDone={onDone} />)
  fireEvent.click(screen.getByRole('button', { name: 'Empezar a explorar' }))
  expect(onLaunch).toHaveBeenCalledTimes(1)
  expect(onDone).not.toHaveBeenCalled()
})

test('con movimiento reducido entra directamente, sin despegue', () => {
  motion(true)
  const onLaunch = vi.fn()
  const onDone = vi.fn()
  render(<Intro phase="cover" onLaunch={onLaunch} onDone={onDone} />)
  fireEvent.click(screen.getByRole('button', { name: 'Empezar a explorar' }))
  expect(onDone).toHaveBeenCalledTimes(1)
  expect(onLaunch).not.toHaveBeenCalled()
})

test('al despegar aparece el cohete y avisa al terminar el vuelo', () => {
  vi.useFakeTimers()
  motion(false)
  const onDone = vi.fn()
  render(<Intro phase="launching" onLaunch={() => {}} onDone={onDone} />)
  expect(screen.getByTestId('rocket')).toBeTruthy()
  expect(onDone).not.toHaveBeenCalled()
  act(() => {
    vi.advanceTimersByTime(3000)
  })
  expect(onDone).toHaveBeenCalledTimes(1)
})
