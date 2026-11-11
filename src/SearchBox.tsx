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
    <div className="search">
      <input
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
        <ul id="search-results" role="listbox">
          {results.map((place, i) => (
            <li
              key={place.kind === 'city' ? `${place.city.iso}-${place.city.name}` : place.country.properties.ADM0_A3}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault()
                pick(place)
              }}
            >
              <span>{place.label}</span>
              <small>{place.sub}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
