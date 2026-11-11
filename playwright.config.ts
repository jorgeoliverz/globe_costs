import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  // WebGL por software es lento: un solo trabajador evita fallos por falta de CPU.
  workers: 1,
  timeout: 60_000,
  use: { baseURL: 'http://localhost:5173' },
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
})
