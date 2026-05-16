import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  CONFIGURATION_SERVICE,
  TEST_DISCOVERY_SERVICE,
  DATA_PROVIDER_SERVICE,
  EXECUTION_SERVICE,
  REPORT_SERVICE,
  HISTORY_SERVICE,
  SCHEDULE_SERVICE,
} from './core/tokens/service-tokens';
import { LocalConfigurationService } from './core/services/local/local-configuration.service';
import { MockTestDiscoveryService } from './core/services/mock/mock-test-discovery.service';
import { MockDataProviderService } from './core/services/mock/mock-data-provider.service';
import { MockExecutionService } from './core/services/mock/mock-execution.service';
import { MockReportService } from './core/services/mock/mock-report.service';
import { IndexedDBHistoryService } from './core/services/local/indexeddb-history.service';
import { IndexedDBScheduleService } from './core/services/local/indexeddb-schedule.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: CONFIGURATION_SERVICE, useClass: LocalConfigurationService },
    { provide: TEST_DISCOVERY_SERVICE, useClass: MockTestDiscoveryService },
    { provide: DATA_PROVIDER_SERVICE, useClass: MockDataProviderService },
    { provide: EXECUTION_SERVICE, useClass: MockExecutionService },
    { provide: REPORT_SERVICE, useClass: MockReportService },
    { provide: HISTORY_SERVICE, useClass: IndexedDBHistoryService },
    { provide: SCHEDULE_SERVICE, useClass: IndexedDBScheduleService },
  ],
};
