import { formatEuro, totalCost } from './lib/cost'

const TOTAL = 'mt-1.5 border-t border-white/20 pt-2 font-bold text-accent'

export default function CostList({ cost }: { cost: { rent: number; food: number; transport: number } }) {
  return (
    <dl className="m-0 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5">
      <dt>Alquiler mensual</dt>
      <dd className="m-0 text-right tabular-nums">{formatEuro(cost.rent)}</dd>
      <dt>Comida mensual</dt>
      <dd className="m-0 text-right tabular-nums">{formatEuro(cost.food)}</dd>
      <dt>Transporte</dt>
      <dd className="m-0 text-right tabular-nums">{formatEuro(cost.transport)}</dd>
      <dt className={TOTAL}>Presupuesto total</dt>
      <dd className={`m-0 text-right tabular-nums ${TOTAL}`}>{formatEuro(totalCost(cost))}</dd>
    </dl>
  )
}
