import { expect, test, type Page } from '@playwright/test'

type Pov = { lat: number; lng: number; altitude: number }
type Clg = { pov: () => Pov; autoRotating: () => boolean }

const pov = (page: Page) => page.evaluate(() => (window as unknown as { __clg: Clg }).__clg.pov())
const autoRotating = (page: Page) =>
  page.evaluate(() => (window as unknown as { __clg: Clg }).__clg.autoRotating())

test('el globo se dibuja y no hay errores', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))

  await page.goto('/')

  const canvas = page.getByTestId('globe').locator('canvas')
  await expect(canvas).toBeVisible()
  const box = await canvas.boundingBox()
  expect(box!.width).toBeGreaterThan(300)
  expect(box!.height).toBeGreaterThan(300)
  expect(errors).toEqual([])
})

test('el globo gira solo y se detiene al tocarlo', async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(() => '__clg' in window)
  const canvas = page.getByTestId('globe').locator('canvas')
  await expect(canvas).toBeVisible()

  // Sin tocar: la vista cambia sola con el tiempo.
  const p1 = await pov(page)
  await page.waitForTimeout(1000)
  const p2 = await pov(page)
  expect(p2.lng).not.toBeCloseTo(p1.lng, 1)
  expect(await autoRotating(page)).toBe(true)

  // Arrastrar: la vista cambia por el gesto.
  const box = (await canvas.boundingBox())!
  const cx = box.x + box.width / 2
  const cy = box.y + box.height / 2
  await page.mouse.move(cx, cy)
  await page.mouse.down()
  await page.mouse.move(cx + 200, cy + 30, { steps: 10 })
  await page.mouse.up()
  await page.waitForTimeout(1500)
  const p3 = await pov(page)
  expect(Math.abs(p3.lng - p2.lng)).toBeGreaterThan(1)

  // Tras tocarlo, la rotación automática queda desactivada (lo que se mueve
  // después es solo la inercia del arrastre).
  expect(await autoRotating(page)).toBe(false)
})
