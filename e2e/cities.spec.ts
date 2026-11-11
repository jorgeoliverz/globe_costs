import { expect, test, type Page } from '@playwright/test'

type Clg = {
  focus: (lat: number, lng: number) => void
  screenCoords: (lat: number, lng: number) => { x: number; y: number }
}

async function clickAt(page: Page, lat: number, lng: number) {
  await page.evaluate(([a, b]) => (window as unknown as { __clg: Clg }).__clg.focus(a, b), [lat, lng])
  await page.waitForTimeout(500)
  const pos = await page.evaluate(
    ([a, b]) => (window as unknown as { __clg: Clg }).__clg.screenCoords(a, b),
    [lat, lng],
  )
  await page.mouse.move(pos.x - 4, pos.y - 4)
  await page.mouse.move(pos.x, pos.y, { steps: 5 })
  await page.waitForTimeout(300) // deja que el globo detecte el objeto bajo el cursor
  await page.mouse.click(pos.x, pos.y)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
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
