import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HISTORY_SERVICE } from '../../core/tokens/service-tokens';
import { ExecutionRun } from '../../core/models';
import { CardComponent } from '../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [CardComponent, StatusBadgeComponent, EmptyStateComponent, DurationPipe, RelativeDatePipe],
  template: `
    <div data-testid="history-page">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Historial de Ejecuciones</h1>

      @if (executions().length === 0) {
        <app-empty-state
          title="Sin historial"
          message="Aún no se han ejecutado tests. Ejecuta tests desde la sección 'Ejecutar' para ver el historial aquí."
          actionLabel="Ir a Ejecutar"
          (action)="goToExecute()"
        />
      } @else {
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b text-xs text-gray-500 uppercase">
              <tr>
                <th class="px-4 py-3 text-left">Fecha</th>
                <th class="px-4 py-3 text-left">Estado</th>
                <th class="px-4 py-3 text-left">Tests</th>
                <th class="px-4 py-3 text-left">Resultado</th>
                <th class="px-4 py-3 text-left">Duración</th>
                <th class="px-4 py-3 text-left">Ambiente</th>
              </tr>
            </thead>
            <tbody>
              @for (exec of executions(); track exec.id) {
                <tr
                  class="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                  (click)="viewReport(exec)"
                  [attr.data-testid]="'history-row-' + exec.id"
                >
                  <td class="px-4 py-3 text-gray-700">{{ exec.startedAt | relativeDate }}</td>
                  <td class="px-4 py-3">
                    <app-status-badge [status]="exec.status" [label]="exec.status" size="sm" />
                  </td>
                  <td class="px-4 py-3 text-gray-600">{{ exec.config.tests.length }} tests</td>
                  <td class="px-4 py-3">
                    @if (exec.results) {
                      <span class="text-green-600">{{ exec.results.passed }}</span> /
                      <span class="text-red-600">{{ exec.results.failed }}</span> /
                      <span class="text-gray-400">{{ exec.results.skipped }}</span>
                    } @else {
                      —
                    }
                  </td>
                  <td class="px-4 py-3 text-gray-500">{{ exec.results?.duration | duration }}</td>
                  <td class="px-4 py-3">
                    <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase">
                      {{ exec.config.environment }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class HistoryPageComponent implements OnInit {
  private readonly historyService = inject(HISTORY_SERVICE);
  private readonly router = inject(Router);

  executions = signal<ExecutionRun[]>([]);

  ngOnInit(): void {
    this.historyService.getHistory().subscribe((execs) => this.executions.set(execs));
  }

  viewReport(exec: ExecutionRun): void {
    this.router.navigate(['/reports', exec.id]);
  }

  goToExecute(): void {
    this.router.navigate(['/execute']);
  }
}
