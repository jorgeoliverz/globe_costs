import {
  REAL_DATA_SOURCE,
  describePriceLevel,
  findRealData,
  formatDecimal,
  formatDollar,
} from './lib/realData'

const TITLE = 'mb-1.5 mt-4 font-mono text-xs font-normal uppercase tracking-wider opacity-70'

/** Cifras reales del Banco Mundial de un país, con el año de cada dato y la fuente. */
export default function RealDataBlock({ iso }: { iso: string }) {
  const data = findRealData(iso)

  return (
    <section data-testid="real-data" aria-label="Datos reales">
      <h3 className={TITLE}>Datos reales (Banco Mundial)</h3>
      {data ? (
        <dl className="m-0 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5">
          {data.priceLevel && (
            <>
              <dt>Nivel de precios</dt>
              <dd className="m-0 text-right tabular-nums">
                {formatDecimal(data.priceLevel.value)} · {data.priceLevel.year}
              </dd>
              <dd className="col-span-2 m-0 -mt-1 text-xs opacity-70">
                {describePriceLevel(data.priceLevel.value)} (EE. UU. = 100)
              </dd>
            </>
          )}
          {data.inflation && (
            <>
              <dt>Inflación anual</dt>
              <dd className="m-0 text-right tabular-nums">
                {formatDecimal(data.inflation.value)} % · {data.inflation.year}
              </dd>
            </>
          )}
          {data.gdpPpp && (
            <>
              <dt>PIB per cápita (PPA)</dt>
              <dd className="m-0 text-right tabular-nums">
                {formatDollar(data.gdpPpp.value)} · {data.gdpPpp.year}
              </dd>
            </>
          )}
        </dl>
      ) : (
        <p className="m-0 opacity-75">Sin datos reales para este país.</p>
      )}
      <p className="mb-0 mt-2 text-[10px] opacity-60">Fuente: {REAL_DATA_SOURCE}</p>
    </section>
  )
}
