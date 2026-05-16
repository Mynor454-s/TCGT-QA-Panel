# Dependencias de Componentes — TCGT-QA-Panel

## Matriz de Dependencias

| Módulo | Depende de (Servicios) | Depende de (Módulos) |
|--------|----------------------|---------------------|
| **Shell** | NotificationService | SharedModule |
| **Dashboard** | IHistoryService, IScheduleService, IExecutionService | SharedModule |
| **Test Management** | ITestDiscoveryService | SharedModule |
| **Data Provider** | IDataProviderService | SharedModule |
| **Execution** | IExecutionService, ITestDiscoveryService, IConfigurationService | SharedModule, Test Management (selección) |
| **Reports** | IReportService, IHistoryService | SharedModule |
| **History** | IHistoryService | SharedModule, Reports (link a reporte) |
| **Scheduling** | IScheduleService, ITestDiscoveryService | SharedModule |
| **Configuration** | IConfigurationService | SharedModule |
| **Shared** | — | — |

---

## Grafo de Dependencias

```
                    ┌──────────────┐
                    │    Shell     │
                    │  (Layout)   │
                    └──────┬───────┘
                           │ router-outlet
          ┌────────────────┼────────────────────┐
          │                │                    │
          ▼                ▼                    ▼
┌──────────────┐  ┌──────────────┐    ┌──────────────┐
│  Dashboard   │  │    Tests     │    │ Configuration│
│              │  │  Management  │    │              │
└──────┬───────┘  └──────┬───────┘    └──────────────┘
       │                 │                    ▲
       │                 │                    │ (config)
       │                 ▼                    │
       │         ┌──────────────┐    ┌───────┴──────┐
       │         │  Execution   │───▶│ Data Provider│
       │         │              │    │              │
       │         └──────┬───────┘    └──────────────┘
       │                │
       │                ▼
       │         ┌──────────────┐
       ├────────▶│   Reports    │
       │         │              │
       │         └──────┬───────┘
       │                │
       │                ▼
       │         ┌──────────────┐
       ├────────▶│   History    │
       │         │              │
       │         └──────────────┘
       │
       │         ┌──────────────┐
       └────────▶│  Scheduling  │
                 │              │
                 └──────────────┘
```

---

## Patrones de Comunicación

### 1. Navegación (Router)
- Dashboard → cualquier módulo (vía cards de navegación)
- Execution → Reports (al completar ejecución)
- History → Reports (al seleccionar ejecución pasada)

### 2. Datos Compartidos (Servicios)
- Test Management → Execution: Tests seleccionados (vía state en servicio o route params)
- Execution → History: Guardar resultado al completar
- Configuration → Todos: Provee ambiente, paths, preferencias

### 3. Eventos (Signals/Observables)
- ExecutionService emite status updates → Dashboard y Execution escuchan
- HistoryService emite cambios → Dashboard actualiza métricas
- ConfigurationService emite cambios → Todos los servicios se reconfiguran

---

## Estructura de Routing

```typescript
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard-page.component')
  },
  { 
    path: 'tests', 
    loadComponent: () => import('./features/test-management/test-list-page.component')
  },
  { 
    path: 'data-providers', 
    loadComponent: () => import('./features/data-provider/data-provider-page.component')
  },
  { 
    path: 'execute', 
    loadComponent: () => import('./features/execution/execution-config-page.component')
  },
  { 
    path: 'reports/:runId', 
    loadComponent: () => import('./features/reports/report-detail-page.component')
  },
  { 
    path: 'history', 
    loadComponent: () => import('./features/history/history-page.component')
  },
  { 
    path: 'scheduling', 
    loadComponent: () => import('./features/scheduling/scheduling-page.component')
  },
  { 
    path: 'configuration', 
    loadComponent: () => import('./features/configuration/configuration-page.component')
  },
];
```

---

## Estructura de Directorios

```
src/
├── app/
│   ├── app.ts                          # Root component
│   ├── app.routes.ts                   # Route definitions
│   ├── app.config.ts                   # App providers (DI tokens)
│   │
│   ├── core/                           # Singleton services, guards, interceptors
│   │   ├── interfaces/                 # Service interfaces
│   │   │   ├── test-discovery.interface.ts
│   │   │   ├── data-provider.interface.ts
│   │   │   ├── execution.interface.ts
│   │   │   ├── report.interface.ts
│   │   │   ├── history.interface.ts
│   │   │   ├── schedule.interface.ts
│   │   │   └── configuration.interface.ts
│   │   ├── tokens/                     # DI injection tokens
│   │   │   └── service-tokens.ts
│   │   ├── models/                     # Shared TypeScript interfaces/types
│   │   │   ├── test.model.ts
│   │   │   ├── execution.model.ts
│   │   │   ├── report.model.ts
│   │   │   ├── schedule.model.ts
│   │   │   └── configuration.model.ts
│   │   └── services/                   # Concrete implementations
│   │       ├── mock/                   # Mock implementations (v1)
│   │       │   ├── mock-test-discovery.service.ts
│   │       │   ├── mock-execution.service.ts
│   │       │   └── ...
│   │       ├── local/                  # Local implementations (IndexedDB, etc.)
│   │       │   ├── indexeddb-history.service.ts
│   │       │   ├── indexeddb-schedule.service.ts
│   │       │   └── local-configuration.service.ts
│   │       └── notification.service.ts
│   │
│   ├── shared/                         # Shared components, pipes, directives
│   │   ├── components/
│   │   │   ├── card/
│   │   │   ├── data-table/
│   │   │   ├── status-badge/
│   │   │   ├── confirm-dialog/
│   │   │   ├── empty-state/
│   │   │   └── search-input/
│   │   ├── pipes/
│   │   │   ├── duration.pipe.ts
│   │   │   ├── status-label.pipe.ts
│   │   │   └── relative-date.pipe.ts
│   │   └── directives/
│   │       └── loading.directive.ts
│   │
│   ├── features/                       # Feature modules (lazy loaded)
│   │   ├── dashboard/
│   │   │   ├── dashboard-page.component.ts
│   │   │   ├── components/
│   │   │   │   ├── module-card.component.ts
│   │   │   │   ├── metrics-summary.component.ts
│   │   │   │   ├── recent-executions-widget.component.ts
│   │   │   │   ├── upcoming-schedules-widget.component.ts
│   │   │   │   └── trend-chart.component.ts
│   │   │   └── dashboard-page.component.html
│   │   ├── test-management/
│   │   ├── data-provider/
│   │   ├── execution/
│   │   ├── reports/
│   │   ├── history/
│   │   ├── scheduling/
│   │   └── configuration/
│   │
│   └── layout/                         # Shell/layout components
│       ├── header.component.ts
│       ├── notification-toast.component.ts
│       └── loading-overlay.component.ts
│
├── styles/                             # Global SCSS
│   ├── _variables.scss
│   ├── _tailwind.scss
│   └── _utilities.scss
│
└── environments/                       # Environment configs
    ├── environment.ts
    └── environment.prod.ts
```
