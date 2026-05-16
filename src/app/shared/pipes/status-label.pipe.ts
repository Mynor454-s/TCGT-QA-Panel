import { Pipe, PipeTransform } from '@angular/core';

const STATUS_LABELS: Record<string, string> = {
  passed: 'Exitoso',
  failed: 'Fallido',
  skipped: 'Omitido',
  running: 'En ejecución',
  queued: 'En cola',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
  transform(status: string | null | undefined): string {
    if (!status) return '—';
    return STATUS_LABELS[status] ?? status;
  }
}
