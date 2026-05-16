import { Observable } from 'rxjs';
import { ExecutionConfig, ExecutionRun, ExecutionStatus } from '../models';

export interface IExecutionService {
  executeTests(config: ExecutionConfig): Observable<ExecutionRun>;
  getExecutionStatus(runId: string): Observable<ExecutionStatus>;
  cancelExecution(runId: string): Observable<void>;
  getExecutionQueue(): Observable<ExecutionRun[]>;
  getActiveExecution(): Observable<ExecutionRun | null>;
}
