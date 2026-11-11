import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import SearchBox from './SearchBox'
import type { Country } from './types'

const country = (iso: string, name: string): Country => ({
  properties: { NAME: name, ISO_A3: iso, ADM0_A3: iso },
  geometry: { type: 'Polygon', coordinates: [] },
})
const countries = [country('ESP', 'Spain'), country('CHE', 'Switzerland'), country('RUS', 'Russia')]

const type = (value: string) =>
  fireEvent.change(screen.getByRole('combobox'), { target: { value } })

test('escribir muestra resultados, incluidas ciudades', () => {
  render(<SearchBox countries={countries} onPick={() => {}} />)
  type('zur')
  expect(screen.getByRole('option', { name: /Zúrich/ })).toBeTruthy()
})

test('flechas y Enter eligen un resultado y vacían el campo', () => {
  const onPick = vi.fn()
  render(<SearchBox countries={countries} onPick={onPick} />)
  type('espa')
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
  expect(onPick).toHaveBeenCalledTimes(1)
  expect(onPick.mock.calls[0][0]).toMatchObject({ kind: 'country', label: 'España' })
  expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('')

  type('a')
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' })
  expect(screen.getAllByRole('option')[1].getAttribute('aria-selected')).toBe('true')
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowUp' })
  expect(screen.getAllByRole('option')[0].getAttribute('aria-selected')).toBe('true')
})

test('elegir con el ratón llama a onPick', () => {
  const onPick = vi.fn()
  render(<SearchBox countries={countries} onPick={onPick} />)
  type('madrid')
  fireEvent.mouseDown(screen.getByRole('option', { name: /Madrid/ }))
  expect(onPick.mock.calls[0][0]).toMatchObject({ kind: 'city', label: 'Madrid' })
})

test('Escape vacía el campo y sin coincidencias no hay lista', () => {
  render(<SearchBox countries={countries} onPick={() => {}} />)
  type('qqqq')
  expect(screen.queryByRole('listbox')).toBeNull()
  type('esp')
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' })
  expect((screen.getByRole('combobox') as HTMLInputElement).value).toBe('')
})
