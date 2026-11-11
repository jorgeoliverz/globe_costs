import { expect, test } from '@playwright/test'
import { clickAt, openApp } from './helpers'

test.beforeEach(async ({ page }) => {
  await openApp(page)
  await page.waitForFunction(() => '__clg' in window)
})

test('clic en España abre el panel con 900 / 250 / 45 / 1.195 €', async ({ page }) => {
  await clickAt(page, 39.5, -2.5)
  const panel = page.getByTestId('country-panel')
  await expect(panel).toBeVisible()
  await expect(panel.getByRole('heading', { name: 'España' })).toBeVisible()
  const text = (await panel.innerText()).replace(/\s/g, ' ')
  for (const v of ['900 €', '250 €', '45 €', '1.195 €']) expect(text).toContain(v)
})

test('clic en un país sin datos (Rusia) muestra "Sin datos"', async ({ page }) => {
  await clickAt(page, 60, 90)
  const panel = page.getByTestId('country-panel')
  await expect(panel).toContainText('Sin datos')
  await expect(panel).not.toContainText('Presupuesto total')
})

test('la X cierra el panel', async ({ page }) => {
  await clickAt(page, 39.5, -2.5)
  await expect(page.getByTestId('country-panel')).toBeVisible()
  await page.getByRole('button', { name: 'Cerrar panel' }).click()
  await expect(page.getByTestId('country-panel')).toHaveCount(0)
})

test('con un país seleccionado el globo no gira; al cerrar el panel vuelve a girar', async ({ page }) => {
  await clickAt(page, 39.5, -2.5)
  await expect(page.getByTestId('country-panel')).toBeVisible()
  const rotating = () =>
    page.evaluate(() => (window as unknown as { __clg: { autoRotating: () => boolean } }).__clg.autoRotating())

  await page.waitForTimeout(2500) // más que la espera de reanudación (1,5 s)
  expect(await rotating()).toBe(false)

  await page.getByRole('button', { name: 'Cerrar panel' }).click()
  await expect.poll(rotating, { timeout: 6000 }).toBe(true)
})
