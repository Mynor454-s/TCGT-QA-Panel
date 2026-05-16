export interface TestItem {
  id: string;
  title: string;
  file: string;
  tags: string[];
  priority: TestPriority;
  flow: TestFlow;
  scenarioId?: string;
}

export type TestPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type TestFlow = 'B2B' | 'B2C' | 'TCJ';

export interface TestFilter {
  tags?: string[];
  priority?: TestPriority[];
  flow?: TestFlow[];
  file?: string;
  search?: string;
}

export interface TestDetail extends TestItem {
  fullPath: string;
  steps?: string[];
  lastResult?: TestResultStatus;
  lastExecutionDate?: Date;
}

export type TestResultStatus = 'passed' | 'failed' | 'skipped';
