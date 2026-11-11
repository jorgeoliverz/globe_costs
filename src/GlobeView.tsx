import { useEffect, useRef, useState } from 'react'
import Globe, { type GlobeMethods } from 'react-globe.gl'
import type { Country } from './types'
import { COSTS, costColor, costRange, findCost, totalCost } from './lib/cost'
import { useCountries } from './useCountries'

const { min, max } = costRange(COSTS)

function baseColor(country: Country): string {
  const cost = findCost(country.properties.ADM0_A3)
  return costColor(cost ? totalCost(cost) : null, min, max)
}

const HOVER_COLOR = 'rgba(94, 234, 212, 0.65)'

interface Props {
  selected: Country | null
  onSelect: (country: Country | null) => void
}

export default function GlobeView({ selected, onSelect }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const { countries } = useCountries()
  const countriesRef = useRef<Country[]>([])
  countriesRef.current = countries
  const [hovered, setHovered] = useState<Country | null>(null)
  const capColor = (d: object) => (d === hovered || d === selected ? HOVER_COLOR : baseColor(d as Country))
  const capColorRef = useRef(capColor)
  capColorRef.current = capColor
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Rotación automática lenta; se detiene para siempre al primer gesto del usuario.
  const onGlobeReady = () => {
    const globe = globeRef.current
    if (!globe) return
    const controls = globe.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.6
    controls.addEventListener('start', () => {
      controls.autoRotate = false
    })

    // Ayuda solo para las pruebas e2e (no existe en producción).
    if (import.meta.env.DEV) {
      ;(window as unknown as Record<string, unknown>).__clg = {
        focus: (lat: number, lng: number) => {
          controls.autoRotate = false
          globe.pointOfView({ lat, lng, altitude: 1.5 }, 0)
        },
        screenCoords: (lat: number, lng: number) => globe.getScreenCoords(lat, lng),
        pov: () => globe.pointOfView(),
        autoRotating: () => controls.autoRotate,
        capColor: (iso: string) => {
          const country = countriesRef.current.find((c) => c.properties.ADM0_A3 === iso)
          return country ? capColorRef.current(country) : null
        },
      }
    }
  }

  return (
    <div className="globe" data-testid="globe">
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        globeImageUrl="/img/earth-blue-marble.jpg"
        backgroundImageUrl="/img/night-sky.png"
        onGlobeReady={onGlobeReady}
        polygonsData={countries}
        polygonCapColor={capColor}
        polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
        polygonStrokeColor={() => 'rgba(255, 255, 255, 0.35)'}
        polygonAltitude={(d) => (d === hovered || d === selected ? 0.03 : 0.006)}
        polygonLabel={(d) => (d as Country).properties.NAME}
        onPolygonHover={(d) => setHovered((d as Country | null) ?? null)}
        onPolygonClick={(d) => onSelect(d as Country)}
        onGlobeClick={() => onSelect(null)}
      />
    </div>
  )
}
