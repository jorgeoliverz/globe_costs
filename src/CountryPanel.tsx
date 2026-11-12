import CostList from './CostList'
import PanelShell from './PanelShell'
import RealDataBlock from './RealDataBlock'
import type { Country } from './types'
import { citiesOf, type City } from './lib/cities'
import { describeLeft, monthlyLeft } from './lib/affordability'
import { findCost, formatEuro, totalCost, type CountryCost } from './lib/cost'
import { useEscape } from './useEscape'

interface Props {
  country: Country
  onClose: () => void
  onSelectCity: (city: City) => void
  /** Sueldo del usuario en la calculadora (0 si no lo ha escrito). */
  salary?: number
}

export default function CountryPanel({ country, onClose, onSelectCity, salary = 0 }: Props) {
  const cost = findCost(country.properties.ADM0_A3)
  const cities = citiesOf(country.properties.ADM0_A3)
  useEscape(onClose)

  return (
    <PanelShell testId="country-panel" label="Detalle del país" onClose={onClose}>
      <h2 className="mb-3 mr-7 mt-0 font-display text-xl font-bold">{cost?.name ?? country.properties.NAME}</h2>
      {cost ? <CostList cost={cost} /> : <p className="m-0 opacity-75">Sin datos ilustrativos para este país.</p>}
      {cost && <SalaryRows cost={cost} salary={salary} />}
      <RealDataBlock iso={country.properties.ADM0_A3} />
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

function SalaryRows({ cost, salary }: { cost: CountryCost; salary: number }) {
  const average = monthlyLeft(cost.salary, cost)
  const mine = describeLeft(monthlyLeft(salary, cost))
  return (
    <dl className="m-0 mt-3 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5" data-testid="salary-rows">
      <dt>Sueldo medio</dt>
      <dd className="m-0 text-right tabular-nums">{formatEuro(cost.salary)}</dd>
      <dt>{average >= 0 ? 'Sobra de media' : 'Falta de media'}</dt>
      <dd className="m-0 text-right tabular-nums">{formatEuro(Math.abs(average))}</dd>
      {salary > 0 && (
        <>
          <dt className="font-semibold text-accent">Con tu sueldo</dt>
          <dd className="m-0 text-right font-semibold tabular-nums text-accent">
            {mine.label.toLowerCase()} {formatEuro(mine.amount)}
          </dd>
        </>
      )}
    </dl>
  )
}
