import { useEffect, useRef, useState } from 'react'
import Globe, { type GlobeMethods } from 'react-globe.gl'

export default function GlobeView() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="globe" data-testid="globe">
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        globeImageUrl="/img/earth-blue-marble.jpg"
        backgroundImageUrl="/img/night-sky.png"
      />
    </div>
  )
}
