import type { Country } from '../types'
import { citiesOf, type City } from './cities'
import { findCost } from './cost'

export const MAX_RESULTS = 8

export type Place =
  | { kind: 'country'; country: Country; label: string; sub: string }
  | { kind: 'city'; city: City; country: Country; label: string; sub: string }

export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

export function countryLabel(country: Country): string {
  return findCost(country.properties.ADM0_A3)?.name ?? country.properties.NAME
}

// 0 = empieza por la consulta, 1 = una palabra empieza por ella, 2 = la contiene.
function score(name: string, q: string): number | null {
  const n = normalize(name)
  if (n.startsWith(q)) return 0
  if (n.split(/[\s-]+/).some((w) => w.startsWith(q))) return 1
  return n.includes(q) ? 2 : null
}

function best(names: string[], q: string): number | null {
  const scores = names.map((n) => score(n, q)).filter((s): s is number => s !== null)
  return scores.length ? Math.min(...scores) : null
}

export function searchPlaces(query: string, countries: Country[]): Place[] {
  const q = normalize(query)
  if (!q) return []

  const found: { place: Place; score: number }[] = []
  for (const country of countries) {
    const label = countryLabel(country)
    const cs = best([label, country.properties.NAME], q)
    if (cs !== null) found.push({ score: cs, place: { kind: 'country', country, label, sub: 'País' } })
    for (const city of citiesOf(country.properties.ADM0_A3)) {
      const ss = best([city.name], q)
      if (ss !== null) {
        found.push({ score: ss, place: { kind: 'city', city, country, label: city.name, sub: label } })
      }
    }
  }

  // A igual puntuación, primero los países y luego por orden alfabético.
  found.sort(
    (a, b) =>
      a.score - b.score ||
      Number(a.place.kind === 'city') - Number(b.place.kind === 'city') ||
      a.place.label.localeCompare(b.place.label, 'es'),
  )
  return found.slice(0, MAX_RESULTS).map((f) => f.place)
}
