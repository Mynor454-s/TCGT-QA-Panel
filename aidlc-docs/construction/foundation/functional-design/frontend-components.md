# Frontend Components — Unit 1: Foundation

## Shell / Layout

### HeaderComponent
```typescript
@Component({ selector: 'app-header' })
class HeaderComponent {
  // Inputs
  title = input<string>('TCGT-QA Panel');
  
  // State
  breadcrumbs = computed(() => /* derive from Router */);
  
  // Template: Logo + title + breadcrumbs
}
```

### NotificationToastComponent
```typescript
@Component({ selector: 'app-notification-toast' })
class NotificationToastComponent {
  // Injected
  notificationService = inject(NotificationService);
  
  // State
  notifications = this.notificationService.notifications; // Signal<Notification[]>
  
  // Actions
  dismiss(id: string): void;
  
  // Template: Stack of toast cards, positioned top-right
}
```

### LoadingOverlayComponent
```typescript
@Component({ selector: 'app-loading-overlay' })
class LoadingOverlayComponent {
  // Inputs
  visible = input<boolean>(false);
  message = input<string>('Cargando...');
  
  // Template: Full-screen overlay with spinner + message
}
```

---

## Shared Components

### CardComponent
```typescript
@Component({ selector: 'app-card' })
class CardComponent {
  // Inputs
  title = input<string>();
  subtitle = input<string>();
  clickable = input<boolean>(false);
  
  // Content projection
  // <ng-content> for body
  // <ng-content select="[card-actions]"> for footer actions
  
  // Events
  cardClick = output<void>();
}
```

### DataTableComponent
```typescript
@Component({ selector: 'app-data-table' })
class DataTableComponent<T> {
  // Inputs
  data = input.required<T[]>();
  columns = input.required<TableColumn[]>();
  selectable = input<boolean>(false);
  paginated = input<boolean>(true);
  pageSize = input<number>(10);
  sortable = input<boolean>(true);
  loading = input<boolean>(false);
  emptyMessage = input<string>('No hay datos disponibles');
  
  // State
  currentPage = signal(1);
  sortColumn = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  selectedItems = signal<T[]>([]);
  
  // Events
  selectionChange = output<T[]>();
  rowClick = output<T>();
  sortChange = output<{ column: string; direction: 'asc' | 'desc' }>();
  pageChange = output<number>();
}

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  template?: TemplateRef<any>;
}
```

### StatusBadgeComponent
```typescript
@Component({ selector: 'app-status-badge' })
class StatusBadgeComponent {
  // Inputs
  status = input.required<string>();
  size = input<'sm' | 'md' | 'lg'>('md');
  
  // Computed
  colorClass = computed(() => {
    switch(this.status()) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'skipped': return 'bg-gray-100 text-gray-800';
      case 'queued': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  });
}
```

### ConfirmDialogComponent
```typescript
@Component({ selector: 'app-confirm-dialog' })
class ConfirmDialogComponent {
  // Inputs
  visible = input<boolean>(false);
  title = input<string>('Confirmar');
  message = input<string>('¿Estás seguro?');
  confirmLabel = input<string>('Confirmar');
  cancelLabel = input<string>('Cancelar');
  confirmVariant = input<'primary' | 'danger'>('primary');
  
  // Events
  confirm = output<void>();
  cancel = output<void>();
}
```

### EmptyStateComponent
```typescript
@Component({ selector: 'app-empty-state' })
class EmptyStateComponent {
  // Inputs
  icon = input<string>('inbox');  // Icon name
  title = input<string>('Sin datos');
  message = input<string>();
  actionLabel = input<string>();
  
  // Events
  action = output<void>();
}
```

### SearchInputComponent
```typescript
@Component({ selector: 'app-search-input' })
class SearchInputComponent {
  // Inputs
  placeholder = input<string>('Buscar...');
  debounceMs = input<number>(300);
  
  // State
  value = signal('');
  
  // Events
  searchChange = output<string>();  // Emits after debounce
  
  // Behavior: debounce input, emit after delay
}
```

---

## Shared Pipes

### DurationPipe
```typescript
@Pipe({ name: 'duration' })
class DurationPipe {
  // Input: number (milliseconds)
  // Output: "1m 23s", "45s", "2h 15m"
  transform(ms: number): string;
}
```

### StatusLabelPipe
```typescript
@Pipe({ name: 'statusLabel' })
class StatusLabelPipe {
  // Input: ExecutionStatus or test result status
  // Output: Spanish label
  // 'passed' → 'Exitoso', 'failed' → 'Fallido', 'running' → 'En ejecución'
  transform(status: string): string;
}
```

### RelativeDatePipe
```typescript
@Pipe({ name: 'relativeDate' })
class RelativeDatePipe {
  // Input: Date
  // Output: "hace 5 min", "hace 2 horas", "ayer", "15 may 2026"
  transform(date: Date): string;
}
```

---

## Component Hierarchy (Unit 1)

```
AppComponent
├── HeaderComponent
│   └── Breadcrumbs (inline)
├── NotificationToastComponent
│   └── Notification cards (ngFor)
├── LoadingOverlayComponent
└── <router-outlet>
    └── [Lazy-loaded feature pages]
```
