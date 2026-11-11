import { expect, test, type Page } from '@playwright/test'
import { openApp } from './helpers'

const norm = (s: string) => s.replace(/\s/g, ' ')
const colorOf = (page: Page, iso: string) =>
  page.evaluate((i) => (window as unknown as { __clg: { capColor: (i: string) => string | null } }).__clg.capColor(i), iso)

async function openCalculator(page: Page) {
  await page.getByRole('button', { name: '¿Cuánto puedo vivir con mi sueldo?' }).click()
  await expect(page.getByTestId('calculator-panel')).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await openApp(page)
  await page.waitForFunction(() => '__clg' in window)
})

test('2.000 € en España: te sobran 805 € y salen las 5 ciudades', async ({ page }) => {
  await openCalculator(page)
  await page.getByLabel('Tu sueldo neto mensual (€)').fill('2000')
  await page.getByLabel('País', { exact: true }).selectOption('ESP')

  const panel = page.getByTestId('calculator-panel')
  expect(norm(await panel.getByTestId('calc-result').innerText())).toBe('Te sobran 805 €')
  await expect(panel.getByRole('listitem')).toHaveCount(5)
  await expect(panel).toContainText('1.900 €') // sueldo medio de España
})

test('500 € en España: te faltan 695 €', async ({ page }) => {
  await openCalculator(page)
  await page.getByLabel('Tu sueldo neto mensual (€)').fill('500')
  await page.getByLabel('País', { exact: true }).selectOption('ESP')
  expect(norm(await page.getByTestId('calc-result').innerText())).toBe('Te faltan 695 €')
})

test('el ranking lista 10 países y un clic abre el país con su sueldo medio', async ({ page }) => {
  await openCalculator(page)
  await page.getByLabel('Tu sueldo neto mensual (€)').fill('2000')
  const items = page.getByTestId('ranking').getByRole('listitem')
  await expect(items).toHaveCount(10)

  await items.first().getByRole('button').click()
  const panel = page.getByTestId('country-panel')
  await expect(panel.getByRole('heading', { name: 'Egipto' })).toBeVisible()
  await expect(page.getByTestId('calculator-panel')).toHaveCount(0)
  await expect(panel).toContainText('Sueldo medio')
  await expect(panel).toContainText('Con tu sueldo')
})

test('escribir un sueldo colorea el globo por capacidad y el interruptor vuelve al coste', async ({ page }) => {
  await expect.poll(() => colorOf(page, 'ESP')).not.toBeNull()
  const costSpain = await colorOf(page, 'ESP')

  await openCalculator(page)
  await page.getByLabel('Tu sueldo neto mensual (€)').fill('2000')
  await expect(page.getByLabel('Leyenda de capacidad')).toBeVisible()
  await expect.poll(() => colorOf(page, 'ESP')).not.toBe(costSpain)
  // Con 2.000 € a Suiza no le llega (rojo) y a Egipto le sobra casi todo (verde).
  const che = await colorOf(page, 'CHE')
  const egy = await colorOf(page, 'EGY')
  expect(che).not.toBe(egy)
  expect(await colorOf(page, 'RUS')).toBe('rgba(150, 150, 150, 0.15)')

  await page.getByRole('button', { name: 'Coste', exact: true }).click()
  await expect(page.getByLabel('Leyenda de coste mensual')).toBeVisible()
  await expect.poll(() => colorOf(page, 'ESP')).toBe(costSpain)
})

test('sin sueldo «Mi sueldo» está desactivado y la calculadora se cierra con la X', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Mi sueldo', exact: true })).toBeDisabled()
  await openCalculator(page)
  await page.getByRole('button', { name: 'Cerrar panel' }).click()
  await expect(page.getByTestId('calculator-panel')).toHaveCount(0)
})

test.describe('móvil (390×844)', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('el botón no tapa el buscador y la calculadora es una hoja sin scroll horizontal', async ({ page }) => {
    const search = (await page.getByRole('combobox').boundingBox())!
    const btn = (await page.getByRole('button', { name: '¿Cuánto puedo vivir con mi sueldo?' }).boundingBox())!
    expect(btn.y).toBeGreaterThanOrEqual(search.y + search.height)
    expect(btn.x + btn.width).toBeLessThanOrEqual(390)

    await openCalculator(page)
    await page.getByLabel('Tu sueldo neto mensual (€)').fill('2000')
    const box = (await page.getByTestId('calculator-panel').boundingBox())!
    expect(box.width).toBeCloseTo(390, 0)
    expect(box.y + box.height).toBeLessThanOrEqual(844)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
})
