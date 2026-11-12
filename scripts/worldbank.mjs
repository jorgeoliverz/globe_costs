// Lógica pura (sin red) para convertir las respuestas del Banco Mundial en el
// JSON local de la app. La descarga vive en fetch-worldbank.mjs.

export const SOURCE = 'World Bank Open Data (CC BY 4.0)'

/** Quita agregados (mundo, regiones…) y deja solo países. Devuelve un Set de códigos ISO3. */
export function countryCodes(countryList) {
  return new Set(countryList.filter((c) => c.region?.id !== 'NA').map((c) => c.id))
}

/** Indexa filas de un indicador como { ISO3: { año: valor } }, ignorando nulos. */
export function byCountryYear(rows, codes) {
  const out = {}
  for (const r of rows ?? []) {
    const iso = r.countryiso3code
    if (!codes.has(iso) || typeof r.value !== 'number' || !Number.isFinite(r.value)) continue
    const year = Number(r.date)
    if (!Number.isInteger(year)) continue
    ;(out[iso] ??= {})[year] = r.value
  }
  return out
}

/** Último valor de cada país: { ISO3: { value, year } }. */
export function latestByCountry(indexed) {
  const out = {}
  for (const [iso, years] of Object.entries(indexed)) {
    const year = Math.max(...Object.keys(years).map(Number))
    out[iso] = { value: years[year], year }
  }
  return out
}

/**
 * Nivel de precios respecto a EE. UU. (EE. UU. = 100):
 * factor PPA del consumo ÷ tipo de cambio oficial × 100, usando el último
 * año en que existen ambos datos para el país.
 */
export function priceLevels(ppp, fx) {
  const out = {}
  for (const [iso, pppYears] of Object.entries(ppp)) {
    const years = Object.keys(pppYears)
      .map(Number)
      .filter((y) => fx[iso]?.[y] > 0)
    if (years.length === 0) continue
    const year = Math.max(...years)
    out[iso] = { value: (pppYears[year] / fx[iso][year]) * 100, year }
  }
  return out
}

const round = (n, decimals) => Number(n.toFixed(decimals))

/** Une los indicadores en { generated, source, countries: { ISO3: { priceLevel?, inflation?, gdpPpp? } } }. */
export function buildDataset({ priceLevel, inflation, gdpPpp }, generated) {
  const countries = {}
  const add = (iso, key, entry, decimals) => {
    ;(countries[iso] ??= {})[key] = { value: round(entry.value, decimals), year: entry.year }
  }
  for (const [iso, e] of Object.entries(priceLevel)) add(iso, 'priceLevel', e, 1)
  for (const [iso, e] of Object.entries(inflation)) add(iso, 'inflation', e, 1)
  for (const [iso, e] of Object.entries(gdpPpp)) add(iso, 'gdpPpp', e, 0)
  const sorted = Object.fromEntries(Object.entries(countries).sort(([a], [b]) => a.localeCompare(b)))
  return { generated, source: SOURCE, countries: sorted }
}
