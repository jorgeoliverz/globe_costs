import { COLOR_STOPS, COSTS, costColor, totalCost, type CountryCost } from './cost'

type Budget = Pick<CountryCost, 'rent' | 'food' | 'transport'>

/** Si te sobra al menos esta parte del sueldo, el color llega al verde del todo. */
export const FULL_SHARE = 0.6

/** Lo que te sobra (o te falta, si es negativo) al mes: sueldo menos alquiler, comida y transporte. */
export function monthlyLeft(salary: number, cost: Budget): number {
  return salary - totalCost(cost)
}

export function describeLeft(left: number): { label: 'Te sobran' | 'Te faltan'; amount: number } {
  return left >= 0 ? { label: 'Te sobran', amount: left } : { label: 'Te faltan', amount: -left }
}

export interface Ranked {
  cost: CountryCost
  left: number
}

/** Países ordenados por lo que te sobra con ese sueldo, de más a menos. */
export function rankCountries(salary: number, costs: CountryCost[] = COSTS): Ranked[] {
  return costs
    .map((cost) => ({ cost, left: monthlyLeft(salary, cost) }))
    .sort((a, b) => b.left - a.left || a.cost.name.localeCompare(b.cost.name, 'es'))
}

/** Rojo si no llega, amarillo a medias, verde si sobra el 60 % del sueldo o más. */
export function leftColor(salary: number, total: number): string {
  const share = (salary - total) / salary
  const t = Math.min(1, Math.max(0, share / FULL_SHARE))
  return costColor(1 - t, 0, 1)
}

/** La misma escala de color, de «no llega» (rojo) a «sobra mucho» (verde). */
export const LEFT_GRADIENT = `linear-gradient(to right, ${[...COLOR_STOPS]
  .reverse()
  .map((c) => `rgb(${c.join(',')})`)
  .join(', ')})`
