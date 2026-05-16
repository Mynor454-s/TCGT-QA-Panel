import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  IDataProviderService,
  Dataset,
  DatasetContent,
  TestMatrix,
  ValidationResult,
} from '../../interfaces/data-provider.interface';

const MOCK_DATASETS: Dataset[] = [
  { id: 'data-new-client', name: 'data_new_client.json', file: 'data/data_new_client.json', keys: ['Marcos', 'Monther'] },
  { id: 'data-new-client-tcj', name: 'data_new_client_TCJ.json', file: 'data/data_new_client_TCJ.json', keys: ['Marcos'] },
];

const MOCK_DATASET_CONTENT: Record<string, DatasetContent> = {
  'data-new-client': {
    Marcos: {
      dpi: '1234567890101',
      nombre: 'Marcos',
      apellido: 'García',
      email: 'marcos.test@example.com',
      telefono: '55551234',
      nit: '1234567',
      fechaInicioLabores: '2020-01-15',
    },
    Monther: {
      dpi: '9876543210101',
      nombre: 'Monther',
      apellido: 'López',
      email: 'monther.test@example.com',
      telefono: '55559876',
      nit: '7654321',
      fechaInicioLabores: '2019-06-01',
    },
  },
  'data-new-client-tcj': {
    Marcos: {
      dpi: '1234567890101',
      nombre: 'Marcos',
      apellido: 'García',
      email: 'marcos.tcj@example.com',
      telefono: '55551234',
      colorTarjeta: 'azul',
      programaLealtad: 'cashback',
    },
  },
};

const MOCK_TEST_MATRIX: TestMatrix = {
  scenarios: [
    {
      id: 'E2E-001',
      name: 'Flujo completo cliente B2B',
      tags: ['@e2e', '@P0', '@B2B'],
      dataProvider: 'data_new_client.json',
      datasets: ['Marcos', 'Monther'],
    },
    {
      id: 'E2E-B2C-001',
      name: 'Flujo completo comercio B2C',
      tags: ['@e2e', '@P0', '@B2C'],
      dataProvider: 'data_new_client.json',
      datasets: ['Marcos'],
    },
    {
      id: 'E2E-TCJ-001',
      name: 'Flujo completo TCJ',
      tags: ['@e2e', '@P1', '@B2B'],
      dataProvider: 'data_new_client_TCJ.json',
      datasets: ['Marcos'],
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class MockDataProviderService implements IDataProviderService {
  getDatasets(): Observable<Dataset[]> {
    return of(MOCK_DATASETS);
  }

  getDatasetContent(datasetId: string): Observable<DatasetContent> {
    return of(MOCK_DATASET_CONTENT[datasetId] ?? {});
  }

  updateDatasetContent(datasetId: string, content: DatasetContent): Observable<void> {
    MOCK_DATASET_CONTENT[datasetId] = content;
    return of(undefined);
  }

  getTestMatrix(): Observable<TestMatrix> {
    return of(MOCK_TEST_MATRIX);
  }

  updateTestMatrix(matrix: TestMatrix): Observable<void> {
    Object.assign(MOCK_TEST_MATRIX, matrix);
    return of(undefined);
  }

  validateDataset(content: unknown): ValidationResult {
    if (!content || typeof content !== 'object') {
      return { valid: false, errors: ['El contenido debe ser un objeto'] };
    }

    const errors: string[] = [];
    const obj = content as Record<string, unknown>;

    for (const [key, value] of Object.entries(obj)) {
      if (!key.trim()) {
        errors.push('Las keys no pueden estar vacías');
      }
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        errors.push(`El valor de "${key}" debe ser un objeto`);
      }
    }

    return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
  }
}
