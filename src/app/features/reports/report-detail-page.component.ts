import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { REPORT_SERVICE } from '../../core/tokens/service-tokens';
import { ExecutionReport, TestResultDetail } from '../../core/models';
import { CardComponent } from '../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-report-detail-page',
  standalone: true,
  imports: [RouterLink, CardComponent, StatusBadgeComponent, DurationPipe, EmptyStateComponent, DecimalPipe],
  template: `
    <div data-testid="report-detail-page">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Reporte de Ejecución</h1>
        <a routerLink="/history" class="text-sm text-blue-600 hover:text-blue-800">← Volver al historial</a>
      </div>

      @if (report()) {
        <!-- Summary cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <app-card>
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ report()!.summary.total }}</p>
              <p class="text-xs text-gray-500">Total</p>
            </div>
          </app-card>
          <app-card>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">{{ report()!.summary.passed }}</p>
              <p class="text-xs text-gray-500">Exitosos</p>
            </div>
          </app-card>
          <app-card>
            <div class="text-center">
              <p class="text-2xl font-bold text-red-600">{{ report()!.summary.failed }}</p>
              <p class="text-xs text-gray-500">Fallidos</p>
            </div>
          </app-card>
          <app-card>
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{ report()!.summary.successRate | number:'1.0-0' }}%</p>
              <p class="text-xs text-gray-500">Tasa de éxito</p>
            </div>
          </app-card>
        </div>

        <!-- Duration -->
        <p class="text-sm text-gray-500 mb-4">Duración total: {{ report()!.summary.duration | duration }}</p>

        <!-- Test results table -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b text-xs text-gray-500 uppercase">
              <tr>
                <th class="px-4 py-3 text-left">Test</th>
                <th class="px-4 py-3 text-left">Estado</th>
                <th class="px-4 py-3 text-left">Duración</th>
                <th class="px-4 py-3 text-left">Error</th>
              </tr>
            </thead>
            <tbody>
              @for (result of report()!.testResults; track result.testId) {
                <tr class="border-b hover:bg-gray-50" [attr.data-testid]="'result-row-' + result.testId">
                  <td class="px-4 py-3 font-medium text-gray-900">{{ result.title }}</td>
                  <td class="px-4 py-3">
                    <app-status-badge [status]="result.status" [label]="result.status" size="sm" />
                  </td>
                  <td class="px-4 py-3 text-gray-500">{{ result.duration | duration }}</td>
                  <td class="px-4 py-3 text-xs text-red-600 font-mono max-w-xs truncate">
                    {{ result.error || '—' }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <app-empty-state title="Sin reporte" message="No se encontró el reporte solicitado." />
      }
    </div>
  `,
})
export class ReportDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly reportService = inject(REPORT_SERVICE);

  report = signal<ExecutionReport | null>(null);

  ngOnInit(): void {
    const runId = this.route.snapshot.paramMap.get('runId');
    if (runId) {
      this.reportService.getReport(runId).subscribe((report) => this.report.set(report));
    }
  }
}
