import GlobeView from './GlobeView'
import Legend from './Legend'

export default function App() {
  return (
    <main>
      <GlobeView />
      <header className="brand">
        <h1>CLG</h1>
        <p>Cost of Living Globe</p>
      </header>
      <Legend />
      <p className="disclaimer">Datos ilustrativos, no estadísticas actuales.</p>
    </main>
  )
}
