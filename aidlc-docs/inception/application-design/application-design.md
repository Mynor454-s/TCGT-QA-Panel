# Diseño de Aplicación Consolidado — TCGT-QA-Panel

## Resumen Ejecutivo

TCGT-QA-Panel es un panel de gestión de automatizaciones construido con Angular 21, Tailwind CSS y Chart.js. Permite a QA manuales gestionar, ejecutar y monitorear tests de Playwright del proyecto TCGT-QA desde una interfaz web amigable.

### Decisiones Arquitectónicas Clave

| Decisión | Elección | Justificación |
|----------|----------|---------------|
| Framework UI | Tailwind CSS + custom components | Máxima flexibilidad, sin dependencia de librería UI pesada |
| Charts | Chart.js (ng2-charts) | Simple, ligero, suficiente para métricas básicas |
| Service Pattern | Interfaces + DI Tokens | Permite swap de mock → real sin cambiar componentes |
| Persistencia (v1) | IndexedDB | Capacidad suficiente, persiste entre sesiones, no requiere backend |
| Test Discovery | `npx playwright test --list` | Directo, sin configuración extra. Preparado para DB futura |
| Deployment | Docker | Portable, reproducible, fácil de compartir |
| Navegación | Dashboard central con cards | Intuitivo para usuarios no técnicos |
| Conexión TCGT-QA | Flexible (local/remoto) | Soporta desarrollo local y despliegue separado |

---

## Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                     ANGULAR 21 FRONTEND                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────┐ ┌──────┐ ┌─────────┐ ┌───────┐ ┌──────────┐  │
│  │Dashboard│ │Tests │ │Execution│ │Reports│ │  History  │  │
│  └────┬────┘ └──┬───┘ └────┬────┘ └───┬───┘ └─────┬────┘  │
│       │         │           │          │            │        │
│  ┌────┴─────────┴───────────┴──────────┴────────────┴────┐  │
│  │              SERVICE LAYER (Interfaces)                 │  │
│  │  ITestDiscovery | IExecution | IReport | IHistory | ... │  │
│  └────┬─────────────────────────────────────────────┬────┘  │
│       │                                             │        │
│  ┌────┴──────────────────┐  ┌───────────────────────┴────┐  │
│  │  Mock/Local Services  │  │   HTTP Services (futuro)   │  │
│  │  (v1 implementation)  │  │   (swap via DI tokens)     │  │
│  └────┬──────────────────┘  └────────────────────────────┘  │
│       │                                                      │
│  ┌────┴──────────────────────────────────────────────────┐  │
│  │              PERSISTENCIA                              │  │
│  │  IndexedDB (historial, schedules, config)             │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         │                              │
         ▼ (v1: filesystem)             ▼ (futuro: API)
┌─────────────────────┐       ┌─────────────────────┐
│    TCGT-QA Project  │       │   Backend API       │
│  (Playwright tests) │       │  (Node.js + DB)     │
└─────────────────────┘       └─────────────────────┘
```

---

## Módulos del Sistema

| # | Módulo | Propósito | Lazy Load |
|---|--------|-----------|-----------|
| 1 | Shell/Layout | Layout principal, header, notifications | No (root) |
| 2 | Dashboard | Vista general, métricas, acceso rápido | Sí |
| 3 | Test Management | Listar, filtrar, seleccionar tests | Sí |
| 4 | Data Provider | Gestionar datasets y test-matrix | Sí |
| 5 | Execution | Configurar y lanzar ejecuciones | Sí |
| 6 | Reports | Visualizar resultados y reportes | Sí |
| 7 | History | Historial de ejecuciones pasadas | Sí |
| 8 | Scheduling | Programar ejecuciones automáticas | Sí |
| 9 | Configuration | Ambientes, conexión, preferencias | Sí |
| 10 | Shared | Componentes, pipes, directivas comunes | Importado por otros |

---

## Service Layer

7 servicios principales con patrón Interface + DI Token:

| Servicio | Token | Impl v1 | Impl Futura |
|----------|-------|---------|-------------|
| TestDiscovery | `TEST_DISCOVERY_SERVICE` | Mock (playwright --list) | HTTP → API/DB |
| DataProvider | `DATA_PROVIDER_SERVICE` | Local (filesystem JSON) | HTTP → API |
| Execution | `EXECUTION_SERVICE` | Mock (simulado) | HTTP + WebSocket |
| Report | `REPORT_SERVICE` | Local (playwright-report/) | HTTP → Storage |
| History | `HISTORY_SERVICE` | IndexedDB | HTTP → DB |
| Schedule | `SCHEDULE_SERVICE` | IndexedDB (UI-only) | HTTP → Backend cron |
| Configuration | `CONFIGURATION_SERVICE` | IndexedDB/localStorage | HTTP → API |

+ `NotificationService` (concreto, sin abstracción necesaria)

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Angular 21.2 (standalone components, signals) |
| Styling | Tailwind CSS 4.x |
| Charts | Chart.js + ng2-charts |
| State | Angular Signals |
| Persistencia | IndexedDB (via wrapper service) |
| Testing | Vitest + PBT (fast-check) |
| Build | Angular CLI (@angular/build) |
| Deploy | Docker + docker-compose |

---

## Documentos Detallados

- [components.md](./components.md) — Definición de componentes por módulo
- [component-methods.md](./component-methods.md) — Interfaces y métodos de servicios
- [services.md](./services.md) — Service layer, patrones y orquestación
- [component-dependency.md](./component-dependency.md) — Dependencias, routing y estructura de directorios
