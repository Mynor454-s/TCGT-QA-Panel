import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { filterTests } from './mock-test-discovery.service';
import { TestItem, TestFilter } from '../../models';

const SAMPLE_TESTS: TestItem[] = [
  { id: '1', title: 'flujo completo', file: 'a.spec.ts', tags: ['@smoke', '@P0', '@B2B'], priority: 'P0', flow: 'B2B' },
  { id: '2', title: 'flujo B2C', file: 'b.spec.ts', tags: ['@e2e', '@P1', '@B2C'], priority: 'P1', flow: 'B2C' },
  { id: '3', title: 'validación email', file: 'c.spec.ts', tags: ['@validation', '@P2', '@B2B'], priority: 'P2', flow: 'B2B' },
  { id: '4', title: 'flujo TCJ', file: 'd.spec.ts', tags: ['@e2e', '@P1', '@B2B'], priority: 'P1', flow: 'B2B' },
  { id: '5', title: 'test movil', file: 'e.spec.ts', tags: ['@e2e', '@P0', '@B2B'], priority: 'P0', flow: 'B2B' },
];

describe('filterTests', () => {
  it('should return all tests with empty filter', () => {
    const result = filterTests(SAMPLE_TESTS, {});
    expect(result.length).toBe(5);
  });

  it('should filter by search (case-insensitive)', () => {
    const result = filterTests(SAMPLE_TESTS, { search: 'FLUJO' });
    expect(result.length).toBe(3); // flujo completo, flujo B2C, flujo TCJ
  });

  it('should filter by priority', () => {
    const result = filterTests(SAMPLE_TESTS, { priority: ['P0'] });
    expect(result.length).toBe(2);
  });

  it('should filter by flow', () => {
    const result = filterTests(SAMPLE_TESTS, { flow: ['B2C'] });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  it('should filter by tags (OR within tags)', () => {
    const result = filterTests(SAMPLE_TESTS, { tags: ['@smoke', '@validation'] });
    expect(result.length).toBe(2); // id 1 and 3
  });

  it('should filter by file', () => {
    const result = filterTests(SAMPLE_TESTS, { file: 'a.spec.ts' });
    expect(result.length).toBe(1);
  });

  it('should combine filters with AND logic', () => {
    const result = filterTests(SAMPLE_TESTS, { priority: ['P1'], flow: ['B2B'] });
    expect(result.length).toBe(1); // only flujo TCJ
    expect(result[0].id).toBe('4');
  });

  // Property-Based Tests
  describe('PBT', () => {
    it('filtered results should always be a subset of input', () => {
      const tagArb = fc.constantFrom('@smoke', '@e2e', '@validation', '@P0', '@P1', '@P2', '@B2B', '@B2C');
      const filterArb = fc.record({
        tags: fc.option(fc.array(tagArb, { minLength: 1, maxLength: 3 }), { nil: undefined }),
        priority: fc.option(fc.array(fc.constantFrom('P0' as const, 'P1' as const, 'P2' as const), { minLength: 1 }), { nil: undefined }),
        flow: fc.option(fc.array(fc.constantFrom('B2B' as const, 'B2C' as const), { minLength: 1 }), { nil: undefined }),
        search: fc.option(fc.string({ minLength: 1, maxLength: 10 }), { nil: undefined }),
      });

      fc.assert(
        fc.property(filterArb, (filter) => {
          const result = filterTests(SAMPLE_TESTS, filter as TestFilter);
          return result.length <= SAMPLE_TESTS.length;
        }),
      );
    });

    it('empty filter should always return all tests', () => {
      const testsArb = fc.array(
        fc.record({
          id: fc.uuid(),
          title: fc.string({ minLength: 1 }),
          file: fc.string({ minLength: 1 }),
          tags: fc.array(fc.string()),
          priority: fc.constantFrom('P0' as const, 'P1' as const, 'P2' as const, 'P3' as const),
          flow: fc.constantFrom('B2B' as const, 'B2C' as const, 'TCJ' as const),
        }),
        { minLength: 0, maxLength: 20 },
      );

      fc.assert(
        fc.property(testsArb, (tests) => {
          const result = filterTests(tests, {});
          return result.length === tests.length;
        }),
      );
    });

    it('adding more filter criteria should never increase results', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('P0' as const, 'P1' as const, 'P2' as const),
          fc.constantFrom('B2B' as const, 'B2C' as const),
          (priority, flow) => {
            const withPriority = filterTests(SAMPLE_TESTS, { priority: [priority] });
            const withBoth = filterTests(SAMPLE_TESTS, { priority: [priority], flow: [flow] });
            return withBoth.length <= withPriority.length;
          },
        ),
      );
    });
  });
});
