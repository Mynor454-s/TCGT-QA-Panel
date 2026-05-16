import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  const pipe = new DurationPipe();

  it('should return "—" for null/undefined', () => {
    expect(pipe.transform(null)).toBe('—');
    expect(pipe.transform(undefined)).toBe('—');
  });

  it('should return "—" for negative values', () => {
    expect(pipe.transform(-1)).toBe('—');
    expect(pipe.transform(-1000)).toBe('—');
  });

  it('should return "0s" for 0ms', () => {
    expect(pipe.transform(0)).toBe('0s');
  });

  it('should format seconds correctly', () => {
    expect(pipe.transform(5000)).toBe('5s');
    expect(pipe.transform(45000)).toBe('45s');
  });

  it('should format minutes and seconds', () => {
    expect(pipe.transform(60000)).toBe('1m');
    expect(pipe.transform(90000)).toBe('1m 30s');
    expect(pipe.transform(125000)).toBe('2m 5s');
  });

  it('should format hours and minutes', () => {
    expect(pipe.transform(3600000)).toBe('1h');
    expect(pipe.transform(5400000)).toBe('1h 30m');
    expect(pipe.transform(7500000)).toBe('2h 5m');
  });

  // Property-Based Tests
  describe('PBT', () => {
    it('should always return a non-empty string for non-negative integers', () => {
      fc.assert(
        fc.property(fc.nat({ max: 100000000 }), (ms) => {
          const result = pipe.transform(ms);
          return result.length > 0;
        }),
      );
    });

    it('should always contain "s", "m", or "h" for positive values', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1000, max: 100000000 }), (ms) => {
          const result = pipe.transform(ms);
          return result.includes('s') || result.includes('m') || result.includes('h');
        }),
      );
    });

    it('should produce larger time units for larger inputs', () => {
      fc.assert(
        fc.property(fc.nat({ max: 50000000 }), (ms) => {
          const result = pipe.transform(ms);
          if (ms >= 3600000) return result.includes('h');
          if (ms >= 60000) return result.includes('m');
          return result.includes('s');
        }),
      );
    });

    it('should never return negative numbers in output', () => {
      fc.assert(
        fc.property(fc.nat({ max: 100000000 }), (ms) => {
          const result = pipe.transform(ms);
          return !/\-\d/.test(result);
        }),
      );
    });
  });
});
