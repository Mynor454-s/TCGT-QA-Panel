import { Injectable, signal, computed } from '@angular/core';
import {
  Notification,
  NotificationType,
  NOTIFICATION_DEFAULTS,
  MAX_VISIBLE_NOTIFICATIONS,
} from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);

  readonly notifications = computed(() =>
    this._notifications().slice(0, MAX_VISIBLE_NOTIFICATIONS),
  );

  readonly count = computed(() => this._notifications().length);

  show(type: NotificationType, message: string, duration?: number): void {
    const notification: Notification = {
      id: crypto.randomUUID(),
      type,
      message,
      duration: duration ?? NOTIFICATION_DEFAULTS[type].duration,
      dismissible: true,
      timestamp: new Date(),
    };

    this._notifications.update((current) => {
      const updated = [notification, ...current];
      // Trim to max visible
      if (updated.length > MAX_VISIBLE_NOTIFICATIONS) {
        return updated.slice(0, MAX_VISIBLE_NOTIFICATIONS);
      }
      return updated;
    });

    // Auto-dismiss if duration > 0
    if (notification.duration > 0) {
      setTimeout(() => this.dismiss(notification.id), notification.duration);
    }
  }

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  warning(message: string): void {
    this.show('warning', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  dismiss(id: string): void {
    this._notifications.update((current) => current.filter((n) => n.id !== id));
  }

  clear(): void {
    this._notifications.set([]);
  }
}
