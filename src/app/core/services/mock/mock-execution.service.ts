import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IExecutionService } from '../../interfaces/execution.interface';
import { ExecutionConfig, ExecutionRun, ExecutionStatus, ExecutionResults, TestResult } from '../../models';

@Injectable({ providedIn: 'root' })
export class MockExecutionService implements IExecutionService {
  private activeExecution$ = new BehaviorSubject<ExecutionRun | null>(null);
  private queue$ = new BehaviorSubject<ExecutionRun[]>([]);

  executeTests(config: ExecutionConfig): Observable<ExecutionRun> {
    const run: ExecutionRun = {
      id: crypto.randomUUID(),
      config,
      status: 'running',
      startedAt: new Date(),
    };

    this.activeExecution$.next(run);

    // Simulate execution completing after 3 seconds
    timer(3000).subscribe(() => {
      const completedRun: ExecutionRun = {
        ...run,
        status: 'completed',
        completedAt: new Date(),
        results: this.generateMockResults(config),
      };
      this.activeExecution$.next(completedRun);
    });

    return of(run);
  }

  getExecutionStatus(runId: string): Observable<ExecutionStatus> {
    return this.activeExecution$.pipe(
      map((exec) => (exec?.id === runId ? exec.status : 'completed')),
    );
  }

  cancelExecution(runId: string): Observable<void> {
    const current = this.activeExecution$.value;
    if (current?.id === runId) {
      this.activeExecution$.next({ ...current, status: 'cancelled' });
    }
    return of(undefined);
  }

  getExecutionQueue(): Observable<ExecutionRun[]> {
    return this.queue$.asObservable();
  }

  getActiveExecution(): Observable<ExecutionRun | null> {
    return this.activeExecution$.asObservable();
  }

  private generateMockResults(config: ExecutionConfig): ExecutionResults {
    const testResults: TestResult[] = config.tests.map((test) => {
      const random = Math.random();
      const status = random > 0.15 ? 'passed' : random > 0.05 ? 'failed' : 'skipped';
      return {
        testId: test.id,
        title: test.title,
        status,
        duration: Math.floor(Math.random() * 30000) + 5000,
        logs: status === 'failed' ? ['Error: Element not found', 'at page.click()'] : undefined,
        screenshotUrl: status === 'failed' ? '/assets/mock-screenshot.png' : undefined,
        error: status === 'failed' ? 'TimeoutError: waiting for selector' : undefined,
      };
    });

    const passed = testResults.filter((r) => r.status === 'passed').length;
    const failed = testResults.filter((r) => r.status === 'failed').length;
    const skipped = testResults.filter((r) => r.status === 'skipped').length;

    return {
      total: testResults.length,
      passed,
      failed,
      skipped,
      duration: testResults.reduce((sum, r) => sum + r.duration, 0),
      testResults,
    };
  }
}
