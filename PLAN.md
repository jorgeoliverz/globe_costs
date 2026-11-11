# Plan

El agente trabaja una fase cada vez y marca las casillas al cerrarla. Cada fase cabe en una sesión, termina con algo que se ve en `npm run dev`, lleva sus pruebas y cierra con un commit local (sin push) que también actualiza este archivo.

## Fase 0 · Esqueleto

**Objetivo:** una versión mínima que se abre y funciona.

**Tareas:**
- [x] Crear la estructura mínima (Vite + React + TypeScript, Vitest y Playwright) según `docs/project-info.md`.
- [x] Mostrar una primera pantalla con el nombre «CLG» (subtítulo: Cost of Living Globe).
- [x] Usar «CLG» como título de la página.

**Pruebas:**
- Prueba e2e (Playwright): la app se abre y muestra «CLG».

**Hecho cuando:** la app se abre sin errores, se ve «CLG» y la prueba pasa.

## Fase 1 · Globo giratorio

**Objetivo:** ver la Tierra en 3D y poder moverla. Es la fase más pequeña.

**Tareas:**
- [x] Instalar solo `react-globe.gl` (avisando antes).
- [x] Mostrar el globo a pantalla completa sobre fondo oscuro, con giro y zoom con el ratón.

**Pruebas:**
- e2e: existe el canvas del globo y no hay errores en consola.

**Hecho cuando:** abro la app, veo la Tierra, la arrastro y hago zoom.

## Fase 2 · Países en el globo

**Objetivo:** ver los países y resaltar el que está bajo el cursor.

**Tareas:**
- [x] Guardar un GeoJSON de países en `public/`.
- [x] Dibujar los contornos y resaltar el país bajo el cursor.

**Pruebas:**
- e2e: el GeoJSON carga sin error.

**Hecho cuando:** paso el ratón por España y se resalta.

## Fase 3 · Datos y color por coste

**Objetivo:** colorear cada país según su coste de vida.

**Tareas:**
- [x] Crear `costs.json` con unos 35 países (ISO, nombre, alquiler, comida, transporte; datos ilustrativos).
- [x] Crear la lógica `cost.ts` (total y escala de color), separada de la interfaz.
- [x] Colorear países por total, gris si no hay datos; añadir leyenda y aviso «Datos ilustrativos».

**Pruebas:**
- Unitaria: España 900 + 250 + 45 = 1.195 €.
- Unitaria: un país sin datos devuelve «sin datos».

**Hecho cuando:** veo colores distintos, la leyenda, el aviso y países en gris.

## Fase 4 · Panel de país

**Objetivo:** consultar el detalle de un país.

**Tareas:**
- [x] Clic en un país abre un panel con alquiler, comida, transporte y total.
- [x] Mostrar «sin datos» si el país no los tiene; cerrar con X.

**Pruebas:**
- e2e: clic en España muestra 900 / 250 / 45 / 1.195 €.
- e2e: clic en un país gris muestra «sin datos».

**Hecho cuando:** el panel se abre, se cierra y muestra los importes correctos.

## Fase 5 · Ciudades

**Objetivo:** cada país incluye sus 5 ciudades más importantes.

**Tareas:**
- [x] Ampliar el JSON con 5 ciudades por país (nombre, latitud, longitud e importes propios).
- [x] Mostrar las ciudades como puntos en el globo y como lista en el panel del país.
- [x] Clic en una ciudad abre su panel con sus importes.

**Pruebas:**
- Unitaria sobre los datos: cada país tiene exactamente 5 ciudades.
- e2e: clic en España lista 5 ciudades; clic en una ciudad muestra sus importes.

**Hecho cuando:** veo los puntos, la lista y el panel de ciudad.

## Fase 6 · Buscador

**Objetivo:** encontrar países y ciudades escribiendo.

**Tareas:**
- [x] Buscador de países y ciudades.
- [x] Al elegir un resultado, seleccionarlo y centrar el globo.

**Pruebas:**
- Unitaria: la búsqueda filtra por nombre sin distinguir mayúsculas ni acentos.
- e2e: escribir «espa» abre España; escribir una ciudad abre su panel.

**Hecho cuando:** busco, elijo y el globo se centra en el resultado.

## Fase 7 · Móvil y pulido

**Objetivo:** que se vea bien en el móvil y con el estilo del ejemplo.

**Tareas:**
- [x] Instalar y configurar Tailwind CSS (avisando antes); diseño responsive con el panel como hoja inferior en móvil.
- [x] Estilo: fondo con estrellas, halo del globo y acento menta.
- [x] Actualizar el README con cómo arrancar y probar.

**Pruebas:**
- e2e en ancho ~390 px: sin scroll horizontal y el panel se puede abrir y cerrar.
- Todas las pruebas y el linter sin errores ni avisos.

**Hecho cuando:** en móvil todo se usa bien y el conjunto de pruebas pasa.

## Fase 8 · Portada y despegue

**Objetivo:** una pantalla de inicio al cargar y un cohete que lleva hasta la vista del globo.

**Tareas:**
- [x] Instalar la fuente Geist (`@fontsource-variable/geist`) para los títulos.
- [x] Portada con título, subtítulo con datos reales, botón «Empezar a explorar» y entrada animada una sola vez.
- [x] Cohete SVG que despega al pulsar, cruza la pantalla en arco y aterriza en el centro, con la cámara acercándose a la vista normal.
- [x] Buscador, leyenda, marca y paneles ocultos hasta terminar el vuelo.
- [x] Con «reducir movimiento» se entra al instante, sin cohete.

**Pruebas:**
- Unitarias: portada, cohete, arco de la trayectoria, movimiento reducido, App.
- e2e: la portada se ve al cargar, el cohete despega y deja la app usable, movimiento reducido, móvil sin scroll horizontal.
- Las demás pruebas e2e pasan por un ayudante `openApp` que salta la portada.

**Hecho cuando:** al recargar aparece la portada y, al pulsar el botón, el cohete llega a la vista del globo con la interfaz funcionando.

## Fase 9 · Sueldos y calculadora

**Objetivo:** mostrar el sueldo medio de cada país y calcular cuánto te sobra con tu sueldo.

**Tareas:**
- [x] Añadir `salary` (sueldo neto medio mensual, ilustrativo) a los 35 países.
- [x] Lógica `affordability.ts`: lo que sobra, ranking de países y escala de color.
- [x] Panel de país con «Sueldo medio» y «Sobra de media».
- [x] Calculadora: sueldo, país, resultado «Te sobran / Te faltan», 5 ciudades y ranking de 10 países.
- [x] Interruptor «Coste / Mi sueldo» que colorea el globo y cambia la leyenda.

**Pruebas:**
- Unitarias: 2.000 € en España = +805 €; 500 € = −695 €; ranking y color.
- e2e: calculadora, ranking, colores del globo, interruptor y móvil.

**Hecho cuando:** escribo mi sueldo y el globo se tiñe según lo que me sobra en cada país.

## Después (no incluido)

Comparador de 2–3 países con gráficos.
