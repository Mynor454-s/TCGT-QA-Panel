import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IReportService } from '../../interfaces/report.interface';
import { ExecutionReport, TestResultDetail, ExecutionComparison, ReportSummary } from '../../models';
import { MockExecutionService } from './mock-execution.service';

@Injectable({ providedIn: 'root' })
export class MockReportService implements IReportService {
  private readonly executionService = inject(MockExecutionService);

  getReport(runId: string): Observable<ExecutionReport> {
    return this.executionService.getActiveExecution().pipe(
      map((exec) => {
        if (!exec || !exec.results) {
          return this.generateEmptyReport(runId);
        }
        const summary: ReportSummary = {
          total: exec.results.total,
          passed: exec.results.passed,
          failed: exec.results.failed,
          skipped: exec.results.skipped,
          duration: exec.results.duration,
          successRate: exec.results.total > 0 ? (exec.results.passed / exec.results.total) * 100 : 0,
        };
        return {
          run: exec,
          summary,
          testResults: exec.results.testResults.map((r) => ({ ...r })),
          playwrightReportUrl: '/playwright-report/index.html',
        };
      }),
    );
  }

  getTestResult(runId: string, testId: string): Observable<TestResultDetail> {
    return this.getReport(runId).pipe(
      map((report) => {
        const result = report.testResults.find((r) => r.testId === testId);
        if (!result) throw new Error(`Test result not found: ${testId}`);
        return result;
      }),
    );
  }

  getPlaywrightReportUrl(runId: string): Observable<string> {
    return of('/playwright-report/index.html');
  }

  compareExecutions(runId1: string, runId2: string): Observable<ExecutionComparison> {
    // Mock comparison — in real implementation would fetch both reports
    return of({
      run1: this.generateEmptyReport(runId1),
      run2: this.generateEmptyReport(runId2),
      newFailures: [],
      fixedTests: [],
      unchanged: [],
    });
  }

  private generateEmptyReport(runId: string): ExecutionReport {
    return {
      run: {
        id: runId,
        config: { tests: [], environment: 'qa', mode: 'local' },
        status: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
      },
      summary: { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0, successRate: 0 },
      testResults: [],
    };
  }
}
