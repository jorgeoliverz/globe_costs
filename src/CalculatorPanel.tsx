import PanelShell from './PanelShell'
import { citiesOf } from './lib/cities'
import { describeLeft, monthlyLeft, rankCountries } from './lib/affordability'
import { COSTS, findCost, formatEuro, totalCost } from './lib/cost'
import { useEscape } from './useEscape'

const TOP = 10
const FIELD =
  'box-border w-full rounded-lg border border-accent/35 bg-night px-3 py-2 text-inherit outline-none focus:border-accent'
const LABEL = 'mb-1 mt-3 block font-mono text-[10px] uppercase tracking-wider opacity-70'

const sorted = [...COSTS].sort((a, b) => a.name.localeCompare(b.name, 'es'))

interface Props {
  salary: number
  countryIso: string
  onSalary: (salary: number) => void
  onCountry: (iso: string) => void
  onPickCountry: (iso: string) => void
  onClose: () => void
}

const signed = (left: number) => `${left >= 0 ? '+' : '−'}${formatEuro(Math.abs(left))}`
const tone = (left: number) => (left >= 0 ? 'text-emerald-300' : 'text-rose-300')

export default function CalculatorPanel({ salary, countryIso, onSalary, onCountry, onPickCountry, onClose }: Props) {
  useEscape(onClose)
  const cost = findCost(countryIso)

  return (
    <PanelShell testId="calculator-panel" label="Calculadora de sueldo" onClose={onClose}>
      <h2 className="mb-1 mr-7 mt-0 font-display text-xl font-bold">¿Cuánto puedo vivir con mi sueldo?</h2>

      <label className={LABEL} htmlFor="calc-salary">
        Tu sueldo neto mensual (€)
      </label>
      <input
        id="calc-salary"
        className={FIELD}
        type="number"
        inputMode="numeric"
        min={0}
        step={50}
        placeholder="2000"
        value={salary > 0 ? salary : ''}
        onChange={(e) => onSalary(Math.max(0, Number(e.target.value) || 0))}
      />

      <label className={LABEL} htmlFor="calc-country">
        País
      </label>
      <select id="calc-country" className={FIELD} value={countryIso} onChange={(e) => onCountry(e.target.value)}>
        <option value="">Todos los países</option>
        {sorted.map((c) => (
          <option key={c.iso} value={c.iso}>
            {c.name}
          </option>
        ))}
      </select>

      {salary <= 0 && <p className="mb-0 mt-4 opacity-75">Escribe tu sueldo para ver cuánto te sobra.</p>}

      {salary > 0 && !cost && (
        <>
          <h3 className="mb-1.5 mt-4 font-mono text-xs font-normal uppercase tracking-wider opacity-70">
            Donde más te sobra
          </h3>
          <ol className="m-0 list-none p-0" data-testid="ranking">
            {rankCountries(salary)
              .slice(0, TOP)
              .map(({ cost: c, left }) => (
                <li key={c.iso}>
                  <button
                    className="flex w-full cursor-pointer justify-between rounded-md border-0 bg-transparent px-2 py-1.5 text-left text-inherit hover:bg-accent/15"
                    onClick={() => onPickCountry(c.iso)}
                  >
                    <span>{c.name}</span>
                    <span className={tone(left)}>{signed(left)}</span>
                  </button>
                </li>
              ))}
          </ol>
        </>
      )}

      {salary > 0 && cost && (
        <>
          <dl className="m-0 mt-4 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5">
            <dt>Sueldo medio del país</dt>
            <dd className="m-0 text-right tabular-nums">{formatEuro(cost.salary)}</dd>
            <dt>Coste mensual</dt>
            <dd className="m-0 text-right tabular-nums">{formatEuro(totalCost(cost))}</dd>
          </dl>
          <Result left={monthlyLeft(salary, cost)} />
          <h3 className="mb-1.5 mt-4 font-mono text-xs font-normal uppercase tracking-wider opacity-70">
            Por ciudad
          </h3>
          <ul className="m-0 list-none p-0">
            {citiesOf(cost.iso).map((city) => {
              const left = monthlyLeft(salary, city)
              return (
                <li key={city.name} className="flex justify-between px-2 py-1.5">
                  <span>{city.name}</span>
                  <span className={`tabular-nums ${tone(left)}`}>{signed(left)}</span>
                </li>
              )
            })}
          </ul>
        </>
      )}

      <p className="mb-0 mt-4 text-xs opacity-60">
        Estimación: tu sueldo menos alquiler, comida y transporte. No incluye ocio, ahorro ni impuestos.
      </p>
    </PanelShell>
  )
}

function Result({ left }: { left: number }) {
  const { label, amount } = describeLeft(left)
  return (
    <p
      className={`mb-0 mt-3 rounded-lg bg-white/5 px-3 py-2 text-lg font-bold ${tone(left)}`}
      data-testid="calc-result"
    >
      {label} {formatEuro(amount)}
    </p>
  )
}
