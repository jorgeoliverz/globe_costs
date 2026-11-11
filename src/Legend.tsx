import { LEFT_GRADIENT, FULL_SHARE } from './lib/affordability'
import { COLOR_STOPS, COSTS, costRange, formatEuro } from './lib/cost'

const { min, max } = costRange(COSTS)
const COST_GRADIENT = `linear-gradient(to right, ${COLOR_STOPS.map((c) => `rgb(${c.join(',')})`).join(', ')})`

export type ColorMode = 'cost' | 'salary'

interface Props {
  mode: ColorMode
  /** Hay un sueldo escrito: sin él no se puede colorear por «Mi sueldo». */
  salaryReady: boolean
  onMode: (mode: ColorMode) => void
}

const BTN = 'cursor-pointer border-0 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-40'

export default function Legend({ mode, salaryReady, onMode }: Props) {
  const bySalary = mode === 'salary' && salaryReady
  const pill = (active: boolean) => `${BTN} ${active ? 'bg-accent text-night' : 'bg-white/10 text-inherit'}`

  return (
    <aside
      className="fixed bottom-12 left-4 w-44 font-mono text-[10px] uppercase tracking-wider md:bottom-12 md:w-56"
      aria-label={bySalary ? 'Leyenda de capacidad' : 'Leyenda de coste mensual'}
    >
      <div className="mb-2 inline-flex overflow-hidden rounded-full" role="group" aria-label="Colorear el globo por">
        <button className={pill(!bySalary)} aria-pressed={!bySalary} onClick={() => onMode('cost')}>
          Coste
        </button>
        <button
          className={pill(bySalary)}
          aria-pressed={bySalary}
          disabled={!salaryReady}
          title={salaryReady ? undefined : 'Escribe tu sueldo en la calculadora'}
          onClick={() => onMode('salary')}
        >
          Mi sueldo
        </button>
      </div>
      <div className="h-2.5 rounded-full" style={{ background: bySalary ? LEFT_GRADIENT : COST_GRADIENT }} />
      <div className="mt-1 flex justify-between opacity-85">
        {bySalary ? (
          <>
            <span data-testid="legend-min">No llega</span>
            <span data-testid="legend-max">Sobra {Math.round(FULL_SHARE * 100)} %</span>
          </>
        ) : (
          <>
            <span data-testid="legend-min">{formatEuro(min)}</span>
            <span className="hidden md:inline">coste mensual</span>
            <span data-testid="legend-max">{formatEuro(max)}</span>
          </>
        )}
      </div>
      <div className="mt-1.5 opacity-70">
        <i className="mr-1 inline-block size-2.5 rounded-sm bg-gray-400/40 align-middle" /> sin datos
      </div>
    </aside>
  )
}
