export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration: number;
  dismissible: boolean;
  timestamp: Date;
}

export const NOTIFICATION_DEFAULTS: Record<NotificationType, { duration: number }> = {
  success: { duration: 3000 },
  info: { duration: 4000 },
  warning: { duration: 5000 },
  error: { duration: 0 },
};

export const MAX_VISIBLE_NOTIFICATIONS = 5;
