import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TEST_DISCOVERY_SERVICE } from '../../core/tokens/service-tokens';
import { TestItem, TestFilter } from '../../core/models';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TestFilterBarComponent } from './components/test-filter-bar.component';
import { TestSelectionSummaryComponent } from './components/test-selection-summary.component';

@Component({
  selector: 'app-test-list-page',
  standalone: true,
  imports: [
    SearchInputComponent,
    StatusBadgeComponent,
    EmptyStateComponent,
    TestFilterBarComponent,
    TestSelectionSummaryComponent,
  ],
  template: `
    <div data-testid="test-list-page">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Tests</h1>
        <button
          class="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
          (click)="refresh()"
          data-testid="refresh-tests-btn"
        >
          ↻ Refrescar
        </button>
      </div>

      <app-test-filter-bar
        [availableTags]="availableTags()"
        [availableFiles]="availableFiles()"
        (filterChange)="onFilterChange($event)"
      />

      @if (selectedTests().length > 0) {
        <app-test-selection-summary
          [count]="selectedTests().length"
          (execute)="goToExecute()"
          (clear)="clearSelection()"
        />
      }

      @if (loading()) {
        <div class="text-center py-8 text-gray-500">Cargando tests...</div>
      } @else if (filteredTests().length === 0) {
        <app-empty-state
          title="No se encontraron tests"
          message="Intenta cambiar los filtros o refrescar la lista."
          actionLabel="Limpiar filtros"
          (action)="clearFilters()"
        />
      } @else {
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden mt-4">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b text-xs text-gray-500 uppercase">
              <tr>
                <th class="px-4 py-3 w-10">
                  <input type="checkbox" [checked]="allSelected()" (change)="toggleAll()" class="rounded border-gray-300" data-testid="select-all-tests" />
                </th>
                <th class="px-4 py-3 text-left">Test</th>
                <th class="px-4 py-3 text-left">Archivo</th>
                <th class="px-4 py-3 text-left">Prioridad</th>
                <th class="px-4 py-3 text-left">Flujo</th>
                <th class="px-4 py-3 text-left">Tags</th>
              </tr>
            </thead>
            <tbody>
              @for (test of filteredTests(); track test.id) {
                <tr class="border-b hover:bg-gray-50 transition-colors" [class.bg-blue-50]="isSelected(test)" [attr.data-testid]="'test-row-' + test.id">
                  <td class="px-4 py-3">
                    <input type="checkbox" [checked]="isSelected(test)" (change)="toggleTest(test)" class="rounded border-gray-300" />
                  </td>
                  <td class="px-4 py-3 font-medium text-gray-900">{{ test.title }}</td>
                  <td class="px-4 py-3 text-gray-500 text-xs font-mono">{{ test.file }}</td>
                  <td class="px-4 py-3">
                    <app-status-badge [status]="test.priority" [label]="test.priority" size="sm" />
                  </td>
                  <td class="px-4 py-3">
                    <app-status-badge [status]="test.flow === 'B2B' ? 'passed' : 'running'" [label]="test.flow" size="sm" />
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex flex-wrap gap-1">
                      @for (tag of test.tags.slice(0, 3); track tag) {
                        <span class="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{{ tag }}</span>
                      }
                      @if (test.tags.length > 3) {
                        <span class="text-xs text-gray-400">+{{ test.tags.length - 3 }}</span>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="text-xs text-gray-500 mt-2">{{ filteredTests().length }} tests encontrados</p>
      }
    </div>
  `,
})
export class TestListPageComponent implements OnInit {
  private readonly testService = inject(TEST_DISCOVERY_SERVICE);
  private readonly router = inject(Router);

  loading = signal(true);
  allTests = signal<TestItem[]>([]);
  filter = signal<TestFilter>({});
  selectedTests = signal<TestItem[]>([]);
  availableTags = signal<string[]>([]);
  availableFiles = signal<string[]>([]);

  filteredTests = computed(() => {
    const f = this.filter();
    const tests = this.allTests();
    return tests.filter((test) => {
      if (f.search && !test.title.toLowerCase().includes(f.search.toLowerCase())) return false;
      if (f.tags?.length && !f.tags.some((t) => test.tags.includes(t))) return false;
      if (f.priority?.length && !f.priority.includes(test.priority)) return false;
      if (f.flow?.length && !f.flow.includes(test.flow)) return false;
      if (f.file && test.file !== f.file) return false;
      return true;
    });
  });

  allSelected = computed(() => {
    const filtered = this.filteredTests();
    return filtered.length > 0 && filtered.every((t) => this.isSelected(t));
  });

  ngOnInit(): void {
    this.loadTests();
  }

  loadTests(): void {
    this.loading.set(true);
    this.testService.getAvailableTests().subscribe((tests) => {
      this.allTests.set(tests);
      this.loading.set(false);
    });
    this.testService.getAvailableTags().subscribe((tags) => this.availableTags.set(tags));
    this.testService.getAvailableFiles().subscribe((files) => this.availableFiles.set(files));
  }

  refresh(): void {
    this.loadTests();
  }

  onFilterChange(filter: TestFilter): void {
    this.filter.set(filter);
  }

  clearFilters(): void {
    this.filter.set({});
  }

  isSelected(test: TestItem): boolean {
    return this.selectedTests().some((t) => t.id === test.id);
  }

  toggleTest(test: TestItem): void {
    this.selectedTests.update((selected) =>
      this.isSelected(test) ? selected.filter((t) => t.id !== test.id) : [...selected, test],
    );
  }

  toggleAll(): void {
    if (this.allSelected()) {
      this.selectedTests.set([]);
    } else {
      this.selectedTests.set([...this.filteredTests()]);
    }
  }

  clearSelection(): void {
    this.selectedTests.set([]);
  }

  goToExecute(): void {
    this.router.navigate(['/execute']);
  }
}
