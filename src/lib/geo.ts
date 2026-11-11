import type { Country } from '../types'

type Ring = number[][] // [lng, lat][]

function outerRings(country: Country): Ring[] {
  const { type, coordinates } = country.geometry
  if (type === 'Polygon') return [(coordinates as Ring[])[0]]
  if (type === 'MultiPolygon') return (coordinates as Ring[][]).map((poly) => poly[0])
  return []
}

/** Centro de la caja del polígono más grande del país (evita territorios lejanos). */
export function countryCenter(country: Country): { lat: number; lng: number } {
  let best: { lat: number; lng: number; area: number } | null = null
  for (const ring of outerRings(country)) {
    const lngs = ring.map((p) => p[0])
    const lats = ring.map((p) => p[1])
    const [minLng, maxLng] = [Math.min(...lngs), Math.max(...lngs)]
    const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)]
    const area = (maxLng - minLng) * (maxLat - minLat)
    if (!best || area > best.area) {
      best = { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2, area }
    }
  }
  return best ? { lat: best.lat, lng: best.lng } : { lat: 0, lng: 0 }
}
