import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
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
import { HttpTestDiscoveryService } from './core/services/http/http-test-discovery.service';
import { HttpDataProviderService } from './core/services/http/http-data-provider.service';
import { HttpExecutionService } from './core/services/http/http-execution.service';
import { HttpReportService } from './core/services/http/http-report.service';
import { IndexedDBHistoryService } from './core/services/local/indexeddb-history.service';
import { IndexedDBScheduleService } from './core/services/local/indexeddb-schedule.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: CONFIGURATION_SERVICE, useClass: LocalConfigurationService },
    { provide: TEST_DISCOVERY_SERVICE, useClass: HttpTestDiscoveryService },
    { provide: DATA_PROVIDER_SERVICE, useClass: HttpDataProviderService },
    { provide: EXECUTION_SERVICE, useClass: HttpExecutionService },
    { provide: REPORT_SERVICE, useClass: HttpReportService },
    { provide: HISTORY_SERVICE, useClass: IndexedDBHistoryService },
    { provide: SCHEDULE_SERVICE, useClass: IndexedDBScheduleService },
  ],
};
