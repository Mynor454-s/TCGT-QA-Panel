import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IScheduleService } from '../../interfaces/schedule.interface';
import { Schedule, ScheduleConfig, ScheduledExecution } from '../../models';
import { IndexedDBService, STORES } from './indexeddb.service';

@Injectable({ providedIn: 'root' })
export class IndexedDBScheduleService implements IScheduleService {
  private readonly db = inject(IndexedDBService);

  getSchedules(): Observable<Schedule[]> {
    return this.db.getAll<Schedule>(STORES.schedules);
  }

  createSchedule(config: ScheduleConfig): Observable<Schedule> {
    const schedule: Schedule = {
      id: crypto.randomUUID(),
      name: `Schedule ${new Date().toLocaleDateString('es-GT')}`,
      config,
      active: true,
      createdAt: new Date(),
      nextExecution: this.calculateNextExecution(config.cronExpression),
    };
    return this.db.put(STORES.schedules, schedule).pipe(map(() => schedule));
  }

  updateSchedule(id: string, config: ScheduleConfig): Observable<Schedule> {
    return this.db.getById<Schedule>(STORES.schedules, id).pipe(
      map((existing) => {
        if (!existing) throw new Error(`Schedule not found: ${id}`);
        const updated: Schedule = {
          ...existing,
          config,
          nextExecution: this.calculateNextExecution(config.cronExpression),
        };
        this.db.put(STORES.schedules, updated).subscribe();
        return updated;
      }),
    );
  }

  deleteSchedule(id: string): Observable<void> {
    return this.db.delete(STORES.schedules, id);
  }

  getUpcomingExecutions(limit: number): Observable<ScheduledExecution[]> {
    return this.getSchedules().pipe(
      map((schedules) =>
        schedules
          .filter((s) => s.active && s.nextExecution)
          .map((s) => ({
            scheduleId: s.id,
            scheduleName: s.name,
            nextRunAt: s.nextExecution!,
            config: s.config,
          }))
          .sort((a, b) => new Date(a.nextRunAt).getTime() - new Date(b.nextRunAt).getTime())
          .slice(0, limit),
      ),
    );
  }

  toggleSchedule(id: string, active: boolean): Observable<void> {
    return this.db.getById<Schedule>(STORES.schedules, id).pipe(
      map((existing) => {
        if (!existing) throw new Error(`Schedule not found: ${id}`);
        const updated = { ...existing, active };
        this.db.put(STORES.schedules, updated).subscribe();
      }),
    );
  }

  private calculateNextExecution(cronExpression: string): Date {
    // Simplified: just add 1 day from now for mock purposes
    const next = new Date();
    next.setDate(next.getDate() + 1);
    next.setHours(8, 0, 0, 0);
    return next;
  }
}
