import type { City } from './lib/cities'
import { formatEuro, totalCost } from './lib/cost'
import { useEscape } from './useEscape'

interface Props {
  city: City
  countryName: string
  onBack: () => void
  onClose: () => void
}

export default function CityPanel({ city, countryName, onBack, onClose }: Props) {
  useEscape(onClose)

  return (
    <aside className="panel" data-testid="city-panel" aria-label="Detalle de la ciudad">
      <button className="panel-close" onClick={onClose} aria-label="Cerrar panel">
        ×
      </button>
      <button className="panel-back" onClick={onBack}>
        ← {countryName}
      </button>
      <h2>{city.name}</h2>
      <dl>
        <dt>Alquiler mensual</dt>
        <dd>{formatEuro(city.rent)}</dd>
        <dt>Comida mensual</dt>
        <dd>{formatEuro(city.food)}</dd>
        <dt>Transporte</dt>
        <dd>{formatEuro(city.transport)}</dd>
        <dt className="total">Presupuesto total</dt>
        <dd className="total">{formatEuro(totalCost(city))}</dd>
      </dl>
    </aside>
  )
}
