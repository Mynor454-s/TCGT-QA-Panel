import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  visible = input<boolean>(false);
  title = input<string>('Confirmar');
  message = input<string>('¿Estás seguro?');
  confirmLabel = input<string>('Confirmar');
  cancelLabel = input<string>('Cancelar');
  confirmVariant = input<'primary' | 'danger'>('primary');

  confirm = output<void>();
  cancel = output<void>();
}
