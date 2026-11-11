# 🌍 CLG · Cost of Living Globe

Una herramienta visual para responder a una pregunta: **¿dónde puedo vivir mejor con mi dinero?**

Un globo 3D interactivo donde cada país se colorea según su coste de vida, con estadísticas detalladas y un comparador.

> ⚠️ Los datos del prototipo son **ilustrativos**, no estadísticas actuales.

## Funcionalidades

### Globo 3D interactivo
- Girar el planeta libremente y hacer zoom a países y ciudades.
- Seleccionar países haciendo clic.
- Países coloreados según su coste de vida.

### Información por país
Al seleccionar un país se muestra, por ejemplo:

| Concepto | España |
|---|---|
| Alquiler mensual | 900 € |
| Comida mensual | 250 € |
| Transporte | 45 € |
| **Presupuesto total** | **1.195 €** |

### Comparador de países
Selecciona dos o tres países y compáralos lado a lado, con tabla y gráficos.

| Concepto | España | Japón | Tailandia |
|---|---|---|---|
| Alquiler | 900 € | 750 € | 350 € |
| Comida | 250 € | 280 € | 180 € |
| Transporte | 45 € | 80 € | 35 € |
| **Total** | **1.195 €** | **1.110 €** | **565 €** |

*(Ejemplo ficticio.)*

### Buscador
Búsqueda de países (y, más adelante, ciudades) que centra el globo en el resultado.

## Diseño
- Fondo negro azulado con estrellas y globo 3D en el centro.
- Panel lateral con estadísticas y gráficos comparativos.
- Diseño adaptable a móviles.

## Tecnologías
- [Globe.gl](https://globe.gl) / [react-globe.gl](https://github.com/vasturiano/react-globe.gl): globo 3D
- [Three.js](https://threejs.org): gráficos y efectos 3D
- [React](https://react.dev) + TypeScript (Vite)
- [Tailwind CSS](https://tailwindcss.com): estilos
- Recharts: gráficos comparativos

## Hoja de ruta
- [x] Idea y diseño inicial
- [ ] Prototipo: globo, selección de países y panel de estadísticas
- [ ] Buscador y comparador de 2–3 países
- [ ] **«¿Cuánto puedo vivir con mi sueldo?»**: el usuario introduce su salario mensual y la web muestra qué países y ciudades puede permitirse
- [ ] Datos reales de coste de vida (fuentes estadísticas actualizadas)
- [ ] Ciudades

## Ejecución
Aún sin código. Cuando exista el prototipo:

```bash
npm install
npm run dev
```
