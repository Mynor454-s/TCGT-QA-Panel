# Servicios — TCGT-QA-Panel

## Patrón de Service Layer

Se utiliza el patrón de **Interfaces + Clases Concretas** con Angular DI Tokens:

```typescript
// 1. Definir interface
interface ITestDiscoveryService { ... }

// 2. Crear InjectionToken
const TEST_DISCOVERY_SERVICE = new InjectionToken<ITestDiscoveryService>('TestDiscoveryService');

// 3. Implementación Mock (v1)
class MockTestDiscoveryService implements ITestDiscoveryService { ... }

// 4. Implementación Real (futura)
class HttpTestDiscoveryService implements ITestDiscoveryService { ... }

// 5. Proveer en módulo/route
providers: [
  { provide: TEST_DISCOVERY_SERVICE, useClass: MockTestDiscoveryService }
]
```

Este patrón permite reemplazar implementaciones mock por HTTP clients sin cambiar los componentes consumidores.

---

## Servicios Principales

### 1. TestDiscoveryService

| Aspecto | Detalle |
|---------|---------|
| **Token** | `TEST_DISCOVERY_SERVICE` |
| **Interface** | `ITestDiscoveryService` |
| **Mock (v1)** | `MockTestDiscoveryService` — Ejecuta `npx playwright test --list` y parsea la salida |
| **Real (futuro)** | `HttpTestDiscoveryService` — Consulta API/DB |
| **Responsabilidad** | Descubrir tests, filtrar, obtener metadata |
| **Dependencias** | `IConfigurationService` (para saber dónde está TCGT-QA) |

---

### 2. DataProviderService

| Aspecto | Detalle |
|---------|---------|
| **Token** | `DATA_PROVIDER_SERVICE` |
| **Interface** | `IDataProviderService` |
| **Mock (v1)** | `LocalDataProviderService` — Lee/escribe archivos JSON locales |
| **Real (futuro)** | `HttpDataProviderService` — CRUD vía API |
| **Responsabilidad** | Gestionar datasets y test-matrix |
| **Dependencias** | `IConfigurationService` (path al proyecto) |

---

### 3. ExecutionService

| Aspecto | Detalle |
|---------|---------|
| **Token** | `EXECUTION_SERVICE` |
| **Interface** | `IExecutionService` |
| **Mock (v1)** | `MockExecutionService` — Simula ejecuciones con delays y datos mock |
| **Real (futuro)** | `HttpExecutionService` — Dispara ejecuciones vía API + WebSocket para status |
| **Responsabilidad** | Ejecutar tests, monitorear progreso, manejar cola |
| **Dependencias** | `IConfigurationService`, `IHistoryService` (guardar resultado al completar) |

---

### 4. ReportService

| Aspecto | Detalle |
|---------|---------|
| **Token** | `REPORT_SERVICE` |
| **Interface** | `IReportService` |
| **Mock (v1)** | `LocalReportService` — Lee reportes del filesystem local (playwright-report/) |
| **Real (futuro)** | `HttpReportService` — Obtiene reportes de API/storage |
| **Responsabilidad** | Obtener reportes, resultados detallados, comparaciones |
| **Dependencias** | `IHistoryService`, `IConfigurationService` |

---

### 5. HistoryService

| Aspecto | Detalle |
|---------|---------|
| **Token** | `HISTORY_SERVICE` |
| **Interface** | `IHistoryService` |
| **Implementación (v1)** | `IndexedDBHistoryService` — Persiste en IndexedDB del navegador |
| **Real (futuro)** | `HttpHistoryService` — Persiste en DB vía API |
| **Responsabilidad** | CRUD de historial, métricas históricas |
| **Dependencias** | Ninguna (servicio de persistencia puro) |

---

### 6. ScheduleService

| Aspecto | Detalle |
|---------|---------|
| **Token** | `SCHEDULE_SERVICE` |
| **Interface** | `IScheduleService` |
| **Implementación (v1)** | `IndexedDBScheduleService` — Persiste schedules en IndexedDB (UI-only, no ejecuta) |
| **Real (futuro)** | `HttpScheduleService` — CRUD + activación real vía backend |
| **Responsabilidad** | CRUD de schedules, cálculo de próximas ejecuciones |
| **Dependencias** | Ninguna |

---

### 7. ConfigurationService

| Aspecto | Detalle |
|---------|---------|
| **Token** | `CONFIGURATION_SERVICE` |
| **Interface** | `IConfigurationService` |
| **Implementación (v1)** | `LocalConfigurationService` — Persiste en IndexedDB/localStorage |
| **Real (futuro)** | `HttpConfigurationService` — Configuración centralizada vía API |
| **Responsabilidad** | Gestionar configuración de ambientes, conexión, preferencias |
| **Dependencias** | Ninguna (servicio base, otros dependen de él) |

---

### 8. NotificationService

| Aspecto | Detalle |
|---------|---------|
| **Token** | N/A (servicio concreto, no necesita abstracción) |
| **Implementación** | `NotificationService` — Maneja toasts y notificaciones in-app |
| **Responsabilidad** | Mostrar feedback al usuario (éxito, error, info, warning) |
| **Dependencias** | Ninguna |

---

## Diagrama de Orquestación

```
┌─────────────────────────────────────────────────────────┐
│                    COMPONENTES UI                         │
│  Dashboard │ Tests │ Execution │ Reports │ History │ ... │
└──────┬──────┬───────┬──────────┬─────────┬──────────────┘
       │      │       │          │         │
       ▼      ▼       ▼          ▼         ▼
┌─────────────────────────────────────────────────────────┐
│                   SERVICE LAYER (Interfaces)              │
│  ITestDiscovery │ IExecution │ IReport │ IHistory │ ...  │
└──────┬──────────┬────────────┬─────────┬────────────────┘
       │          │            │         │
       ▼          ▼            ▼         ▼
┌─────────────────────────────────────────────────────────┐
│              IMPLEMENTACIONES (v1: Mock/Local)            │
│  MockTestDiscovery │ MockExecution │ IndexedDBHistory │.. │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│              PERSISTENCIA                                 │
│  IndexedDB │ LocalStorage │ Filesystem (vía backend)     │
└─────────────────────────────────────────────────────────┘
```

---

## Flujo de Ejecución Principal

1. **Usuario selecciona tests** → `TestManagementModule` usa `ITestDiscoveryService`
2. **Usuario configura ejecución** → `ExecutionModule` recibe config (ambiente, modo, dataset)
3. **Usuario lanza ejecución** → `IExecutionService.executeTests(config)`
4. **Ejecución en progreso** → `IExecutionService.getExecutionStatus(runId)` (polling o WebSocket futuro)
5. **Ejecución completa** → `IHistoryService.saveExecution(run)` + navegar a reporte
6. **Usuario ve reporte** → `IReportService.getReport(runId)`
7. **Historial** → `IHistoryService.getHistory(filters)`
