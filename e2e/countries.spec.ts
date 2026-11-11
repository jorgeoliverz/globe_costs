import { expect, test } from '@playwright/test'
import { hoverAt, openApp } from './helpers'

test('el GeoJSON de países carga e incluye España', async ({ request }) => {
  const res = await request.get('/data/countries.geojson')
  expect(res.status()).toBe(200)
  const data = await res.json()
  expect(data.features.length).toBeGreaterThan(150)
  expect(data.features.some((f: { properties: { ADM0_A3: string } }) => f.properties.ADM0_A3 === 'ESP')).toBe(true)
})

test('pasar el ratón por España muestra su nombre', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  await openApp(page)
  await page.waitForFunction(() => '__clg' in window)

  await hoverAt(page, 39.5, -2.5)

  await expect(page.getByText('Spain', { exact: true })).toBeVisible()
  expect(errors).toEqual([])
})
