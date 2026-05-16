import { Observable } from 'rxjs';
import { ExecutionReport, TestResultDetail, ExecutionComparison } from '../models';

export interface IReportService {
  getReport(runId: string): Observable<ExecutionReport>;
  getTestResult(runId: string, testId: string): Observable<TestResultDetail>;
  getPlaywrightReportUrl(runId: string): Observable<string>;
  compareExecutions(runId1: string, runId2: string): Observable<ExecutionComparison>;
}
