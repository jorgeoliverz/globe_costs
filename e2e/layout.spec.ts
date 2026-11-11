import { expect, test, type Page } from '@playwright/test'
import { openApp } from './helpers'

async function openSpain(page: Page) {
  await page.getByRole('combobox', { name: 'Buscar país o ciudad' }).fill('espa')
  await page.getByRole('option', { name: /España/ }).click()
  await expect(page.getByTestId('country-panel')).toBeVisible()
}

test.describe('móvil (390×844)', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('sin scroll horizontal y con buscador y marca sin solaparse', async ({ page }) => {
    await openApp(page)
    await expect(page.getByRole('combobox')).toBeVisible()

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)

    const brand = (await page.getByRole('heading', { name: 'CLG' }).boundingBox())!
    const search = (await page.getByRole('combobox').boundingBox())!
    expect(search.y).toBeGreaterThanOrEqual(brand.y + brand.height)
    expect(search.x).toBeGreaterThanOrEqual(0)
    expect(search.x + search.width).toBeLessThanOrEqual(390)
  })

  test('el panel es una hoja inferior a todo el ancho y se cierra con la X', async ({ page }) => {
    await openApp(page)
    await page.waitForFunction(() => '__clg' in window)
    await openSpain(page)
    const panel = page.getByTestId('country-panel')
    const box = (await panel.boundingBox())!

    // Tras animar la cámara, España queda a la vista, por encima de la hoja.
    await page.waitForTimeout(1500)
    const spain = await page.evaluate(() =>
      (window as unknown as { __clg: { screenCoords: (a: number, b: number) => { x: number; y: number } } }).__clg.screenCoords(
        40,
        -3,
      ),
    )
    expect(spain.y).toBeLessThan(box.y)
    expect(spain.x).toBeGreaterThan(0)
    expect(spain.x).toBeLessThan(390)
    expect(box.x).toBeCloseTo(0, 0)
    expect(box.width).toBeCloseTo(390, 0)
    expect(box.y + box.height).toBeLessThanOrEqual(844)
    expect(box.y).toBeGreaterThan(844 * 0.4) // ocupa como mucho ~55 % de la altura

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)
    await expect(page.getByText('Datos ilustrativos, no estadísticas actuales.')).toBeVisible()

    await page.getByRole('button', { name: 'Cerrar panel' }).click()
    await expect(panel).toHaveCount(0)
  })
})

test.describe('escritorio (1280×720)', () => {
  test.use({ viewport: { width: 1280, height: 720 } })

  test('el panel es una tarjeta de 280 px a la derecha', async ({ page }) => {
    await openApp(page)
    await openSpain(page)
    const box = (await page.getByTestId('country-panel').boundingBox())!
    expect(box.width).toBeCloseTo(280, 0)
    expect(box.x + box.width).toBeCloseTo(1280 - 16, 0)
    expect(box.y).toBeCloseTo(16, 0)
  })
})
