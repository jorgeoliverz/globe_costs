import costsData from '../data/costs.json'

export interface CountryCost {
  iso: string
  name: string
  rent: number
  food: number
  transport: number
  /** Sueldo neto medio mensual en euros (dato ilustrativo). */
  salary: number
}

export const COSTS: CountryCost[] = costsData

// Verde (barato) → amarillo → rojo (caro).
export const COLOR_STOPS: [number, number, number][] = [
  [47, 191, 113],
  [242, 201, 76],
  [229, 72, 77],
]
export const COLOR_ALPHA = 0.6
export const NO_DATA_COLOR = 'rgba(150, 150, 150, 0.15)'

export function totalCost(c: Pick<CountryCost, 'rent' | 'food' | 'transport'>): number {
  return c.rent + c.food + c.transport
}

export function findCost(iso: string, costs: CountryCost[] = COSTS): CountryCost | null {
  return costs.find((c) => c.iso === iso) ?? null
}

export function costRange(costs: CountryCost[] = COSTS): { min: number; max: number } {
  const totals = costs.map(totalCost)
  return { min: Math.min(...totals), max: Math.max(...totals) }
}

export function costColor(total: number | null, min: number, max: number): string {
  if (total === null) return NO_DATA_COLOR
  const t = max === min ? 0 : Math.min(1, Math.max(0, (total - min) / (max - min)))
  const pos = t * (COLOR_STOPS.length - 1)
  const i = Math.min(Math.floor(pos), COLOR_STOPS.length - 2)
  const f = pos - i
  const [r, g, b] = COLOR_STOPS[i].map((v, k) => Math.round(v + (COLOR_STOPS[i + 1][k] - v) * f))
  return `rgba(${r}, ${g}, ${b}, ${COLOR_ALPHA})`
}

export function formatEuro(n: number): string {
  // Agrupación manual: Intl en es-ES no agrupa los números de 4 cifras (1450).
  return `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}\u00a0€`
}
