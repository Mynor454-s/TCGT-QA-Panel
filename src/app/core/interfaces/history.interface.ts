import { Observable } from 'rxjs';
import { ExecutionRun } from '../models';

export interface HistoryFilter {
  dateFrom?: Date;
  dateTo?: Date;
  environment?: 'qa' | 'stg';
  status?: string;
  tags?: string[];
}

export interface HistoryMetrics {
  totalExecutions: number;
  averageSuccessRate: number;
  averageDuration: number;
  executionsByDay: { date: string; count: number; successRate: number }[];
  mostFailedTests: { testId: string; title: string; failCount: number }[];
}

export interface IHistoryService {
  getHistory(filters?: HistoryFilter): Observable<ExecutionRun[]>;
  saveExecution(run: ExecutionRun): Observable<void>;
  getExecution(runId: string): Observable<ExecutionRun>;
  deleteExecution(runId: string): Observable<void>;
  getHistoryMetrics(period: 'week' | 'month' | 'all'): Observable<HistoryMetrics>;
}
