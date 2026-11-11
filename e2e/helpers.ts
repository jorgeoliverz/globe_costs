import { expect, type Page } from '@playwright/test'

/** Abre la app y pasa la portada (con movimiento reducido, para entrar al instante). */
export async function openApp(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Empezar a explorar' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
}

type Clg = {
  focus: (lat: number, lng: number) => void
  screenCoords: (lat: number, lng: number) => { x: number; y: number }
}
const clg = (page: Page) => ({
  focus: (lat: number, lng: number) =>
    page.evaluate(([a, b]) => (window as unknown as { __clg: Clg }).__clg.focus(a, b), [lat, lng]),
  coords: (lat: number, lng: number) =>
    page.evaluate(([a, b]) => (window as unknown as { __clg: Clg }).__clg.screenCoords(a, b), [lat, lng]),
})

/**
 * Centra el globo en (lat, lng) y devuelve su posición en pantalla cuando la
 * cámara se ha parado (la inercia de la rotación automática tarda en apagarse).
 */
export async function focusAndLocate(page: Page, lat: number, lng: number) {
  const g = clg(page)
  await g.focus(lat, lng)
  let last = await g.coords(lat, lng)
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(150)
    const now = await g.coords(lat, lng)
    if (Math.hypot(now.x - last.x, now.y - last.y) < 0.5) return now
    last = now
  }
  throw new Error('La cámara no se estabiliza')
}

/** Mueve el ratón hasta (lat, lng) y deja que el globo detecte el objeto bajo el cursor. */
export async function hoverAt(page: Page, lat: number, lng: number) {
  const pos = await focusAndLocate(page, lat, lng)
  await page.mouse.move(pos.x - 4, pos.y - 4)
  await page.mouse.move(pos.x, pos.y, { steps: 5 })
  await page.waitForTimeout(300)
  return pos
}

export async function clickAt(page: Page, lat: number, lng: number) {
  const pos = await hoverAt(page, lat, lng)
  await page.mouse.click(pos.x, pos.y)
}
