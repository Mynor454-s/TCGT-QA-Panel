import { Injectable, signal } from '@angular/core';
import { TestItem } from '../models';

@Injectable({ providedIn: 'root' })
export class TestSelectionService {
  private readonly _selectedTests = signal<TestItem[]>([]);

  readonly selectedTests = this._selectedTests.asReadonly();

  setSelection(tests: TestItem[]): void {
    this._selectedTests.set(tests);
  }

  clear(): void {
    this._selectedTests.set([]);
  }

  hasSelection(): boolean {
    return this._selectedTests().length > 0;
  }
}
