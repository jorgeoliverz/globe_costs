import { useEffect, useRef, useState } from 'react'
import Globe, { type GlobeMethods } from 'react-globe.gl'
import type { Country } from './types'
import { allCities, type City } from './lib/cities'
import { prefersReducedMotion } from './lib/motion'
import { leftColor } from './lib/affordability'
import { COSTS, costColor, costRange, findCost, totalCost } from './lib/cost'

const { min, max } = costRange(COSTS)

/** Color por coste, o por lo que te sobra si `salary` viene informado. */
function baseColor(country: Country, salary: number | null): string {
  const cost = findCost(country.properties.ADM0_A3)
  if (!cost) return costColor(null, min, max)
  return salary ? leftColor(salary, totalCost(cost)) : costColor(totalCost(cost), min, max)
}

const CITIES = allCities()

const HOVER_COLOR = 'rgba(94, 234, 212, 0.65)'

// Tras soltar el globo, espera a que acabe la inercia antes de volver a girar.
const RESUME_DELAY_MS = 1500
const FOCUS_ALTITUDE = 1.5
// Portada: la cámara empieza lejos y se acerca hasta la altitud normal al despegar el cohete.
const INTRO_ALTITUDE = 6.5
const DEFAULT_ALTITUDE = 2.5
const LAUNCH_MS = 2200
const FOCUS_DURATION_MS = 1000
// En móvil el panel tapa la mitad inferior: la cámara apunta más al sur para que el destino quede arriba.
const MOBILE_LAT_OFFSET = 14

type Controls = ReturnType<GlobeMethods['controls']>

export interface FocusTarget {
  lat: number
  lng: number
}

interface Props {
  countries: Country[]
  selected: Country | null
  focusTarget: FocusTarget | null
  intro: 'cover' | 'launching' | 'done'
  /** Sueldo con el que colorear (modo «Mi sueldo»); null colorea por coste. */
  salary: number | null
  onSelect: (country: Country | null, city?: City | null) => void
}

export default function GlobeView({ countries, selected, focusTarget, intro, salary, onSelect }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const controlsRef = useRef<Controls | null>(null)
  const resumeTimer = useRef<number | undefined>(undefined)
  const introRef = useRef(intro)
  introRef.current = intro
  const selectedRef = useRef(selected)
  selectedRef.current = selected
  const countriesRef = useRef<Country[]>([])
  countriesRef.current = countries
  const [hovered, setHovered] = useState<Country | null>(null)
  const capColor = (d: object) => (d === hovered || d === selected ? HOVER_COLOR : baseColor(d as Country, salary))
  const capColorRef = useRef(capColor)
  capColorRef.current = capColor
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Rotación automática lenta. Se para al tocar el globo y vuelve a girar al
  // soltarlo, salvo que haya un país o ciudad seleccionado.
  const scheduleResume = () => {
    window.clearTimeout(resumeTimer.current)
    resumeTimer.current = window.setTimeout(() => {
      if (controlsRef.current && !selectedRef.current) controlsRef.current.autoRotate = true
    }, RESUME_DELAY_MS)
  }

  useEffect(() => {
    if (!controlsRef.current) return
    if (selected) {
      window.clearTimeout(resumeTimer.current)
      controlsRef.current.autoRotate = false
    } else {
      scheduleResume()
    }
  }, [selected])

  useEffect(() => () => window.clearTimeout(resumeTimer.current), [])

  useEffect(() => {
    if (intro === 'launching') {
      globeRef.current?.pointOfView({ altitude: DEFAULT_ALTITUDE }, LAUNCH_MS)
    }
  }, [intro])

  useEffect(() => {
    if (!focusTarget) return
    const mobile = window.matchMedia('(max-width: 767px)').matches
    const lat = mobile ? Math.max(-85, focusTarget.lat - MOBILE_LAT_OFFSET) : focusTarget.lat
    globeRef.current?.pointOfView(
      { lat, lng: focusTarget.lng, altitude: FOCUS_ALTITUDE },
      FOCUS_DURATION_MS,
    )
  }, [focusTarget])

  const onGlobeReady = () => {
    const globe = globeRef.current
    if (!globe) return
    const controls = globe.controls()
    controlsRef.current = controls
    if (introRef.current === 'cover' && !prefersReducedMotion()) {
      globe.pointOfView({ altitude: INTRO_ALTITUDE }, 0)
    }
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.6
    controls.addEventListener('start', () => {
      window.clearTimeout(resumeTimer.current)
      controls.autoRotate = false
    })
    controls.addEventListener('end', scheduleResume)

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
    <div className="fixed inset-0" data-testid="globe">
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        globeImageUrl="/img/earth-blue-marble.jpg"
        backgroundImageUrl="/img/night-sky.png"
        atmosphereColor="#5eead4"
        atmosphereAltitude={0.22}
        onGlobeReady={onGlobeReady}
        polygonsData={countries}
        polygonCapColor={capColor}
        polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
        polygonStrokeColor={() => 'rgba(255, 255, 255, 0.35)'}
        polygonAltitude={(d) => (d === hovered || d === selected ? 0.012 : 0.006)}
        polygonLabel={(d) => (d as Country).properties.NAME}
        onPolygonHover={(d) => setHovered((d as Country | null) ?? null)}
        onPolygonClick={(d) => onSelect(d as Country)}
        onGlobeClick={() => onSelect(null)}
        pointsData={CITIES}
        pointLat="lat"
        pointLng="lng"
        pointColor={(d) => {
          const total = totalCost(d as City)
          return salary ? leftColor(salary, total) : costColor(total, min, max)
        }}
        pointAltitude={0.025}
        pointRadius={0.7}
        pointLabel={(d) => (d as City).name}
        onPointClick={(d) => {
          const city = d as City
          const country = countriesRef.current.find((c) => c.properties.ADM0_A3 === city.iso)
          if (country) onSelect(country, city)
        }}
      />
    </div>
  )
}
