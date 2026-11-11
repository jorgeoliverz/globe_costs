import { useEffect, useRef, useState } from 'react'
import Rocket from './Rocket'
import { allCities } from './lib/cities'
import { COSTS } from './lib/cost'
import { prefersReducedMotion, type Point } from './lib/motion'

export type IntroPhase = 'cover' | 'launching'

interface Props {
  phase: IntroPhase
  onLaunch: () => void
  onDone: () => void
}

export default function Intro({ phase, onLaunch, onDone }: Props) {
  const button = useRef<HTMLButtonElement>(null)
  const [from, setFrom] = useState<Point>({ x: 0, y: 0 })

  useEffect(() => button.current?.focus(), [])

  const start = () => {
    if (prefersReducedMotion()) {
      onDone()
      return
    }
    // Despega desde fuera de la pantalla, abajo a la izquierda, y cruza en arco hasta el globo.
    setFrom({ x: window.innerWidth * 0.18, y: window.innerHeight + 60 })
    onLaunch()
  }

  const launching = phase === 'launching'

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Bienvenida a CLG">
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center bg-night/60 px-6 text-center backdrop-blur-[3px] transition-opacity duration-500 ease-out ${launching ? 'opacity-0' : 'opacity-100'}`}
      >
        <p
          className="enter absolute left-4 top-4 m-0 font-mono text-[10px] uppercase tracking-wider opacity-70"
          style={{ animationDelay: '0ms' }}
        >
          CLG · Cost of Living Globe
        </p>
        <h1
          className="enter m-0 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
          style={{ animationDelay: '150ms' }}
        >
          ¿Dónde vives mejor con tu dinero?
        </h1>
        <p
          className="enter mb-0 mt-5 max-w-md text-base text-white/75 md:text-lg"
          style={{ animationDelay: '450ms' }}
        >
          Compara el coste mensual de {COSTS.length} países y {allCities().length} ciudades en un globo.
        </p>
        <button
          ref={button}
          className="enter mt-8 cursor-pointer rounded-full border-0 bg-accent px-7 py-3 text-base font-semibold text-night transition duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          style={{ animationDelay: '700ms' }}
          onClick={start}
          disabled={launching}
        >
          Empezar a explorar
        </button>
        <p
          className="enter absolute bottom-4 m-0 font-mono text-[10px] uppercase tracking-wider opacity-60"
          style={{ animationDelay: '900ms' }}
        >
          Datos ilustrativos
        </p>
      </div>
      {launching && <Rocket from={from} onDone={onDone} />}
    </div>
  )
}
