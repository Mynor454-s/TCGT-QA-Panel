# Domain Entities — Unit 1: Foundation

## Core Models (Definidos en Unit 1, usados por todas las unidades)

---

### TestItem
Representa un test individual del proyecto TCGT-QA.

```typescript
interface TestItem {
  id: string;                    // Identificador único (hash del path + title)
  title: string;                 // Nombre del test
  file: string;                  // Archivo .spec.ts
  tags: string[];                // Tags: @smoke, @e2e, @P0, @B2B, etc.
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  flow: 'B2B' | 'B2C' | 'TCJ';
  scenarioId?: string;           // @E2E-001, @E2E-B2C-001
}
```

---

### TestFilter
Criterios de filtrado para tests.

```typescript
interface TestFilter {
  tags?: string[];
  priority?: ('P0' | 'P1' | 'P2' | 'P3')[];
  flow?: ('B2B' | 'B2C' | 'TCJ')[];
  file?: string;
  search?: string;               // Búsqueda por título
}
```

---

### ExecutionConfig
Configuración para lanzar una ejecución.

```typescript
interface ExecutionConfig {
  tests: TestItem[];
  environment: 'qa' | 'stg';
  mode: 'local' | 'browserstack';
  dataset?: string;              // Key del dataset a usar
  tags?: string[];               // Alternativa: ejecutar por tags
}
```

---

### ExecutionRun
Representa una ejecución (en curso o completada).

```typescript
interface ExecutionRun {
  id: string;                    // UUID generado al crear
  config: ExecutionConfig;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  results?: ExecutionResults;
}

type ExecutionStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
```

---

### ExecutionResults
Resultados agregados de una ejecución.

```typescript
interface ExecutionResults {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;              // Duración total en ms
  testResults: TestResult[];
}
```

---

### TestResult
Resultado individual de un test.

```typescript
interface TestResult {
  testId: string;
  title: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;              // ms
  logs?: string[];
  screenshotUrl?: string;
  traceUrl?: string;
  videoUrl?: string;
  error?: string;
}
```

---

### Schedule
Configuración de ejecución programada.

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
```

---

### AppConfiguration
Configuración global de la aplicación.

```typescript
interface AppConfiguration {
  connection: ConnectionConfig;
  environments: Record<'qa' | 'stg', EnvironmentConfig>;
  browserstack?: BrowserStackConfig;
  preferences: UserPreferences;
}

interface ConnectionConfig {
  mode: 'local' | 'remote';
  localPath?: string;
  remoteUrl?: string;
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
```

---

### Notification
Notificación del sistema.

```typescript
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration: number;              // ms, 0 = persistent
  dismissible: boolean;
  timestamp: Date;
}
```

---

### HistoryFilter
Filtros para consultar historial.

```typescript
interface HistoryFilter {
  dateFrom?: Date;
  dateTo?: Date;
  environment?: 'qa' | 'stg';
  status?: ExecutionStatus;
  tags?: string[];
}
```

---

### HistoryMetrics
Métricas calculadas del historial.

```typescript
interface HistoryMetrics {
  totalExecutions: number;
  averageSuccessRate: number;
  averageDuration: number;
  executionsByDay: { date: string; count: number; successRate: number }[];
  mostFailedTests: { testId: string; title: string; failCount: number }[];
}
```

---

## Relaciones entre Entidades

```
AppConfiguration ──── ConnectionConfig
                 ├─── EnvironmentConfig (qa, stg)
                 ├─── BrowserStackConfig
                 └─── UserPreferences

TestItem ─────────┐
                  ├──── ExecutionConfig ──── ExecutionRun ──── ExecutionResults
TestFilter ───────┘                                              └── TestResult[]

Schedule ──── ScheduleConfig ──── (references TestItem[] or tags)

HistoryFilter ──── (queries) ──── ExecutionRun[]
HistoryMetrics ──── (computed from) ──── ExecutionRun[]

Notification (standalone, no relationships)
```
