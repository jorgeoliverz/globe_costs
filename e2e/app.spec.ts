import { expect, test } from '@playwright/test'

test('la app se abre y muestra CLG sin errores en consola', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))

  await page.goto('/')

  await expect(page).toHaveTitle('CLG')
  await expect(page.getByRole('heading', { name: 'CLG' })).toBeVisible()
  expect(errors).toEqual([])
})
