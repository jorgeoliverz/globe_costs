import type { ReactNode } from 'react'

interface Props {
  testId: string
  label: string
  onClose: () => void
  children: ReactNode
}

// Móvil: hoja inferior a todo el ancho. Escritorio (md): tarjeta a la derecha.
const SHELL =
  'fixed inset-x-0 bottom-7 z-10 box-border max-h-[55vh] overflow-y-auto rounded-t-2xl border border-accent/35 bg-[#0a1226] px-5 pb-6 pt-4 ' +
  'md:inset-x-auto md:bg-panel md:bottom-auto md:right-4 md:top-4 md:max-h-[calc(100vh-2rem)] md:w-70 md:rounded-xl md:pb-4'

export default function PanelShell({ testId, label, onClose, children }: Props) {
  return (
    <aside className={SHELL} data-testid={testId} aria-label={label}>
      <button
        className="absolute right-2.5 top-2 cursor-pointer border-0 bg-transparent text-2xl leading-none text-inherit"
        onClick={onClose}
        aria-label="Cerrar panel"
      >
        ×
      </button>
      {children}
    </aside>
  )
}
