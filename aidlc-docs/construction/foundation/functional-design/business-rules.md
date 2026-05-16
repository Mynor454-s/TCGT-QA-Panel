# Business Rules — Unit 1: Foundation

## BR-01: Configuration Persistence

| Rule | Description |
|------|-------------|
| BR-01.1 | La configuración se carga al iniciar la app desde IndexedDB |
| BR-01.2 | Si no existe configuración guardada, se usa la configuración por defecto |
| BR-01.3 | Cambios en configuración se persisten inmediatamente en IndexedDB |
| BR-01.4 | La configuración es un singleton — una sola instancia para toda la app |
| BR-01.5 | ConfigurationService emite un signal cuando la configuración cambia |

## BR-02: Notification Management

| Rule | Description |
|------|-------------|
| BR-02.1 | Máximo 5 notificaciones visibles simultáneamente |
| BR-02.2 | Notificaciones de tipo 'error' no se auto-descartan (duration=0) |
| BR-02.3 | Notificaciones de tipo 'success' se auto-descartan en 3000ms |
| BR-02.4 | Notificaciones de tipo 'info' se auto-descartan en 4000ms |
| BR-02.5 | Notificaciones de tipo 'warning' se auto-descartan en 5000ms |
| BR-02.6 | Si se excede el límite de 5, la notificación más antigua se descarta |
| BR-02.7 | Todas las notificaciones son dismissible por el usuario (click en X) |

## BR-03: IndexedDB Operations

| Rule | Description |
|------|-------------|
| BR-03.1 | Todas las operaciones de IndexedDB son asíncronas (Observable) |
| BR-03.2 | Si IndexedDB no está disponible, fallback a localStorage con warning |
| BR-03.3 | Errores de IndexedDB se capturan y notifican al usuario vía NotificationService |
| BR-03.4 | La DB se inicializa al primer acceso (lazy initialization) |
| BR-03.5 | Migraciones de schema se ejecutan automáticamente al detectar version mismatch |

## BR-04: Routing & Navigation

| Rule | Description |
|------|-------------|
| BR-04.1 | Rutas no reconocidas redirigen a /dashboard |
| BR-04.2 | Todos los feature modules se cargan con lazy loading |
| BR-04.3 | El header muestra breadcrumbs basados en la ruta activa |
| BR-04.4 | No hay guards de autenticación (herramienta interna sin auth) |

## BR-05: Shared Components

| Rule | Description |
|------|-------------|
| BR-05.1 | DataTable soporta sorting por cualquier columna |
| BR-05.2 | DataTable soporta paginación configurable (10, 25, 50 items por página) |
| BR-05.3 | DataTable soporta selección múltiple con checkbox |
| BR-05.4 | SearchInput aplica debounce de 300ms antes de emitir el valor |
| BR-05.5 | StatusBadge mapea estados a colores: passed=green, failed=red, running=blue, skipped=gray, queued=yellow |
| BR-05.6 | ConfirmDialog requiere acción explícita (no se cierra con click fuera) |

## BR-06: Theme & Styling

| Rule | Description |
|------|-------------|
| BR-06.1 | Theme por defecto: light |
| BR-06.2 | Tailwind CSS como sistema de estilos principal |
| BR-06.3 | Colores del sistema definidos en tailwind.config como design tokens |
| BR-06.4 | Responsive: funcional en desktop (>1024px), usable en tablet (>768px) |
