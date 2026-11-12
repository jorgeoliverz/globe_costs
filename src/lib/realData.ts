import worldbank from '../data/worldbank.json'

export interface Indicator {
  value: number
  year: number
}

export interface RealData {
  /** Nivel de precios respecto a EE. UU. (EE. UU. = 100). */
  priceLevel?: Indicator
  /** Inflación anual de precios al consumo, en %. */
  inflation?: Indicator
  /** PIB per cápita en paridad de poder adquisitivo, en dólares internacionales. */
  gdpPpp?: Indicator
}

export type RealDataset = Record<string, RealData>

export const REAL_DATA: RealDataset = worldbank.countries
export const REAL_DATA_SOURCE: string = worldbank.source
export const REAL_DATA_DATE: string = worldbank.generated

/** Códigos del GeoJSON que el Banco Mundial escribe de otra forma. */
const WORLD_BANK_CODE: Record<string, string> = { KOS: 'XKX', SDS: 'SSD', PSX: 'PSE' }

/** Datos reales de un país, o null si no hay ninguno. */
export function findRealData(iso: string, data: RealDataset = REAL_DATA): RealData | null {
  const d = data[WORLD_BANK_CODE[iso] ?? iso]
  return d && Object.keys(d).length > 0 ? d : null
}

/** «68,7» — una cifra con coma decimal española y los decimales indicados. */
export function formatDecimal(n: number, decimals = 1): string {
  return n.toFixed(decimals).replace('.', ',')
}

/** Dólares con miles separados por punto (Intl no agrupa 4 cifras en es-ES): 59.868 $. */
export function formatDollar(n: number): string {
  return `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}\u00a0$`
}

/** Frase corta que explica el nivel de precios respecto a EE. UU. */
export function describePriceLevel(level: number): string {
  const diff = Math.round(level - 100)
  if (diff === 0) return 'Igual que EE. UU.'
  return diff < 0 ? `${-diff} % más barato que EE. UU.` : `${diff} % más caro que EE. UU.`
}
