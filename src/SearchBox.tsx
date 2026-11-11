import { useMemo, useState, type KeyboardEvent } from 'react'
import { searchPlaces, type Place } from './lib/search'
import type { Country } from './types'

interface Props {
  countries: Country[]
  onPick: (place: Place) => void
}

export default function SearchBox({ countries, onPick }: Props) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const results = useMemo(() => searchPlaces(query, countries), [query, countries])

  const pick = (place: Place) => {
    onPick(place)
    setQuery('')
    setActive(0)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && results.length) {
      e.preventDefault()
      setActive((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp' && results.length) {
      e.preventDefault()
      setActive((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter' && results[active]) {
      pick(results[active])
    } else if (e.key === 'Escape') {
      e.stopPropagation()
      setQuery('')
    }
  }

  return (
    <div className="fixed inset-x-4 top-16 z-20 md:inset-x-auto md:left-1/2 md:top-4 md:w-80 md:-translate-x-1/2">
      <input
        className="box-border w-full rounded-xl border border-accent/35 bg-panel px-3.5 py-2.5 text-inherit outline-none focus:border-accent"
        type="search"
        role="combobox"
        aria-expanded={results.length > 0}
        aria-controls="search-results"
        aria-label="Buscar país o ciudad"
        placeholder="Buscar país o ciudad…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setActive(0)
        }}
        onKeyDown={onKeyDown}
      />
      {results.length > 0 && (
        <ul
          id="search-results"
          role="listbox"
          className="m-0 mt-1 list-none rounded-xl border border-accent/35 bg-panel p-1"
        >
          {results.map((place, i) => (
            <li
              key={place.kind === 'city' ? `${place.city.iso}-${place.city.name}` : place.country.properties.ADM0_A3}
              role="option"
              className="flex cursor-pointer justify-between gap-3 rounded-md px-2.5 py-2 aria-selected:bg-accent/20"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault()
                pick(place)
              }}
            >
              <span>{place.label}</span>
              <small className="opacity-65">{place.sub}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
