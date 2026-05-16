import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-test-selection-summary',
  standalone: true,
  template: `
    <div class="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mt-4" data-testid="test-selection-summary">
      <span class="text-sm text-blue-800 font-medium">
        {{ count() }} test{{ count() > 1 ? 's' : '' }} seleccionado{{ count() > 1 ? 's' : '' }}
      </span>
      <div class="flex gap-2">
        <button
          class="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
          (click)="clear.emit()"
          data-testid="clear-selection-btn"
        >
          Limpiar
        </button>
        <button
          class="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          (click)="execute.emit()"
          data-testid="execute-selected-btn"
        >
          Ejecutar seleccionados →
        </button>
      </div>
    </div>
  `,
})
export class TestSelectionSummaryComponent {
  count = input.required<number>();
  execute = output<void>();
  clear = output<void>();
}
