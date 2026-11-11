import { useState } from 'react'
import CityPanel from './CityPanel'
import CountryPanel from './CountryPanel'
import GlobeView, { type FocusTarget } from './GlobeView'
import Legend from './Legend'
import SearchBox from './SearchBox'
import type { City } from './lib/cities'
import { findCost } from './lib/cost'
import { countryCenter } from './lib/geo'
import type { Place } from './lib/search'
import type { Country } from './types'
import { useCountries } from './useCountries'

export default function App() {
  const { countries } = useCountries()
  const [selected, setSelected] = useState<Country | null>(null)
  const [city, setCity] = useState<City | null>(null)
  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null)

  const select = (country: Country | null, c: City | null = null) => {
    setSelected(country)
    setCity(c)
  }
  const close = () => select(null)

  const pick = (place: Place) => {
    if (place.kind === 'city') {
      select(place.country, place.city)
      setFocusTarget({ lat: place.city.lat, lng: place.city.lng })
    } else {
      select(place.country)
      setFocusTarget(countryCenter(place.country))
    }
  }

  return (
    <main>
      <GlobeView countries={countries} selected={selected} focusTarget={focusTarget} onSelect={select} />
      <header className="brand">
        <h1>CLG</h1>
        <p>Cost of Living Globe</p>
      </header>
      <SearchBox countries={countries} onPick={pick} />
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
