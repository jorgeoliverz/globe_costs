import { expect, test } from '@playwright/test'
import { clickAt, openApp } from './helpers'

test.beforeEach(async ({ page }) => {
  await openApp(page)
  await page.waitForFunction(() => '__clg' in window)
})

test('clic en España lista 5 ciudades', async ({ page }) => {
  await clickAt(page, 39.5, -2.5) // lejos de los puntos de las ciudades
  const panel = page.getByTestId('country-panel')
  await expect(panel.getByRole('listitem')).toHaveCount(5)
})

test('clic en una ciudad de la lista abre su panel, y se puede volver', async ({ page }) => {
  await clickAt(page, 39.5, -2.5)
  await page.getByTestId('country-panel').getByRole('button', { name: /Madrid/ }).click()
  const city = page.getByTestId('city-panel')
  await expect(city.getByRole('heading', { name: 'Madrid' })).toBeVisible()
  const text = (await city.innerText()).replace(/\s/g, ' ')
  expect(text).toContain('1.080 €')
  expect(text).not.toContain('900 €')
  await city.getByRole('button', { name: /España/ }).click()
  await expect(page.getByTestId('country-panel')).toBeVisible()
})

test('clic en el punto de Madrid sobre el globo abre su panel', async ({ page }) => {
  await clickAt(page, 40.42, -3.7)
  await expect(page.getByTestId('city-panel').getByRole('heading', { name: 'Madrid' })).toBeVisible()
})
