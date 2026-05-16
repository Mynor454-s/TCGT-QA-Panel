import { Observable } from 'rxjs';
import { TestItem, TestFilter, TestDetail } from '../models';

export interface ITestDiscoveryService {
  getAvailableTests(): Observable<TestItem[]>;
  getFilteredTests(filters: TestFilter): Observable<TestItem[]>;
  getTestDetail(testId: string): Observable<TestDetail>;
  refreshTests(): Observable<TestItem[]>;
  getAvailableTags(): Observable<string[]>;
  getAvailableFiles(): Observable<string[]>;
}
