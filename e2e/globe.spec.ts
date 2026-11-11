import { expect, test, type Page } from '@playwright/test'
import { openApp } from './helpers'

type Pov = { lat: number; lng: number; altitude: number }
type Clg = { pov: () => Pov; autoRotating: () => boolean }

const pov = (page: Page) => page.evaluate(() => (window as unknown as { __clg: Clg }).__clg.pov())
const autoRotating = (page: Page) =>
  page.evaluate(() => (window as unknown as { __clg: Clg }).__clg.autoRotating())

test('el globo se dibuja y no hay errores', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))

  await openApp(page)

  const canvas = page.getByTestId('globe').locator('canvas')
  await expect(canvas).toBeVisible()
  const box = await canvas.boundingBox()
  expect(box!.width).toBeGreaterThan(300)
  expect(box!.height).toBeGreaterThan(300)
  expect(errors).toEqual([])
})

test('el globo gira solo, se para al tocarlo y vuelve a girar al soltarlo', async ({ page }) => {
  await openApp(page)
  await page.waitForFunction(() => '__clg' in window)
  const canvas = page.getByTestId('globe').locator('canvas')
  await expect(canvas).toBeVisible()

  // Sin tocar: la vista cambia sola con el tiempo.
  const p1 = await pov(page)
  await page.waitForTimeout(1000)
  const p2 = await pov(page)
  expect(p2.lng).not.toBeCloseTo(p1.lng, 1)
  expect(await autoRotating(page)).toBe(true)

  // Mientras se arrastra: la vista cambia por el gesto y no gira solo.
  const box = (await canvas.boundingBox())!
  const cx = box.x + box.width / 2
  const cy = box.y + box.height / 2
  await page.mouse.move(cx, cy)
  await page.mouse.down()
  await page.mouse.move(cx + 200, cy + 30, { steps: 10 })
  expect(await autoRotating(page)).toBe(false)
  await page.mouse.up()
  const p3 = await pov(page)
  expect(Math.abs(p3.lng - p2.lng)).toBeGreaterThan(1)

  // Al soltar vuelve a girar solo (tras una breve espera).
  await expect.poll(() => autoRotating(page), { timeout: 6000 }).toBe(true)
})
