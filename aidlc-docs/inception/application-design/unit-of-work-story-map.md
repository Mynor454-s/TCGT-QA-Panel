# Mapeo de Requerimientos a Unidades — TCGT-QA-Panel

## Mapeo RF → Unidades

| Requerimiento | Descripción | Unidad |
|---------------|-------------|--------|
| RF-01 | Gestión de Tests (listar, filtrar, metadata) | Unit 2 |
| RF-02 | Configuración de Data Providers | Unit 2 |
| RF-03 | Ejecución de Tests (local + BrowserStack) | Unit 3 |
| RF-04 | Reportes y Resultados (logs, screenshots, traces, HTML report) | Unit 3 |
| RF-05 | Historial de Ejecuciones | Unit 4 |
| RF-06 | Programación de Ejecuciones (Scheduling) | Unit 6 |
| RF-07 | Configuración de Ambientes | Unit 6 |
| RF-08 | Dashboard Principal (métricas, tendencias, acceso rápido) | Unit 5 |

---

## Mapeo RNF → Unidades

| Requerimiento | Descripción | Unidad |
|---------------|-------------|--------|
| RNF-01 | Arquitectura (service layer, DI tokens, signals) | Unit 1 |
| RNF-02 | Despliegue (Docker, docker-compose) | Unit 6 |
| RNF-03 | Usabilidad (navegación, feedback visual, responsive) | Unit 1 (base) + todas |
| RNF-04 | Performance (carga < 3s, lazy loading) | Unit 1 (config) + todas |
| RNF-05 | Mantenibilidad (modular, lazy loading, convenciones) | Unit 1 (estructura) |
| RNF-06 | Accesibilidad (sin auth, red interna) | Unit 1 |
| RNF-07 | Testing (PBT, unit tests) | Todas las unidades |

---

## Cobertura de Funcionalidades por Unidad

### Unit 1: Foundation
- [x] Estructura de proyecto Angular 21
- [x] Tailwind CSS configurado
- [x] Shell/Layout (header, notifications)
- [x] Shared components base
- [x] Core interfaces y modelos
- [x] DI tokens y providers
- [x] Routing con lazy loading
- [x] ConfigurationService (IndexedDB)
- [x] NotificationService

### Unit 2: Test Management + Data Providers
- [x] RF-01: Listar tests disponibles
- [x] RF-01: Filtrar por archivo, tag, prioridad, flujo
- [x] RF-01: Mostrar metadata de tests
- [x] RF-02: Visualizar datasets
- [x] RF-02: Editar datasets
- [x] RF-02: Visualizar test-matrix
- [x] RF-02: Seleccionar datasets para ejecución

### Unit 3: Execution + Reports
- [x] RF-03: Configurar ejecución (tests, ambiente, modo, dataset)
- [x] RF-03: Ejecutar tests (mock en v1)
- [x] RF-03: Mostrar progreso de ejecución
- [x] RF-04: Resultados por test (pass/fail/skip)
- [x] RF-04: Logs, screenshots, traces
- [x] RF-04: Integración HTML report Playwright
- [x] RF-04: Resumen general
- [x] RF-04: Comparar ejecuciones

### Unit 4: History
- [x] RF-05: Historial de ejecuciones
- [x] RF-05: Filtrar por fecha, ambiente, estado
- [x] RF-05: Acceder a reportes pasados
- [x] RF-05: Tendencias históricas

### Unit 5: Dashboard + Metrics
- [x] RF-08: Cards de navegación a módulos
- [x] RF-08: Métricas resumidas
- [x] RF-08: Ejecuciones recientes
- [x] RF-08: Próximos schedules
- [x] RF-08: Tendencias (Chart.js)

### Unit 6: Scheduling + Configuration + Docker
- [x] RF-06: Crear/editar/eliminar schedules
- [x] RF-06: Configurar frecuencia, tests, ambiente
- [x] RF-06: Preview de próximas ejecuciones
- [x] RF-07: Configurar ambientes QA/STG
- [x] RF-07: Configurar conexión a TCGT-QA
- [x] RF-07: Configurar BrowserStack
- [x] RNF-02: Dockerfile multi-stage
- [x] RNF-02: docker-compose.yml

---

## Verificación de Completitud

- **Total RFs**: 8 → Todos mapeados ✅
- **Total RNFs**: 7 → Todos mapeados ✅
- **Unidades sin RF asignado**: Ninguna ✅
- **RFs sin unidad asignada**: Ninguno ✅
