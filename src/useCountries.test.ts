import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { useCountries } from './useCountries'

afterEach(() => vi.unstubAllGlobals())

test('devuelve los países cuando el fetch responde bien', async () => {
  const features = [{ properties: { NAME: 'Spain', ISO_A3: 'ESP', ADM0_A3: 'ESP' }, geometry: {} }]
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ features }) }))
  const { result } = renderHook(() => useCountries())
  await waitFor(() => expect(result.current.countries).toHaveLength(1))
  expect(result.current.countries[0].properties.NAME).toBe('Spain')
  expect(result.current.error).toBeNull()
})

test('devuelve un error cuando el fetch falla', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }))
  const { result } = renderHook(() => useCountries())
  await waitFor(() => expect(result.current.error).toBe('HTTP 404'))
  expect(result.current.countries).toEqual([])
})
