import { useCallback, useState } from 'react'
import CityPanel from './CityPanel'
import CountryPanel from './CountryPanel'
import GlobeView, { type FocusTarget } from './GlobeView'
import Intro from './Intro'
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
  const [intro, setIntro] = useState<'cover' | 'launching' | 'done'>('cover')
  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null)

  const select = (country: Country | null, c: City | null = null) => {
    setSelected(country)
    setCity(c)
  }
  const close = () => select(null)
  const launch = useCallback(() => setIntro('launching'), [])
  const finishIntro = useCallback(() => setIntro('done'), [])

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
      <GlobeView
        countries={countries}
        selected={selected}
        focusTarget={focusTarget}
        intro={intro}
        onSelect={select}
      />
      {intro !== 'done' && <Intro phase={intro} onLaunch={launch} onDone={finishIntro} />}
      {intro === 'done' && (
        <div className="fade-in">
          <header className="pointer-events-none fixed left-4 top-3 md:top-4">
            <h1 className="m-0 font-display text-xl font-bold md:text-2xl">CLG</h1>
            <p className="m-0 font-mono text-[10px] uppercase tracking-wider opacity-70">Cost of Living Globe</p>
          </header>
          <SearchBox countries={countries} onPick={pick} />
          <Legend />
          <p className="fixed inset-x-0 bottom-0 z-10 m-0 bg-black/50 px-4 py-1.5 text-center font-mono text-[10px] uppercase tracking-wider opacity-80 md:inset-x-auto md:bottom-4 md:left-4 md:bg-transparent md:p-0 md:text-left">
            Datos ilustrativos, no estadísticas actuales.
          </p>
        </div>
      )}
      {intro === 'done' && selected && city && (
        <CityPanel
          city={city}
          countryName={findCost(selected.properties.ADM0_A3)?.name ?? selected.properties.NAME}
          onBack={() => setCity(null)}
          onClose={close}
        />
      )}
      {intro === 'done' && selected && !city && (
        <CountryPanel country={selected} onClose={close} onSelectCity={setCity} />
      )}
    </main>
  )
}
