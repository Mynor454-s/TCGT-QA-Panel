import { TestItem, ExecutionEnvironment, ExecutionMode } from './index';

export interface Schedule {
  id: string;
  name: string;
  config: ScheduleConfig;
  active: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  nextExecution?: Date;
}

export interface ScheduleConfig {
  cronExpression: string;
  tests: TestItem[] | { tags: string[] };
  environment: ExecutionEnvironment;
  mode: ExecutionMode;
  dataset?: string;
}

export interface ScheduledExecution {
  scheduleId: string;
  scheduleName: string;
  nextRunAt: Date;
  config: ScheduleConfig;
}
