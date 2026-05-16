import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITestDiscoveryService } from '../../interfaces/test-discovery.interface';
import { TestItem, TestFilter, TestDetail } from '../../models';

const MOCK_TESTS: TestItem[] = [
  {
    id: 'fc-001',
    title: 'flujo completo cliente',
    file: 'flujoCompletoCliente.spec.ts',
    tags: ['@smoke', '@e2e', '@P0', '@B2B'],
    priority: 'P0',
    flow: 'B2B',
  },
  {
    id: 'fc-002',
    title: 'flujo completo cliente matrix driven',
    file: 'flujoCompletoClienteMatrixDriven.spec.ts',
    tags: ['@e2e', '@P0', '@B2B', '@E2E-001'],
    priority: 'P0',
    flow: 'B2B',
    scenarioId: 'E2E-001',
  },
  {
    id: 'fc-003',
    title: 'flujo completo cliente movil',
    file: 'flujoCompletoClienteMovil.spec.ts',
    tags: ['@e2e', '@P1', '@B2B'],
    priority: 'P1',
    flow: 'B2B',
  },
  {
    id: 'fc-004',
    title: 'flujo completo cliente TCJ',
    file: 'flujoCompletoClienteTCJ.spec.ts',
    tags: ['@e2e', '@P1', '@B2B'],
    priority: 'P1',
    flow: 'B2B',
  },
  {
    id: 'fc-005',
    title: 'flujo completo comercio B2C',
    file: 'B2C/flujoCompletoComercio.spec.ts',
    tags: ['@e2e', '@P0', '@B2C', '@E2E-B2C-001'],
    priority: 'P0',
    flow: 'B2C',
    scenarioId: 'E2E-B2C-001',
  },
  {
    id: 'val-001',
    title: 'validación datos generales - campos requeridos',
    file: 'validations/datosGenerales/camposRequeridos.spec.ts',
    tags: ['@validation', '@P2', '@B2B'],
    priority: 'P2',
    flow: 'B2B',
  },
  {
    id: 'val-002',
    title: 'validación datos generales - formato email',
    file: 'validations/datosGenerales/formatoEmail.spec.ts',
    tags: ['@validation', '@P2', '@B2B'],
    priority: 'P2',
    flow: 'B2B',
  },
  {
    id: 'val-003',
    title: 'validación UI - footer links',
    file: 'validations/ui/footerLinks.spec.ts',
    tags: ['@validation', '@P3', '@B2B'],
    priority: 'P3',
    flow: 'B2B',
  },
  {
    id: 'fc-006',
    title: 'flujo completo TCJ colores',
    file: 'TCJ/flujoColores.spec.ts',
    tags: ['@e2e', '@P1', '@B2B'],
    priority: 'P1',
    flow: 'B2B',
  },
];

@Injectable({ providedIn: 'root' })
export class MockTestDiscoveryService implements ITestDiscoveryService {
  getAvailableTests(): Observable<TestItem[]> {
    return of(MOCK_TESTS);
  }

  getFilteredTests(filters: TestFilter): Observable<TestItem[]> {
    return of(MOCK_TESTS).pipe(map((tests) => filterTests(tests, filters)));
  }

  getTestDetail(testId: string): Observable<TestDetail> {
    const test = MOCK_TESTS.find((t) => t.id === testId);
    if (!test) {
      throw new Error(`Test not found: ${testId}`);
    }
    return of({
      ...test,
      fullPath: `tests/flows/happypath/${test.file}`,
      steps: ['Navegar a página', 'Llenar formulario', 'Validar resultado'],
    });
  }

  refreshTests(): Observable<TestItem[]> {
    return of(MOCK_TESTS);
  }

  getAvailableTags(): Observable<string[]> {
    const tags = new Set<string>();
    MOCK_TESTS.forEach((t) => t.tags.forEach((tag) => tags.add(tag)));
    return of(Array.from(tags).sort());
  }

  getAvailableFiles(): Observable<string[]> {
    const files = new Set<string>();
    MOCK_TESTS.forEach((t) => files.add(t.file));
    return of(Array.from(files).sort());
  }
}

export function filterTests(tests: TestItem[], filter: TestFilter): TestItem[] {
  return tests.filter((test) => {
    if (filter.search && !test.title.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    if (filter.tags?.length && !filter.tags.some((t) => test.tags.includes(t))) {
      return false;
    }
    if (filter.priority?.length && !filter.priority.includes(test.priority)) {
      return false;
    }
    if (filter.flow?.length && !filter.flow.includes(test.flow)) {
      return false;
    }
    if (filter.file && test.file !== filter.file) {
      return false;
    }
    return true;
  });
}
