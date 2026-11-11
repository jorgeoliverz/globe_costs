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
    <aside className="panel" data-testid="country-panel" aria-label="Detalle del país">
      <button className="panel-close" onClick={onClose} aria-label="Cerrar panel">
        ×
      </button>
      <h2>{cost?.name ?? country.properties.NAME}</h2>
      {cost ? (
        <dl>
          <dt>Alquiler mensual</dt>
          <dd>{formatEuro(cost.rent)}</dd>
          <dt>Comida mensual</dt>
          <dd>{formatEuro(cost.food)}</dd>
          <dt>Transporte</dt>
          <dd>{formatEuro(cost.transport)}</dd>
          <dt className="total">Presupuesto total</dt>
          <dd className="total">{formatEuro(totalCost(cost))}</dd>
        </dl>
      ) : (
        <p>Sin datos para este país.</p>
      )}
      {cities.length > 0 && (
        <>
          <h3>Ciudades principales</h3>
          <ul className="city-list">
            {cities.map((city) => (
              <li key={city.name}>
                <button onClick={() => onSelectCity(city)}>
                  <span>{city.name}</span>
                  <span>{formatEuro(totalCost(city))}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  )
}
