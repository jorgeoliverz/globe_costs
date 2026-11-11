import { expect, test } from '@playwright/test'

test('al cargar se ve la portada y la interfaz aún no', async ({ page }) => {
  await page.goto('/')
  const dialog = page.getByRole('dialog', { name: 'Bienvenida a CLG' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: '¿Dónde vives mejor con tu dinero?' })).toBeVisible()
  await expect(dialog.getByText(/35 países y 175 ciudades/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Empezar a explorar' })).toBeVisible()
  await expect(page.getByRole('combobox')).toHaveCount(0)
  await expect(page.getByLabel('Leyenda de coste mensual')).toHaveCount(0)
})

test('«Empezar»: despega el cohete, la portada se va y la app queda usable', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/')
  await page.waitForFunction(() => '__clg' in window)

  await page.getByRole('button', { name: 'Empezar a explorar' }).click()
  await expect(page.getByTestId('rocket')).toBeVisible()
  await expect(page.getByRole('combobox')).toHaveCount(0)

  // El vuelo dura unos 2,5 s: después la portada y el cohete desaparecen.
  await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 8000 })
  await expect(page.getByTestId('rocket')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'CLG' })).toBeVisible()

  // La cámara terminó en la altitud normal y la app responde.
  await expect
    .poll(async () => (await page.evaluate(() => (window as unknown as { __clg: { pov: () => { altitude: number } } }).__clg.pov().altitude)))
    .toBeCloseTo(2.5, 0)
  await page.getByRole('combobox', { name: 'Buscar país o ciudad' }).fill('espa')
  await page.getByRole('option', { name: /España/ }).click()
  await expect(page.getByTestId('country-panel').getByRole('heading', { name: 'España' })).toBeVisible()
  expect(errors).toEqual([])
})

test('con movimiento reducido no hay cohete: entra al instante', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Empezar a explorar' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByTestId('rocket')).toHaveCount(0)
  await expect(page.getByRole('combobox')).toBeVisible()
})

test('en móvil la portada cabe sin scroll horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Empezar a explorar' })).toBeVisible()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
  const btn = (await page.getByRole('button', { name: 'Empezar a explorar' }).boundingBox())!
  expect(btn.x).toBeGreaterThanOrEqual(0)
  expect(btn.x + btn.width).toBeLessThanOrEqual(390)
})
