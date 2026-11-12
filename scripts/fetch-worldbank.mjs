// Descarga datos públicos del Banco Mundial y escribe src/data/worldbank.json.
// Uso: node scripts/fetch-worldbank.mjs   (solo lectura, sin claves ni datos personales)
import { writeFile } from 'node:fs/promises'
import { buildDataset, byCountryYear, countryCodes, latestByCountry, priceLevels } from './worldbank.mjs'

const API = 'https://api.worldbank.org/v2'
const OUT = new URL('../src/data/worldbank.json', import.meta.url)

async function getJson(path) {
  const res = await fetch(`${API}/${path}${path.includes('?') ? '&' : '?'}format=json&per_page=20000`)
  if (!res.ok) throw new Error(`Banco Mundial respondió ${res.status} en ${path}`)
  const body = await res.json()
  if (!Array.isArray(body) || !Array.isArray(body[1])) {
    throw new Error(`Respuesta inesperada en ${path}: ${JSON.stringify(body).slice(0, 200)}`)
  }
  return body[1]
}

const indicator = (code, query) => getJson(`country/all/indicator/${code}?${query}`)

const year = new Date().getFullYear()
const codes = countryCodes(await getJson('country'))
const [ppp, fx, inflation, gdp] = await Promise.all([
  indicator('PA.NUS.PRVT.PP', `date=${year - 10}:${year}`),
  indicator('PA.NUS.FCRF', `date=${year - 10}:${year}`),
  indicator('FP.CPI.TOTL.ZG', 'mrnev=1'),
  indicator('NY.GDP.PCAP.PP.CD', 'mrnev=1'),
])

const dataset = buildDataset(
  {
    priceLevel: priceLevels(byCountryYear(ppp, codes), byCountryYear(fx, codes)),
    inflation: latestByCountry(byCountryYear(inflation, codes)),
    gdpPpp: latestByCountry(byCountryYear(gdp, codes)),
  },
  new Date().toISOString().slice(0, 10),
)

await writeFile(OUT, JSON.stringify(dataset, null, 1) + '\n')
console.log(`Escrito ${OUT.pathname}: ${Object.keys(dataset.countries).length} países`)
