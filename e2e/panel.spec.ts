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
  await page.mouse.click(pos.x, pos.y)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(() => '__clg' in window)
})

test('clic en España abre el panel con 900 / 250 / 45 / 1.195 €', async ({ page }) => {
  await clickAt(page, 40, -4)
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
  await clickAt(page, 40, -4)
  await expect(page.getByTestId('country-panel')).toBeVisible()
  await page.getByRole('button', { name: 'Cerrar panel' }).click()
  await expect(page.getByTestId('country-panel')).toHaveCount(0)
})
