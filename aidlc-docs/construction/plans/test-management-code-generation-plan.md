# Code Generation Plan — Unit 2: Test Management + Data Providers

## Unit Context
- **Unit**: Test Management + Data Providers
- **Dependencies**: Unit 1 (Foundation) — interfaces, models, shared components
- **Implements**: RF-01, RF-02

---

## Generation Steps

### Step 1: Mock Test Discovery Service
- [x] Create `src/app/core/services/mock/mock-test-discovery.service.ts`
- [x] Create mock data with realistic TCGT-QA test structure

### Step 2: Mock Data Provider Service
- [x] Create `src/app/core/services/mock/mock-data-provider.service.ts`
- [x] Include mock datasets matching TCGT-QA structure

### Step 3: Test Management Feature — Page + Components
- [x] Create `src/app/features/test-management/test-list-page.component.ts` (replace placeholder)
- [x] Create `src/app/features/test-management/components/test-filter-bar.component.ts`
- [x] Create `src/app/features/test-management/components/test-selection-summary.component.ts`

### Step 4: Data Provider Feature — Page + Components
- [x] Create `src/app/features/data-provider/data-provider-page.component.ts` (replace placeholder)
- [x] Create `src/app/features/data-provider/components/dataset-viewer.component.ts`

### Step 5: Register Services in App Config
- [x] Update `src/app/app.config.ts` with new service providers

### Step 6: Unit Tests
- [x] Create test for filtering logic (PBT)

---

## Estimated Scope
- **Files to Create**: ~8
- **Files to Modify**: 2
