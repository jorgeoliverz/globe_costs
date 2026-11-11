import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest sin `globals` no limpia el DOM entre pruebas por su cuenta.
afterEach(cleanup)
