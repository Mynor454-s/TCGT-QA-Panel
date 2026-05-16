import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  IDataProviderService,
  Dataset,
  DatasetContent,
  TestMatrix,
  ValidationResult,
} from '../../interfaces/data-provider.interface';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpDataProviderService implements IDataProviderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getDatasets(): Observable<Dataset[]> {
    return this.http.get<Dataset[]>(`${this.baseUrl}/api/data-providers`);
  }

  getDatasetContent(datasetId: string): Observable<DatasetContent> {
    return this.http.get<DatasetContent>(`${this.baseUrl}/api/data-providers/${datasetId}`);
  }

  updateDatasetContent(datasetId: string, content: DatasetContent): Observable<void> {
    // Not implemented in MVP backend yet
    return of(undefined);
  }

  getTestMatrix(): Observable<TestMatrix> {
    return this.http.get<TestMatrix>(`${this.baseUrl}/api/data-providers/test-matrix/config`);
  }

  updateTestMatrix(matrix: TestMatrix): Observable<void> {
    return of(undefined);
  }

  validateDataset(content: unknown): ValidationResult {
    if (!content || typeof content !== 'object') {
      return { valid: false, errors: ['El contenido debe ser un objeto'] };
    }
    return { valid: true };
  }
}
