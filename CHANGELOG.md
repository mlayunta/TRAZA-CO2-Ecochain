# Changelog

Todas las novedades relevantes de **ECOCHAIN AUDIT · TRAZA//CO₂ WMS**.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el versionado [SemVer](https://semver.org/lang/es/).

## [3.4.0] — 2026-11-04

### Añadido
- **Entrada de datos por operativa** en los 5 eslabones (Compras, Almacén,
  Picking & Packing, Transporte y Logística Inversa) con formulario de registro
  y cálculo automático de impacto ambiental.
- Persistencia local de los registros en `localStorage` bajo la clave `eca.entry`.
- Cálculo automático por módulo:
  - Compras → score de homologación (0-100) y estado (verde/condicional/bloqueado).
  - Almacén → kWh/m² y kgCO₂e (factor 0,19 kg/kWh).
  - Picking → ratio de aire, % circular y kgCO₂e.
  - Transporte → kgCO₂e por modo (aéreo 620 · marítimo 22 · ferro 16 g/t·km).
  - Logística inversa → kgCO₂e devolución vs. recogida selectiva.
- Botón de eliminación de registros por fila.
- Exportación CSV/JSON ampliada para incluir los registros del usuario (`userEntries`).
- Nuevo icono `icon-maskable.svg` (zona segura central, requisito PWA maskable).
- Documento `CHANGELOG.md`.

### Cambiado
- Versión de la aplicación elevada a **3.4.0** (cabecera, sidebar y footer).
- `sw.js`: `VERSION` actualizado de `3.3.1` a `3.4.0` para invalidar cachés antiguas.
- `README.md`: eliminados los placeholders `<usuario>/<repo>`, actualizada la
  versión y añadida la sección de entrada de datos por operativa.
- Estilos: nuevas clases `.inp`, `.fgrid` y `.text-green` integradas en el
  sistema de diseño existente.

### Corregido
- Referencia a `icon-maskable.svg` que provocaba un `404` en el precache del
  Service Worker y en el manifiesto PWA.

## [3.3.1] — 2026-10

### Añadido
- Versión inicial publicada de la maqueta funcional ECOCHAIN AUDIT.
- 10 vistas: Torre de Control, Gemelo Digital, 5 eslabones operativos,
  Auditoría, Integraciones y Autoría.
- PWA offline-first con `manifest.json` y `sw.js` (cachés `static`, `runtime`, `data`).
- Gráficos SVG generados en runtime (barras, líneas, donut, heatmap, mapa de rutas).
- Checklist de auditoría persistente en `localStorage` (clave `eca.checklist`).
- Exportaciones CSV / JSON / impresión marcadas como maqueta.
- Licencia *source-available* TRAZA//CO₂ v1.0.
