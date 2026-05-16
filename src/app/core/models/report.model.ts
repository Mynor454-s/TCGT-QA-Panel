import { ExecutionRun, TestResult } from './execution.model';

export interface ExecutionReport {
  run: ExecutionRun;
  summary: ReportSummary;
  testResults: TestResultDetail[];
  playwrightReportUrl?: string;
}

export interface TestResultDetail extends TestResult {
  file?: string;
  tags?: string[];
}

export interface ReportSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  successRate: number;
}

export interface ExecutionComparison {
  run1: ExecutionReport;
  run2: ExecutionReport;
  newFailures: TestResultDetail[];
  fixedTests: TestResultDetail[];
  unchanged: TestResultDetail[];
}
