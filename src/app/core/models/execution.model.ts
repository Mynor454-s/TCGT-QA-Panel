import { TestItem } from './test.model';

export interface ExecutionConfig {
  tests: TestItem[];
  environment: ExecutionEnvironment;
  mode: ExecutionMode;
  dataset?: string;
  tags?: string[];
}

export type ExecutionEnvironment = 'qa' | 'stg';
export type ExecutionMode = 'local' | 'browserstack';
export type ExecutionStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface ExecutionRun {
  id: string;
  config: ExecutionConfig;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  results?: ExecutionResults;
}

export interface ExecutionResults {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  testResults: TestResult[];
}

export interface TestResult {
  testId: string;
  title: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  logs?: string[];
  screenshotUrl?: string;
  traceUrl?: string;
  videoUrl?: string;
  error?: string;
}
