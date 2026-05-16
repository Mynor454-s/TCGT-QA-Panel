import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IReportService } from '../../interfaces/report.interface';
import { ExecutionReport, TestResultDetail, ExecutionComparison, ReportSummary } from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpReportService implements IReportService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getReport(runId: string): Observable<ExecutionReport> {
    return this.http.get<any>(`${this.baseUrl}/api/reports/${runId}`).pipe(
      map((raw) => this.mapToReport(runId, raw)),
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
    return this.http.get<{ url: string }>(`${this.baseUrl}/api/reports/${runId}/html`).pipe(
      map((r) => `${this.baseUrl}${r.url}`),
    );
  }

  compareExecutions(runId1: string, runId2: string): Observable<ExecutionComparison> {
    // Not implemented in MVP
    return of({
      run1: {} as ExecutionReport,
      run2: {} as ExecutionReport,
      newFailures: [],
      fixedTests: [],
      unchanged: [],
    });
  }

  private mapToReport(runId: string, raw: any): ExecutionReport {
    // Map Playwright JSON report format to our model
    const testResults: TestResultDetail[] = [];
    let total = 0, passed = 0, failed = 0, skipped = 0, duration = 0;

    function extractSpecs(suite: any) {
      for (const spec of suite.specs || []) {
        for (const test of spec.tests || []) {
          total++;
          const result = test.results?.[0];
          const status = result?.status === 'passed' ? 'passed' : result?.status === 'skipped' ? 'skipped' : 'failed';
          if (status === 'passed') passed++;
          else if (status === 'failed') failed++;
          else skipped++;
          duration += result?.duration || 0;

          testResults.push({
            testId: btoa(`${spec.file}:${spec.title}`).slice(0, 12),
            title: spec.title,
            status,
            duration: result?.duration || 0,
            error: result?.error?.message,
          });
        }
      }
      for (const child of suite.suites || []) {
        extractSpecs(child);
      }
    }

    for (const suite of raw.suites || []) {
      extractSpecs(suite);
    }

    const summary: ReportSummary = {
      total,
      passed,
      failed,
      skipped,
      duration,
      successRate: total > 0 ? (passed / total) * 100 : 0,
    };

    return {
      run: { id: runId, config: { tests: [], environment: 'qa', mode: 'local' }, status: 'completed', startedAt: new Date() },
      summary,
      testResults,
      playwrightReportUrl: `${this.baseUrl}/reports-static/index.html`,
    };
  }
}
