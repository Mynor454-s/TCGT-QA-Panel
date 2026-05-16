import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { TEST_DISCOVERY_SERVICE, EXECUTION_SERVICE } from '../../core/tokens/service-tokens';
import { TestItem, ExecutionConfig, ExecutionRun } from '../../core/models';
import { CardComponent } from '../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-execution-config-page',
  standalone: true,
  imports: [CardComponent, StatusBadgeComponent, UpperCasePipe],
  template: `
    <div data-testid="execution-config-page">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Ejecutar Tests</h1>

      @if (activeRun()) {
        <!-- Execution in progress -->
        <app-card title="Ejecución en curso">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span class="text-sm text-gray-700">Ejecutando {{ activeRun()!.config.tests.length }} tests...</span>
              <app-status-badge [status]="activeRun()!.status" [label]="activeRun()!.status" />
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full transition-all" [style.width.%]="progress()"></div>
            </div>
            <p class="text-xs text-gray-500">Ambiente: {{ activeRun()!.config.environment | uppercase }} | Modo: {{ activeRun()!.config.mode }}</p>
          </div>
        </app-card>
      } @else {
        <!-- Configuration form -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Tests selection -->
          <div class="lg:col-span-2">
            <app-card title="Tests a ejecutar" [subtitle]="tests().length + ' tests disponibles'">
              <div class="space-y-2 max-h-64 overflow-y-auto">
                @for (test of tests(); track test.id) {
                  <label class="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      [checked]="isSelected(test)"
                      (change)="toggleTest(test)"
                      class="rounded border-gray-300"
                    />
                    <span class="text-sm text-gray-700 flex-1">{{ test.title }}</span>
                    <app-status-badge [status]="test.priority" [label]="test.priority" size="sm" />
                  </label>
                }
              </div>
              <div card-actions class="px-4 py-2 border-t bg-gray-50 flex justify-between items-center">
                <span class="text-xs text-gray-500">{{ selectedTests().length }} seleccionados</span>
                <button class="text-xs text-blue-600 hover:text-blue-800" (click)="selectAll()" data-testid="select-all-exec">
                  Seleccionar todos
                </button>
              </div>
            </app-card>
          </div>

          <!-- Config panel -->
          <div class="space-y-4">
            <app-card title="Configuración">
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Ambiente</label>
                  <select class="w-full text-sm border border-gray-300 rounded-md px-3 py-2" (change)="environment.set($any($event.target).value)" data-testid="env-select">
                    <option value="qa">QA</option>
                    <option value="stg">STG</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Modo</label>
                  <select class="w-full text-sm border border-gray-300 rounded-md px-3 py-2" (change)="mode.set($any($event.target).value)" data-testid="mode-select">
                    <option value="local">Local</option>
                    <option value="browserstack">BrowserStack</option>
                  </select>
                </div>
              </div>
            </app-card>

            <button
              class="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              [disabled]="selectedTests().length === 0"
              (click)="execute()"
              data-testid="execute-btn"
            >
              ▶ Ejecutar {{ selectedTests().length }} test{{ selectedTests().length !== 1 ? 's' : '' }}
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class ExecutionConfigPageComponent implements OnInit {
  private readonly testService = inject(TEST_DISCOVERY_SERVICE);
  private readonly executionService = inject(EXECUTION_SERVICE);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  tests = signal<TestItem[]>([]);
  selectedTests = signal<TestItem[]>([]);
  environment = signal<'qa' | 'stg'>('qa');
  mode = signal<'local' | 'browserstack'>('local');
  activeRun = signal<ExecutionRun | null>(null);
  progress = signal(0);

  ngOnInit(): void {
    this.testService.getAvailableTests().subscribe((tests) => this.tests.set(tests));
    this.executionService.getActiveExecution().subscribe((run) => {
      this.activeRun.set(run);
      if (run?.status === 'completed') {
        this.progress.set(100);
        this.notificationService.success('Ejecución completada');
        setTimeout(() => this.router.navigate(['/reports', run.id]), 1500);
      } else if (run?.status === 'running') {
        this.simulateProgress();
      }
    });
  }

  isSelected(test: TestItem): boolean {
    return this.selectedTests().some((t) => t.id === test.id);
  }

  toggleTest(test: TestItem): void {
    this.selectedTests.update((s) =>
      this.isSelected(test) ? s.filter((t) => t.id !== test.id) : [...s, test],
    );
  }

  selectAll(): void {
    this.selectedTests.set([...this.tests()]);
  }

  execute(): void {
    const config: ExecutionConfig = {
      tests: this.selectedTests(),
      environment: this.environment(),
      mode: this.mode(),
    };
    this.executionService.executeTests(config).subscribe();
  }

  private simulateProgress(): void {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 90) {
        clearInterval(interval);
        p = 90;
      }
      this.progress.set(Math.min(p, 90));
    }, 500);
  }
}
