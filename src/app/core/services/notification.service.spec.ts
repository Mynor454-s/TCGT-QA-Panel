import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
    vi.useFakeTimers();
  });

  it('should start with no notifications', () => {
    expect(service.notifications()).toEqual([]);
    expect(service.count()).toBe(0);
  });

  it('should add a success notification', () => {
    service.success('Test message');
    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].type).toBe('success');
    expect(service.notifications()[0].message).toBe('Test message');
  });

  it('should add an error notification', () => {
    service.error('Error occurred');
    expect(service.notifications()[0].type).toBe('error');
    expect(service.notifications()[0].duration).toBe(0); // persistent
  });

  it('should auto-dismiss success notifications after 3000ms', () => {
    service.success('Will disappear');
    expect(service.notifications().length).toBe(1);
    vi.advanceTimersByTime(3000);
    expect(service.notifications().length).toBe(0);
  });

  it('should NOT auto-dismiss error notifications', () => {
    service.error('Stays visible');
    vi.advanceTimersByTime(10000);
    expect(service.notifications().length).toBe(1);
  });

  it('should dismiss a notification by id', () => {
    service.info('Message 1');
    service.info('Message 2');
    const id = service.notifications()[0].id;
    service.dismiss(id);
    expect(service.notifications().length).toBe(1);
  });

  it('should limit to 5 visible notifications', () => {
    for (let i = 0; i < 7; i++) {
      service.error(`Message ${i}`); // error = persistent, won't auto-dismiss
    }
    expect(service.notifications().length).toBe(5);
  });

  it('should clear all notifications', () => {
    service.success('A');
    service.error('B');
    service.warning('C');
    service.clear();
    expect(service.notifications().length).toBe(0);
  });
});
