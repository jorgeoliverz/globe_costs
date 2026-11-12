# Información del proyecto

## Qué es
CLG (Cost of Living Globe): una web con un globo 3D interactivo donde cada país se colorea según su coste de vida, y donde cada país incluye sus 5 ciudades más importantes, para responder a «¿dónde puedo vivir mejor con mi dinero?». Los datos del prototipo son ilustrativos, no estadísticas actuales.

## Para quién
Proyecto de aprendizaje y portfolio. Lo usa cualquier persona curiosa por comparar el coste de vida entre países y ciudades (por ejemplo, quien se plantea mudarse) y necesita ver de un vistazo qué lugares son más baratos o más caros.

## Funciones
Primer prototipo:

- Globo 3D que se puede girar y al que se puede hacer zoom.
- Países coloreados según su presupuesto mensual total (alquiler + comida + transporte).
- Las 5 ciudades más importantes de cada país, marcadas como puntos sobre el globo.
- Clic en un país: panel con alquiler, comida, transporte y total, y la lista de sus 5 ciudades.
- Clic en una ciudad (en el globo o en la lista): panel con sus propios importes.
- Buscador de países y ciudades que selecciona el resultado y centra el globo en él.
- Países sin datos en gris, y aviso visible de «Datos ilustrativos».
- Diseño adaptable a móviles.
- Portada al cargar la página, con botón «Empezar a explorar» y un cohete que vuela hasta la vista del globo. Respeta «reducir movimiento».

- Sueldo medio de cada país en su panel.
- Datos reales del Banco Mundial (nivel de precios, inflación, PIB per cápita en PPA) en el panel de país, con año y fuente.
- Calculadora «¿Cuánto puedo vivir con mi sueldo?»: con tu sueldo neto mensual dice cuánto te sobra en cada país y ciudad, y puede colorear el globo por ello.

Fases posteriores (aún no): comparador de 2–3 países con gráficos.

## Fuera de alcance
- Más de 5 ciudades por país.
- Cuentas de usuario, login y guardar datos: nada se guarda, todo ocurre en el navegador.
- Llamar a APIs externas desde el navegador: los datos reales (Banco Mundial, Eurostat) se descargan con un script y se guardan como JSON local (fases 10–13).
- Despliegue o publicación (requiere permiso explícito según AGENTS.md).

## Tecnología
Se ejecuta en local, en el navegador. Vite + React + TypeScript, Tailwind CSS y react-globe.gl (Globe.gl sobre Three.js). Pruebas: Vitest para la lógica y Playwright para extremo a extremo (en `e2e/`). Las dependencias se añaden solo cuando hacen falta.

Cómo se arrancará: `npm install` y `npm run dev` (se abre en localhost). Pruebas con `npm test` y `npm run e2e`.

## Datos y claves
Un JSON local con unos 30–40 países. Cada país tiene: código ISO, nombre, alquiler, comida, transporte y sueldo neto medio mensuales en euros, y una lista de 5 ciudades, cada una con nombre, latitud, longitud y sus propios importes de alquiler, comida y transporte (datos ficticios). Además, `src/data/worldbank.json` guarda datos reales por país (ISO3) descargados con `npm run data:worldbank` (API pública del Banco Mundial, sin clave). Los contornos de los países vienen de un archivo GeoJSON público guardado en el proyecto. No hay datos de usuario ni claves; no hace falta `.env` por ahora.

## Cómo se prueba
- España con alquiler 900 €, comida 250 € y transporte 45 € = total 1.195 €/mes.
- Al hacer clic en España en el globo, el panel muestra esos tres importes, 1.195 € y una lista de exactamente 5 ciudades.
- Cada país del JSON tiene exactamente 5 ciudades (prueba automática sobre los datos).
- Buscar «espa» selecciona España y abre su panel; buscar el nombre de una de sus ciudades abre el panel de esa ciudad.
- Un país sin datos aparece en gris y su panel indica «sin datos».
- La app se abre sin errores y muestra su nombre.
