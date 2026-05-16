# Componentes — TCGT-QA-Panel

## Visión General de Componentes

El panel se organiza en módulos Angular con lazy loading. Cada módulo representa una funcionalidad principal accesible desde el dashboard central.

---

## 1. Shell (App Shell)

**Propósito**: Layout principal de la aplicación, navegación y estructura base.

**Responsabilidades**:
- Renderizar layout principal (header, content area, footer)
- Proveer navegación global (breadcrumbs, back navigation)
- Manejar estado global de la app (loading, notifications/toasts)
- Routing principal entre módulos

**Componentes UI**:
- `AppComponent` — Root component con router-outlet
- `HeaderComponent` — Barra superior con título, breadcrumbs
- `NotificationToastComponent` — Toasts de feedback al usuario
- `LoadingOverlayComponent` — Overlay de carga global

---

## 2. Dashboard Module

**Propósito**: Vista principal/home con resumen general y acceso rápido a todos los módulos.

**Responsabilidades**:
- Mostrar cards de navegación a cada módulo
- Mostrar métricas resumidas (última ejecución, tasa de éxito, tests totales)
- Mostrar ejecuciones recientes
- Mostrar próximos schedules programados
- Mostrar tendencias básicas (chart de éxito/fallo últimas N ejecuciones)

**Componentes UI**:
- `DashboardPageComponent` — Página principal del dashboard
- `ModuleCardComponent` — Card de navegación a un módulo
- `MetricsSummaryComponent` — Resumen de métricas numéricas
- `RecentExecutionsWidgetComponent` — Lista compacta de ejecuciones recientes
- `UpcomingSchedulesWidgetComponent` — Próximos schedules
- `TrendChartComponent` — Chart de tendencias (Chart.js)

---

## 3. Test Management Module

**Propósito**: Listar, filtrar y seleccionar tests disponibles del proyecto TCGT-QA.

**Responsabilidades**:
- Descubrir tests disponibles (vía `npx playwright test --list` o futura DB)
- Listar tests con metadata (nombre, archivo, tags, prioridad)
- Filtrar por: archivo, tag, prioridad, flujo (B2B/B2C), escenario ID
- Seleccionar tests para ejecución
- Mostrar detalle de cada test

**Componentes UI**:
- `TestListPageComponent` — Página principal de gestión de tests
- `TestFilterBarComponent` — Barra de filtros (tags, prioridad, archivo, flujo)
- `TestTableComponent` — Tabla de tests con selección múltiple
- `TestDetailDrawerComponent` — Panel lateral con detalle de un test
- `TestSelectionSummaryComponent` — Resumen de tests seleccionados

---

## 4. Data Provider Module

**Propósito**: Visualizar y configurar los data providers (datasets) para las ejecuciones.

**Responsabilidades**:
- Visualizar contenido de `data/data_new_client.json` y `data_new_client_TCJ.json`
- Visualizar y editar `data/test-matrix.json`
- Permitir seleccionar qué datasets usar en cada ejecución
- Validar formato de datos antes de guardar cambios

**Componentes UI**:
- `DataProviderPageComponent` — Página principal de data providers
- `DatasetViewerComponent` — Visualizador de un dataset (JSON tree/table)
- `DatasetEditorComponent` — Editor inline de valores del dataset
- `TestMatrixViewerComponent` — Visualizador del test-matrix
- `DatasetSelectorComponent` — Selector de datasets para ejecución

---

## 5. Execution Module

**Propósito**: Configurar y lanzar ejecuciones de tests.

**Responsabilidades**:
- Configurar ejecución: tests seleccionados, ambiente (QA/STG), modo (local/BrowserStack), dataset
- Lanzar ejecución y mostrar progreso
- Mostrar estado en tiempo real (cuando backend disponible)
- Manejar cola de ejecuciones (si hay múltiples en espera)

**Componentes UI**:
- `ExecutionConfigPageComponent` — Página de configuración de ejecución
- `EnvironmentSelectorComponent` — Selector QA/STG
- `ExecutionModeSelectorComponent` — Selector Local/BrowserStack
- `ExecutionProgressComponent` — Barra de progreso y estado en vivo
- `ExecutionQueueComponent` — Cola de ejecuciones pendientes

---

## 6. Reports Module

**Propósito**: Visualizar resultados completos de ejecuciones.

**Responsabilidades**:
- Mostrar resultados detallados por test (pass/fail/skip)
- Mostrar logs, screenshots, traces, videos
- Integrar reporte HTML de Playwright (iframe o link)
- Mostrar resumen general (totales, tiempos, tasa de éxito)
- Permitir comparar resultados entre ejecuciones

**Componentes UI**:
- `ReportDetailPageComponent` — Página de detalle de un reporte
- `TestResultListComponent` — Lista de resultados por test
- `TestResultDetailComponent` — Detalle de un test (logs, screenshot, trace)
- `ReportSummaryComponent` — Resumen numérico del reporte
- `PlaywrightReportViewerComponent` — Visor del HTML report de Playwright
- `ExecutionComparisonComponent` — Comparador de dos ejecuciones

---

## 7. History Module

**Propósito**: Mantener y consultar historial de ejecuciones pasadas.

**Responsabilidades**:
- Listar todas las ejecuciones pasadas con metadata
- Filtrar por fecha, ambiente, estado (pass/fail), tags
- Acceder al reporte de cualquier ejecución pasada
- Mostrar tendencias históricas
- Persistir en IndexedDB

**Componentes UI**:
- `HistoryPageComponent` — Página principal de historial
- `HistoryFilterBarComponent` — Filtros de historial
- `HistoryTableComponent` — Tabla de ejecuciones pasadas
- `HistoryTrendChartComponent` — Chart de tendencias históricas

---

## 8. Scheduling Module

**Propósito**: Configurar ejecuciones automáticas programadas (UI-only en v1).

**Responsabilidades**:
- Crear/editar/eliminar schedules
- Configurar: frecuencia, hora, días, tests, ambiente, dataset
- Mostrar próximas ejecuciones programadas
- Persistir configuración en IndexedDB (ejecutable cuando exista backend)

**Componentes UI**:
- `SchedulingPageComponent` — Página principal de scheduling
- `ScheduleFormComponent` — Formulario de creación/edición de schedule
- `ScheduleListComponent` — Lista de schedules configurados
- `CronPreviewComponent` — Preview de próximas ejecuciones según cron expression

---

## 9. Configuration Module

**Propósito**: Gestionar configuración de ambientes y conexión con TCGT-QA.

**Responsabilidades**:
- Configurar ambientes (QA/STG) con sus variables
- Configurar ruta/conexión al proyecto TCGT-QA (local path o URL de API)
- Configurar credenciales de BrowserStack
- Gestionar preferencias del panel

**Componentes UI**:
- `ConfigurationPageComponent` — Página principal de configuración
- `EnvironmentConfigComponent` — Configuración por ambiente
- `ConnectionConfigComponent` — Configuración de conexión a TCGT-QA
- `BrowserStackConfigComponent` — Configuración de BrowserStack
- `PreferencesComponent` — Preferencias generales del panel

---

## 10. Shared Module

**Propósito**: Componentes, pipes, directivas y utilidades reutilizables.

**Responsabilidades**:
- Componentes UI genéricos (buttons, cards, tables, modals, badges)
- Pipes comunes (date formatting, status formatting, duration)
- Directivas (loading, tooltip, copy-to-clipboard)
- Modelos/interfaces compartidos

**Componentes UI**:
- `CardComponent` — Card genérica reutilizable
- `DataTableComponent` — Tabla genérica con sorting, pagination, selection
- `StatusBadgeComponent` — Badge de estado (pass/fail/running/pending)
- `ConfirmDialogComponent` — Diálogo de confirmación
- `EmptyStateComponent` — Estado vacío con ilustración y CTA
- `SearchInputComponent` — Input de búsqueda con debounce
