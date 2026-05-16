import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { SCHEDULE_SERVICE } from '../../core/tokens/service-tokens';
import { Schedule, ScheduleConfig } from '../../core/models';
import { CardComponent } from '../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-scheduling-page',
  standalone: true,
  imports: [FormsModule, UpperCasePipe, CardComponent, StatusBadgeComponent, EmptyStateComponent, RelativeDatePipe],
  template: `
    <div data-testid="scheduling-page">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Scheduling</h1>
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          (click)="showForm.set(true)"
          data-testid="new-schedule-btn"
        >
          + Nuevo Schedule
        </button>
      </div>

      <p class="text-sm text-gray-500 mb-4 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2">
        ⚠️ Los schedules se guardan localmente. La ejecución automática estará disponible cuando se implemente el backend.
      </p>

      @if (showForm()) {
        <app-card title="Nuevo Schedule" class="mb-4">
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" [(ngModel)]="formName" class="w-full text-sm border border-gray-300 rounded-md px-3 py-2" placeholder="Ej: Smoke tests diarios" data-testid="schedule-name-input" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Cron Expression</label>
              <input type="text" [(ngModel)]="formCron" class="w-full text-sm border border-gray-300 rounded-md px-3 py-2 font-mono" placeholder="0 8 * * 1-5" data-testid="schedule-cron-input" />
              <p class="text-xs text-gray-400 mt-1">Formato: minuto hora día mes díaSemana</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Ambiente</label>
                <select [(ngModel)]="formEnv" class="w-full text-sm border border-gray-300 rounded-md px-3 py-2">
                  <option value="qa">QA</option>
                  <option value="stg">STG</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Modo</label>
                <select [(ngModel)]="formMode" class="w-full text-sm border border-gray-300 rounded-md px-3 py-2">
                  <option value="local">Local</option>
                  <option value="browserstack">BrowserStack</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Tags (separados por coma)</label>
              <input type="text" [(ngModel)]="formTags" class="w-full text-sm border border-gray-300 rounded-md px-3 py-2" placeholder="@smoke, @P0" data-testid="schedule-tags-input" />
            </div>
            <div class="flex justify-end gap-2 pt-2">
              <button class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800" (click)="showForm.set(false)">Cancelar</button>
              <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700" (click)="createSchedule()" data-testid="save-schedule-btn">Guardar</button>
            </div>
          </div>
        </app-card>
      }

      @if (schedules().length === 0 && !showForm()) {
        <app-empty-state
          title="Sin schedules"
          message="Crea un schedule para programar ejecuciones automáticas."
          actionLabel="Crear schedule"
          (action)="showForm.set(true)"
        />
      } @else {
        <div class="space-y-3">
          @for (schedule of schedules(); track schedule.id) {
            <div class="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center justify-between" [attr.data-testid]="'schedule-' + schedule.id">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ schedule.name }}</p>
                <p class="text-xs text-gray-500 font-mono">{{ schedule.config.cronExpression }} | {{ schedule.config.environment | uppercase }} | {{ schedule.config.mode }}</p>
              </div>
              <div class="flex items-center gap-3">
                <app-status-badge [status]="schedule.active ? 'passed' : 'skipped'" [label]="schedule.active ? 'Activo' : 'Inactivo'" size="sm" />
                <button class="text-xs text-red-500 hover:text-red-700" (click)="deleteSchedule(schedule.id)" data-testid="delete-schedule-btn">Eliminar</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class SchedulingPageComponent implements OnInit {
  private readonly scheduleService = inject(SCHEDULE_SERVICE);
  private readonly notificationService = inject(NotificationService);

  schedules = signal<Schedule[]>([]);
  showForm = signal(false);

  formName = '';
  formCron = '0 8 * * 1-5';
  formEnv: 'qa' | 'stg' = 'qa';
  formMode: 'local' | 'browserstack' = 'local';
  formTags = '@smoke';

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.scheduleService.getSchedules().subscribe((s) => this.schedules.set(s));
  }

  createSchedule(): void {
    const config: ScheduleConfig = {
      cronExpression: this.formCron,
      tests: { tags: this.formTags.split(',').map((t) => t.trim()) },
      environment: this.formEnv,
      mode: this.formMode,
    };
    this.scheduleService.createSchedule(config).subscribe((schedule) => {
      // Update name
      schedule.name = this.formName || schedule.name;
      this.loadSchedules();
      this.showForm.set(false);
      this.notificationService.success('Schedule creado exitosamente');
    });
  }

  deleteSchedule(id: string): void {
    this.scheduleService.deleteSchedule(id).subscribe(() => {
      this.loadSchedules();
      this.notificationService.info('Schedule eliminado');
    });
  }
}
