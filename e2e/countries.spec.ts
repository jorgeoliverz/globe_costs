import { expect, test } from '@playwright/test'

type Clg = {
  focus: (lat: number, lng: number) => void
  screenCoords: (lat: number, lng: number) => { x: number; y: number }
}

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
  await page.goto('/')
  await page.waitForFunction(() => '__clg' in window)

  await page.evaluate(() => (window as unknown as { __clg: Clg }).__clg.focus(40, -4))
  await page.waitForTimeout(500)
  const pos = await page.evaluate(() => (window as unknown as { __clg: Clg }).__clg.screenCoords(40, -4))
  await page.mouse.move(pos.x - 5, pos.y - 5)
  await page.mouse.move(pos.x, pos.y, { steps: 5 })

  await expect(page.getByText('Spain', { exact: true })).toBeVisible()
  expect(errors).toEqual([])
})
