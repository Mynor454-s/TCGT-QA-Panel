import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestFilter, TestPriority, TestFlow } from '../../../core/models';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';

@Component({
  selector: 'app-test-filter-bar',
  standalone: true,
  imports: [FormsModule, SearchInputComponent],
  template: `
    <div class="bg-white rounded-lg border border-gray-200 p-4 space-y-3" data-testid="test-filter-bar">
      <div class="flex flex-wrap gap-3 items-end">
        <div class="flex-1 min-w-[200px]">
          <app-search-input placeholder="Buscar por nombre..." (searchChange)="onSearchChange($event)" />
        </div>

        <div>
          <label class="block text-xs text-gray-500 mb-1">Prioridad</label>
          <select class="text-xs border border-gray-300 rounded-md px-2 py-1.5" (change)="onPriorityChange($event)" data-testid="filter-priority">
            <option value="">Todas</option>
            <option value="P0">P0</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>
        </div>

        <div>
          <label class="block text-xs text-gray-500 mb-1">Flujo</label>
          <select class="text-xs border border-gray-300 rounded-md px-2 py-1.5" (change)="onFlowChange($event)" data-testid="filter-flow">
            <option value="">Todos</option>
            <option value="B2B">B2B</option>
            <option value="B2C">B2C</option>
            <option value="TCJ">TCJ</option>
          </select>
        </div>

        <div>
          <label class="block text-xs text-gray-500 mb-1">Tag</label>
          <select class="text-xs border border-gray-300 rounded-md px-2 py-1.5" (change)="onTagChange($event)" data-testid="filter-tag">
            <option value="">Todos</option>
            @for (tag of availableTags(); track tag) {
              <option [value]="tag">{{ tag }}</option>
            }
          </select>
        </div>
      </div>
    </div>
  `,
})
export class TestFilterBarComponent {
  availableTags = input<string[]>([]);
  availableFiles = input<string[]>([]);

  filterChange = output<TestFilter>();

  private currentFilter: TestFilter = {};

  onSearchChange(search: string): void {
    this.currentFilter = { ...this.currentFilter, search: search || undefined };
    this.filterChange.emit(this.currentFilter);
  }

  onPriorityChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.currentFilter = {
      ...this.currentFilter,
      priority: value ? [value as TestPriority] : undefined,
    };
    this.filterChange.emit(this.currentFilter);
  }

  onFlowChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.currentFilter = { ...this.currentFilter, flow: value ? [value as TestFlow] : undefined };
    this.filterChange.emit(this.currentFilter);
  }

  onTagChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.currentFilter = { ...this.currentFilter, tags: value ? [value] : undefined };
    this.filterChange.emit(this.currentFilter);
  }
}
