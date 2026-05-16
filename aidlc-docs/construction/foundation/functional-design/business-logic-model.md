# Business Logic Model — Unit 1: Foundation

## Visión General

Unit 1 establece la base técnica del proyecto. La lógica de negocio es mínima y se centra en:
1. **Gestión de configuración** — Persistir y recuperar configuración de la app
2. **Notificaciones** — Mostrar feedback al usuario
3. **IndexedDB wrapper** — Abstracción para persistencia local

---

## 1. Configuration Management

### Flujo Principal
```
Usuario abre app → ConfigService.getConfiguration()
  → Si existe en IndexedDB → retornar config guardada
  → Si no existe → retornar config por defecto → guardar en IndexedDB
```

### Configuración por Defecto
```typescript
const DEFAULT_CONFIG: AppConfiguration = {
  connection: {
    mode: 'local',
    localPath: '../TCGT-QA',  // Path relativo al proyecto hermano
    remoteUrl: undefined
  },
  environments: {
    qa: {
      name: 'QA',
      baseUrl: 'https://qa-tarjetadigital.incubadorabi.com',
      variables: {}
    },
    stg: {
      name: 'STG',
      baseUrl: 'https://stg-tarjetadigital.incubadorabi.com',
      variables: {}
    }
  },
  browserstack: undefined,
  preferences: {
    defaultEnvironment: 'qa',
    defaultMode: 'local',
    theme: 'light'
  }
};
```

### Reglas de Validación
- `localPath` debe ser un path válido (no vacío si mode='local')
- `remoteUrl` debe ser URL válida si mode='remote'
- `baseUrl` de ambientes debe ser URL válida
- BrowserStack username y accessKey no pueden estar vacíos si se configuran

---

## 2. Notification System

### Tipos de Notificación
```typescript
type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration: number; // ms, 0 = persistent
  dismissible: boolean;
  timestamp: Date;
}
```

### Reglas de Comportamiento
- Máximo 5 notificaciones visibles simultáneamente
- Las más antiguas se descartan si se excede el límite
- Duration por defecto: success=3000ms, info=4000ms, warning=5000ms, error=0 (persistent)
- Notificaciones de error requieren dismiss manual
- Stack de notificaciones: nuevas aparecen arriba

---

## 3. IndexedDB Persistence Layer

### Stores (Tablas)
```typescript
const DB_NAME = 'tcgt-qa-panel';
const DB_VERSION = 1;

const STORES = {
  configuration: 'configuration',  // AppConfiguration
  history: 'history',              // ExecutionRun[]
  schedules: 'schedules',         // Schedule[]
};
```

### Operaciones Base
```typescript
interface IDBStore<T> {
  getAll(): Observable<T[]>;
  getById(id: string): Observable<T | undefined>;
  put(item: T): Observable<void>;
  delete(id: string): Observable<void>;
  clear(): Observable<void>;
}
```

### Reglas de Migración
- Si DB_VERSION cambia, ejecutar migración automática
- Nunca perder datos del usuario en migraciones
- Si migración falla, mantener versión anterior y notificar al usuario

---

## 4. Routing & Navigation

### Reglas de Navegación
- Ruta por defecto: `/dashboard`
- Rutas inválidas: redirect a `/dashboard`
- Lazy loading para todas las features (no cargar hasta que se navegue)
- Breadcrumbs generados automáticamente desde la ruta activa

### Estructura de Rutas
```
/                     → redirect to /dashboard
/dashboard            → DashboardPageComponent
/tests                → TestListPageComponent
/data-providers       → DataProviderPageComponent
/execute              → ExecutionConfigPageComponent
/reports/:runId       → ReportDetailPageComponent
/history              → HistoryPageComponent
/scheduling           → SchedulingPageComponent
/configuration        → ConfigurationPageComponent
/**                   → redirect to /dashboard
```
