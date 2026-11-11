import { expect, test, type Page } from '@playwright/test'

type Pov = { lat: number; lng: number; altitude: number }
type Clg = { pov: () => Pov }

const pov = (page: Page) => page.evaluate(() => (window as unknown as { __clg: Clg }).__clg.pov())

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(() => '__clg' in window)
})

test('buscar «espa» abre el panel de España y centra el globo', async ({ page }) => {
  await page.getByRole('combobox', { name: 'Buscar país o ciudad' }).fill('espa')
  await page.getByRole('option', { name: /España/ }).click()

  await expect(page.getByTestId('country-panel').getByRole('heading', { name: 'España' })).toBeVisible()
  await expect
    .poll(async () => {
      const p = await pov(page)
      return Math.abs(p.lat - 40) < 4 && Math.abs(p.lng + 3) < 4
    }, { timeout: 5000 })
    .toBe(true)
})

test('buscar «zurich» abre el panel de Zúrich y centra el globo en la ciudad', async ({ page }) => {
  const input = page.getByRole('combobox', { name: 'Buscar país o ciudad' })
  await input.fill('zurich')
  await input.press('Enter')

  await expect(page.getByTestId('city-panel').getByRole('heading', { name: 'Zúrich' })).toBeVisible()
  await expect
    .poll(async () => {
      const p = await pov(page)
      return Math.abs(p.lat - 47.38) < 1.5 && Math.abs(p.lng - 8.54) < 1.5
    }, { timeout: 5000 })
    .toBe(true)
})

test('un país sin datos también se encuentra y su panel dice «Sin datos»', async ({ page }) => {
  await page.getByRole('combobox', { name: 'Buscar país o ciudad' }).fill('russia')
  await page.getByRole('option', { name: /Russia/ }).click()
  await expect(page.getByTestId('country-panel')).toContainText('Sin datos')
})
