import CostList from './CostList'
import PanelShell from './PanelShell'
import type { City } from './lib/cities'
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
    <PanelShell testId="city-panel" label="Detalle de la ciudad" onClose={onClose}>
      <button
        className="mb-2 cursor-pointer border-0 bg-transparent p-0 text-sm text-accent"
        onClick={onBack}
      >
        ← {countryName}
      </button>
      <h2 className="mb-3 mr-7 mt-0 font-display text-xl font-bold">{city.name}</h2>
      <CostList cost={city} />
    </PanelShell>
  )
}
