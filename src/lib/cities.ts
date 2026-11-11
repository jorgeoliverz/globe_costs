import citiesData from '../data/cities.json'
import type { CountryCost } from './cost'

export interface City extends Pick<CountryCost, 'rent' | 'food' | 'transport'> {
  iso: string
  name: string
  lat: number
  lng: number
}

type RawCity = Omit<City, 'iso'>
const RAW: Record<string, RawCity[]> = citiesData

export const CITIES_PER_COUNTRY = 5

export function citiesOf(iso: string): City[] {
  return (RAW[iso] ?? []).map((c) => ({ ...c, iso }))
}

export function allCities(): City[] {
  return Object.keys(RAW).flatMap(citiesOf)
}
