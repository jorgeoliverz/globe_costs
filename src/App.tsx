import { useState } from 'react'
import CountryPanel from './CountryPanel'
import GlobeView from './GlobeView'
import Legend from './Legend'
import type { Country } from './types'

export default function App() {
  const [selected, setSelected] = useState<Country | null>(null)

  return (
    <main>
      <GlobeView selected={selected} onSelect={setSelected} />
      <header className="brand">
        <h1>CLG</h1>
        <p>Cost of Living Globe</p>
      </header>
      <Legend />
      <p className="disclaimer">Datos ilustrativos, no estadísticas actuales.</p>
      {selected && <CountryPanel country={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}
