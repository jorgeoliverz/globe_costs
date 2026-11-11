import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  // WebGL por software es lento: pocos trabajadores en paralelo evitan fallos por tiempo.
  workers: 2,
  use: { baseURL: 'http://localhost:5173' },
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
})
