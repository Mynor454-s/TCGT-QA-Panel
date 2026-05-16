import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-white/80" data-testid="loading-overlay">
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm text-gray-600">{{ message() }}</p>
        </div>
      </div>
    }
  `,
})
export class LoadingOverlayComponent {
  visible = input<boolean>(false);
  message = input<string>('Cargando...');
}
