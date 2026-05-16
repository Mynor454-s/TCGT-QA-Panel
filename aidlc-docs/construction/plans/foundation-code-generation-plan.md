# Code Generation Plan — Unit 1: Foundation

## Unit Context
- **Unit**: Foundation (Core + Shared + Shell + Configuration)
- **Project Type**: Angular 21 monolith (greenfield multi-unit monolith pattern)
- **Code Location**: `src/app/` (workspace root: TCGT-QA-Panel)
- **Dependencies**: None (base unit)
- **Implements**: RNF-01, RNF-03, RNF-04, RNF-05, RNF-06 (parcial)

---

## Generation Steps

### Step 1: Project Setup — Tailwind CSS + Global Styles
- [x] Install Tailwind CSS 4 and configure with Angular
- [x] Create `src/styles/` with design tokens (_variables.scss)
- [x] Update `src/styles.scss` with Tailwind imports
- [x] Configure tailwind for the project

### Step 2: Core Models
- [ ] Create `src/app/core/models/test.model.ts` (TestItem, TestFilter, TestDetail)
- [ ] Create `src/app/core/models/execution.model.ts` (ExecutionConfig, ExecutionRun, ExecutionResults, ExecutionStatus, TestResult)
- [ ] Create `src/app/core/models/report.model.ts` (ExecutionReport, TestResultDetail, ReportSummary, ExecutionComparison)
- [ ] Create `src/app/core/models/schedule.model.ts` (Schedule, ScheduleConfig, ScheduledExecution)
- [ ] Create `src/app/core/models/configuration.model.ts` (AppConfiguration, ConnectionConfig, EnvironmentConfig, BrowserStackConfig, UserPreferences)
- [ ] Create `src/app/core/models/notification.model.ts` (Notification, NotificationType)
- [ ] Create `src/app/core/models/index.ts` (barrel export)

### Step 3: Core Interfaces
- [ ] Create `src/app/core/interfaces/test-discovery.interface.ts` (ITestDiscoveryService)
- [ ] Create `src/app/core/interfaces/data-provider.interface.ts` (IDataProviderService)
- [ ] Create `src/app/core/interfaces/execution.interface.ts` (IExecutionService)
- [ ] Create `src/app/core/interfaces/report.interface.ts` (IReportService)
- [ ] Create `src/app/core/interfaces/history.interface.ts` (IHistoryService)
- [ ] Create `src/app/core/interfaces/schedule.interface.ts` (IScheduleService)
- [ ] Create `src/app/core/interfaces/configuration.interface.ts` (IConfigurationService)
- [ ] Create `src/app/core/interfaces/index.ts` (barrel export)

### Step 4: DI Tokens
- [ ] Create `src/app/core/tokens/service-tokens.ts` (all InjectionTokens)

### Step 5: IndexedDB Service
- [ ] Create `src/app/core/services/local/indexeddb.service.ts` (generic IndexedDB wrapper)
- [ ] Create `src/app/core/services/local/indexeddb.service.spec.ts` (unit tests)

### Step 6: Configuration Service
- [ ] Create `src/app/core/services/local/local-configuration.service.ts` (implements IConfigurationService)
- [ ] Create `src/app/core/services/local/local-configuration.service.spec.ts` (unit tests)

### Step 7: Notification Service
- [ ] Create `src/app/core/services/notification.service.ts`
- [ ] Create `src/app/core/services/notification.service.spec.ts` (unit tests)

### Step 8: Shared Pipes
- [ ] Create `src/app/shared/pipes/duration.pipe.ts`
- [ ] Create `src/app/shared/pipes/status-label.pipe.ts`
- [ ] Create `src/app/shared/pipes/relative-date.pipe.ts`
- [ ] Create `src/app/shared/pipes/duration.pipe.spec.ts` (unit tests + PBT)
- [ ] Create `src/app/shared/pipes/status-label.pipe.spec.ts` (unit tests)
- [ ] Create `src/app/shared/pipes/relative-date.pipe.spec.ts` (unit tests)

### Step 9: Shared Components
- [ ] Create `src/app/shared/components/card/card.component.ts`
- [ ] Create `src/app/shared/components/card/card.component.html`
- [ ] Create `src/app/shared/components/status-badge/status-badge.component.ts`
- [ ] Create `src/app/shared/components/status-badge/status-badge.component.html`
- [ ] Create `src/app/shared/components/empty-state/empty-state.component.ts`
- [ ] Create `src/app/shared/components/empty-state/empty-state.component.html`
- [ ] Create `src/app/shared/components/search-input/search-input.component.ts`
- [ ] Create `src/app/shared/components/search-input/search-input.component.html`
- [ ] Create `src/app/shared/components/confirm-dialog/confirm-dialog.component.ts`
- [ ] Create `src/app/shared/components/confirm-dialog/confirm-dialog.component.html`
- [ ] Create `src/app/shared/components/data-table/data-table.component.ts`
- [ ] Create `src/app/shared/components/data-table/data-table.component.html`

### Step 10: Layout Components
- [ ] Create `src/app/layout/header/header.component.ts`
- [ ] Create `src/app/layout/header/header.component.html`
- [ ] Create `src/app/layout/notification-toast/notification-toast.component.ts`
- [ ] Create `src/app/layout/notification-toast/notification-toast.component.html`
- [ ] Create `src/app/layout/loading-overlay/loading-overlay.component.ts`
- [ ] Create `src/app/layout/loading-overlay/loading-overlay.component.html`

### Step 11: App Shell & Routing
- [ ] Update `src/app/app.ts` (add layout components)
- [ ] Update `src/app/app.html` (shell template with header, router-outlet, notifications)
- [ ] Update `src/app/app.routes.ts` (lazy-loaded routes for all features)
- [ ] Update `src/app/app.config.ts` (register DI providers)

### Step 12: Environment Configuration
- [ ] Create `src/environments/environment.ts`
- [ ] Create `src/environments/environment.prod.ts`

### Step 13: Documentation Summary
- [ ] Create `aidlc-docs/construction/foundation/code/code-summary.md`

---

## Estimated Scope
- **Total Steps**: 13
- **Files to Create**: ~45
- **Files to Modify**: 4 (existing app files)
- **Test Files**: ~6 (unit tests + PBT for pipes and services)
