import { Component, input, computed } from '@angular/core';

const STATUS_COLORS: Record<string, string> = {
  passed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  running: 'bg-blue-100 text-blue-800',
  skipped: 'bg-gray-100 text-gray-600',
  queued: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
};

const SIZE_CLASSES: Record<string, string> = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
  lg: 'text-sm px-2.5 py-1',
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center font-medium rounded-full"
      [class]="classes()"
      [attr.data-testid]="'status-badge-' + status()"
    >
      {{ label() }}
    </span>
  `,
})
export class StatusBadgeComponent {
  status = input.required<string>();
  size = input<'sm' | 'md' | 'lg'>('md');
  label = input<string>();

  classes = computed(() => {
    const colorClass = STATUS_COLORS[this.status()] ?? 'bg-gray-100 text-gray-600';
    const sizeClass = SIZE_CLASSES[this.size()];
    return `${colorClass} ${sizeClass}`;
  });
}
