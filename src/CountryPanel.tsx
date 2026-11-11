import { useEffect } from 'react'
import type { Country } from './types'
import { findCost, formatEuro, totalCost } from './lib/cost'

interface Props {
  country: Country
  onClose: () => void
}

export default function CountryPanel({ country, onClose }: Props) {
  const cost = findCost(country.properties.ADM0_A3)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

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
    </aside>
  )
}
