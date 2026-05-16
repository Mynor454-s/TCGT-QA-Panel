import { Component, input, output, signal, computed } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
})
export class DataTableComponent<T = unknown> {
  data = input.required<T[]>();
  columns = input.required<TableColumn[]>();
  selectable = input<boolean>(false);
  paginated = input<boolean>(true);
  pageSize = input<number>(10);
  sortable = input<boolean>(true);
  loading = input<boolean>(false);
  emptyMessage = input<string>('No hay datos disponibles');

  selectionChange = output<T[]>();
  rowClick = output<T>();
  sortChange = output<{ column: string; direction: 'asc' | 'desc' }>();
  pageChange = output<number>();

  currentPage = signal(1);
  sortColumn = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  selectedItems = signal<Set<number>>(new Set());

  totalPages = computed(() => {
    if (!this.paginated()) return 1;
    return Math.ceil(this.data().length / this.pageSize());
  });

  paginatedData = computed(() => {
    const data = this.data();
    if (!this.paginated()) return data;
    const start = (this.currentPage() - 1) * this.pageSize();
    return data.slice(start, start + this.pageSize());
  });

  onSort(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
    this.sortChange.emit({ column, direction: this.sortDirection() });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.pageChange.emit(page);
  }

  toggleSelection(index: number): void {
    this.selectedItems.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
    const selected = Array.from(this.selectedItems()).map((i) => this.data()[i]);
    this.selectionChange.emit(selected);
  }

  toggleAll(): void {
    const allSelected = this.selectedItems().size === this.data().length;
    if (allSelected) {
      this.selectedItems.set(new Set());
    } else {
      this.selectedItems.set(new Set(this.data().map((_, i) => i)));
    }
    const selected = Array.from(this.selectedItems()).map((i) => this.data()[i]);
    this.selectionChange.emit(selected);
  }

  isSelected(index: number): boolean {
    return this.selectedItems().has(index);
  }

  getValue(item: T, key: string): unknown {
    return (item as Record<string, unknown>)[key];
  }
}
