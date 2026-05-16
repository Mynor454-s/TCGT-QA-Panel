import { Observable } from 'rxjs';

export interface Dataset {
  id: string;
  name: string;
  file: string;
  keys: string[];
}

export interface DatasetContent {
  [key: string]: unknown;
}

export interface TestMatrix {
  scenarios: TestScenario[];
}

export interface TestScenario {
  id: string;
  name: string;
  tags: string[];
  dataProvider: string;
  datasets: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export interface IDataProviderService {
  getDatasets(): Observable<Dataset[]>;
  getDatasetContent(datasetId: string): Observable<DatasetContent>;
  updateDatasetContent(datasetId: string, content: DatasetContent): Observable<void>;
  getTestMatrix(): Observable<TestMatrix>;
  updateTestMatrix(matrix: TestMatrix): Observable<void>;
  validateDataset(content: unknown): ValidationResult;
}
