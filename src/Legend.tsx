import { COLOR_STOPS, COSTS, costRange, formatEuro } from './lib/cost'

const { min, max } = costRange(COSTS)
const gradient = `linear-gradient(to right, ${COLOR_STOPS.map((c) => `rgb(${c.join(',')})`).join(', ')})`

export default function Legend() {
  return (
    <aside
      className="fixed bottom-12 left-4 w-44 font-mono text-[10px] uppercase tracking-wider md:bottom-12 md:w-56"
      aria-label="Leyenda de coste mensual"
    >
      <div className="h-2.5 rounded-full" style={{ background: gradient }} />
      <div className="mt-1 flex justify-between opacity-85">
        <span data-testid="legend-min">{formatEuro(min)}</span>
        <span className="hidden md:inline">coste mensual</span>
        <span data-testid="legend-max">{formatEuro(max)}</span>
      </div>
      <div className="mt-1.5 opacity-70">
        <i className="mr-1 inline-block size-2.5 rounded-sm bg-gray-400/40 align-middle" /> sin datos
      </div>
    </aside>
  )
}
