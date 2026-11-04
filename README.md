# 🛒 ECOCHAIN AUDIT · **TRAZA//CO₂** WMS

**Auditoría de cadena de suministro con visibilidad operacional y trazabilidad del impacto ambiental (Alcance 1, 2 y 3 · GHG Protocol) por SKU.**

[![Licencia](https://img.shields.io/badge/license-Source%20Available-e2703a)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-offline--first-3ecf8e)](#-desplegar-en-github-pages)
[![Dependencias](https://img.shields.io/badge/dependencias-0-38bdf8)](#-stack-técnico)
[![GHG](https://img.shields.io/badge/GHG%20Protocol-Scope%201·2·3-3ecf8e)](#-alcances-cubiertos)
[![Build](https://github.com/TU-USUARIO/TRAZA-CO2/actions/workflows/deploy.yml/badge.svg)](https://github.com/TU-USUARIO/TRAZA-CO2/actions)

> ⚠️ **Maqueta funcional.** Todos los datos son **SINTÉTICOS y reproducibles** (semilla fija `20261104`).
> Ninguna cifra, proveedor, ruta, SKU ni centro logístico corresponde a una empresa real.
> **No sustituye** a un inventario GEI verificado, a una auditoría ISO 14064 ni a una memoria de sostenibilidad.

**🔗 Demo:** `https://TU-USUARIO.github.io/TRAZA-CO2/`
*(Requiere HTTPS o `localhost`: los Service Worker **no** funcionan abriendo el archivo con `file://`.)*

---

## 1 · Qué hace

Una única página (SPA sin framework) con **10 vistas** interconectadas sobre el mismo dataset sintético:

**Inteligencia**
| Vista | Contenido |
|---|---|
| 🧭 Torre de Control de Carbono | KPIs de Alcance 1/2/3, intensidad (kgCO₂e/unidad), evolución, hotspots |
| 🪢 Gemelo Digital · Escenarios | Simulador de palancas de reducción con comparativa base vs. escenario |

**Eslabones operativos**
| # | Vista | Qué se audita |
|---|---|---|
| 1 | 🧾 Compras & Materias Primas | Huella de proveedores, transporte de entrada, % de datos primarios |
| 2 | 🏬 Almacén (SGA Verde) | Consumo energético, frío, embalaje, ocupación cúbica |
| 3 | 📦 Picking & Preparación | Distancia recorrida, re-picking, material de embalaje |
| 4 | 🚚 Transporte & Última Milla | Modos, llenado, kgCO₂e/t·km, rutas |
| 5 | ♻️ Logística Inversa | Devoluciones, reutilización, valorización y vertido |

**Gobierno y salida**
- 🗂️ Trazabilidad por SKU (desglose Alcance 1/2/3 y factores de emisión aplicados)
- ✅ Checklist de auditoría persistente (progreso guardado en `localStorage`)
- 📤 Exportaciones (CSV / JSON / impresión) **marcadas como maqueta**
- 🔌 Conectores de ejemplo (WMS/ERP) — **demostrativos, sin integración real**
- ⚙️ Ajustes: tema claro/oscuro, reset de datos, estado del Service Worker

---

## 2 · ✍️ Entrada de datos por operativa (v3.4.0)

Cada eslabón operativo incorpora un **formulario de registro** con **cálculo automático de impacto ambiental** y **persistencia local**:

| Eslabón | Formulario | Cálculo automático |
|---|---|---|
| 1 · Compras | Proveedor, país, categoría, EcoVadis, ISO 14001, huella, gasto, % embalaje | **Score de homologación** (0-100) y estado (verde / condicional / bloqueado) |
| 2 · Almacén | Zona, m², kWh/mes, tipo, maquinaria | **kWh/m²** y **kgCO₂e** (factor 0,19 kg/kWh) |
| 3 · Picking & Packing | Pedido, volumen producto/caja, cintas, film, relleno | **Ratio de aire**, **% circular** y kgCO₂e |
| 4 · Transporte | Envío, modo, ámbito, distancia, peso, ocupación, combustible | **kgCO₂e** por modo (aéreo 620 · marítimo 22 · ferro 16 g/t·km) |
| 5 · Logística Inversa | Devolución, motivo, clasificación, peso, valor, recogida | **kgCO₂e** devolución vs. recogida selectiva |

- 💾 Los registros se guardan en `localStorage` (clave **`eca.entry`**) y **no se pierden al recargar**.
- 📤 Los botones **CSV** y **JSON** de la barra superior exportan **también tus registros** (`userEntries`).
- 🧮 Los factores de emisión están centralizados en el objeto `FEMIS` para actualizarlos según IPCC / DEFRA / EcoInvent.

---

## 3 · Alcances cubiertos

| Alcance | Fuentes modeladas en la maqueta |
|---|---|
| **1 · Directas** | Combustión fija (grupos electrógenos, calderas, carretillas), fugas de refrigerante, vehículo de empresa |
| **2 · Energía indirecta** | Electricidad y calor de red por centro, con mix renovable configurable |
| **3 · Cadena de valor** | Cat1 upstream (materias primas y transporte de entrada), Cat4 downstream (distribución), Cat5 uso, Cat6 fin de vida, Cat7 transporte marítimo/aéreo |

Metodología y estructura de categorías según **GHG Protocol – Corporate Value Chain (Scope 3) Standard**. Factores de emisión **de ejemplo**, no oficiales.

---

## 4 · Stack técnico

- **0 dependencias, 0 build, 0 CDN**: HTML + CSS + JavaScript vanilla.
- Gráficos **SVG generados en runtime** (barras, líneas, donut, heatmap, mapa de rutas).
- **PWA offline-first**: `manifest.json` + `sw.js` con tres caches (`static`, `runtime`, `data`).
- Datos deterministas: mismo resultado en cada carga hasta que se resetea.
- Accesible e imprimible (`@media print` oculta navegación y deja el informe).
- Responsive: sidebar deslizante en móvil, grids fluidos en escritorio.

---

## 5 · Estructura del repositorio

```text
.
├── index.html          # SPA completa (10 vistas, estilos y datos)
├── sw.js               # Service Worker offline-first  → VERSION = '3.4.0'
├── manifest.json       # Manifiesto PWA (start_url y scope relativos)
├── icon-cart.svg       # Icono de la app (favicon + logo + PWA)
├── icon-maskable.svg   # Icono maskable (zona segura central)
├── .nojekyll           # Desactiva Jekyll en GitHub Pages
├── .gitignore
├── LICENSE             # Licencia source-available TRAZA//CO₂ v1.0
├── README.md
├── CHANGELOG.md        # Historial de versiones
├── docs/               # Capturas y material de apoyo
└── .github/workflows/  # CI: publica Pages + control de datos personales
```

---

## 6 · Ejecutar en local

```bash
# desde la carpeta del proyecto
python -m http.server 8000
# → abre http://localhost:8000
```

Alternativas:

```bash
npx serve .          # Node
```

o en VS Code: extensión **Live Server** → clic derecho sobre `index.html` → *Open with Live Server*.

**Comprobación rápida** (F12 → Consola):
- sin errores `404` (sobre todo en `icon-cart.svg` e `icon-maskable.svg`);
- mensaje verde `[SW 3.4.0] instalado`;
- pestaña *Application → Service Workers* registrado; marcando **Offline** y recargando, la app sigue funcionando.

> 💡 Si cambias cualquier archivo, sube `VERSION` en `sw.js` (p. ej. `3.4.1`) para que los navegadores invaliden la caché vieja.

---

## 7 · Desplegar en GitHub Pages

1. Sube el repo (rama `main`).
2. **Settings → Pages → Build and deployment → Source: *Deploy from a branch*** → rama `main` / carpeta `/ (root)`.
3. Espera el pipeline y abre `https://TU-USUARIO.github.io/TRAZA-CO2/`.

Con el workflow incluido en `.github/workflows/`, el despliegue es automático en cada push **y la compilación falla si reaparecen el teléfono o el email del autor** en cualquier archivo del repo.

Si usas *GitHub Actions* como fuente de despliegue, selecciona el job que publica Pages en **Settings → Pages**.

---

## 8 · Datos sintéticos

Todo el contenido se genera en cliente a partir de una semilla fija, de modo que los gráficos y KPIs son **estables y reproducibles** en cada carga. Los formularios de **entrada de datos por operativa** son la única fuente de datos introducida por el usuario y se almacenan localmente en el navegador.

- **Semilla:** `20261104`
- **Reset:** botón de ajustes o borrar la clave `eca.entry` / `eca.checklist` del `localStorage`.
- **Naturaleza:** datos de demostración, **no verificados**.

---

## 9 · 📸 Capturas

> Añade aquí tus imágenes de `docs/`:

```markdown
![Torre de Control](docs/screenshot-overview.png)
![Gemelo Digital](docs/screenshot-twin.png)
![Entrada de datos](docs/screenshot-entrada-datos.png)
```

---

## 10 · Licencia y autoría

**Licencia:** *Source-Available* — TRAZA//CO₂ v1.0 (ver [`LICENSE`](LICENSE)).
Uso interno, formativo y de auditoría permitido. Redistribución comercial o como SaaS no incluida.

**Autor:** Miguel Ángel Layunta López — *TRAZA//CO₂ WMS · Sistemas de Trazabilidad Carbono · Logística 5.0*
**Contacto:** mlayuntalopez [at] gmail [punto] com

> SAP, Oracle, Manhattan, Maersk, MSC, Hapag-Lloyd, Iberia, Renfe e InPost son marcas de sus titulares; se citan solo a título descriptivo. Sin afiliación ni aval.

© 2026 Miguel Ángel Layunta López · **ECOCHAIN AUDIT · TRAZA//CO₂ WMS**