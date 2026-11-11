import { useCallback, useState } from 'react'
import CalculatorPanel from './CalculatorPanel'
import CityPanel from './CityPanel'
import CountryPanel from './CountryPanel'
import GlobeView, { type FocusTarget } from './GlobeView'
import Intro from './Intro'
import Legend, { type ColorMode } from './Legend'
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

  const [calcOpen, setCalcOpen] = useState(false)
  const [salary, setSalary] = useState(0)
  const [calcIso, setCalcIso] = useState('')
  const [mode, setMode] = useState<ColorMode>('cost')

  // Elegir un país en el globo cierra la calculadora: solo hay un panel a la vez.
  const select = (country: Country | null, c: City | null = null) => {
    setSelected(country)
    setCity(c)
    if (country) setCalcOpen(false)
  }
  const openCalculator = () => {
    select(null)
    setCalcOpen(true)
  }
  const changeSalary = (value: number) => {
    // La primera vez que se escribe un sueldo, el globo pasa a colorearse por él.
    if (salary === 0 && value > 0) setMode('salary')
    setSalary(value)
  }
  const countryByIso = (iso: string) => countries.find((c) => c.properties.ADM0_A3 === iso)
  const chooseCalcCountry = (iso: string) => {
    setCalcIso(iso)
    const country = countryByIso(iso)
    if (country) setFocusTarget(countryCenter(country))
  }
  const pickFromRanking = (iso: string) => {
    const country = countryByIso(iso)
    if (!country) return
    select(country)
    setFocusTarget(countryCenter(country))
  }
  const colorSalary = mode === 'salary' && salary > 0 ? salary : null
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
        salary={colorSalary}
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
          <button
            className="fixed left-4 top-[7.25rem] z-10 cursor-pointer rounded-full border border-accent/50 bg-panel px-4 py-2 text-sm font-semibold text-accent transition duration-150 hover:-translate-y-0.5 hover:border-accent active:translate-y-0 md:top-20"
            onClick={openCalculator}
          >
            ¿Cuánto puedo vivir con mi sueldo?
          </button>
          <Legend mode={mode} salaryReady={salary > 0} onMode={setMode} />
          <p className="fixed inset-x-0 bottom-0 z-10 m-0 bg-black/50 px-4 py-1.5 text-center font-mono text-[10px] uppercase tracking-wider opacity-80 md:inset-x-auto md:bottom-4 md:left-4 md:bg-transparent md:p-0 md:text-left">
            Datos ilustrativos, no estadísticas actuales.
          </p>
        </div>
      )}
      {intro === 'done' && calcOpen && (
        <CalculatorPanel
          salary={salary}
          countryIso={calcIso}
          onSalary={changeSalary}
          onCountry={chooseCalcCountry}
          onPickCountry={pickFromRanking}
          onClose={() => setCalcOpen(false)}
        />
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
        <CountryPanel country={selected} onClose={close} onSelectCity={setCity} salary={salary} />
      )}
    </main>
  )
}
