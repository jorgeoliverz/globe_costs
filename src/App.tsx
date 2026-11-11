import { useState } from 'react'
import CityPanel from './CityPanel'
import CountryPanel from './CountryPanel'
import GlobeView from './GlobeView'
import Legend from './Legend'
import type { City } from './lib/cities'
import { findCost } from './lib/cost'
import type { Country } from './types'

export default function App() {
  const [selected, setSelected] = useState<Country | null>(null)
  const [city, setCity] = useState<City | null>(null)

  const select = (country: Country | null, c: City | null = null) => {
    setSelected(country)
    setCity(c)
  }
  const close = () => select(null)

  return (
    <main>
      <GlobeView selected={selected} onSelect={select} />
      <header className="brand">
        <h1>CLG</h1>
        <p>Cost of Living Globe</p>
      </header>
      <Legend />
      <p className="disclaimer">Datos ilustrativos, no estadísticas actuales.</p>
      {selected && city && (
        <CityPanel
          city={city}
          countryName={findCost(selected.properties.ADM0_A3)?.name ?? selected.properties.NAME}
          onBack={() => setCity(null)}
          onClose={close}
        />
      )}
      {selected && !city && (
        <CountryPanel country={selected} onClose={close} onSelectCity={setCity} />
      )}
    </main>
  )
}
