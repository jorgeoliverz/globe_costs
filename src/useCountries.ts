import { useEffect, useState } from 'react'
import type { Country } from './types'

export const COUNTRIES_URL = '/data/countries.geojson'

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(COUNTRIES_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: { features: Country[] }) => {
        if (!cancelled) setCountries(data.features)
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { countries, error }
}
