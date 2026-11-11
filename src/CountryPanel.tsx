import CostList from './CostList'
import PanelShell from './PanelShell'
import type { Country } from './types'
import { citiesOf, type City } from './lib/cities'
import { findCost, formatEuro, totalCost } from './lib/cost'
import { useEscape } from './useEscape'

interface Props {
  country: Country
  onClose: () => void
  onSelectCity: (city: City) => void
}

export default function CountryPanel({ country, onClose, onSelectCity }: Props) {
  const cost = findCost(country.properties.ADM0_A3)
  const cities = citiesOf(country.properties.ADM0_A3)
  useEscape(onClose)

  return (
    <PanelShell testId="country-panel" label="Detalle del país" onClose={onClose}>
      <h2 className="mb-3 mr-7 mt-0 text-xl font-bold">{cost?.name ?? country.properties.NAME}</h2>
      {cost ? <CostList cost={cost} /> : <p className="m-0 opacity-75">Sin datos para este país.</p>}
      {cities.length > 0 && (
        <>
          <h3 className="mb-1.5 mt-4 font-mono text-xs font-normal uppercase tracking-wider opacity-70">
            Ciudades principales
          </h3>
          <ul className="m-0 list-none p-0">
            {cities.map((city) => (
              <li key={city.name}>
                <button
                  className="flex w-full cursor-pointer justify-between rounded-md border-0 bg-transparent px-2 py-1.5 text-left text-inherit hover:bg-accent/15"
                  onClick={() => onSelectCity(city)}
                >
                  <span>{city.name}</span>
                  <span>{formatEuro(totalCost(city))}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </PanelShell>
  )
}
