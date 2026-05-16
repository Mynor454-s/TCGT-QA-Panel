# Dependencias entre Unidades de Trabajo — TCGT-QA-Panel

## Matriz de Dependencias

| Unidad | Depende de | Es dependencia de |
|--------|-----------|-------------------|
| Unit 1: Foundation | — | Todas (2, 3, 4, 5, 6) |
| Unit 2: Test Mgmt + Data | Unit 1 | Unit 3, Unit 5, Unit 6 |
| Unit 3: Execution + Reports | Unit 1, Unit 2 | Unit 4, Unit 5 |
| Unit 4: History | Unit 1, Unit 3 | Unit 5, Unit 6 |
| Unit 5: Dashboard + Metrics | Unit 1, Unit 4 | — |
| Unit 6: Scheduling + Config + Docker | Unit 1, Unit 4 | — |

---

## Grafo de Dependencias

```
Unit 1: Foundation
    │
    ├──────────────────────────────┐
    │                              │
    ▼                              │
Unit 2: Test Mgmt + Data          │
    │                              │
    ▼                              │
Unit 3: Execution + Reports        │
    │                              │
    ▼                              │
Unit 4: History                    │
    │                              │
    ├──────────────┐               │
    ▼              ▼               │
Unit 5: Dashboard  Unit 6: Scheduling + Config + Docker
```

---

## Secuencia de Implementación

```
Semana 1-2:  Unit 1 (Foundation)
                │
Semana 3-4:  Unit 2 (Test Management + Data Providers)
                │
Semana 5-6:  Unit 3 (Execution + Reports)
                │
Semana 7:    Unit 4 (History)
                │
                ├─────────────────────┐
Semana 8:    Unit 5 (Dashboard)    Unit 6 (Scheduling + Docker)
```

**Nota**: Units 5 y 6 pueden desarrollarse en paralelo ya que no dependen entre sí.

---

## Interfaces de Integración entre Unidades

### Unit 1 → Unit 2
- `ITestDiscoveryService` interface definida en Unit 1, implementada en Unit 2
- `IDataProviderService` interface definida en Unit 1, implementada en Unit 2
- Shared components (DataTable, SearchInput, StatusBadge) usados por Unit 2

### Unit 2 → Unit 3
- `TestItem[]` seleccionados en Test Management, consumidos por Execution
- `DatasetContent` seleccionado en Data Provider, usado en Execution config

### Unit 3 → Unit 4
- `ExecutionRun` generado por Execution, persistido por History
- `IHistoryService.saveExecution()` llamado al completar ejecución

### Unit 4 → Unit 5
- `IHistoryService.getHistoryMetrics()` consumido por Dashboard para métricas
- `ExecutionRun[]` recientes mostrados en Dashboard widget

### Unit 4 → Unit 6
- `IScheduleService` usa `IHistoryService` para mostrar última ejecución de cada schedule
- Configuration provee settings globales usados por History (ambiente default, etc.)

---

## Contratos de Integración

Cada unidad debe respetar las interfaces definidas en `core/interfaces/`. Los contratos clave:

1. **TestItem** — Modelo compartido entre Test Management, Execution, y Scheduling
2. **ExecutionRun** — Modelo compartido entre Execution, Reports, History, y Dashboard
3. **ExecutionConfig** — Modelo compartido entre Execution y Scheduling
4. **AppConfiguration** — Modelo compartido entre Configuration y todos los servicios

Estos modelos se definen en Unit 1 (`core/models/`) y no deben modificarse sin actualizar todas las unidades dependientes.
