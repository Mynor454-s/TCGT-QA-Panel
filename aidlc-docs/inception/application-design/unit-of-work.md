# Unidades de Trabajo — TCGT-QA-Panel

## Estrategia de Descomposición

- **Enfoque**: Híbrido — Core/Shared como base, luego features completos (UI + servicio + tests)
- **Orden**: MVP mínimo primero, features secundarios después
- **Cantidad**: 6 unidades de trabajo
- **Deployment**: Monolito Angular (single deployable, lazy-loaded features)

---

## Unidad 1: Foundation (Core + Shared + Shell)

**Propósito**: Establecer la base del proyecto — estructura, servicios core, componentes compartidos, layout y configuración de Tailwind/routing.

**Incluye**:
- Configuración de Tailwind CSS
- Shell/Layout (header, notifications, loading overlay)
- Shared components (card, data-table, status-badge, confirm-dialog, empty-state, search-input)
- Shared pipes (duration, status-label, relative-date)
- Core interfaces (todas las IService interfaces)
- Core tokens (DI injection tokens)
- Core models (todos los tipos TypeScript)
- ConfigurationService (implementación IndexedDB)
- NotificationService
- Routing principal con lazy loading
- Estructura de directorios completa

**Entregable**: Aplicación navegable con layout, componentes base funcionales, y service layer definido.

**Orden**: 1° (base para todo lo demás)

---

## Unidad 2: Test Management + Data Providers

**Propósito**: Permitir al QA ver, filtrar y seleccionar tests disponibles, y gestionar los data providers.

**Incluye**:
- TestDiscoveryService (mock: parsea salida de `playwright test --list`)
- DataProviderService (mock: lee JSON locales)
- Test Management feature completo (page, filter bar, table, detail drawer, selection summary)
- Data Provider feature completo (page, dataset viewer, editor, test-matrix viewer, selector)
- Tests unitarios + PBT para lógica de filtrado y parsing

**Entregable**: QA puede ver todos los tests disponibles, filtrarlos, y gestionar datasets.

**Orden**: 2° (prerequisito para ejecución)

---

## Unidad 3: Execution + Reports

**Propósito**: Permitir ejecutar tests y ver resultados completos.

**Incluye**:
- ExecutionService (mock: simula ejecuciones con delays y resultados mock)
- ReportService (mock: genera reportes a partir de resultados simulados)
- Execution feature completo (config page, environment selector, mode selector, progress, queue)
- Reports feature completo (detail page, result list, result detail, summary, playwright viewer, comparison)
- Tests unitarios + PBT para lógica de ejecución y generación de reportes

**Entregable**: QA puede configurar y lanzar ejecuciones (mock), ver resultados detallados con screenshots/logs.

**Orden**: 3° (flujo principal del MVP)

---

## Unidad 4: History

**Propósito**: Persistir y consultar historial de ejecuciones pasadas.

**Incluye**:
- HistoryService (IndexedDB: persistencia real)
- History feature completo (page, filter bar, table, trend chart)
- Integración con ExecutionService (guardar resultado al completar)
- Integración con ReportService (link a reporte desde historial)
- Tests unitarios + PBT para lógica de persistencia y métricas

**Entregable**: QA puede ver historial de ejecuciones, filtrar, y acceder a reportes pasados.

**Orden**: 4° (depende de Execution + Reports)

---

## Unidad 5: Dashboard + Metrics

**Propósito**: Vista general con métricas, acceso rápido y tendencias.

**Incluye**:
- Dashboard feature completo (page, module cards, metrics summary, recent executions widget, upcoming schedules widget, trend chart)
- Integración con Chart.js (ng2-charts) para gráficos de tendencias
- Integración con HistoryService para métricas
- Integración con ScheduleService para próximos schedules
- Tests unitarios para cálculo de métricas

**Entregable**: Dashboard funcional con métricas reales del historial y navegación a todos los módulos.

**Orden**: 5° (depende de History para métricas reales)

---

## Unidad 6: Scheduling + Configuration + Docker

**Propósito**: Features secundarios y preparación para deployment.

**Incluye**:
- ScheduleService (IndexedDB: UI-only, persiste configuración)
- Scheduling feature completo (page, form, list, cron preview)
- Configuration feature completo (page, environment config, connection config, browserstack config, preferences)
- Dockerfile (multi-stage build: build Angular → serve con nginx)
- docker-compose.yml (desarrollo local)
- Tests unitarios + PBT para lógica de cron parsing y validación de configuración

**Entregable**: Panel completo con todas las features, desplegable en Docker.

**Orden**: 6° (último, features no críticos para MVP)

---

## Resumen de Unidades

| # | Unidad | Módulos | Orden | Dependencias |
|---|--------|---------|-------|--------------|
| 1 | Foundation | Core + Shared + Shell + Config | 1° | Ninguna |
| 2 | Test Management + Data Providers | Tests, Data Provider | 2° | Unit 1 |
| 3 | Execution + Reports | Execution, Reports | 3° | Unit 1, Unit 2 |
| 4 | History | History | 4° | Unit 1, Unit 3 |
| 5 | Dashboard + Metrics | Dashboard | 5° | Unit 1, Unit 4 |
| 6 | Scheduling + Config + Docker | Scheduling, Configuration, Docker | 6° | Unit 1, Unit 4 |

---

## Organización de Código

```
src/app/
├── app.ts                    # Root component (Unit 1)
├── app.routes.ts             # Lazy routes (Unit 1)
├── app.config.ts             # DI providers (Unit 1)
├── core/                     # Unit 1
│   ├── interfaces/
│   ├── tokens/
│   ├── models/
│   └── services/
│       ├── mock/
│       ├── local/
│       └── notification.service.ts
├── shared/                   # Unit 1
│   ├── components/
│   ├── pipes/
│   └── directives/
├── layout/                   # Unit 1
│   ├── header.component.ts
│   └── ...
├── features/
│   ├── dashboard/            # Unit 5
│   ├── test-management/      # Unit 2
│   ├── data-provider/        # Unit 2
│   ├── execution/            # Unit 3
│   ├── reports/              # Unit 3
│   ├── history/              # Unit 4
│   ├── scheduling/           # Unit 6
│   └── configuration/        # Unit 6
└── ...
```
