import { describe, it, expect } from 'vitest';
import { StatusLabelPipe } from './status-label.pipe';

describe('StatusLabelPipe', () => {
  const pipe = new StatusLabelPipe();

  it('should return "—" for null/undefined', () => {
    expect(pipe.transform(null)).toBe('—');
    expect(pipe.transform(undefined)).toBe('—');
  });

  it('should return Spanish labels for known statuses', () => {
    expect(pipe.transform('passed')).toBe('Exitoso');
    expect(pipe.transform('failed')).toBe('Fallido');
    expect(pipe.transform('skipped')).toBe('Omitido');
    expect(pipe.transform('running')).toBe('En ejecución');
    expect(pipe.transform('queued')).toBe('En cola');
    expect(pipe.transform('completed')).toBe('Completado');
    expect(pipe.transform('cancelled')).toBe('Cancelado');
  });

  it('should return the original string for unknown statuses', () => {
    expect(pipe.transform('unknown')).toBe('unknown');
    expect(pipe.transform('custom-status')).toBe('custom-status');
  });
});
