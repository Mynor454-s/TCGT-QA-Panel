import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IHistoryService, HistoryFilter, HistoryMetrics } from '../../interfaces/history.interface';
import { ExecutionRun } from '../../models';
import { IndexedDBService, STORES } from './indexeddb.service';

@Injectable({ providedIn: 'root' })
export class IndexedDBHistoryService implements IHistoryService {
  private readonly db = inject(IndexedDBService);

  getHistory(filters?: HistoryFilter): Observable<ExecutionRun[]> {
    return this.db.getAll<ExecutionRun>(STORES.history).pipe(
      map((runs) => {
        if (!filters) return runs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
        return runs
          .filter((run) => {
            if (filters.environment && run.config.environment !== filters.environment) return false;
            if (filters.status && run.status !== filters.status) return false;
            if (filters.dateFrom && new Date(run.startedAt) < filters.dateFrom) return false;
            if (filters.dateTo && new Date(run.startedAt) > filters.dateTo) return false;
            return true;
          })
          .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
      }),
    );
  }

  saveExecution(run: ExecutionRun): Observable<void> {
    return this.db.put(STORES.history, run);
  }

  getExecution(runId: string): Observable<ExecutionRun> {
    return this.db.getById<ExecutionRun>(STORES.history, runId).pipe(
      map((run) => {
        if (!run) throw new Error(`Execution not found: ${runId}`);
        return run;
      }),
    );
  }

  deleteExecution(runId: string): Observable<void> {
    return this.db.delete(STORES.history, runId);
  }

  getHistoryMetrics(period: 'week' | 'month' | 'all'): Observable<HistoryMetrics> {
    return this.getHistory().pipe(
      map((runs) => {
        const now = new Date();
        const filtered = period === 'all' ? runs : runs.filter((r) => {
          const diff = now.getTime() - new Date(r.startedAt).getTime();
          const days = diff / (1000 * 60 * 60 * 24);
          return period === 'week' ? days <= 7 : days <= 30;
        });

        const totalExecutions = filtered.length;
        const withResults = filtered.filter((r) => r.results);
        const avgSuccessRate = withResults.length > 0
          ? withResults.reduce((sum, r) => sum + (r.results!.passed / r.results!.total) * 100, 0) / withResults.length
          : 0;
        const avgDuration = withResults.length > 0
          ? withResults.reduce((sum, r) => sum + r.results!.duration, 0) / withResults.length
          : 0;

        // Group by day
        const byDay = new Map<string, { count: number; passRate: number[] }>();
        filtered.forEach((r) => {
          const date = new Date(r.startedAt).toISOString().split('T')[0];
          const entry = byDay.get(date) ?? { count: 0, passRate: [] };
          entry.count++;
          if (r.results) {
            entry.passRate.push((r.results.passed / r.results.total) * 100);
          }
          byDay.set(date, entry);
        });

        const executionsByDay = Array.from(byDay.entries()).map(([date, data]) => ({
          date,
          count: data.count,
          successRate: data.passRate.length > 0
            ? data.passRate.reduce((a, b) => a + b, 0) / data.passRate.length
            : 0,
        }));

        // Most failed tests
        const failCounts = new Map<string, { title: string; count: number }>();
        withResults.forEach((r) => {
          r.results!.testResults
            .filter((t) => t.status === 'failed')
            .forEach((t) => {
              const entry = failCounts.get(t.testId) ?? { title: t.title, count: 0 };
              entry.count++;
              failCounts.set(t.testId, entry);
            });
        });

        const mostFailedTests = Array.from(failCounts.entries())
          .map(([testId, data]) => ({ testId, title: data.title, failCount: data.count }))
          .sort((a, b) => b.failCount - a.failCount)
          .slice(0, 5);

        return {
          totalExecutions,
          averageSuccessRate: avgSuccessRate,
          averageDuration: avgDuration,
          executionsByDay,
          mostFailedTests,
        };
      }),
    );
  }
}
