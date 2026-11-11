import { useEffect, useRef, useState } from 'react'
import Globe, { type GlobeMethods } from 'react-globe.gl'
import type { Country } from './types'
import { useCountries } from './useCountries'

const BASE_COLOR = 'rgba(120, 190, 255, 0.18)'
const HOVER_COLOR = 'rgba(94, 234, 212, 0.65)'

export default function GlobeView() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const { countries } = useCountries()
  const [hovered, setHovered] = useState<Country | null>(null)
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
        polygonCapColor={(d) => (d === hovered ? HOVER_COLOR : BASE_COLOR)}
        polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
        polygonStrokeColor={() => 'rgba(255, 255, 255, 0.35)'}
        polygonAltitude={(d) => (d === hovered ? 0.03 : 0.006)}
        polygonLabel={(d) => (d as Country).properties.NAME}
        onPolygonHover={(d) => setHovered((d as Country | null) ?? null)}
      />
    </div>
  )
}
