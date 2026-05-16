# Métodos de Componentes — TCGT-QA-Panel

## Nota
Este documento define las interfaces y métodos principales de cada servicio. La lógica de negocio detallada se definirá en la fase de Functional Design (per-unit, CONSTRUCTION phase).

---

## 1. ITestDiscoveryService

**Propósito**: Descubrir y listar tests disponibles del proyecto TCGT-QA.

```typescript
interface ITestDiscoveryService {
  // Obtener lista completa de tests disponibles
  getAvailableTests(): Observable<TestItem[]>;
  
  // Obtener tests filtrados por criterios
  getFilteredTests(filters: TestFilter): Observable<TestItem[]>;
  
  // Obtener metadata de un test específico
  getTestDetail(testId: string): Observable<TestDetail>;
  
  // Refrescar lista de tests (re-ejecutar discovery)
  refreshTests(): Observable<TestItem[]>;
  
  // Obtener tags disponibles
  getAvailableTags(): Observable<string[]>;
  
  // Obtener archivos de test disponibles
  getAvailableFiles(): Observable<string[]>;
}
```

**Tipos**:
```typescript
interface TestItem {
  id: string;
  title: string;
  file: string;
  tags: string[];
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  flow: 'B2B' | 'B2C' | 'TCJ';
  scenarioId?: string;
}

interface TestFilter {
  tags?: string[];
  priority?: string[];
  flow?: string[];
  file?: string;
  search?: string;
}

interface TestDetail extends TestItem {
  fullPath: string;
  steps?: string[];
  lastResult?: TestResultStatus;
  lastExecutionDate?: Date;
}
```

---

## 2. IDataProviderService

**Propósito**: Gestionar datasets y test-matrix.

```typescript
interface IDataProviderService {
  // Obtener lista de datasets disponibles
  getDatasets(): Observable<Dataset[]>;
  
  // Obtener contenido de un dataset específico
  getDatasetContent(datasetId: string): Observable<DatasetContent>;
  
  // Actualizar contenido de un dataset
  updateDatasetContent(datasetId: string, content: DatasetContent): Observable<void>;
  
  // Obtener test-matrix
  getTestMatrix(): Observable<TestMatrix>;
  
  // Actualizar test-matrix
  updateTestMatrix(matrix: TestMatrix): Observable<void>;
  
  // Validar formato de dataset
  validateDataset(content: unknown): ValidationResult;
}
```

**Tipos**:
```typescript
interface Dataset {
  id: string;
  name: string;
  file: string;
  keys: string[]; // e.g., ['Marcos', 'Monther']
}

interface DatasetContent {
  [key: string]: ClienteTestData;
}

interface TestMatrix {
  scenarios: TestScenario[];
}

interface ValidationResult {
  valid: boolean;
  errors?: string[];
}
```

---

## 3. IExecutionService

**Propósito**: Configurar y ejecutar tests.

```typescript
interface IExecutionService {
  // Ejecutar tests seleccionados
  executeTests(config: ExecutionConfig): Observable<ExecutionRun>;
  
  // Obtener estado de una ejecución en curso
  getExecutionStatus(runId: string): Observable<ExecutionStatus>;
  
  // Cancelar una ejecución en curso
  cancelExecution(runId: string): Observable<void>;
  
  // Obtener cola de ejecuciones
  getExecutionQueue(): Observable<ExecutionRun[]>;
  
  // Obtener ejecución activa
  getActiveExecution(): Observable<ExecutionRun | null>;
}
```

**Tipos**:
```typescript
interface ExecutionConfig {
  tests: TestItem[];
  environment: 'qa' | 'stg';
  mode: 'local' | 'browserstack';
  dataset?: string;
  tags?: string[];
}

interface ExecutionRun {
  id: string;
  config: ExecutionConfig;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  results?: ExecutionResults;
}

type ExecutionStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

interface ExecutionResults {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number; // ms
  testResults: TestResult[];
}
```

---

## 4. IReportService

**Propósito**: Gestionar reportes y resultados de ejecuciones.

```typescript
interface IReportService {
  // Obtener reporte de una ejecución
  getReport(runId: string): Observable<ExecutionReport>;
  
  // Obtener resultado detallado de un test
  getTestResult(runId: string, testId: string): Observable<TestResultDetail>;
  
  // Obtener URL del reporte HTML de Playwright
  getPlaywrightReportUrl(runId: string): Observable<string>;
  
  // Comparar dos ejecuciones
  compareExecutions(runId1: string, runId2: string): Observable<ExecutionComparison>;
}
```

**Tipos**:
```typescript
interface ExecutionReport {
  run: ExecutionRun;
  summary: ReportSummary;
  testResults: TestResultDetail[];
  playwrightReportUrl?: string;
}

interface TestResultDetail {
  testId: string;
  title: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  logs?: string[];
  screenshotUrl?: string;
  traceUrl?: string;
  videoUrl?: string;
  error?: string;
}

interface ReportSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  successRate: number;
}

interface ExecutionComparison {
  run1: ExecutionReport;
  run2: ExecutionReport;
  newFailures: TestResultDetail[];
  fixedTests: TestResultDetail[];
  unchanged: TestResultDetail[];
}
```

---

## 5. IHistoryService

**Propósito**: Persistir y consultar historial de ejecuciones (IndexedDB).

```typescript
interface IHistoryService {
  // Obtener historial completo
  getHistory(filters?: HistoryFilter): Observable<ExecutionRun[]>;
  
  // Guardar una ejecución en el historial
  saveExecution(run: ExecutionRun): Observable<void>;
  
  // Obtener una ejecución del historial por ID
  getExecution(runId: string): Observable<ExecutionRun>;
  
  // Eliminar entradas del historial
  deleteExecution(runId: string): Observable<void>;
  
  // Obtener métricas históricas
  getHistoryMetrics(period: 'week' | 'month' | 'all'): Observable<HistoryMetrics>;
}
```

**Tipos**:
```typescript
interface HistoryFilter {
  dateFrom?: Date;
  dateTo?: Date;
  environment?: 'qa' | 'stg';
  status?: ExecutionStatus;
  tags?: string[];
}

interface HistoryMetrics {
  totalExecutions: number;
  averageSuccessRate: number;
  averageDuration: number;
  executionsByDay: { date: string; count: number; successRate: number }[];
  mostFailedTests: { testId: string; title: string; failCount: number }[];
}
```

---

## 6. IScheduleService

**Propósito**: Gestionar schedules de ejecuciones automáticas (UI-only en v1).

```typescript
interface IScheduleService {
  // Obtener todos los schedules
  getSchedules(): Observable<Schedule[]>;
  
  // Crear un nuevo schedule
  createSchedule(schedule: ScheduleConfig): Observable<Schedule>;
  
  // Actualizar un schedule existente
  updateSchedule(id: string, schedule: ScheduleConfig): Observable<Schedule>;
  
  // Eliminar un schedule
  deleteSchedule(id: string): Observable<void>;
  
  // Obtener próximas ejecuciones programadas
  getUpcomingExecutions(limit: number): Observable<ScheduledExecution[]>;
  
  // Activar/desactivar un schedule
  toggleSchedule(id: string, active: boolean): Observable<void>;
}
```

**Tipos**:
```typescript
interface Schedule {
  id: string;
  name: string;
  config: ScheduleConfig;
  active: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  nextExecution?: Date;
}

interface ScheduleConfig {
  cronExpression: string;
  tests: TestItem[] | { tags: string[] };
  environment: 'qa' | 'stg';
  mode: 'local' | 'browserstack';
  dataset?: string;
}

interface ScheduledExecution {
  scheduleId: string;
  scheduleName: string;
  nextRunAt: Date;
  config: ScheduleConfig;
}
```

---

## 7. IConfigurationService

**Propósito**: Gestionar configuración de ambientes y conexiones.

```typescript
interface IConfigurationService {
  // Obtener configuración actual
  getConfiguration(): Observable<AppConfiguration>;
  
  // Actualizar configuración
  updateConfiguration(config: Partial<AppConfiguration>): Observable<void>;
  
  // Obtener configuración de un ambiente específico
  getEnvironmentConfig(env: 'qa' | 'stg'): Observable<EnvironmentConfig>;
  
  // Testear conexión con TCGT-QA
  testConnection(): Observable<ConnectionTestResult>;
  
  // Obtener modo de conexión actual
  getConnectionMode(): Observable<'local' | 'remote'>;
}
```

**Tipos**:
```typescript
interface AppConfiguration {
  connection: ConnectionConfig;
  environments: Record<'qa' | 'stg', EnvironmentConfig>;
  browserstack?: BrowserStackConfig;
  preferences: UserPreferences;
}

interface ConnectionConfig {
  mode: 'local' | 'remote';
  localPath?: string; // Path al proyecto TCGT-QA
  remoteUrl?: string; // URL de API futura
}

interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  variables: Record<string, string>;
}

interface BrowserStackConfig {
  username: string;
  accessKey: string;
  projectName?: string;
}

interface UserPreferences {
  defaultEnvironment: 'qa' | 'stg';
  defaultMode: 'local' | 'browserstack';
  theme: 'light' | 'dark';
}

interface ConnectionTestResult {
  success: boolean;
  message: string;
  testsFound?: number;
}
```
