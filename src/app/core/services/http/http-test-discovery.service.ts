import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITestDiscoveryService } from '../../interfaces/test-discovery.interface';
import { TestItem, TestFilter, TestDetail } from '../../models';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpTestDiscoveryService implements ITestDiscoveryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAvailableTests(): Observable<TestItem[]> {
    return this.http.get<TestItem[]>(`${this.baseUrl}/api/tests`);
  }

  getFilteredTests(filters: TestFilter): Observable<TestItem[]> {
    return this.getAvailableTests().pipe(
      map((tests) => this.applyFilters(tests, filters)),
    );
  }

  getTestDetail(testId: string): Observable<TestDetail> {
    return this.http.get<TestDetail>(`${this.baseUrl}/api/tests/${testId}`);
  }

  refreshTests(): Observable<TestItem[]> {
    return this.getAvailableTests();
  }

  getAvailableTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/api/tests/tags`);
  }

  getAvailableFiles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/api/tests/files`);
  }

  private applyFilters(tests: TestItem[], filter: TestFilter): TestItem[] {
    return tests.filter((test) => {
      if (filter.search && !test.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
      if (filter.tags?.length && !filter.tags.some((t) => test.tags.includes(t))) return false;
      if (filter.priority?.length && !filter.priority.includes(test.priority)) return false;
      if (filter.flow?.length && !filter.flow.includes(test.flow)) return false;
      if (filter.file && test.file !== filter.file) return false;
      return true;
    });
  }
}
