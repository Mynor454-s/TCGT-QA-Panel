import { Observable } from 'rxjs';
import { Schedule, ScheduleConfig, ScheduledExecution } from '../models';

export interface IScheduleService {
  getSchedules(): Observable<Schedule[]>;
  createSchedule(schedule: ScheduleConfig): Observable<Schedule>;
  updateSchedule(id: string, schedule: ScheduleConfig): Observable<Schedule>;
  deleteSchedule(id: string): Observable<void>;
  getUpcomingExecutions(limit: number): Observable<ScheduledExecution[]>;
  toggleSchedule(id: string, active: boolean): Observable<void>;
}
