import { COLOR_STOPS, COSTS, costRange, formatEuro } from './lib/cost'

const { min, max } = costRange(COSTS)
const gradient = `linear-gradient(to right, ${COLOR_STOPS.map((c) => `rgb(${c.join(',')})`).join(', ')})`

export default function Legend() {
  return (
    <aside className="legend" aria-label="Leyenda de coste mensual">
      <div className="legend-bar" style={{ background: gradient }} />
      <div className="legend-labels">
        <span data-testid="legend-min">{formatEuro(min)}</span>
        <span>coste mensual</span>
        <span data-testid="legend-max">{formatEuro(max)}</span>
      </div>
      <div className="legend-nodata">
        <i /> sin datos
      </div>
    </aside>
  )
}
