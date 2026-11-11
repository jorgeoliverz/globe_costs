import { expect, test } from '@playwright/test'

type Clg = { capColor: (iso: string) => string | null }

const colorOf = (page: import('@playwright/test').Page, iso: string) =>
  page.evaluate((i) => (window as unknown as { __clg: Clg }).__clg.capColor(i), iso)

test('se ven la leyenda y el aviso de datos ilustrativos', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByLabel('Leyenda de coste mensual')).toBeVisible()
  await expect(page.getByText('Datos ilustrativos, no estadísticas actuales.')).toBeVisible()
})

test('los países se colorean por coste y los que no tienen datos van en gris', async ({ page }) => {
  await page.goto('/')
  await page.waitForFunction(() => '__clg' in window)
  await expect.poll(() => colorOf(page, 'ESP')).not.toBeNull()

  const spain = await colorOf(page, 'ESP')
  const morocco = await colorOf(page, 'MAR')
  const switzerland = await colorOf(page, 'CHE')
  const russia = await colorOf(page, 'RUS')

  expect(spain).not.toBe(morocco)
  expect(morocco).not.toBe(switzerland)
  expect(russia).toBe('rgba(150, 150, 150, 0.15)')
})
