import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { HISTORY_SERVICE } from '../../core/tokens/service-tokens';
import { HistoryMetrics } from '../../core/interfaces/history.interface';
import { ExecutionRun } from '../../core/models';
import { CardComponent } from '../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';

interface ModuleCard {
  title: string;
  subtitle: string;
  description: string;
  route: string;
  icon: string;
}

const MODULE_CARDS: ModuleCard[] = [
  { title: 'Tests', subtitle: 'Gestionar tests', description: 'Ver, filtrar y seleccionar tests del proyecto TCGT-QA', route: '/tests', icon: '🧪' },
  { title: 'Ejecutar', subtitle: 'Lanzar ejecuciones', description: 'Configurar y ejecutar tests seleccionados', route: '/execute', icon: '▶️' },
  { title: 'Data Providers', subtitle: 'Gestionar datasets', description: 'Configurar datos de prueba y test-matrix', route: '/data-providers', icon: '📊' },
  { title: 'Historial', subtitle: 'Ejecuciones pasadas', description: 'Ver historial y tendencias de ejecuciones', route: '/history', icon: '📋' },
  { title: 'Scheduling', subtitle: 'Programar ejecuciones', description: 'Configurar ejecuciones automáticas', route: '/scheduling', icon: '⏰' },
  { title: 'Configuración', subtitle: 'Ambientes y conexión', description: 'Configurar ambientes, BrowserStack y preferencias', route: '/configuration', icon: '⚙️' },
];

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CardComponent, StatusBadgeComponent, DurationPipe, RelativeDatePipe, DecimalPipe],
  template: `
    <div data-testid="dashboard-page">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-sm text-gray-500 mb-6">Panel de gestión de automatizaciones TCGT-QA</p>

      <!-- Metrics summary -->
      @if (metrics()) {
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <app-card>
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ metrics()!.totalExecutions }}</p>
              <p class="text-xs text-gray-500">Ejecuciones totales</p>
            </div>
          </app-card>
          <app-card>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">{{ metrics()!.averageSuccessRate | number:'1.0-0' }}%</p>
              <p class="text-xs text-gray-500">Tasa de éxito promedio</p>
            </div>
          </app-card>
          <app-card>
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{ metrics()!.averageDuration | duration }}</p>
              <p class="text-xs text-gray-500">Duración promedio</p>
            </div>
          </app-card>
          <app-card>
            <div class="text-center">
              <p class="text-2xl font-bold text-red-600">{{ metrics()!.mostFailedTests.length }}</p>
              <p class="text-xs text-gray-500">Tests problemáticos</p>
            </div>
          </app-card>
        </div>
      }

      <!-- Recent executions -->
      @if (recentExecutions().length > 0) {
        <div class="mb-6">
          <h2 class="text-sm font-semibold text-gray-700 mb-3">Ejecuciones recientes</h2>
          <div class="bg-white rounded-lg border border-gray-200 divide-y">
            @for (exec of recentExecutions().slice(0, 5); track exec.id) {
              <div
                class="px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
                (click)="navigate('/reports/' + exec.id)"
                [attr.data-testid]="'recent-exec-' + exec.id"
              >
                <div class="flex items-center gap-3">
                  <app-status-badge [status]="exec.status" [label]="exec.status" size="sm" />
                  <span class="text-sm text-gray-700">{{ exec.config.tests.length }} tests</span>
                  <span class="text-xs text-gray-400 uppercase">{{ exec.config.environment }}</span>
                </div>
                <div class="flex items-center gap-3">
                  @if (exec.results) {
                    <span class="text-xs text-gray-500">
                      {{ exec.results.passed }}/{{ exec.results.total }} exitosos
                    </span>
                  }
                  <span class="text-xs text-gray-400">{{ exec.startedAt | relativeDate }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Module cards -->
      <h2 class="text-sm font-semibold text-gray-700 mb-3">Módulos</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (card of moduleCards; track card.route) {
          <app-card [title]="card.icon + ' ' + card.title" [subtitle]="card.subtitle" [clickable]="true" (cardClick)="navigate(card.route)">
            <p class="text-sm text-gray-500">{{ card.description }}</p>
          </app-card>
        }
      </div>
    </div>
  `,
})
export class DashboardPageComponent implements OnInit {
  private readonly historyService = inject(HISTORY_SERVICE);
  private readonly router = inject(Router);

  moduleCards = MODULE_CARDS;
  metrics = signal<HistoryMetrics | null>(null);
  recentExecutions = signal<ExecutionRun[]>([]);

  ngOnInit(): void {
    this.historyService.getHistoryMetrics('month').subscribe((m) => this.metrics.set(m));
    this.historyService.getHistory().subscribe((execs) => this.recentExecutions.set(execs.slice(0, 5)));
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
