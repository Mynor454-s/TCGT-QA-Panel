import { InjectionToken } from '@angular/core';
import { ITestDiscoveryService } from '../interfaces/test-discovery.interface';
import { IDataProviderService } from '../interfaces/data-provider.interface';
import { IExecutionService } from '../interfaces/execution.interface';
import { IReportService } from '../interfaces/report.interface';
import { IHistoryService } from '../interfaces/history.interface';
import { IScheduleService } from '../interfaces/schedule.interface';
import { IConfigurationService } from '../interfaces/configuration.interface';

export const TEST_DISCOVERY_SERVICE = new InjectionToken<ITestDiscoveryService>(
  'TestDiscoveryService',
);

export const DATA_PROVIDER_SERVICE = new InjectionToken<IDataProviderService>(
  'DataProviderService',
);

export const EXECUTION_SERVICE = new InjectionToken<IExecutionService>('ExecutionService');

export const REPORT_SERVICE = new InjectionToken<IReportService>('ReportService');

export const HISTORY_SERVICE = new InjectionToken<IHistoryService>('HistoryService');

export const SCHEDULE_SERVICE = new InjectionToken<IScheduleService>('ScheduleService');

export const CONFIGURATION_SERVICE = new InjectionToken<IConfigurationService>(
  'ConfigurationService',
);
