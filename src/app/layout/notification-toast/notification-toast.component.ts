import { Component, inject } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  templateUrl: './notification-toast.component.html',
})
export class NotificationToastComponent {
  readonly notificationService = inject(NotificationService);
  readonly notifications = this.notificationService.notifications;

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  }

  getBorderClass(type: string): string {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'info':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  }
}
