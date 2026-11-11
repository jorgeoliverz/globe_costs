import { expect, test } from '@playwright/test'

test('el globo se dibuja, se puede arrastrar y no hay errores', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))

  await page.goto('/')

  const canvas = page.getByTestId('globe').locator('canvas')
  await expect(canvas).toBeVisible()
  const box = await canvas.boundingBox()
  expect(box!.width).toBeGreaterThan(300)
  expect(box!.height).toBeGreaterThan(300)

  const cx = box!.x + box!.width / 2
  const cy = box!.y + box!.height / 2
  await page.mouse.move(cx, cy)
  await page.mouse.down()
  await page.mouse.move(cx + 150, cy + 40, { steps: 10 })
  await page.mouse.up()
  await page.mouse.wheel(0, -300)

  await expect(canvas).toBeVisible()
  expect(errors).toEqual([])
})
