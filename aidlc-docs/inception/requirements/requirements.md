# Documento de Requerimientos — TCGT-QA-Panel

## Intent Analysis

- **User Request**: Panel de gestión de automatizaciones para QA manual, que permita gestionar y ejecutar todas las automatizaciones del proyecto TCGT-QA desde un frontend amigable.
- **Request Type**: New Feature (aplicación completa)
- **Scope Estimate**: System-wide (múltiples componentes: dashboard, ejecución, reportes, configuración, historial)
- **Complexity Estimate**: Complex (múltiples módulos, integración con Playwright, data providers, ambientes, Docker)

---

## 1. Requerimientos Funcionales

### RF-01: Gestión de Tests
- El panel debe listar todos los tests disponibles del proyecto TCGT-QA
- Debe permitir filtrar tests por:
  - Archivo de test (spec file)
  - Tags (@smoke, @e2e, @P0, @P1, @P2, @P3, @B2B, @B2C)
  - Escenario ID (@E2E-001, @E2E-B2C-001)
  - Suite completa
- Debe mostrar metadata de cada test: nombre, tags, prioridad, flujo asociado

### RF-02: Configuración de Data Providers
- El panel debe permitir visualizar y editar los datos de prueba (data providers)
- Debe soportar la gestión de datasets del archivo `data/data_new_client.json` y `data/data_new_client_TCJ.json`
- Debe permitir configurar qué datasets usar para cada ejecución
- Debe soportar la visualización y edición del `data/test-matrix.json` (registro central de escenarios)
- Los data providers deben de poder configurarse de manera RND si es necesario

### RF-03: Ejecución de Tests
- Debe permitir ejecutar tests seleccionados bajo demanda
- Modos de ejecución:
  - **Local en servidor**: Ejecutar Playwright directamente
  - **BrowserStack**: Ejecutar vía BrowserStack SDK para cross-browser testing
- Debe permitir seleccionar el ambiente de ejecución: QA o STG
- Debe mostrar estado de ejecución en tiempo real (cuando el backend esté disponible)
- Debe soportar ejecución de tests individuales, por tag, o suite completa

### RF-04: Reportes y Resultados
- Debe mostrar resultados completos de cada ejecución:
  - Estado por test (passed/failed/skipped)
  - Logs de consola
  - Screenshots de fallos
  - Traces de Playwright
  - Video de ejecución (cuando disponible)
  - Tiempo de ejecución por test
- Debe integrar el reporte HTML de Playwright (poder abrirlo/visualizarlo desde el panel)
- Debe mostrar resumen general: total tests, pasados, fallidos, tiempo total

### RF-05: Historial de Ejecuciones
- Debe mantener un historial de ejecuciones pasadas
- Cada entrada del historial debe incluir: fecha, ambiente, tests ejecutados, resultados, duración
- Debe permitir comparar resultados entre ejecuciones
- Debe permitir filtrar historial por fecha, ambiente, estado (pass/fail)

### RF-06: Programación de Ejecuciones (Scheduling)
- Debe permitir programar ejecuciones automáticas (tipo cron)
- Configuración de schedule: frecuencia, hora, días, tests a ejecutar, ambiente
- Debe mostrar próximas ejecuciones programadas
- Debe notificar resultados de ejecuciones programadas (al menos en el panel)

### RF-07: Configuración de Ambientes
- Debe permitir configurar y alternar entre ambientes (QA, STG)
- Debe mostrar las variables de configuración relevantes por ambiente (sin exponer secretos)
- Debe permitir seleccionar el ambiente antes de cada ejecución

### RF-08: Dashboard Principal
- Vista general con:
  - Estado de la última ejecución
  - Tests disponibles por categoría
  - Ejecuciones recientes
  - Próximas ejecuciones programadas
  - Métricas básicas (tasa de éxito, tests más fallidos, tendencias)

---

## 2. Requerimientos No Funcionales

### RNF-01: Arquitectura
- **Frontend**: Angular 21 (standalone components, signals)
- **Arquitectura preparada para backend**: Capa de servicios con interfaces/abstractions que permitan conectar un backend real (Node.js + DB + WebSockets) en el futuro
- **Patrón**: Service layer con implementaciones mock/local por ahora, reemplazables por HTTP clients cuando exista API
- **Estado**: Usar signals de Angular para state management reactivo

### RNF-02: Despliegue
- Debe ser desplegable en contenedores Docker
- Dockerfile para build de producción
- docker-compose para desarrollo local
- Configuración de ambientes vía variables de entorno

### RNF-03: Usabilidad
- Interfaz intuitiva para QA manuales (no necesariamente técnicos en código)
- Navegación clara entre secciones (dashboard, tests, ejecución, reportes, configuración)
- Feedback visual inmediato en acciones (loading states, progress bars, toasts)
- Responsive design (funcional en desktop, usable en tablet)

### RNF-04: Performance
- Carga inicial del panel < 3 segundos
- Listado de tests debe cargar en < 1 segundo
- Actualización de estado de ejecución en tiempo real (cuando backend disponible)

### RNF-05: Mantenibilidad
- Código modular con lazy loading por feature
- Componentes reutilizables en shared module
- Convenciones de Angular CLI (naming, estructura)
- Tests unitarios con Vitest para lógica de negocio

### RNF-06: Accesibilidad
- Sin autenticación requerida (herramienta interna)
- Accesible desde cualquier máquina en la red del equipo

### RNF-07: Testing
- Property-Based Testing (PBT) habilitado para lógica de negocio
- Tests unitarios para servicios y utilidades
- Tests de componentes para UI crítica

---

## 3. Restricciones Técnicas

- **Framework**: Angular 21.2 (ya configurado en el workspace)
- **Styling**: SCSS
- **Test Runner**: Vitest 4.0
- **Build**: Angular CLI con @angular/build
- **Integración**: Debe poder comunicarse con el proyecto TCGT-QA (mismo filesystem o API futura)
- **Sin backend propio inicialmente**: Toda la lógica de ejecución será mock/simulada hasta que exista una API

---

## 4. Alcance Futuro (Out of Scope para v1, pero arquitectura preparada)

- Backend real con Node.js/Express
- Base de datos para persistencia de historial y configuraciones
- WebSockets para resultados en tiempo real
- Integración con otros proyectos de automatización
- Notificaciones push/email de resultados
- Integración con Jira para reportar bugs automáticamente

---

## 5. Extension Configuration

| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | No | Requirements Analysis |
| Property-Based Testing | Yes | Requirements Analysis |
