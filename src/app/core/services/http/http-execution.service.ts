import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, timer, switchMap, takeWhile, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { IExecutionService } from '../../interfaces/execution.interface';
import { ExecutionConfig, ExecutionRun, ExecutionStatus } from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpExecutionService implements IExecutionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly activeExecution$ = new BehaviorSubject<ExecutionRun | null>(null);
  private cancelled = false;

  executeTests(config: ExecutionConfig): Observable<ExecutionRun> {
    this.cancelled = false;
    const body = {
      grep: config.tags?.length ? config.tags.join('|') : undefined,
      file: config.tests?.length ? config.tests.map(t => t.file).join(' ') : undefined,
      environment: config.environment,
      mode: config.mode,
      workers: 4,
    };

    return this.http.post<ExecutionRun>(`${this.baseUrl}/api/executions`, body).pipe(
      tap((run) => {
        // Enrich run with local config for display
        run.config = config;
        this.activeExecution$.next(run);
        this.pollStatus(run.id);
      }),
    );
  }

  getExecutionStatus(runId: string): Observable<ExecutionStatus> {
    return this.http.get<ExecutionRun>(`${this.baseUrl}/api/executions/${runId}`).pipe(
      map((run) => run.status),
    );
  }

  cancelExecution(runId: string): Observable<void> {
    this.cancelled = true;
    this.activeExecution$.next(null);
    return this.http.post<void>(`${this.baseUrl}/api/executions/${runId}/cancel`, {});
  }

  getExecutionQueue(): Observable<ExecutionRun[]> {
    return this.http.get<ExecutionRun[]>(`${this.baseUrl}/api/executions`);
  }

  getActiveExecution(): Observable<ExecutionRun | null> {
    return this.activeExecution$.asObservable();
  }

  private pollStatus(runId: string): void {
    timer(2000, 2000)
      .pipe(
        takeWhile(() => !this.cancelled),
        switchMap(() => this.http.get<ExecutionRun>(`${this.baseUrl}/api/executions/${runId}`)),
        tap((run) => {
          if (!this.cancelled) {
            this.activeExecution$.next(run);
          }
        }),
        takeWhile((run) => run.status === 'running', true),
      )
      .subscribe();
  }
}
