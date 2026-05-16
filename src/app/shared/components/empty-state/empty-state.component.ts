import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  title = input<string>('Sin datos');
  message = input<string>();
  actionLabel = input<string>();

  action = output<void>();
}
